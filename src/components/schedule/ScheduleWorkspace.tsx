"use client";

import {
  Bell,
  CalendarDays,
  CircleHelp,
  Clock3,
  Coffee,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ImageIcon,
  MapPin,
  MessageCircle,
  NotebookText,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Upload,
  UserRoundCheck,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emptyCourseInput, initialCourses } from "@/lib/schedule/mock";
import {
  courseStatusLabels,
  courseStatusOptions,
  reminderOptions,
  weekdays,
  weekTypeLabels,
  weekTypeOptions,
} from "@/lib/schedule/options";
import {
  formatReminder,
  sortCourses,
  timeToMinutes,
} from "@/lib/schedule/time";
import type {
  CourseVisibility,
  ScheduleCourse,
  ScheduleCourseInput,
} from "@/types/schedule";

const storageKey = "campus-ai-schedule-v2";
const desktopHourHeight = 82;
const desktopDayHeaderHeight = 76;
const mobileHourHeight = 88;
const mobileDayHeaderHeight = 64;
const visibilityOptions = [
  {
    value: "public",
    label: "完整公开",
    description: "别人能看到具体课程/安排",
  },
  {
    value: "busy",
    label: "仅忙碌",
    description: "别人只知道这段时间被占用",
  },
  {
    value: "private",
    label: "完全隐藏",
    description: "只有自己能看到",
  },
] as const;

export function ScheduleWorkspace() {
  const [courses, setCourses] = useState<ScheduleCourse[]>(() => {
    if (typeof window === "undefined") {
      return initialCourses;
    }

    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return initialCourses;
    }

    return JSON.parse(saved) as ScheduleCourse[];
  });
  const [form, setForm] = useState<ScheduleCourseInput>(emptyCourseInput);
  const [activeWeekday, setActiveWeekday] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<ScheduleCourse | null>(
    null,
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(courses));
  }, [courses]);

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortCourses(courses).filter((course) => {
      if (course.isHidden) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [course.courseName, course.teacher, course.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [courses, query]);

  const publicCount = courses.filter(
    (course) => course.visibility === "public" && !course.isHidden,
  ).length;
  const personalCount = courses.filter(
    (course) => course.itemType === "personal" && !course.isHidden,
  ).length;
  const matchingCount = courses.filter(
    (course) => course.participateInMatching && !course.isHidden,
  ).length;

  function updateForm<K extends keyof ScheduleCourseInput>(
    key: K,
    value: ScheduleCourseInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.courseName.trim()) {
      return;
    }

    setCourses((current) => [
      ...current,
      {
        ...form,
        id: crypto.randomUUID(),
        courseName: form.courseName.trim(),
        teacher: form.teacher.trim(),
        location: form.location.trim(),
      },
    ]);
    setActiveWeekday(form.weekday);
    setForm(emptyCourseInput);
  }

  function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setImportFile(file);
    setImportMessage(file ? "文件已选择，点击 AI 识别导入。" : "");
  }

  function handleAiImport() {
    if (!importFile) {
      setImportMessage("先上传课表图片或 Excel 文件。");
      return;
    }

    setIsImporting(true);
    setImportMessage("AI 正在识别课表结构...");

    window.setTimeout(() => {
      const importedCourses = buildMockImportedCourses(importFile.name);

      setCourses((current) => [...current, ...importedCourses]);
      setActiveWeekday(importedCourses[0]?.weekday ?? activeWeekday);
      setIsImporting(false);
      setImportMessage(`已从 ${importFile.name} 识别导入 ${importedCourses.length} 门课程，建议逐条确认。`);
    }, 700);
  }

  function toggleCourse(id: string, key: keyof ScheduleCourse) {
    setCourses((current) =>
      current.map((course) => {
        if (course.id !== id) {
          return course;
        }

        if (key === "visibility") {
          const nextVisibility = {
            public: "busy",
            busy: "private",
            private: "public",
          } as const;

          return {
            ...course,
            visibility: nextVisibility[course.visibility],
          };
        }

        return {
          ...course,
          [key]: !course[key],
        };
      }),
    );
  }

  function updateCourseVisibility(id: string, visibility: CourseVisibility) {
    setCourses((current) =>
      current.map((course) =>
        course.id === id ? { ...course, visibility } : course,
      ),
    );
  }

  function resetDemo() {
    setCourses(initialCourses);
    setForm(emptyCourseInput);
    setQuery("");
  }

  if (selectedCourse) {
    return (
      <CourseBoard
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <main className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="liquid-glass rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                <CalendarDays size={18} />
                日程表 · 第一个核心工具模块
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                先把课表变成每天真的会用的校园工作台
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                手动添加课程，也能记录吃饭、自习、社团、运动和已经约好的安排。社交连接先藏在工具之后，让用户先获得确定的日程价值。
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
              <Metric label="完整公开" value={publicCount} />
              <Metric label="个人安排" value={personalCount} />
              <Metric label="参与匹配" value={matchingCount} />
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.95fr)_minmax(360px,0.75fr)]">
          <div className="liquid-glass rounded-[28px] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">三日视图课表</h2>
                <p className="mt-1 text-sm text-slate-600">
                  一次展示三天，左右拖动查看前后日程，让卡片有足够空间保持清晰。
                </p>
              </div>
              <div className="liquid-soft flex items-center gap-2 rounded-full px-3 py-2">
                <Search size={16} className="text-slate-500" />
                <input
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-56"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索课程、安排、地点"
                  value={query}
                />
              </div>
            </div>

            <DesktopMultiDayTimeline
              activeWeekday={activeWeekday}
              courses={visibleCourses}
              onOpen={setSelectedCourse}
              onVisibilityChange={updateCourseVisibility}
            />

            <div className="mt-5 lg:hidden">
              <div className="grid grid-cols-7 gap-2">
                {weekdays.map((day) => (
                  <button
                    className={`rounded-2xl px-2 py-3 text-sm font-semibold transition ${
                      activeWeekday === day.value
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                        : "liquid-soft text-slate-700"
                    }`}
                    key={day.value}
                    onClick={() => setActiveWeekday(day.value)}
                    type="button"
                  >
                    {day.short}
                  </button>
                ))}
              </div>
              <MobileDayTimeline
                activeWeekday={activeWeekday}
                courses={visibleCourses}
                onOpen={setSelectedCourse}
                onVisibilityChange={updateCourseVisibility}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <form
              className="liquid-glass rounded-[28px] p-5"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">添加日程</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    可以添加课程，也可以添加吃饭、自习、社团等自己的安排。
                  </p>
                </div>
                <button
                  className="rounded-full bg-slate-950 p-3 text-white shadow-lg shadow-slate-950/15"
                  type="submit"
                  aria-label="添加课程"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                <section className="liquid-soft rounded-3xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Sparkles size={16} />
                        AI 导入课表
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        上传课表截图、照片或 Excel，AI 自动识别课程并写入日程表。
                      </p>
                    </div>
                    <span className="rounded-full bg-white/42 px-2.5 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur-md">
                      Beta
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/28 px-3 py-3 text-sm font-medium text-slate-700 backdrop-blur-md">
                      <span className="flex min-w-0 items-center gap-2">
                        {importFile?.type.startsWith("image/") ? (
                          <ImageIcon size={16} />
                        ) : (
                          <FileSpreadsheet size={16} />
                        )}
                        <span className="truncate">
                          {importFile ? importFile.name : "选择图片或 Excel 文件"}
                        </span>
                      </span>
                      <Upload size={16} className="shrink-0 text-slate-500" />
                      <input
                        accept="image/*,.xls,.xlsx,.csv"
                        className="hidden"
                        onChange={handleImportFile}
                        type="file"
                      />
                    </label>

                    <button
                      className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 disabled:cursor-not-allowed disabled:bg-slate-400"
                      disabled={isImporting}
                      onClick={handleAiImport}
                      type="button"
                    >
                      <Sparkles size={16} />
                      {isImporting ? "识别中..." : "AI 识别并导入"}
                    </button>

                    {importMessage && (
                      <p className="text-xs leading-5 text-slate-600">
                        {importMessage}
                      </p>
                    )}
                  </div>
                </section>

                <Field label="类型">
                  <div className="grid grid-cols-2 gap-2">
                    <SegmentButton
                      active={form.itemType === "course"}
                      label="课程"
                      onClick={() => updateForm("itemType", "course")}
                    />
                    <SegmentButton
                      active={form.itemType === "personal"}
                      label="个人安排"
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          itemType: "personal",
                          teacher: "",
                          visibility: "private",
                          showOnProfile: false,
                          participateInMatching: false,
                        }));
                      }}
                    />
                  </div>
                </Field>

                <Field label={form.itemType === "course" ? "课程名" : "安排名称"}>
                  <input
                    className="field-input"
                    onChange={(event) =>
                      updateForm("courseName", event.target.value)
                    }
                    placeholder={
                      form.itemType === "course"
                        ? "例如：计量经济学"
                        : "例如：和朋友出去吃饭"
                    }
                    value={form.courseName}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label={form.itemType === "course" ? "老师" : "对象/备注"}>
                    <input
                      className="field-input"
                      onChange={(event) =>
                        updateForm("teacher", event.target.value)
                      }
                      placeholder={
                        form.itemType === "course" ? "陈老师" : "室友 / 社团 / 自己"
                      }
                      value={form.teacher}
                    />
                  </Field>
                  <Field label="地点">
                    <input
                      className="field-input"
                      onChange={(event) =>
                        updateForm("location", event.target.value)
                      }
                      placeholder="经管楼 B302"
                      value={form.location}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="星期">
                    <select
                      className="field-input"
                      onChange={(event) =>
                        updateForm("weekday", Number(event.target.value))
                      }
                      value={form.weekday}
                    >
                      {weekdays.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="开始">
                    <input
                      className="field-input"
                      onChange={(event) =>
                        updateForm("startTime", event.target.value)
                      }
                      type="time"
                      value={form.startTime}
                    />
                  </Field>
                  <Field label="结束">
                    <input
                      className="field-input"
                      onChange={(event) =>
                        updateForm("endTime", event.target.value)
                      }
                      type="time"
                      value={form.endTime}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="起始周">
                    <input
                      className="field-input"
                      min={1}
                      onChange={(event) =>
                        updateForm("startWeek", Number(event.target.value))
                      }
                      type="number"
                      value={form.startWeek}
                    />
                  </Field>
                  <Field label="结束周">
                    <input
                      className="field-input"
                      min={1}
                      onChange={(event) =>
                        updateForm("endWeek", Number(event.target.value))
                      }
                      type="number"
                      value={form.endWeek}
                    />
                  </Field>
                  <Field label="单双周">
                    <select
                      className="field-input"
                      onChange={(event) =>
                        updateForm(
                          "weekType",
                          event.target.value as ScheduleCourseInput["weekType"],
                        )
                      }
                      value={form.weekType}
                    >
                      {weekTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="课程状态">
                  <select
                    className="field-input"
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value as ScheduleCourseInput["status"],
                      )
                    }
                    value={form.status}
                  >
                    {courseStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="补充备注">
                  <textarea
                    className="field-input min-h-20 py-3"
                    onChange={(event) => updateForm("note", event.target.value)}
                    placeholder="例如：已经约好，不要排别的事情"
                    value={form.note}
                  />
                </Field>

                <Field label="提醒">
                  <select
                    className="field-input"
                    onChange={(event) =>
                      updateForm(
                        "reminderMinutes",
                        event.target.value ? Number(event.target.value) : null,
                      )
                    }
                    value={form.reminderMinutes ?? ""}
                  >
                    {reminderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-2 pt-1">
                  <Field label="可见状态">
                    <div className="grid grid-cols-3 gap-2">
                      {visibilityOptions.map((option) => (
                        <button
                          className={`rounded-2xl px-2 py-3 text-center transition ${
                            form.visibility === option.value
                              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                              : "liquid-soft text-slate-600"
                          }`}
                          key={option.value}
                          onClick={() =>
                            updateForm("visibility", option.value)
                          }
                          type="button"
                        >
                          <span className="block text-xs font-semibold">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-[10px] leading-4 opacity-75">
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Field>
                  <ToggleRow
                    checked={form.showOnProfile}
                    label="展示在个人主页"
                    onChange={() =>
                      updateForm("showOnProfile", !form.showOnProfile)
                    }
                  />
                  <ToggleRow
                    checked={form.participateInMatching}
                    label="参与同频匹配"
                    onChange={() =>
                      updateForm(
                        "participateInMatching",
                        !form.participateInMatching,
                      )
                    }
                  />
                </div>
              </div>
            </form>

            <section className="liquid-glass rounded-[28px] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">日程清单</h2>
                <button
                  className="liquid-soft rounded-full p-2 text-slate-700"
                  onClick={resetDemo}
                  type="button"
                  aria-label="重置演示数据"
                >
                  <RotateCcw size={17} />
                </button>
              </div>
              <div className="mt-4 max-h-[460px] space-y-3 overflow-auto pr-1">
                {visibleCourses.map((course) => (
                  <CourseListCard
                    course={course}
                    key={course.id}
                    onOpen={setSelectedCourse}
                    onVisibilityChange={updateCourseVisibility}
                    onToggle={toggleCourse}
                  />
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="liquid-soft rounded-2xl p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function CourseBoard({
  course,
  onBack,
}: {
  course: ScheduleCourse;
  onBack: () => void;
}) {
  const isCourse = course.itemType === "course";

  return (
    <main className="liquid-page min-h-screen text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="liquid-glass rounded-[32px] p-5">
          <button
            className="liquid-soft mb-5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={onBack}
            type="button"
          >
            返回日程
          </button>
          <div className="min-w-0">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isCourse
                  ? "bg-emerald-50/70 text-emerald-800"
                  : "bg-sky-50/70 text-sky-800"
              }`}
            >
              {isCourse ? "课程板块" : "日程板块"}
            </span>
            <h2 className="mt-3 truncate text-2xl font-semibold">
              {course.courseName}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {weekdays.find((day) => day.value === course.weekday)?.label} ·{" "}
              {course.startTime} - {course.endTime} ·{" "}
              {course.location || "未填写地点"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="liquid-soft rounded-3xl p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-teal-700" />
              <h3 className="font-semibold">AI 课程总结</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              AI 会根据课程名、老师、上课频率、共享笔记和课堂疑问生成课程卡片。目前这是预览版：
              {isCourse
                ? `《${course.courseName}》建议重点关注概念框架、课堂例题和课后习题，适合在课后 24 小时内整理一页复盘。`
                : "这个安排会被纳入个人时间管理，后续可用于判断空闲时间和避免冲突。"}
            </p>
            <div className="mt-4 grid gap-2">
              {[
                "本周重点：整理课堂关键词和老师强调的例题",
                "复习建议：课后先写 3 条不懂的问题",
                "协作建议：可邀请同课同学共享笔记",
              ].map((item) => (
                <div
                  className="rounded-2xl border border-white/50 bg-white/28 px-3 py-2 text-sm text-slate-700 backdrop-blur-md"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="liquid-soft rounded-3xl p-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-blue-700" />
              <h3 className="font-semibold">课程聊天室</h3>
            </div>
            <div className="mt-3 space-y-2">
              <ChatBubble name="AI 助教" text="可以在这里讨论作业、复习范围和组队学习。" />
              <ChatBubble name="同课同学" text="这节课老师提到的案例有人整理了吗？" />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/55 bg-white/30 px-3 py-2 backdrop-blur-md">
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="发一条课程消息"
              />
              <Send size={16} className="text-slate-500" />
            </div>
          </section>

          <section className="liquid-soft rounded-3xl p-4">
            <div className="flex items-center gap-2">
              <NotebookText size={18} className="text-violet-700" />
              <h3 className="font-semibold">笔记共享单元</h3>
            </div>
            <div className="mt-3 grid gap-2">
              {["第 3 周课堂框架.md", "期中复习重点.pdf", "例题整理共享版"].map(
                (note) => (
                  <div
                    className="rounded-2xl border border-white/50 bg-white/28 px-3 py-2 text-sm text-slate-700 backdrop-blur-md"
                    key={note}
                  >
                    {note}
                  </div>
                ),
              )}
            </div>
          </section>

          <section className="liquid-soft rounded-3xl p-4">
            <div className="flex items-center gap-2">
              <CircleHelp size={18} className="text-amber-700" />
              <h3 className="font-semibold">疑问单元</h3>
            </div>
            <div className="mt-3 space-y-2">
              {["这节课的核心公式怎么推导？", "老师说的案例会考吗？"].map(
                (question) => (
                  <div
                    className="rounded-2xl border border-white/50 bg-white/28 px-3 py-2 text-sm text-slate-700 backdrop-blur-md"
                    key={question}
                  >
                    {question}
                  </div>
                ),
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ChatBubble({ name, text }: { name: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/28 px-3 py-2 backdrop-blur-md">
      <p className="text-xs font-semibold text-slate-500">{name}</p>
      <p className="mt-1 text-sm text-slate-700">{text}</p>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-600">
      {label}
      {children}
    </label>
  );
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      className="liquid-soft flex items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium"
      onClick={onChange}
      type="button"
    >
      <span>{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-slate-950" : "bg-white/70"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function SegmentButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
          : "liquid-soft text-slate-600"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function buildMockImportedCourses(fileName: string): ScheduleCourse[] {
  const base = [
    {
      courseName: "高等数学",
      teacher: "AI 识别",
      weekday: 1,
      startTime: "08:00",
      endTime: "09:40",
      location: "教学楼 A201",
    },
    {
      courseName: "大学英语",
      teacher: "AI 识别",
      weekday: 3,
      startTime: "14:00",
      endTime: "15:40",
      location: "外语楼 302",
    },
    {
      courseName: "计算机基础",
      teacher: "AI 识别",
      weekday: 5,
      startTime: "10:00",
      endTime: "11:40",
      location: "实验楼 504",
    },
  ];

  return base.map((course) => ({
    ...emptyCourseInput,
    ...course,
    id: crypto.randomUUID(),
    itemType: "course",
    visibility: "private",
    showOnProfile: false,
    participateInMatching: true,
    status: "must_go",
    reminderMinutes: 30,
    note: `由 ${fileName} AI 识别导入，待确认。`,
  }));
}

function getVisibilityMeta(visibility: CourseVisibility) {
  const meta = {
    public: {
      label: "完整公开",
      short: "公开",
      className: "text-teal-700 bg-teal-50",
      icon: "eye",
    },
    busy: {
      label: "仅显示忙碌",
      short: "忙碌",
      className: "text-amber-700 bg-amber-50",
      icon: "eye",
    },
    private: {
      label: "完全隐藏",
      short: "隐藏",
      className: "text-slate-500 bg-slate-100",
      icon: "off",
    },
  } satisfies Record<
    CourseVisibility,
    { label: string; short: string; className: string; icon: "eye" | "off" }
  >;

  return meta[visibility];
}

function VisibilityRail({
  compact = false,
  onChange,
  value,
}: {
  compact?: boolean;
  onChange: (visibility: CourseVisibility) => void;
  value: CourseVisibility;
}) {
  const iconSize = compact ? 11 : 13;
  const options: Array<{
    icon: ReactNode;
    label: string;
    value: CourseVisibility;
  }> = [
    { icon: <Eye size={iconSize} />, label: "完整公开", value: "public" },
    { icon: <Clock3 size={iconSize} />, label: "仅忙碌", value: "busy" },
    { icon: <EyeOff size={iconSize} />, label: "完全隐藏", value: "private" },
  ];

  return (
    <div
      className={`grid shrink-0 grid-cols-3 rounded-full border border-white/70 bg-white/24 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl ${
        compact ? "p-0.5" : "p-1"
      }`}
    >
      {options.map((option) => (
        <button
          aria-label={option.label}
          className={`flex items-center justify-center rounded-full transition ${
            compact ? "h-5 w-5" : "h-7 w-7"
          } ${
            value === option.value
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
              : "text-slate-500 hover:bg-white/42"
          }`}
          key={option.value}
          onClick={(event) => {
            event.stopPropagation();
            onChange(option.value);
          }}
          title={option.label}
          type="button"
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}

function DesktopMultiDayTimeline({
  activeWeekday,
  courses,
  onOpen,
  onVisibilityChange,
}: {
  activeWeekday: number;
  courses: ScheduleCourse[];
  onOpen: (course: ScheduleCourse) => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    const dayWidth = viewport.scrollWidth / weekdays.length;
    viewport.scrollTo({
      left: Math.max(0, (activeWeekday - 1) * dayWidth),
      behavior: "smooth",
    });
  }, [activeWeekday]);

  return (
    <div className="liquid-distort-shell paper-board mt-5 hidden overflow-hidden rounded-[28px] lg:block">
      <div
        className="relative grid grid-cols-[82px_1fr]"
        style={{ height: `${desktopDayHeaderHeight + 24 * desktopHourHeight}px` }}
      >
        <div className="relative z-20 border-r border-amber-950/8 bg-[#fff8dd]/56">
          <div className="flex h-[76px] items-center justify-center text-xs font-semibold text-amber-950/36">
            24H
          </div>
          {Array.from({ length: 25 }).map((_, hour) => (
            <div
              className="absolute left-4 text-sm font-medium text-amber-950/40"
              key={hour}
              style={{
                top: `${desktopDayHeaderHeight + hour * desktopHourHeight - 10}px`,
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        <div
          className="liquid-underlay relative overflow-x-auto overscroll-x-contain scroll-smooth"
          ref={scrollRef}
        >
          <div
            className="relative grid h-full snap-x snap-mandatory grid-cols-7"
            style={{ width: `${(weekdays.length / 3) * 100}%` }}
          >
            {weekdays.map((day) => {
              const dayCourses = courses.filter(
                (course) => course.weekday === day.value,
              );

              return (
                <div
                  className="relative snap-start border-r border-amber-950/6"
                  key={day.value}
                >
                  <button
                    className={`sticky top-0 z-20 flex h-[76px] w-full flex-col justify-center border-b border-amber-950/8 bg-[#fff7d8]/62 px-5 text-left backdrop-blur-md transition ${
                      day.value === activeWeekday
                        ? "text-slate-950"
                        : "text-amber-950/46 hover:text-slate-800"
                    }`}
                    type="button"
                  >
                    <span className="text-sm font-semibold">{day.label}</span>
                    <span className="mt-1 text-3xl font-semibold leading-none">
                      {day.short}
                    </span>
                  </button>

                  <div
                    className="absolute inset-x-0 z-0"
                    style={{
                      top: `${desktopDayHeaderHeight}px`,
                      height: `${24 * desktopHourHeight}px`,
                    }}
                  >
                    {Array.from({ length: 25 }).map((_, hour) => (
                      <div
                        className="absolute left-0 right-0 border-t border-amber-950/6"
                        key={hour}
                        style={{ top: `${hour * desktopHourHeight}px` }}
                      />
                    ))}
                  </div>

                  {dayCourses.map((course) => (
                    <DesktopTimelineBlock
                      course={course}
                      key={course.id}
                      onOpen={onOpen}
                      onVisibilityChange={onVisibilityChange}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopTimelineBlock({
  course,
  onOpen,
  onVisibilityChange,
}: {
  course: ScheduleCourse;
  onOpen: (course: ScheduleCourse) => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
}) {
  const isPersonal = course.itemType === "personal";
  const startMinutes = timeToMinutes(course.startTime);
  const endMinutes = timeToMinutes(course.endTime);
  const top = desktopDayHeaderHeight + (startMinutes / 60) * desktopHourHeight;
  const height = Math.max(((endMinutes - startMinutes) / 60) * desktopHourHeight, 124);

  return (
    <article
      className={`liquid-distort-glass group left-5 right-5 z-10 cursor-pointer overflow-hidden rounded-[28px] p-4 transition hover:-translate-y-0.5 ${
        isPersonal ? "text-[#0f55c8]" : "text-[#14532d]"
      }`}
      onClick={() => onOpen(course)}
      style={{
        top,
        height,
      }}
    >
      <div className="glass-lens" />
      <div
        className={`absolute inset-y-5 left-3 z-10 w-1 rounded-full ${
          isPersonal ? "bg-sky-400/65" : "bg-emerald-500/65"
        }`}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-3 pl-3">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${
                isPersonal
                  ? "bg-sky-100/54 text-sky-800"
                  : "bg-emerald-50/54 text-emerald-800"
              }`}
            >
              {isPersonal ? "安排" : "课程"}
            </span>
            <VisibilityRail
              compact
              onChange={(visibility) =>
                onVisibilityChange(course.id, visibility)
              }
              value={course.visibility}
            />
          </div>
          <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-tight">
            {course.courseName}
          </h3>
          <p className="mt-2 truncate text-sm font-semibold text-slate-600/90">
            {course.startTime} - {course.endTime}
          </p>
          {course.location && (
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500/85">
              {course.location}
            </p>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold backdrop-blur-md ${
              getVisibilityMeta(course.visibility).className
            }`}
          >
            {getVisibilityMeta(course.visibility).short}
          </span>
          {course.showOnProfile && (
            <span className="rounded-full bg-violet-50/58 px-2 py-1 text-[10px] font-semibold text-violet-700 backdrop-blur-md">
              主页
            </span>
          )}
          {course.participateInMatching && (
            <span className="rounded-full bg-teal-50/58 px-2 py-1 text-[10px] font-semibold text-teal-700 backdrop-blur-md">
              匹配
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function MobileDayTimeline({
  activeWeekday,
  courses,
  onOpen,
  onVisibilityChange,
}: {
  activeWeekday: number;
  courses: ScheduleCourse[];
  onOpen: (course: ScheduleCourse) => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    const dayWidth = viewport.scrollWidth / weekdays.length;
    viewport.scrollTo({
      left: Math.max(0, (activeWeekday - 1) * dayWidth),
      behavior: "smooth",
    });
  }, [activeWeekday]);

  return (
    <div className="liquid-distort-shell paper-board mt-4 overflow-hidden rounded-[28px]">
      <div
        className="grid grid-cols-[76px_1fr]"
        style={{ height: `${mobileDayHeaderHeight + 24 * mobileHourHeight}px` }}
      >
        <div className="relative z-10 border-r border-amber-900/6 bg-[#fff8dd]/55">
          <div className="flex h-16 items-center justify-center text-xs font-semibold text-amber-950/32">
            24H
          </div>
          {Array.from({ length: 25 }).map((_, hour) => (
            <div
              className="absolute left-4 text-sm font-medium text-amber-950/36"
              key={hour}
              style={{
                top: `${mobileDayHeaderHeight + hour * mobileHourHeight - 10}px`,
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        <div
          className="liquid-underlay relative overflow-x-auto overscroll-x-contain scroll-smooth"
          ref={scrollRef}
        >
          <div
            className="relative grid h-full snap-x snap-mandatory grid-cols-7"
            style={{ width: `${(weekdays.length / 3) * 100}%` }}
          >
            {weekdays.map((day) => {
              const dayCourses = courses.filter(
                (course) => course.weekday === day.value,
              );

              return (
                <div
                  className="relative snap-start border-r border-amber-950/4"
                  key={day.value}
                >
                  <div className="sticky top-0 z-20 flex h-16 flex-col justify-center border-b border-amber-950/6 bg-[#fff6d4]/58 px-3 backdrop-blur-md">
                    <span
                      className={`text-xs font-semibold ${
                        day.value === activeWeekday
                          ? "text-slate-950"
                          : "text-amber-950/42"
                      }`}
                    >
                      {day.label}
                    </span>
                    <span
                      className={`mt-1 text-lg font-semibold leading-none ${
                        day.value === activeWeekday
                          ? "text-slate-950"
                          : "text-amber-950/34"
                      }`}
                    >
                      {day.short}
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 z-0"
                    style={{
                      top: `${mobileDayHeaderHeight}px`,
                      height: `${24 * mobileHourHeight}px`,
                    }}
                  >
                    {Array.from({ length: 25 }).map((_, hour) => (
                      <div
                        className="absolute left-0 right-0 border-t border-amber-950/5"
                        key={hour}
                        style={{ top: `${hour * mobileHourHeight}px` }}
                      />
                    ))}
                  </div>

                  {dayCourses.length === 0 && (
                    <div className="absolute inset-x-3 top-28 rounded-2xl border border-white/45 bg-white/14 px-3 py-4 text-center text-xs font-medium text-amber-950/34 backdrop-blur-md">
                      空
                    </div>
                  )}

                  {dayCourses.map((course) => (
                    <MobileTimelineBlock
                      course={course}
                      key={course.id}
                      onOpen={onOpen}
                      onVisibilityChange={onVisibilityChange}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTimelineBlock({
  course,
  onOpen,
  onVisibilityChange,
}: {
  course: ScheduleCourse;
  onOpen: (course: ScheduleCourse) => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
}) {
  const startMinutes = timeToMinutes(course.startTime);
  const endMinutes = timeToMinutes(course.endTime);
  const top = mobileDayHeaderHeight + (startMinutes / 60) * mobileHourHeight;
  const height = Math.max(((endMinutes - startMinutes) / 60) * mobileHourHeight, 54);

  return (
    <article
      className={`liquid-distort-glass left-4 right-4 z-10 cursor-pointer overflow-hidden rounded-[24px] p-3 transition hover:-translate-y-0.5 ${
        course.itemType === "personal" ? "text-[#0f55c8]" : "text-[#14532d]"
      }`}
      onClick={() => onOpen(course)}
      style={{
        top,
        height,
      }}
    >
      <div className="glass-lens" />
      <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  course.itemType === "personal"
                    ? "bg-sky-100/54 text-sky-800 backdrop-blur-md"
                    : "bg-emerald-50/54 text-emerald-800 backdrop-blur-md"
                }`}
              >
                {course.itemType === "personal" ? "个人安排" : "课程"}
              </span>
              <h3 className="mt-1 truncate text-sm font-semibold">
                {course.courseName}
              </h3>
            </div>
            <VisibilityRail
              onChange={(visibility) =>
                onVisibilityChange(course.id, visibility)
              }
              value={course.visibility}
            />
          </div>
          <p className="mt-1 truncate text-xs font-medium text-slate-600/86">
            {course.startTime} - {course.endTime}
            {course.location ? ` · ${course.location}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {course.showOnProfile && (
            <span className="rounded-full bg-violet-50/54 px-2 py-1 text-[10px] font-semibold text-violet-700 backdrop-blur-md">
              主页
            </span>
          )}
          {course.participateInMatching && (
            <span className="rounded-full bg-teal-50/54 px-2 py-1 text-[10px] font-semibold text-teal-700 backdrop-blur-md">
              匹配
            </span>
          )}
          {course.itemType === "personal" && (
            <span className="rounded-full bg-white/38 px-2 py-1 text-[10px] font-semibold text-sky-700 backdrop-blur-md">
              私人
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function CourseListCard({
  course,
  onOpen,
  onVisibilityChange,
  onToggle,
}: {
  course: ScheduleCourse;
  onOpen: (course: ScheduleCourse) => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
  onToggle: (id: string, key: keyof ScheduleCourse) => void;
}) {
  return (
    <article
      className="liquid-soft cursor-pointer rounded-3xl p-4 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10"
      onClick={() => onOpen(course)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              course.itemType === "personal"
                ? "bg-sky-50 text-sky-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {course.itemType === "personal" ? (
              <Coffee size={13} />
            ) : (
              <CalendarDays size={13} />
            )}
            {course.itemType === "personal" ? "个人安排" : "课程"}
          </span>
          <h3 className="truncate text-base font-semibold">
            {course.courseName}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {weekdays.find((day) => day.value === course.weekday)?.label} ·{" "}
            {course.startTime} - {course.endTime}
          </p>
        </div>
        <VisibilityRail
          onChange={(visibility) => onVisibilityChange(course.id, visibility)}
          value={course.visibility}
        />
      </div>

      <div className="mt-3 grid gap-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin size={15} />
          {course.location || "未填写地点"}
        </p>
        <p className="flex items-center gap-2">
          <Bell size={15} />
          {formatReminder(course.reminderMinutes)}
        </p>
        <p className="flex items-center gap-2">
          <Sparkles size={15} />
          {course.itemType === "course"
            ? `${courseStatusLabels[course.status]} · 第 ${course.startWeek}-${course.endWeek} 周 · ${weekTypeLabels[course.weekType]}`
            : course.teacher || "自己的安排"}
        </p>
        {course.note && (
          <p className="rounded-2xl bg-white/42 px-3 py-2 text-sm leading-6">
            {course.note}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Pill
          active={course.showOnProfile}
          icon={<UserRoundCheck size={13} />}
          label="主页展示"
          onClick={() => onToggle(course.id, "showOnProfile")}
        />
        <Pill
          active={course.participateInMatching}
          icon={<Sparkles size={13} />}
          label="参与匹配"
          onClick={() => onToggle(course.id, "participateInMatching")}
        />
      </div>
    </article>
  );
}

function Pill({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-white/60 bg-white/40 text-slate-600"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

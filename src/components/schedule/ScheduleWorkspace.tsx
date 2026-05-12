"use client";

import {
  Bell,
  CalendarDays,
  Coffee,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { emptyCourseInput, initialCourses } from "@/lib/schedule/mock";
import {
  courseStatusLabels,
  courseStatusOptions,
  reminderOptions,
  timeSlots,
  weekdays,
  weekTypeLabels,
  weekTypeOptions,
} from "@/lib/schedule/options";
import {
  formatReminder,
  getCourseGridPosition,
  sortCourses,
} from "@/lib/schedule/time";
import type { ScheduleCourse, ScheduleCourseInput } from "@/types/schedule";

const storageKey = "campus-ai-schedule-v2";

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
  const [activeWeekday, setActiveWeekday] = useState<number>(2);
  const [query, setQuery] = useState("");

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

  const activeDayCourses = visibleCourses.filter(
    (course) => course.weekday === activeWeekday,
  );

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

  function toggleCourse(id: string, key: keyof ScheduleCourse) {
    setCourses((current) =>
      current.map((course) => {
        if (course.id !== id) {
          return course;
        }

        if (key === "visibility") {
          return {
            ...course,
            visibility: course.visibility === "public" ? "private" : "public",
          };
        }

        return {
          ...course,
          [key]: !course[key],
        };
      }),
    );
  }

  function resetDemo() {
    setCourses(initialCourses);
    setForm(emptyCourseInput);
    setQuery("");
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
              <Metric label="公开事项" value={publicCount} />
              <Metric label="个人安排" value={personalCount} />
              <Metric label="参与匹配" value={matchingCount} />
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.65fr_0.95fr]">
          <div className="liquid-glass rounded-[28px] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">周视图课表</h2>
                <p className="mt-1 text-sm text-slate-600">
                  课程和个人安排会按时间自动落位，公开和匹配状态直接可见。
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

            <div className="mt-5 hidden overflow-hidden rounded-[22px] border border-white/60 bg-white/25 lg:block">
              <div className="grid grid-cols-[76px_repeat(7,minmax(0,1fr))] border-b border-white/60">
                <div className="px-3 py-3 text-xs font-medium text-slate-500">
                  时间
                </div>
                {weekdays.map((day) => (
                  <div
                    className="border-l border-white/60 px-3 py-3 text-sm font-semibold"
                    key={day.value}
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              <div className="grid min-h-[960px] grid-cols-[76px_repeat(7,minmax(0,1fr))]">
                <div className="relative border-r border-white/60">
                  {timeSlots.map((slot, index) => (
                    <div
                      className="absolute left-3 text-xs font-medium text-slate-400"
                      key={slot.start}
                      style={{
                        top: `${(index / (timeSlots.length - 1)) * 100}%`,
                      }}
                    >
                      {slot.label}
                    </div>
                  ))}
                </div>

                {weekdays.map((day) => (
                  <div
                    className="relative border-l border-white/50"
                    key={day.value}
                  >
                    <div className="absolute inset-0 grid grid-rows-8">
                      {timeSlots.slice(0, -1).map((slot) => (
                        <div
                          className="border-b border-white/40"
                          key={`${day.value}-${slot.start}`}
                        />
                      ))}
                    </div>
                    {visibleCourses
                      .filter((course) => course.weekday === day.value)
                      .map((course) => (
                        <CourseBubble
                          course={course}
                          key={course.id}
                          onToggle={toggleCourse}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>

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
                courses={activeDayCourses}
                onToggle={toggleCourse}
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
                  <ToggleRow
                    checked={form.visibility === "public"}
                    label="公开这个日程"
                    onChange={() =>
                      updateForm(
                        "visibility",
                        form.visibility === "public" ? "private" : "public",
                      )
                    }
                  />
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

function CourseBubble({
  course,
  onToggle,
}: {
  course: ScheduleCourse;
  onToggle: (id: string, key: keyof ScheduleCourse) => void;
}) {
  const position = getCourseGridPosition(course);

  return (
    <article
      className="absolute left-1 right-1 z-10 overflow-hidden rounded-2xl border border-white/70 bg-white/62 p-3 shadow-lg shadow-slate-900/10 backdrop-blur-xl"
      style={position}
    >
      <div className="flex h-full flex-col justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span
                className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  course.itemType === "personal"
                    ? "bg-sky-50 text-sky-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {course.itemType === "personal" ? "安排" : "课程"}
              </span>
              <h3 className="line-clamp-2 text-sm font-semibold">
                {course.courseName}
              </h3>
            </div>
            {course.visibility === "public" ? (
              <Eye size={14} className="shrink-0 text-teal-700" />
            ) : (
              <EyeOff size={14} className="shrink-0 text-slate-400" />
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {course.startTime} - {course.endTime}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {course.itemType === "personal" && (
            <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700">
              私人日程
            </span>
          )}
          {course.participateInMatching && (
            <button
              className="rounded-full bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-700"
              onClick={() => onToggle(course.id, "participateInMatching")}
              type="button"
            >
              匹配中
            </button>
          )}
          {course.showOnProfile && (
            <button
              className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700"
              onClick={() => onToggle(course.id, "showOnProfile")}
              type="button"
            >
              主页
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function MobileDayTimeline({
  courses,
  onToggle,
}: {
  courses: ScheduleCourse[];
  onToggle: (id: string, key: keyof ScheduleCourse) => void;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-[24px] border border-white/60 bg-white/22">
      <div className="grid min-h-[960px] grid-cols-[64px_1fr]">
        <div className="relative border-r border-white/60">
          {timeSlots.map((slot, index) => (
            <div
              className="absolute left-3 text-xs font-medium text-slate-400"
              key={slot.start}
              style={{ top: `${(index / (timeSlots.length - 1)) * 100}%` }}
            >
              {slot.label}
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 grid grid-rows-8">
            {timeSlots.slice(0, -1).map((slot) => (
              <div className="border-b border-white/42" key={slot.start} />
            ))}
          </div>

          {courses.length === 0 && <EmptyDay />}

          {courses.map((course) => (
            <MobileTimelineBlock
              course={course}
              key={course.id}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTimelineBlock({
  course,
  onToggle,
}: {
  course: ScheduleCourse;
  onToggle: (id: string, key: keyof ScheduleCourse) => void;
}) {
  const position = getCourseGridPosition(course);

  return (
    <article
      className={`absolute left-3 right-3 z-10 overflow-hidden rounded-2xl border p-3 shadow-lg backdrop-blur-xl ${
        course.itemType === "personal"
          ? "border-sky-100/80 bg-sky-50/76 shadow-sky-900/10"
          : "border-emerald-100/80 bg-white/72 shadow-slate-900/10"
      }`}
      style={position}
    >
      <div className="flex h-full min-h-0 flex-col justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  course.itemType === "personal"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {course.itemType === "personal" ? "个人安排" : "课程"}
              </span>
              <h3 className="mt-1 truncate text-sm font-semibold">
                {course.courseName}
              </h3>
            </div>
            <button
              className="rounded-full bg-white/54 p-1.5 text-slate-600"
              onClick={() => onToggle(course.id, "visibility")}
              type="button"
              aria-label="切换公开状态"
            >
              {course.visibility === "public" ? (
                <Eye size={14} />
              ) : (
                <EyeOff size={14} />
              )}
            </button>
          </div>
          <p className="mt-1 truncate text-xs font-medium text-slate-600">
            {course.startTime} - {course.endTime}
            {course.location ? ` · ${course.location}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {course.showOnProfile && (
            <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
              主页
            </span>
          )}
          {course.participateInMatching && (
            <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700">
              匹配
            </span>
          )}
          {course.itemType === "personal" && (
            <span className="rounded-full bg-white/58 px-2 py-1 text-[10px] font-semibold text-sky-700">
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
  onToggle,
}: {
  course: ScheduleCourse;
  onToggle: (id: string, key: keyof ScheduleCourse) => void;
}) {
  return (
    <article className="liquid-soft rounded-3xl p-4">
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
        <button
          className="rounded-full bg-white/60 p-2 text-slate-600"
          onClick={() => onToggle(course.id, "visibility")}
          type="button"
          aria-label="切换公开状态"
        >
          {course.visibility === "public" ? (
            <Eye size={16} />
          ) : (
            <EyeOff size={16} />
          )}
        </button>
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

function EmptyDay() {
  return (
    <div className="absolute inset-x-3 top-[38%] z-10 rounded-3xl border border-white/60 bg-white/58 p-6 text-center shadow-lg shadow-slate-900/10 backdrop-blur-xl">
      <p className="font-semibold">这一天还没有课程</p>
      <p className="mt-2 text-sm text-slate-600">
        添加课程或个人安排后，会用时间块占住对应时间段。
      </p>
    </div>
  );
}

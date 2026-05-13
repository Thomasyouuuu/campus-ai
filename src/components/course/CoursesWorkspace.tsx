"use client";

import {
  Award,
  BookOpen,
  CircleDollarSign,
  CircleDot,
  ClipboardList,
  FileCheck,
  FileText,
  FolderOpen,
  Globe2,
  Headphones,
  Heart,
  ImagePlus,
  Layers,
  ListChecks,
  MessageCircle,
  Puzzle,
  Search,
  Sparkles,
  Tag,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  mockCourseDetails,
  mockCourseList,
  mockSearchResults,
  skillsAIModeLabels,
  skillAIMockResponses,
} from "@/lib/course/mock";
import type {
  CourseDetail,
  CourseSection,
  CourseTabKey,
  CourseSummary,
  SkillsAIMode,
  SkillsAIMessage,
} from "@/types/course";

const topSections: Array<{ key: CourseSection; label: string; description: string }> = [
  { key: "search", label: "搜课程", description: "快速查找课程和推荐加入" },
  { key: "add", label: "添加课程", description: "手动创建你的课程空间" },
  { key: "my", label: "我的课程", description: "查看和进入已加入的课程" },
];

const tabItems: Array<{ key: CourseTabKey; label: string }> = [
  { key: "overview", label: "课程概览" },
  { key: "chat", label: "聊天室" },
  { key: "notes", label: "课程笔记" },
  { key: "skills", label: "AI 自学" },
  { key: "ddl", label: "考试 / DDL" },
  { key: "members", label: "课程成员" },
  { key: "teams", label: "课程组队" },
];

export function CoursesWorkspace() {
  const [activeSection, setActiveSection] = useState<CourseSection>("my");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCourse = useMemo(
    () => (selectedCourseId ? mockCourseDetails[selectedCourseId] : null),
    [selectedCourseId],
  );

  const filteredCourses = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return mockSearchResults;
    }
    return mockSearchResults.filter((course) =>
      [course.courseName, course.teacher, course.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [searchQuery]);

  if (selectedCourse) {
    return (
      <div className="liquid-page min-h-screen overflow-hidden text-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <CourseDetail
            course={selectedCourse}
            onBack={() => setSelectedCourseId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="liquid-glass rounded-[32px] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-700">课程空间</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
                每门课都是你的学习社区与 AI 自学工作台
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                在这里搜课程、添加课程、进入我的课程。每门课可以承载笔记、聊天室、DDL、成员和 AI 学习导引。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <SummaryCard label="已加入课程" value={2} icon={<FolderOpen size={18} />} />
              <SummaryCard label="待处理 DDL" value={7} icon={<ClipboardList size={18} />} />
              <SummaryCard label="AI 自学" value={1} icon={<Sparkles size={18} />} />
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.75fr_0.95fr]">
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {topSections.map((section) => (
                <button
                  key={section.key}
                  className={`rounded-[26px] border px-4 py-4 text-left transition ${
                    activeSection === section.key
                      ? "bg-[#fff8dd] text-slate-950 shadow-[0_20px_60px_rgba(255,244,214,0.35)]"
                      : "bg-white/70 text-slate-700 hover:bg-white"
                  }`}
                  onClick={() => setActiveSection(section.key)}
                  type="button"
                >
                  <p className="text-sm font-semibold">{section.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {section.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="liquid-glass rounded-[32px] p-5 sm:p-6">
              {activeSection === "search" ? (
                <CourseSearchPanel
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  results={filteredCourses}
                  onJoin={(id) => setSelectedCourseId(id)}
                />
              ) : activeSection === "add" ? (
                <AddCoursePanel />
              ) : (
                <MyCoursesPanel
                  courses={mockCourseList.filter((course) => course.membership === "joined")}
                  onOpen={(id) => setSelectedCourseId(id)}
                />
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="liquid-glass rounded-[32px] p-5">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-emerald-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI 课程助手</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    进入 Skills AI，快速用分步引导、练习题和错题本提升学习效率。
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <QuickCard title="拍题学习" description="上传题目图片，AI 先帮你判断知识点。" icon={<ImagePlus size={18} />} />
                <QuickCard title="生成自测" description="根据课堂笔记自动出题。" icon={<ListChecks size={18} />} />
                <QuickCard title="课程速查" description="关联当前课程笔记与 DDL。" icon={<BookOpen size={18} />} />
              </div>
            </div>

            <div className="liquid-soft rounded-[32px] p-5">
              <p className="text-sm font-semibold text-teal-700">课程快览</p>
              <div className="mt-4 space-y-3">
                {mockCourseList.slice(0, 2).map((course) => (
                  <div key={course.id} className="rounded-3xl border border-white/70 bg-white/40 p-4">
                    <p className="text-sm font-semibold text-slate-900">{course.courseName}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{course.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
                      <span className="rounded-full bg-white/80 px-2 py-1">{course.nextSession}</span>
                      <span className="rounded-full bg-white/80 px-2 py-1">{course.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white/80 px-5 py-4 shadow-[0_18px_40px_rgba(31,47,62,0.08)] backdrop-blur-md">
      <div className="flex items-center gap-3 text-slate-800">
        <span className="rounded-2xl bg-slate-950/5 p-2 text-slate-700">{icon}</span>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/40 px-4 py-4 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">{icon}</span>
        <div>
          <p className="font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function CourseSearchPanel({
  query,
  onQueryChange,
  results,
  onJoin,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  results: CourseSummary[];
  onJoin: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">搜索课程</h2>
          <p className="mt-2 text-sm text-slate-600">
            先找到你想加入的课程，再进入课程空间查看 AI 学习与课堂资料。
          </p>
        </div>
        <div className="liquid-soft flex items-center gap-2 rounded-full px-4 py-3">
          <Search size={16} className="text-slate-500" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="搜索课程名、老师或关键词"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((course) => (
          <CourseSearchResult key={course.id} course={course} onJoin={onJoin} />
        ))}
      </div>
    </div>
  );
}

function CourseSearchResult({
  course,
  onJoin,
}: {
  course: CourseSummary;
  onJoin: (id: string) => void;
}) {
  return (
    <div className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_18px_40px_rgba(31,47,62,0.08)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{course.courseName}</p>
          <p className="mt-2 text-sm text-slate-600">{course.teacher}</p>
        </div>
        <button
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="button"
          onClick={() => onJoin(course.id)}
        >
          加入
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{course.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-700">
        <span className="rounded-full bg-slate-100 px-2 py-1">{course.nextSession}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{course.location}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{course.tags[0]}</span>
      </div>
    </div>
  );
}

function AddCoursePanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">添加课程</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          手动创建课程，立即进入专属课程页面，AI 自学系统会关联你的课程内容。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextCard title="创建新课程" description="填写课程名、老师和上课时间，生成课程空间入口。" icon={<FileText size={18} />} />
        <TextCard title="导入课表" description="从已有课表、课堂资料或课程清单快速生成。" icon={<FolderOpen size={18} />} />
      </div>

      <div className="liquid-soft rounded-[30px] p-5">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-teal-700" />
          <div>
            <p className="font-semibold text-slate-950">快速开课</p>
            <p className="mt-1 text-sm text-slate-600">留空选项后系统会给你智能推荐，适合先把课程空间搭建起来。</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <input className="field-input" placeholder="课程名称，例如：计量经济学" />
          <input className="field-input" placeholder="授课老师，例如：陈老师" />
          <button className="rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800" type="button">
            创建课程空间
          </button>
        </div>
      </div>
    </div>
  );
}

function MyCoursesPanel({
  courses,
  onOpen,
}: {
  courses: CourseSummary[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">我的课程</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          你已加入的课程空间会在这里展示，快速进入详情页查看 AI 自学、笔记与组队。 
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({
  course,
  onOpen,
}: {
  course: CourseSummary;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="liquid-soft rounded-[30px] p-5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{course.courseName}</p>
          <p className="mt-2 text-xs text-slate-600">{course.teacher}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          {course.status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{course.description}</p>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p className="flex items-center gap-2"><CircleDot size={14} />{course.nextSession} · {course.location}</p>
        <p className="flex items-center gap-2"><Users size={14} />{course.studentCount} 人已加入</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="button"
          onClick={() => onOpen(course.id)}
        >
          进入课程
        </button>
        <span className="rounded-full bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700">
          {course.newNotesCount} 条新笔记
        </span>
        <span className="rounded-full bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700">
          {course.unreadDDLCount} 条待办
        </span>
      </div>
    </article>
  );
}

function TextCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-md">
      <div className="flex items-center gap-3 text-slate-900">
        <span className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</span>
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function CourseDetail({ course, onBack }: { course: CourseDetail; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<CourseTabKey>("overview");

  return (
    <div className="space-y-6">
      <div className="liquid-glass rounded-[32px] p-5 sm:p-6">
        <button
          className="liquid-soft mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={onBack}
          type="button"
        >
          返回课程
        </button>
        <div className="grid gap-5 lg:grid-cols-[1.8fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <BookOpen size={14} />课程空间
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1 text-xs font-semibold text-slate-700">
                {course.members.length} 位成员
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">{course.courseName}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{course.summary}</p>
          </div>
          <div className="grid gap-3 rounded-[30px] border border-white/70 bg-white/60 p-4 backdrop-blur-md">
            <DetailStat label="老师" value={course.teacher} />
            <DetailStat label="下次上课" value={course.nextSession} />
            <DetailStat label="地点" value={course.location} />
            <DetailStat label="待办 DDL" value={`${course.upcomingDDL.length}`} />
          </div>
        </div>
      </div>

      <div className="liquid-soft rounded-[32px] p-3 shadow-[0_18px_50px_rgba(31,47,62,0.08)]">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-2 p-2">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-slate-950 text-white"
                    : "bg-white/85 text-slate-700 hover:bg-white"
                }`}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        {activeTab === "overview" && <CourseOverview course={course} />}
        {activeTab === "chat" && <CourseChat course={course} />}
        {activeTab === "notes" && <CourseNotes course={course} />}
        {activeTab === "skills" && <SkillsAI course={course} />}
        {activeTab === "ddl" && <CourseDDL course={course} />}
        {activeTab === "members" && <CourseMembers course={course} />}
        {activeTab === "teams" && <CourseTeams course={course} />}
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function CourseOverview({ course }: { course: CourseDetail }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
      <section className="liquid-glass rounded-[32px] p-5 sm:p-6">
        <div className="flex items-center gap-3 text-slate-950">
          <Sparkles size={20} className="text-teal-700" />
          <div>
            <p className="text-sm font-semibold">课程概览</p>
            <p className="mt-1 text-sm text-slate-600">默认展示当前课程的学习主题、笔记与 DDL 关联。</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoCard label="最近学习主题" values={course.recentTopics} />
          <InfoCard label="已掌握知识点" values={course.masteredPoints} />
          <InfoCard label="待复习知识点" values={course.reviewPoints} />
          <DDLCard items={course.upcomingDDL} />
        </div>
      </section>
      <section className="liquid-soft rounded-[32px] p-5 sm:p-6">
        <p className="text-sm font-semibold text-teal-700">课堂速查</p>
        <div className="mt-4 space-y-3">
          {course.notes.map((note) => (
            <div key={note.id} className="rounded-3xl border border-white/70 bg-white/40 p-4">
              <p className="text-sm font-semibold text-slate-950">{note.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{note.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
                <span className="rounded-full bg-slate-100 px-2 py-1">{note.tag}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{note.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-md">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        {values.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</div>
        ))}
      </div>
    </div>
  );
}

function DDLCard({ items }: { items: CourseDetail["upcomingDDL"] }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-md">
      <p className="text-sm font-semibold text-slate-900">近期 DDL</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-100 bg-white/80 p-4">
            <p className="text-sm font-semibold text-slate-950">{item.title}</p>
            <p className="mt-1 text-xs text-slate-600">{item.type} · 截止 {item.dueDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseChat({ course }: { course: CourseDetail }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="liquid-glass rounded-[32px] p-5 sm:p-6">
        <div className="flex items-center gap-3 text-slate-950">
          <MessageCircle size={20} className="text-blue-700" />
          <div>
            <p className="text-sm font-semibold">课程聊天室</p>
            <p className="mt-1 text-sm text-slate-600">围绕 {course.courseName} 的同课讨论，后续可以进一步接入实时消息。</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <ChatMessage author="小李" role="同课同学" text="这道题你怎么看？老师上课的逻辑有点绕。" />
          <ChatMessage author="AI 助教" role="AI" text="建议从题干中的边际成本角度先做第一步，你可以先试着写出成本函数。" />
          <ChatMessage author="你" role="学生" text="我觉得这题应该用均衡条件，但不确定怎么表达。" />
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-3xl border border-white/70 bg-white/60 p-3 backdrop-blur-md">
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="发一条课程消息" />
          <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">发送</button>
        </div>
      </section>
      <aside className="space-y-4">
        <SmallInfoCard icon={<CircleDollarSign size={18} />} title="聊天室建议" description="先把问题拆成两部分，再请求 AI 检查。" />
        <SmallInfoCard icon={<Users size={18} />} title="活跃成员" description="阿佳、 小高在本周内发布了最新讨论。" />
      </aside>
    </div>
  );
}

function ChatMessage({ author, role, text }: { author: string; role: string; text: string; }) {
  return (
    <div className="rounded-[28px] border border-white/75 bg-white/70 p-4 text-sm text-slate-700 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-slate-950">{author}</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{role}</span>
      </div>
      <p className="mt-3 leading-6">{text}</p>
    </div>
  );
}

function SmallInfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-4 backdrop-blur-md">
      <div className="flex items-center gap-3 text-slate-950">
        <span className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function CourseNotes({ course }: { course: CourseDetail }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="liquid-glass rounded-[32px] p-5 sm:p-6">
        <div className="flex items-center gap-3 text-slate-950">
          <BookOpen size={20} className="text-violet-700" />
          <div>
            <p className="text-sm font-semibold">课程笔记</p>
            <p className="mt-1 text-sm text-slate-600">我的笔记、共享笔记和 AI 笔记总结都将在这里呈现。</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {course.notes.map((note) => (
            <div key={note.id} className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-slate-950">{note.title}</p>
              <p className="mt-2 text-sm text-slate-600">{note.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
                <span className="rounded-full bg-slate-100 px-2 py-1">{note.tag}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{note.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <aside className="space-y-4">
        <SmallInfoCard icon={<Globe2 size={18} />} title="AI 笔记总结" description="根据课堂笔记提取核心考点。" />
        <SmallInfoCard icon={<Headphones size={18} />} title="课堂录音摘要" description="录音转写内容将在这里展示（mock）。" />
      </aside>
    </div>
  );
}

function SkillsAI({ course }: { course: CourseDetail }) {
  const [activeMode, setActiveMode] = useState<SkillsAIMode>("step");
  const [messages, setMessages] = useState<SkillsAIMessage[]>(course.skillsMessages);
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) {
      return;
    }
    const nextUserMessage: SkillsAIMessage = {
      id: `user-${Date.now()}`,
      sender: "student",
      text: draft,
      time: "现在",
    };
    const nextTutorMessage: SkillsAIMessage = {
      id: `tutor-${Date.now() + 1}`,
      sender: "tutor",
      text: skillAIMockResponses[activeMode],
      time: "现在",
    };
    setMessages((current) => [...current, nextUserMessage, nextTutorMessage]);
    setDraft("");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.95fr]">
      <div className="space-y-5">
        <SkillsAIContextCard course={course} />
        <div className="liquid-glass rounded-[32px] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-700">AI 自学 / Skills AI</p>
              <p className="mt-1 text-sm text-slate-600">选择引导模式，和 AI 助教一步步练习你的课程问题。</p>
            </div>
            <SkillsAIModeSelector value={activeMode} onChange={setActiveMode} />
          </div>
          <SkillsAITutorPanel
            messages={messages}
            draft={draft}
            onDraftChange={setDraft}
            onSend={handleSend}
          />
        </div>
      </div>
      <SkillsAISidebar course={course} />
    </div>
  );
}

function SkillsAIContextCard({ course }: { course: CourseDetail }) {
  return (
    <div className="liquid-soft rounded-[32px] p-5 sm:p-6">
      <div className="flex items-center gap-3 text-slate-950">
        <Sparkles size={20} className="text-emerald-700" />
        <div>
          <p className="text-sm font-semibold">学习上下文</p>
          <p className="mt-1 text-sm text-slate-600">AI 会基于当前课程、课堂笔记和 DDL 推荐学习路径。</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <ContextPill label="当前课程" value={course.courseName} />
        <ContextPill label="最近主题" value={course.recentTopics.join(" / ")} />
        <ContextPill label="待复习" value={course.reviewPoints.join(" / ")} />
      </div>
    </div>
  );
}

function ContextPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/60 px-4 py-3 text-sm text-slate-700 backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-900">{value}</p>
    </div>
  );
}

function SkillsAIModeSelector({
  value,
  onChange,
}: {
  value: SkillsAIMode;
  onChange: (mode: SkillsAIMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100/70 p-2">
      {(Object.keys(skillsAIModeLabels) as SkillsAIMode[]).map((mode) => (
        <button
          key={mode}
          className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
            value === mode
              ? "bg-slate-950 text-white"
              : "bg-white text-slate-700 hover:bg-white/90"
          }`}
          type="button"
          onClick={() => onChange(mode)}
        >
          {skillsAIModeLabels[mode]}
        </button>
      ))}
    </div>
  );
}

function SkillsAITutorPanel({
  messages,
  draft,
  onDraftChange,
  onSend,
}: {
  messages: SkillsAIMessage[];
  draft: string;
  onDraftChange: (text: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="mt-5 rounded-[32px] border border-white/70 bg-white/60 p-4 shadow-[0_18px_40px_rgba(31,47,62,0.08)] backdrop-blur-md">
      <div className="max-h-[520px] space-y-4 overflow-auto pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-[28px] p-4 ${
              message.sender === "tutor"
                ? "bg-slate-950 text-white"
                : "bg-slate-50 text-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>{message.sender === "tutor" ? "AI 助教" : "你"}</span>
              <span>{message.time}</span>
            </div>
            <p className="mt-3 text-sm leading-7">{message.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
        <input
          className="field-input w-full flex-1"
          placeholder="输入问题或上传题目……"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && !event.shiftKey && onSend()}
        />
        <button
          className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          type="button"
          onClick={onSend}
        >
          发送
        </button>
      </div>
    </div>
  );
}

function SkillsAISidebar({ course }: { course: CourseDetail }) {
  return (
    <aside className="space-y-5">
      <SkillsAIPracticeCard />
      <SkillsAIMistakeBook mistakes={course.mistakeCards} />
      <SmallInfoCard icon={<Puzzle size={18} />} title="下一步建议" description="先把当前笔记里的关键概念画成思维导图。" />
    </aside>
  );
}

function SkillsAIPracticeCard() {
  return (
    <div className="liquid-soft rounded-[32px] p-5">
      <div className="flex items-center gap-3 text-slate-950">
        <FileCheck size={20} className="text-teal-700" />
        <div>
          <p className="text-sm font-semibold">自测模式</p>
          <p className="mt-1 text-sm text-slate-600">生成练习题，训练知识点理解而非背答案。</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <button className="w-full rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800" type="button">
          生成选择题
        </button>
        <button className="w-full rounded-3xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-950" type="button">
          生成简答题
        </button>
      </div>
    </div>
  );
}

function SkillsAIMistakeBook({
  mistakes,
}: {
  mistakes: Array<{ id: string; title: string; reason: string; nextReview: string }>;
}) {
  return (
    <div className="liquid-soft rounded-[32px] p-5">
      <div className="flex items-center gap-3 text-slate-950">
        <Award size={20} className="text-amber-700" />
        <div>
          <p className="text-sm font-semibold">错题本</p>
          <p className="mt-1 text-sm text-slate-600">归档你的学习盲点，AI 下次会优先提醒。</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {mistakes.map((mistake) => (
          <div key={mistake.id} className="rounded-3xl border border-white/70 bg-white/60 p-4">
            <p className="text-sm font-semibold text-slate-950">{mistake.title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{mistake.reason}</p>
            <p className="mt-3 text-[11px] text-slate-500">下次复习：{mistake.nextReview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseDDL({ course }: { course: CourseDetail }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:gap-5">
      <section className="liquid-glass rounded-[32px] p-5 sm:p-6 xl:flex-1">
        <div className="flex items-center gap-3 text-slate-950">
          <CircleDollarSign size={20} className="text-amber-700" />
          <div>
            <p className="text-sm font-semibold">考试 / 论文 / DDL</p>
            <p className="mt-1 text-sm text-slate-600">管理当前课程的所有任务和复习计划。</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {course.upcomingDDL.map((item) => (
            <div key={item.id} className="rounded-[28px] border border-white/70 bg-white/70 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">{item.type}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">截止 {item.dueDate}</p>
            </div>
          ))}
        </div>
      </section>
      <aside className="grid gap-4 xl:w-[320px]">
        <SmallInfoCard icon={<Tag size={18} />} title="学习计划" description="将 DDL 任务转化为复习日程。" />
        <SmallInfoCard icon={<Video size={18} />} title="考前提醒" description="AI 将在关键节点提醒你回顾错题。" />
      </aside>
    </div>
  );
}

function CourseMembers({ course }: { course: CourseDetail }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
      <section className="liquid-glass rounded-[32px] p-5 sm:p-6">
        <div className="flex items-center gap-3 text-slate-950">
          <Users size={20} className="text-blue-700" />
          <div>
            <p className="text-sm font-semibold">课程成员</p>
            <p className="mt-1 text-sm text-slate-600">查看同课成员和他们的学习状态。</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {course.members.map((member) => (
            <div key={member.id} className="rounded-3xl border border-white/70 bg-white/70 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{member.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{member.role}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <aside className="space-y-4">
        <SmallInfoCard icon={<Heart size={18} />} title="组队偏好" description="优先推荐想找复习搭子和讨论组的人。" />
        <SmallInfoCard icon={<Tag size={18} />} title="共享笔记" description="记录下本周贡献笔记的成员。" />
      </aside>
    </div>
  );
}

function CourseTeams({ course }: { course: CourseDetail }) {
  return (
    <div className="grid gap-5">
      <section className="liquid-glass rounded-[32px] p-5 sm:p-6">
        <div className="flex items-center gap-3 text-slate-950">
          <Puzzle size={20} className="text-emerald-700" />
          <div>
            <p className="text-sm font-semibold">课程组队</p>
            <p className="mt-1 text-sm text-slate-600">小组作业、论文互助和复习搭子赛道。 </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {course.teams.map((team) => (
            <div key={team.id} className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950">{team.title}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">{team.progress}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{team.focus}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">{team.members} 人</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

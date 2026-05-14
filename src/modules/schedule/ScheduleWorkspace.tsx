"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  Coffee,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emptyCourseInput, initialCourses } from "@/lib/schedule/mock";
import { weekdays } from "@/lib/schedule/options";
import { sortCourses, timeToMinutes } from "@/lib/schedule/time";
import type {
  CourseVisibility,
  ScheduleCourse,
  ScheduleCourseInput,
} from "@/types/schedule";

const storageKey = "campus-ai-schedule-v2";
const dayHeaderHeight = 76;
const minHourHeight = 24;
const maxHourHeight = 104;
const compactThreshold = 32;
const defaultHourHeight = 58;
const minDayWidth = 68;
const maxDayWidth = 240;
const timeColumnWidth = 72;
const visibilityOptions: Array<{
  description: string;
  label: string;
  value: CourseVisibility;
}> = [
  {
    description: "别人能看到具体事项",
    label: "显示给他人",
    value: "public",
  },
  {
    description: "别人只看到这段忙碌",
    label: "不显示详细事项",
    value: "busy",
  },
  {
    description: "仅自己可见",
    label: "隐藏",
    value: "private",
  },
];

type EditorMode = "create" | "edit";

export function ScheduleWorkspace({
  embedded = false,
}: {
  embedded?: boolean;
} = {}) {
  const [courses, setCourses] = useState<ScheduleCourse[]>(() => {
    if (typeof window === "undefined") {
      return initialCourses;
    }

    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as ScheduleCourse[]) : initialCourses;
    } catch {
      return initialCourses;
    }
  });
  const [activeWeekday, setActiveWeekday] = useState(1);
  const [query, setQuery] = useState("");
  const [editorState, setEditorState] = useState<{
    course: ScheduleCourseInput;
    id?: string;
    mode: EditorMode;
  } | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(courses));
  }, [courses]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCourses = useMemo(
    () =>
      sortCourses(courses).filter((course) => {
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
      }),
    [courses, normalizedQuery],
  );

  function openCreateEditor() {
    setEditorState({
      course: {
        ...emptyCourseInput,
        weekday: activeWeekday,
        visibility: "private",
      },
      mode: "create",
    });
  }

  function openEditEditor(course: ScheduleCourse) {
    const { id, ...input } = course;
    setEditorState({ course: input, id, mode: "edit" });
  }

  function updateEditor<K extends keyof ScheduleCourseInput>(
    key: K,
    value: ScheduleCourseInput[K],
  ) {
    setEditorState((current) =>
      current
        ? {
            ...current,
            course: {
              ...current.course,
              [key]: value,
            },
          }
        : current,
    );
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editorState?.course.courseName.trim()) {
      return;
    }

    const nextCourse = {
      ...editorState.course,
      courseName: editorState.course.courseName.trim(),
      teacher: editorState.course.teacher.trim(),
      location: editorState.course.location.trim(),
      note: editorState.course.note.trim(),
    };

    if (editorState.mode === "create") {
      setCourses((current) => [
        ...current,
        {
          ...nextCourse,
          id: crypto.randomUUID(),
        },
      ]);
    } else if (editorState.id) {
      setCourses((current) =>
        current.map((course) =>
          course.id === editorState.id
            ? {
                ...course,
                ...nextCourse,
              }
            : course,
        ),
      );
    }

    setActiveWeekday(nextCourse.weekday);
    setEditorState(null);
  }

  function deleteCourse() {
    if (!editorState?.id) {
      return;
    }

    setCourses((current) =>
      current.filter((course) => course.id !== editorState.id),
    );
    setEditorState(null);
  }

  function updateCourseVisibility(id: string, visibility: CourseVisibility) {
    setCourses((current) =>
      current.map((course) =>
        course.id === id ? { ...course, visibility } : course,
      ),
    );
  }

  return (
    <main
      className={
        embedded
          ? "text-slate-950"
          : "liquid-page min-h-screen overflow-hidden text-slate-950"
      }
    >
      <section
        className={
          embedded
            ? "flex w-full flex-col gap-4"
            : "mobile-page-x mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 py-4 sm:py-5 lg:py-8"
        }
      >
        {!embedded && (
          <div className="flex items-center gap-3">
            <label className="liquid-soft flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full px-4 sm:h-16 sm:px-6">
              <Search size={21} className="shrink-0 text-slate-500" />
              <input
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400 sm:text-lg"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索课程、安排、地点"
                value={query}
              />
            </label>
            <button
              className="liquid-orb flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-slate-950 sm:h-16 sm:w-16"
              type="button"
            >
              我
            </button>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weekdays.map((day) => (
            <button
              className={`flex h-14 items-center justify-center rounded-[22px] text-xl font-semibold transition active:scale-[0.98] sm:h-16 sm:rounded-[28px] sm:text-2xl ${
                activeWeekday === day.value
                  ? "bg-slate-950 text-white shadow-2xl shadow-slate-950/20"
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

        <section className="relative min-h-0 flex-1">
          <ScheduleTable
            activeWeekday={activeWeekday}
            courses={visibleCourses}
            days={[...weekdays]}
            onOpenCourse={openEditEditor}
            onVisibilityChange={updateCourseVisibility}
          />

          <div
            className={
              embedded
                ? "pointer-events-none absolute bottom-4 right-4 z-30 flex flex-col items-end gap-3"
                : "pointer-events-none fixed bottom-[calc(var(--bottom-tab-height)+var(--safe-bottom)+1rem)] right-5 z-[60] flex flex-col items-end gap-3 sm:right-8"
            }
          >
            <button
              className="pointer-events-auto flex h-15 w-15 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/25 transition active:scale-95 sm:h-16 sm:w-16"
              onClick={openCreateEditor}
              type="button"
              aria-label="添加日程"
            >
              <Plus size={26} />
            </button>
          </div>
        </section>
      </section>

      {editorState && (
        <ScheduleEditor
          editorState={editorState}
          onClose={() => setEditorState(null)}
          onDelete={deleteCourse}
          onSave={saveEditor}
          onUpdate={updateEditor}
        />
      )}
    </main>
  );
}

function ScheduleTable({
  activeWeekday,
  courses,
  days,
  onOpenCourse,
  onVisibilityChange,
}: {
  activeWeekday: number;
  courses: ScheduleCourse[];
  days: Array<(typeof weekdays)[number]>;
  onOpenCourse: (course: ScheduleCourse) => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const didInitialScroll = useRef(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const [scale, setScale] = useState(1);
  const [baseDayWidth, setBaseDayWidth] = useState(106);
  const dragState = useRef<{
    pointerId: number;
    startScrollLeft: number;
    startScrollTop: number;
    startY: number;
    startX: number;
  } | null>(null);
  const pinchState = useRef<{
    distance: number;
    scale: number;
  } | null>(null);

  const hourHeight = clamp(defaultHourHeight * scale, minHourHeight, maxHourHeight);
  const dayWidth = clamp(baseDayWidth * scale, minDayWidth, maxDayWidth);
  const isCompact = hourHeight <= compactThreshold || dayWidth <= 76;
  const viewportHeight = defaultHourHeight * 8;
  const contentHeight = hourHeight * 24;
  const gridTemplateColumns = `${timeColumnWidth}px repeat(${days.length}, ${dayWidth}px)`;

  useEffect(() => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    if (!didInitialScroll.current) {
      viewport.scrollTop = Math.max(0, hourHeight * 7.5);
      didInitialScroll.current = true;
    }
  }, [hourHeight]);

  useEffect(() => {
    const table = tableRef.current;

    if (!table) {
      return;
    }

    function updateBaseDayWidth() {
      const width = table?.clientWidth ?? 390;
      setBaseDayWidth(Math.max(minDayWidth, (width - timeColumnWidth) / 3));
    }

    updateBaseDayWidth();
    const observer = new ResizeObserver(updateBaseDayWidth);
    observer.observe(table);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollLeft = Math.max(0, (activeWeekday - 1) * dayWidth);
    if (headerRef.current) {
      headerRef.current.scrollLeft = viewport.scrollLeft;
    }
  }, [activeWeekday, dayWidth]);

  function setNextScale(value: number) {
    setScale(clamp(value, minHourHeight / defaultHourHeight, maxDayWidth / baseDayWidth));
  }

  function syncHeaderScroll() {
    if (headerRef.current && scrollRef.current) {
      headerRef.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();
    const multiplier = event.deltaY > 0 ? 0.92 : 1.08;
    setNextScale(scale * multiplier);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("button")) {
      return;
    }

    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);

    if (pointers.current.size === 2) {
      const [first, second] = Array.from(pointers.current.values());
      pinchState.current = {
        distance: getDistance(first, second),
        scale,
      };
      dragState.current = null;
      return;
    }

    dragState.current = {
      pointerId: event.pointerId,
      startScrollLeft: event.currentTarget.scrollLeft,
      startScrollTop: event.currentTarget.scrollTop,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();

    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }

    if (pointers.current.size >= 2 && pinchState.current) {
      const [first, second] = Array.from(pointers.current.values());
      const nextDistance = getDistance(first, second);
      const nextScale =
        pinchState.current.scale * (nextDistance / pinchState.current.distance);

      setNextScale(nextScale);
      return;
    }

    const drag = dragState.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.scrollLeft =
      drag.startScrollLeft - (event.clientX - drag.startX);
    event.currentTarget.scrollTop =
      drag.startScrollTop - (event.clientY - drag.startY);
    syncHeaderScroll();
  }

  function handleScroll() {
    syncHeaderScroll();
  }

  function stopGesture(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) {
      pinchState.current = null;
    }

    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
    }
  }

  return (
    <div className="paper-board overflow-hidden rounded-[30px] sm:rounded-[36px]" ref={tableRef}>
      <div
        className="overflow-hidden"
        ref={headerRef}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns,
            width: timeColumnWidth + days.length * dayWidth,
          }}
        >
        <div className="sticky left-0 z-20 border-r border-amber-950/8 bg-white/40 backdrop-blur-md">
          <div
            className="flex flex-col items-center justify-center gap-2 text-sm font-semibold text-amber-950/38"
            style={{ height: dayHeaderHeight }}
          >
            <span>24H</span>
            <span className="text-[11px] font-medium">双指缩放</span>
          </div>
        </div>
        {days.map((day) => (
          <div
            className="border-b border-r border-amber-950/8 bg-[#fff7d8]/62 px-3 py-4 backdrop-blur-md last:border-r-0 sm:px-5"
            key={day.value}
            style={{ height: dayHeaderHeight }}
          >
            <p className="text-sm font-semibold text-slate-950 sm:text-base">
              {day.label}
            </p>
            <p className="mt-2 text-2xl font-semibold leading-none text-slate-950 sm:text-3xl">
              {day.short}
            </p>
          </div>
        ))}
        </div>
      </div>

      <div
        className="schedule-scroll cursor-grab touch-none select-none overflow-auto overscroll-contain scroll-smooth bg-[#fff8dd]/68 active:cursor-grabbing"
        onPointerCancel={stopGesture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopGesture}
        onScroll={handleScroll}
        onWheel={handleWheel}
        ref={scrollRef}
        style={{
          height: `min(calc(100dvh - var(--bottom-tab-height) - var(--safe-bottom) - 15rem), ${viewportHeight}px)`,
          minHeight: "360px",
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns,
            height: contentHeight,
            width: timeColumnWidth + days.length * dayWidth,
          }}
        >
        <div
          className="sticky left-0 z-10 border-r border-amber-950/8 bg-white/32 backdrop-blur-md"
          style={{ height: contentHeight }}
        >
          {Array.from({ length: 25 }).map((_, hour) => (
            <div
              className="absolute left-0 right-0 border-t border-amber-950/5"
              key={hour}
              style={{ top: hour * hourHeight }}
            >
              <span className="absolute left-2 top-[-0.8rem] text-xs font-medium text-amber-950/42 sm:left-7 sm:text-base">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dayCourses = courses.filter(
            (course) => course.weekday === day.value,
          );

          return (
            <div
              className="relative liquid-underlay border-r border-amber-950/5 last:border-r-0"
              key={day.value}
              style={{ height: contentHeight }}
            >
              {Array.from({ length: 25 }).map((_, hour) => (
                <div
                  className="absolute left-0 right-0 border-t border-amber-950/5"
                  key={hour}
                  style={{ top: hour * hourHeight }}
                />
              ))}

              {dayCourses.length === 0 && (
                <div
                  className="absolute left-2 right-2 flex items-center justify-center rounded-[22px] border border-white/60 bg-white/18 text-xs font-semibold text-amber-950/34 backdrop-blur-md sm:left-4 sm:right-4"
                  style={{
                    height: Math.max(48, hourHeight * 0.72),
                    top: hourHeight * 1,
                  }}
                >
                  空
                </div>
              )}

              {dayCourses.map((course) => (
                <ScheduleBlock
                  course={course}
                  dayWidth={dayWidth}
                  hourHeight={hourHeight}
                  isCompact={isCompact}
                  key={course.id}
                  onClick={() => onOpenCourse(course)}
                  onVisibilityChange={onVisibilityChange}
                />
              ))}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(
  first: { x: number; y: number },
  second: { x: number; y: number },
) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function ScheduleBlock({
  course,
  dayWidth,
  hourHeight,
  isCompact,
  onClick,
  onVisibilityChange,
}: {
  course: ScheduleCourse;
  dayWidth: number;
  hourHeight: number;
  isCompact: boolean;
  onClick: () => void;
  onVisibilityChange: (id: string, visibility: CourseVisibility) => void;
}) {
  const startMinutes = timeToMinutes(course.startTime);
  const endMinutes = timeToMinutes(course.endTime);
  const top = (startMinutes / 60) * hourHeight;
  const rawHeight = Math.max(((endMinutes - startMinutes) / 60) * hourHeight, 24);
  const isPersonal = course.itemType === "personal";
  const showStatusIcons = rawHeight >= 82 && dayWidth >= 170;
  const showTimeAndPlace = rawHeight >= 62 && dayWidth >= 108;
  const showTypeIcon = rawHeight >= 58 && dayWidth >= 96;
  const TypeIcon = isPersonal ? Coffee : BookOpen;

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  if (isCompact) {
    return (
      <button
        className={`absolute left-1.5 right-1.5 rounded-[12px] border text-left shadow-lg backdrop-blur-xl transition active:scale-[0.99] sm:left-3 sm:right-3 ${
          isPersonal
            ? "border-sky-200/70 bg-sky-200/44"
            : "border-emerald-200/70 bg-emerald-200/44"
        }`}
        onClick={onClick}
        style={{
          height: Math.max(rawHeight, 18),
          top,
        }}
        type="button"
        aria-label={`${course.courseName} 已占用`}
      >
        <span className="absolute left-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-slate-950/55 sm:left-3" />
      </button>
    );
  }

  return (
    <article
      className={`liquid-distort-glass absolute left-1.5 right-1.5 overflow-hidden rounded-[18px] px-3 py-2 text-left transition active:scale-[0.99] sm:left-3 sm:right-3 sm:rounded-[24px] sm:px-4 sm:py-3 ${
        isPersonal ? "text-[#0f55c8]" : "text-[#14532d]"
      }`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      style={{
        height: Math.max(rawHeight, 58),
        top,
      }}
      tabIndex={0}
    >
      <div className="glass-lens" />
      <span
        className={`absolute bottom-5 left-3 top-5 z-10 w-1 rounded-full ${
          isPersonal ? "bg-sky-400/80" : "bg-emerald-400/80"
        }`}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-1.5 pl-5">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs ${
                isPersonal
                  ? "bg-sky-100/58 text-sky-800"
                  : "bg-emerald-50/58 text-emerald-800"
              }`}
            >
              {showTypeIcon && <TypeIcon size={13} className="shrink-0" />}
              {isPersonal ? "安排" : "课程"}
            </span>
            {showStatusIcons && (
              <VisibilityRail
                courseId={course.id}
                onChange={onVisibilityChange}
                value={course.visibility}
              />
            )}
          </div>
          <h3 className="mt-2 truncate text-lg font-semibold leading-tight sm:text-xl">
            {course.courseName}
          </h3>
          {showTimeAndPlace && (
            <p className="mt-1 truncate text-sm font-semibold text-slate-600/90 sm:text-base">
              {course.startTime} - {course.endTime}
            </p>
          )}
        </div>
        {showTimeAndPlace && (
          <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-slate-600/85 sm:text-sm">
            <MapPin size={15} className="shrink-0" />
            <span className="truncate">{course.location || "未填写地点"}</span>
          </div>
        )}
      </div>
    </article>
  );
}

function VisibilityRail({
  courseId,
  onChange,
  value,
}: {
  courseId: string;
  onChange: (id: string, visibility: CourseVisibility) => void;
  value: CourseVisibility;
}) {
  const options: Array<{
    icon: ReactNode;
    label: string;
    value: CourseVisibility;
  }> = [
    { icon: <Eye size={14} />, label: "显示给他人", value: "public" },
    { icon: <Clock3 size={14} />, label: "不显示详细事项", value: "busy" },
    { icon: <EyeOff size={14} />, label: "隐藏", value: "private" },
  ];

  return (
    <div
      className="liquid-soft inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 text-slate-600"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      role="group"
      aria-label="对他人可见状态"
    >
      {options.map((option) => (
        <button
          aria-label={option.label}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
            value === option.value
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
              : "bg-white/34 text-slate-600 hover:bg-white/58"
          }`}
          key={option.value}
          onClick={(event) => {
            event.stopPropagation();
            onChange(courseId, option.value);
          }}
          type="button"
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}

function ScheduleEditor({
  editorState,
  onClose,
  onDelete,
  onSave,
  onUpdate,
}: {
  editorState: {
    course: ScheduleCourseInput;
    id?: string;
    mode: EditorMode;
  };
  onClose: () => void;
  onDelete: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: <K extends keyof ScheduleCourseInput>(
    key: K,
    value: ScheduleCourseInput[K],
  ) => void;
}) {
  const course = editorState.course;

  return (
    <div className="fixed inset-0 z-[70] flex items-end bg-slate-950/20 px-3 pb-[calc(var(--safe-bottom)+0.75rem)] backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <form
        className="liquid-glass max-h-[86dvh] w-full max-w-xl overflow-auto rounded-[30px] p-4 shadow-2xl sm:rounded-[34px] sm:p-5"
        onSubmit={onSave}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
              <CalendarDays size={17} />
              {editorState.mode === "create" ? "添加日程" : "编辑日程"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              {course.courseName || "新的时间段"}
            </h2>
          </div>
          <button
            className="liquid-soft flex h-10 w-10 items-center justify-center rounded-full text-slate-700"
            onClick={onClose}
            type="button"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <Field label="类型">
            <div className="grid grid-cols-2 gap-2">
              <EditorSegment
                active={course.itemType === "course"}
                label="课程"
                onClick={() => onUpdate("itemType", "course")}
              />
              <EditorSegment
                active={course.itemType === "personal"}
                label="安排"
                onClick={() => onUpdate("itemType", "personal")}
              />
            </div>
          </Field>

          <Field label={course.itemType === "course" ? "课程名" : "安排名称"}>
            <input
              className="field-input"
              onChange={(event) => onUpdate("courseName", event.target.value)}
              placeholder="例如：计量经济学 / 自习 / 社团例会"
              value={course.courseName}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="星期">
              <select
                className="field-input"
                onChange={(event) =>
                  onUpdate("weekday", Number(event.target.value))
                }
                value={course.weekday}
              >
                {weekdays.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="地点">
              <input
                className="field-input"
                onChange={(event) => onUpdate("location", event.target.value)}
                placeholder="教学楼 / 图书馆 / 操场"
                value={course.location}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="开始">
              <input
                className="field-input"
                onChange={(event) => onUpdate("startTime", event.target.value)}
                type="time"
                value={course.startTime}
              />
            </Field>
            <Field label="结束">
              <input
                className="field-input"
                onChange={(event) => onUpdate("endTime", event.target.value)}
                type="time"
                value={course.endTime}
              />
            </Field>
          </div>

          <Field label={course.itemType === "course" ? "老师" : "对象/备注"}>
            <input
              className="field-input"
              onChange={(event) => onUpdate("teacher", event.target.value)}
              placeholder="老师 / 同学 / 自己"
              value={course.teacher}
            />
          </Field>

          <Field label="对他人可见状态">
            <div className="grid gap-2 sm:grid-cols-3">
              {visibilityOptions.map((option) => (
                <button
                  className={`rounded-2xl px-3 py-3 text-left transition ${
                    course.visibility === option.value
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                      : "liquid-soft text-slate-600"
                  }`}
                  key={option.value}
                  onClick={() => onUpdate("visibility", option.value)}
                  type="button"
                >
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 opacity-75">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="补充备注">
            <textarea
              className="field-input min-h-24 py-3"
              onChange={(event) => onUpdate("note", event.target.value)}
              placeholder="例如：带电脑、提前 10 分钟到、这段时间不要排别的事"
              value={course.note}
            />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {editorState.mode === "edit" ? (
            <button
              className="liquid-soft flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-rose-700"
              onClick={onDelete}
              type="button"
            >
              <Trash2 size={16} />
              删除
            </button>
          ) : (
            <span />
          )}
          <button
            className="flex h-12 min-w-28 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-xl shadow-slate-950/18"
            type="submit"
          >
            <Clock3 size={16} />
            保存
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-600">
      {label}
      {children}
    </label>
  );
}

function EditorSegment({
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

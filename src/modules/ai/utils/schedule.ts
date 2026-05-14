import type { ScheduleCourse } from "@/types/schedule";
import type { ScheduleAction } from "../types";

const SCHEDULE_KEY = "campus-ai-schedule-v2";

export function addScheduleItem(action: ScheduleAction): ScheduleCourse {
  const newItem: ScheduleCourse = {
    id: crypto.randomUUID(),
    itemType: action.itemType,
    courseName: action.courseName,
    teacher: "",
    weekday: action.weekday,
    startTime: action.startTime,
    endTime: action.endTime,
    location: action.location,
    startWeek: 1,
    endWeek: 16,
    weekType: "all",
    visibility: "private",
    showOnProfile: false,
    participateInMatching: false,
    status: "must_go",
    reminderMinutes: 10,
    isHidden: false,
    note: action.note || "",
  };

  try {
    const raw = window.localStorage.getItem(SCHEDULE_KEY);
    const courses: ScheduleCourse[] = raw ? JSON.parse(raw) : [];
    const updated = [...courses, newItem];
    window.localStorage.setItem(SCHEDULE_KEY, JSON.stringify(updated));
  } catch {
    console.error("Failed to write schedule to localStorage");
  }

  return newItem;
}

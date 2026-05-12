import type { ScheduleCourse } from "@/types/schedule";

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatReminder(minutes: number | null) {
  if (!minutes) {
    return "不提醒";
  }

  if (minutes === 60) {
    return "提前 1 小时";
  }

  return `提前 ${minutes} 分钟`;
}

export function sortCourses(courses: ScheduleCourse[]) {
  return [...courses].sort((a, b) => {
    if (a.weekday !== b.weekday) {
      return a.weekday - b.weekday;
    }

    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });
}

export function getCourseGridPosition(course: ScheduleCourse) {
  const dayStart = 0;
  const gridEnd = 24 * 60;
  const start = Math.max(timeToMinutes(course.startTime), dayStart);
  const end = Math.min(timeToMinutes(course.endTime), gridEnd);
  const top = ((start - dayStart) / (gridEnd - dayStart)) * 100;
  const height = Math.max(((end - start) / (gridEnd - dayStart)) * 100, 8);

  return {
    top: `${top}%`,
    height: `${height}%`,
  };
}

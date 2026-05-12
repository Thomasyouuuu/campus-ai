import type { CourseStatus, WeekType } from "@/types/schedule";

export const weekdays = [
  { value: 1, label: "周一", short: "一" },
  { value: 2, label: "周二", short: "二" },
  { value: 3, label: "周三", short: "三" },
  { value: 4, label: "周四", short: "四" },
  { value: 5, label: "周五", short: "五" },
  { value: 6, label: "周六", short: "六" },
  { value: 7, label: "周日", short: "日" },
] as const;

export const weekTypeLabels: Record<WeekType, string> = {
  all: "每周",
  odd: "单周",
  even: "双周",
};

export const courseStatusLabels: Record<CourseStatus, string> = {
  must_go: "必去",
  sometimes: "偶尔去",
  rarely: "不常去",
  exam_only: "只考前去",
  looking_classmate: "想找人一起上",
  looking_study_partner: "想找复习搭子",
};

export const courseStatusOptions = Object.entries(courseStatusLabels).map(
  ([value, label]) => ({
    value: value as CourseStatus,
    label,
  }),
);

export const weekTypeOptions = Object.entries(weekTypeLabels).map(
  ([value, label]) => ({
    value: value as WeekType,
    label,
  }),
);

export const reminderOptions = [
  { value: "", label: "不提醒" },
  { value: "10", label: "提前 10 分钟" },
  { value: "30", label: "提前 30 分钟" },
  { value: "60", label: "提前 1 小时" },
];

export const timeSlots = [
  { start: "00:00", label: "00:00" },
  { start: "03:00", label: "03:00" },
  { start: "06:00", label: "06:00" },
  { start: "09:00", label: "09:00" },
  { start: "12:00", label: "12:00" },
  { start: "15:00", label: "15:00" },
  { start: "18:00", label: "18:00" },
  { start: "21:00", label: "21:00" },
  { start: "24:00", label: "24:00" },
];

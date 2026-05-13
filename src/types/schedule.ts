export type WeekType = "all" | "odd" | "even";

export type CourseVisibility = "public" | "busy" | "private";

export type ScheduleItemType = "course" | "personal";

export type CourseStatus =
  | "must_go"
  | "sometimes"
  | "rarely"
  | "exam_only"
  | "looking_classmate"
  | "looking_study_partner";

export type ScheduleCourse = {
  id: string;
  itemType: ScheduleItemType;
  courseName: string;
  teacher: string;
  weekday: number;
  startTime: string;
  endTime: string;
  location: string;
  startWeek: number;
  endWeek: number;
  weekType: WeekType;
  visibility: CourseVisibility;
  showOnProfile: boolean;
  participateInMatching: boolean;
  status: CourseStatus;
  reminderMinutes: number | null;
  isHidden: boolean;
  note: string;
};

export type ScheduleCourseInput = Omit<ScheduleCourse, "id">;

export type EntityId = string;
export type ISODateTimeString = string;

export type BaseEntity = {
  id: EntityId;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type User = BaseEntity & {
  username: string;
  nickname: string;
  phone: string | null;
  email: string | null;
  passwordHash: string;
  avatarUrl: string | null;
  school: string;
  major: string;
  grade: string;
};

export type Course = BaseEntity & {
  courseName: string;
  courseCode: string;
  teacher: string;
  college: string;
  credits: number;
  semester: string;
  description: string;
  coverUrl: string | null;
};

export type UserCourseStudyStatus =
  | "planned"
  | "learning"
  | "reviewing"
  | "completed"
  | "archived";

export type UserCourse = BaseEntity & {
  userId: EntityId;
  courseId: EntityId;
  studyStatus: UserCourseStudyStatus;
  progress: number;
  note: string;
  isPinned: boolean;
};

export type ScheduleType =
  | "course"
  | "study"
  | "deadline"
  | "club"
  | "personal"
  | "exam"
  | "other";

export type Schedule = BaseEntity & {
  userId: EntityId;
  title: string;
  description: string;
  startTime: ISODateTimeString;
  endTime: ISODateTimeString;
  location: string;
  type: ScheduleType;
  courseId: EntityId | null;
  tagIds: EntityId[];
  color: string;
  reminderTime: ISODateTimeString | null;
  isCompleted: boolean;
};

export type Tag = BaseEntity & {
  userId: EntityId;
  name: string;
  color: string;
  icon: string;
};

export type AIStudyGuideStepType =
  | "context"
  | "hint"
  | "step_by_step"
  | "check_answer"
  | "explain_concept"
  | "practice"
  | "summary"
  | "reflection";

export type AIStudySessionStatus = "active" | "paused" | "completed" | "archived";

export type AIStudySession = BaseEntity & {
  userId: EntityId;
  courseId: EntityId | null;
  topic: string;
  title: string;
  status: AIStudySessionStatus;
  currentStepType: AIStudyGuideStepType;
  summary: string | null;
};

export type AIStudyMessageRole = "user" | "assistant" | "system";

export type AIStudyMessage = BaseEntity & {
  sessionId: EntityId;
  role: AIStudyMessageRole;
  content: string;
  guideStepType: AIStudyGuideStepType;
};

export type Club = BaseEntity & {
  name: string;
  description: string;
  category: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  school: string;
  contactEmail: string | null;
};

export type UserClubRole = "member" | "admin" | "owner";
export type UserClubStatus = "pending" | "active" | "left" | "blocked";

export type UserClub = BaseEntity & {
  userId: EntityId;
  clubId: EntityId;
  role: UserClubRole;
  status: UserClubStatus;
  joinedAt: ISODateTimeString | null;
};

export type ThemePreference = "system" | "light" | "dark";
export type LanguagePreference = "zh-CN" | "en-US";
export type NotificationPreference = {
  scheduleReminder: boolean;
  deadlineReminder: boolean;
  courseUpdates: boolean;
  clubUpdates: boolean;
  aiStudyNudges: boolean;
};

export type AIGuideMode =
  | "socratic"
  | "step_by_step"
  | "hint_first"
  | "concise"
  | "exam_review";

export type UserSettings = BaseEntity & {
  userId: EntityId;
  theme: ThemePreference;
  liquidGlassIntensity: number;
  notifications: NotificationPreference;
  language: LanguagePreference;
  aiGuideMode: AIGuideMode;
};

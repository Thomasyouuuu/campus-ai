export type CourseSection = "search" | "add" | "my";
export type CourseTabKey =
  | "overview"
  | "chat"
  | "notes"
  | "skills"
  | "ddl"
  | "members"
  | "teams";

export type SkillsAIMode =
  | "hint"
  | "step"
  | "check"
  | "answer"
  | "practice";

export type CourseSummary = {
  id: string;
  courseName: string;
  teacher: string;
  nextSession: string;
  location: string;
  studentCount: number;
  unreadDDLCount: number;
  newNotesCount: number;
  status: string;
  tags: string[];
  description: string;
  membership: "joined" | "recommended";
};

export type CourseNote = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  updatedAt: string;
};

export type CourseDDLItem = {
  id: string;
  type: string;
  title: string;
  dueDate: string;
  status: "open" | "due-soon" | "done";
};

export type CourseMember = {
  id: string;
  name: string;
  role: string;
  status: string;
};

export type CourseTeam = {
  id: string;
  title: string;
  focus: string;
  members: number;
  progress: string;
};

export type SkillsAIMessage = {
  id: string;
  sender: "student" | "tutor";
  text: string;
  time: string;
};

export type CourseDetail = CourseSummary & {
  summary: string;
  recentTopics: string[];
  masteredPoints: string[];
  reviewPoints: string[];
  upcomingDDL: CourseDDLItem[];
  notes: CourseNote[];
  members: CourseMember[];
  teams: CourseTeam[];
  skillsMessages: SkillsAIMessage[];
  relatedNotes: CourseNote[];
  mistakeCards: Array<{
    id: string;
    title: string;
    reason: string;
    nextReview: string;
  }>;
};

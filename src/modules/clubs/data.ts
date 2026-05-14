import type { ClubActivity, ClubOpportunity, ClubSignal } from "./types";

export const activityHighlights: ClubActivity[] = [
  {
    club: "摄影社",
    date: "周六 14:00",
    location: "南门集合",
    mood: "轻社交",
    seats: "剩 12 位",
    title: "Citywalk 光影练习",
  },
  {
    club: "AI 创作社",
    date: "周三 19:30",
    location: "图书馆 B201",
    mood: "技能共创",
    seats: "开放报名",
    title: "Prompt Jam 小组挑战",
  },
  {
    club: "飞盘社",
    date: "周五 17:20",
    location: "东操场",
    mood: "新手友好",
    seats: "剩 8 位",
    title: "期中后轻量训练",
  },
];

export const opportunities: ClubOpportunity[] = [
  {
    body: "辩论社、AI 创作社、滑板社正在开放新成员申请，适合先收藏再比较。",
    label: "招新信息",
    metric: "6 个社团",
  },
  {
    body: "把活动主题拆成流程、物料、报名表和风险提醒，便于负责人快速开局。",
    label: "活动策划",
    metric: "AI 预留",
  },
  {
    body: "用兴趣、时间段和参与偏好生成轻量标签，后续可做同频推荐。",
    label: "成员展示",
    metric: "同频入口",
  },
];

export const clubSignals: ClubSignal[] = [
  { label: "本周活动", value: "9" },
  { label: "开放招新", value: "6" },
  { label: "新手友好", value: "4" },
];

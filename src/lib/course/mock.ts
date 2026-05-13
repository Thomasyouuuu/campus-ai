import type {
  CourseDetail,
  CourseSummary,
  SkillsAIMode,
} from "@/types/course";

export const mockCourseList: CourseSummary[] = [
  {
    id: "course-1",
    courseName: "计量经济学",
    teacher: "陈老师",
    nextSession: "周二 10:00",
    location: "经管楼 B302",
    studentCount: 24,
    unreadDDLCount: 2,
    newNotesCount: 5,
    status: "已加入",
    tags: ["微观经济", "模型", "考试复习"],
    description: "重点围绕成本、收益与市场均衡展开，适合想要深度理解经济直觉的同学。",
    membership: "joined",
  },
  {
    id: "course-2",
    courseName: "传播学专题",
    teacher: "李老师",
    nextSession: "周四 14:00",
    location: "三教 205",
    studentCount: 18,
    unreadDDLCount: 1,
    newNotesCount: 3,
    status: "已加入",
    tags: ["传播理论", "案例分析", "小组报告"],
    description: "围绕传播策略与媒体分析，强调课堂讨论和小组协作。",
    membership: "joined",
  },
  {
    id: "course-3",
    courseName: "国际贸易理论",
    teacher: "王老师",
    nextSession: "周五 16:00",
    location: "文科楼 410",
    studentCount: 32,
    unreadDDLCount: 4,
    newNotesCount: 2,
    status: "推荐加入",
    tags: ["国际贸易", "模型", "S-S 定理"],
    description: "分析国际贸易的经典模型与政策影响，适合期末复习与论文准备。",
    membership: "recommended",
  },
];

export const mockCourseDetails: Record<string, CourseDetail> = {
  "course-1": {
    ...mockCourseList[0],
    summary: "这门课关注边际成本、边际收益与市场均衡，适合构建微观经济学学习路径。",
    recentTopics: [
      "边际成本与边际收益的直觉",
      "完全竞争市场的均衡条件",
      "成本曲线的几何意义",
    ],
    masteredPoints: ["边际收益的定义", "供给与需求的动态变化"],
    reviewPoints: ["成本函数的推导", "价格与产量的边际变化"],
    upcomingDDL: [
      {
        id: "ddl-1",
        type: "作业",
        title: "第 4 周练习题",
        dueDate: "周三 23:59",
        status: "due-soon",
      },
      {
        id: "ddl-2",
        type: "期中复习",
        title: "经济学模型整理",
        dueDate: "5 月 20 日",
        status: "open",
      },
    ],
    notes: [
      {
        id: "note-1",
        title: "边际成本笔记",
        summary: "公式推导与常见误区，适合考试前回看。",
        tag: "公式",
        updatedAt: "今天",
      },
      {
        id: "note-2",
        title: "市场均衡核心框架",
        summary: "老师重点强调的三个判断步骤。",
        tag: "概念",
        updatedAt: "昨天",
      },
    ],
    members: [
      { id: "member-1", name: "小李", role: "组员", status: "正在找复习搭子" },
      { id: "member-2", name: "阿佳", role: "学习伙伴", status: "共享笔记" },
      { id: "member-3", name: "小高", role: "助教", status: "课程讨论活跃" },
    ],
    teams: [
      { id: "team-1", title: "期中复习小组", focus: "问题拆解与习题训练", members: 4, progress: "正在讨论" },
      { id: "team-2", title: "模型总结组", focus: "微观模型整理", members: 3, progress: "准备中" },
    ],
    skillsMessages: [
      { id: "msg-1", sender: "student", text: "我这道边际成本题不会做。", time: "09:12" },
      { id: "msg-2", sender: "tutor", text: "先判断这题考的是边际成本还是边际收益，你觉得呢？", time: "09:13" },
    ],
    relatedNotes: [
      { id: "note-3", title: "边际成本公式归纳", summary: "从图形和公式两个角度解释。", tag: "复习", updatedAt: "今天" },
      { id: "note-4", title: "市场均衡速记卡", summary: "常见题型与答题框架。", tag: "考试", updatedAt: "2 天前" },
    ],
    mistakeCards: [
      { id: "mistake-1", title: "边际成本判断错误", reason: "没区分固定成本和变动成本", nextReview: "5 月 19 日" },
      { id: "mistake-2", title: "均衡价格写法不严谨", reason: "没有说明假设条件", nextReview: "5 月 21 日" },
    ],
  },
  "course-2": {
    ...mockCourseList[1],
    summary: "这门课重视传播策略、媒介选择与小组案例分析，适合锻炼表达与讨论能力。",
    recentTopics: ["传播模型对比", "媒介效果评估", "案例分析结构"],
    masteredPoints: ["传播链条模型", "受众细分"],
    reviewPoints: ["议题设置", "实证案例分析"],
    upcomingDDL: [
      { id: "ddl-3", type: "小组报告", title: "第 5 周案例汇报", dueDate: "周五 18:00", status: "open" },
    ],
    notes: [
      { id: "note-5", title: "传播学模型对比", summary: "线性模型与双重循环模型区别。", tag: "理论", updatedAt: "今天" },
    ],
    members: [
      { id: "member-4", name: "小华", role: "组长", status: "寻找组队" },
      { id: "member-5", name: "小东", role: "讨论伙伴", status: "已共享笔记" },
    ],
    teams: [
      { id: "team-3", title: "案例整理组", focus: "传播案例库", members: 5, progress: "已开始" },
    ],
    skillsMessages: [
      { id: "msg-3", sender: "student", text: "这个传播模型怎么写成答题结构？", time: "14:25" },
      { id: "msg-4", sender: "tutor", text: "先把模型的关键变量整理出来，然后再分成题干、分析、结论三部分。", time: "14:26" },
    ],
    relatedNotes: [
      { id: "note-6", title: "媒体效果三段论", summary: "考前快速回顾。", tag: "记忆", updatedAt: "今天" },
    ],
    mistakeCards: [
      { id: "mistake-3", title: "案例分析缺少论据", reason: "没引用课堂讨论点", nextReview: "5 月 22 日" },
    ],
  },
  "course-3": {
    ...mockCourseList[2],
    summary: "国际贸易理论侧重经典模型和政策直觉，是复习国际贸易考试的重要资源。",
    recentTopics: ["李嘉图模型", "要素价格报酬递减", "S-S 定理"],
    masteredPoints: ["比较优势", "贸易均衡条件"],
    reviewPoints: ["要素价格变化路径", "两部门模型假设"],
    upcomingDDL: [
      { id: "ddl-4", type: "论文", title: "国际贸易政策分析", dueDate: "5 月 28 日", status: "open" },
    ],
    notes: [
      { id: "note-7", title: "S-S 定理直觉", summary: "从两部门两要素的角度讲解。", tag: "理解", updatedAt: "昨天" },
    ],
    members: [
      { id: "member-6", name: "小周", role: "复习搭子", status: "想找小组" },
      { id: "member-7", name: "小雅", role: "资料共享", status: "共享过笔记" },
    ],
    teams: [
      { id: "team-4", title: "论文互助组", focus: "贸易政策写作", members: 3, progress: "待分工" },
    ],
    skillsMessages: [
      { id: "msg-5", sender: "student", text: "S-S 定理和要素价格有什么关系？", time: "11:00" },
      { id: "msg-6", sender: "tutor", text: "我们先从直觉出发：要素价格变化是因为哪两个部门的收益不同？", time: "11:01" },
    ],
    relatedNotes: [
      { id: "note-8", title: "S-S 定理图解", summary: "老师上课的例题图。", tag: "图示", updatedAt: "3 天前" },
    ],
    mistakeCards: [
      { id: "mistake-4", title: "要素价格变化混淆", reason: "忘记区分出口与进口部门", nextReview: "5 月 25 日" },
    ],
  },
};

export const skillsAIModeLabels: Record<SkillsAIMode, string> = {
  hint: "只给提示",
  step: "分步引导",
  check: "检查我的答案",
  answer: "完整解析",
  practice: "生成练习题",
};

export const skillAIMockResponses: Record<SkillsAIMode, string> = {
  hint: "这道题的关键在于先判断它考的是边际成本还是边际收益。你先说一下题目里提到了哪些变量？",
  step: "第一步，我们先画出成本和收益的变化趋势。你能告诉我这两条曲线的基本形状吗？",
  check: "请把你的第一步写出来，我来帮你检查是否已经抓住关键点。",
  answer: "完整解析：首先……（这里给出结构化的学习路径，而不是直接输出答案）。",
  practice: "我为你生成了一套练习题，包含选择题、简答题和计算题。请先完成第一道题。",
};

export const mockSearchResults = mockCourseList;

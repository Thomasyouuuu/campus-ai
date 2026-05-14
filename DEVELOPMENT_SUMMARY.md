# Campus AI Mobile Browser Adaptation Summary

## 本次完成了什么

- 确认当前开发分支为 `mobile-browser-version`，未切换或修改 `main`。
- 阅读并遵循 `AGENTS.md`；按要求查看了 Next.js 16.2.6 的本地文档，确认项目使用 App Router，目标浏览器为现代浏览器与 Safari 16.4+。
- 完成项目体检：阅读了 `package.json`、`src/app`、`src/components`、`src/lib`、`src/types`。
- 为手机浏览器加入全局移动端基础能力：
  - `viewport-fit=cover`
  - `html/body` 高度与横向溢出控制
  - safe-area 底部变量
  - 可复用页面横向 padding 与底部导航避让 padding
- 将全局底部导航改造为移动端固定 Tab Bar：
  - 保留五个主路由：`/`、`/schedule`、`/ai`、`/courses`、`/clubs`
  - mobile-first fixed bottom
  - 支持 `safe-area-inset-bottom`
  - 保留 liquid glass 视觉与明确 active 状态
- 逐页完成移动端适配：
  - `/`：降低手机首屏标题、tab、卡片和课表预览拥挤度。
  - `/schedule`：表单字段在手机端纵向排列，课表区域保留移动三日/单日体验，底部内容不被 Tab Bar 遮挡。
  - `/ai`：降低移动端 hero 与功能卡片高度，保证卡片纵向排列和触控尺寸。
  - `/courses`：课程首页、搜索卡片、课程详情头部、统计卡、横向 tab、聊天输入、DDL、成员和组队卡片适配窄屏。
  - `/clubs`：社团首页 hero、活动卡和侧栏在移动端更紧凑。
- 日程板块追加修正：
  - 新增 `src/modules/schedule/index.ts`，让 `/schedule` 路由通过业务模块入口导入日程工作台。
  - 修复桌面与移动时间轴课程卡片缺少绝对定位的问题，课程块现在会按开始/结束时间正确落位。
  - 手机端时间轴改为单日聚焦滑动视图，避免 390px 宽度下课程卡片被三列布局压窄。
  - 手机端课程块使用紧凑可见性控件，减少按钮挤压和横向溢出风险。
  - 日程详情页加入底部导航避让，避免内容被 fixed Tab Bar 遮挡。
  - 补回 `/` 与 `/ai` 的薄路由入口，并通过 `src/modules/home`、`src/modules/ai` 导出，保证五个主路由仍可访问。
- 日程板块三日表重构：
  - `/schedule` 进入后只展示日程表，不再展示工作台 header、右侧添加表单或日程清单。
  - 日程表调整为三天一屏：时间列 + 连续三天列，顶部星期按钮用于切换三日窗口。
  - 纵向视口按 6 小时体验设计，日程内容保留 24 小时并支持拖拽/滚动查看。
  - 加入缩放控件；缩到临界值以下时，日程卡片切换为占用方块，避免文字不可读。
  - 右下角固定加号用于添加日程；点击已有日程打开底部编辑面板，可修改时间、地点、备注或删除。
- 日程板块手势缩放修正：
  - 移除加减按钮/滑杆缩放，改为日程表区域内双指捏合缩放。
  - 缩放会同时改变小时高度和日期列宽：默认约为三天、六小时；缩小显示更多天和更多小时，放大显示更少天和更少小时。
  - 保留三天作为默认最佳比例，但日程表实际承载 7 天横向画布，可横向拖动或通过顶部星期按钮定位。
  - 支持触控板/桌面浏览器的 `ctrl/meta + wheel` 缩放兜底。
- 日程隐私状态恢复：
  - 在添加/编辑日程面板中恢复「显示给他人 / 不显示详细事项 / 隐藏」三档可见性设置。
  - 保留原有 `visibility: public | busy | private` 数据结构，不改变已有 localStorage 日程数据。
- 日程卡片图标层级恢复：
  - 正常尺寸日程卡片恢复课程/安排类型图标、时间图标和地点图标。
  - 中等缩放时保留关键文字和主图标；空间不足时自动隐藏次要图标/地点信息。
  - 缩小到无法保证图标美观时进入纯占用块状态，不再强行显示图标。
- 日程卡片视觉对齐参考稿：
  - 卡片改为左侧竖向状态色条、顶部类型胶囊、右上角状态图标组、标题、时间、地点的层级。
  - 正常尺寸显示可见性/时间/隐藏详细事项图标组；中等缩放隐藏图标组；更小进入占用块。
  - 移除此前偏水印式的大图标，避免和参考稿方向不一致。
- 日程表溢出与 FAB 修复：
  - 状态图标组显示阈值调高，并让类型胶囊不换行，避免三天视图下卡片内容互相挤压。
  - 日程表内部滚动条改为视觉隐藏，保留横向/纵向拖动能力。
  - 添加日程 FAB 改为固定在底部 Tab Bar 上方，避免被底部导航遮挡或误认为社团入口。
- 社团板块追加精修：
  - 将 `/clubs` 路由改为薄入口，新增 `src/modules/clubs` 承载页面组件、mock 数据与类型。
  - 补足社团工作台内容密度：本周活动、开放招新、新手友好指标、AI 社团助手和负责人入口。
  - 优化手机浏览器体验：首屏指标三栏、活动信息纵向卡片、44px 以上触控入口、移动端单列排列。
  - 补齐已有模块化迁移缺失的 `/` 与 `/ai` 薄路由入口，确保五个主路由都可由 App Router 访问。
- 全局骨架与模块边界整理：
  - 新增 `src/components/layout/AppShell.tsx`，统一承载 liquid page、页面容器、底部 Tab Bar 和 safe-area 底部避让。
  - 新增 `src/components/ui/GlassPanel.tsx`，为后续抽取高频 liquid glass / paper / soft UI 表面提供统一入口。
  - 将首页业务从 `src/app/page.tsx` 迁移到 `src/modules/home/HomePage.tsx`。
  - 将 AI 业务从 `src/app/ai/page.tsx` 迁移到 `src/modules/ai/AIPage.tsx`。
  - 将日程工作台迁移到 `src/modules/schedule/ScheduleWorkspace.tsx`，并新增 `src/modules/schedule/page.tsx` 作为模块页入口。
  - 保持 `src/app/*/page.tsx` 为薄路由层，只负责渲染对应模块页面。
- AI 模块 ChatPage 改造：
  - 新增 `src/app/api/chat/route.ts`：API 代理路由，将客户端请求转发到 OpenAI-compatible 后端，保护 API key 不暴露在浏览器。
  - 新增 `src/modules/ai/types.ts`：ChatMessage、ScheduleAction、APISettings 等聊天与日程类型定义。
  - 新增 `src/modules/ai/utils/systemPrompt.ts`：动态构建 AI 系统提示词，注入当天日期和日程识别规则。
  - 新增 `src/modules/ai/utils/parser.ts`：从 AI 回复中提取 `scheduleAction` JSON 并校验必填字段。
  - 新增 `src/modules/ai/utils/schedule.ts`：将 AI 解析出的日程写入 `localStorage`（key: `campus-ai-schedule-v2`），ScheduleWorkspace 挂载时自动读取。
  - 新增 `src/modules/ai/hooks/useChat.ts`：聊天状态机（消息管理、发送、历史持久化、日程确认/忽略）。
  - 新增 `src/modules/ai/hooks/useAPISettings.ts`：API 配置的 localStorage 读写（key: `campus-ai-api-settings`）。
  - 新增 `src/modules/ai/components/ChatBubble.tsx`：用户/AI 消息气泡，liquid-glass 风格，支持内嵌日程确认卡片。
  - 新增 `src/modules/ai/components/ScheduleConfirmCard.tsx`：paper-board 日程建议卡片，显示活动名称、日期、时间、地点，支持确认添加或忽略。
  - 新增 `src/modules/ai/components/ChatInput.tsx`：底部输入框，liquid-soft 圆角容器，支持 Enter 发送、自动高度增长、未配置 API 时显示设置齿轮。
  - 新增 `src/modules/ai/components/ChatSuggestions.tsx`：空态建议 chips（"帮我排自习"、"复习计划"等）。
  - 新增 `src/modules/ai/components/ChatMessages.tsx`：消息列表容器，包含空态建议、消息列表和加载动画。
  - 新增 `src/modules/ai/components/ChatHeader.tsx`：顶部栏，显示连接状态、清空对话和 API 设置入口。
  - 新增 `src/modules/ai/components/APISettingsDialog.tsx`：API 配置弹窗，支持 DeepSeek/OpenAI/豆包/智谱 快速预设、Base URL / API Key / Model 自定义，内置各平台获取 Key 链接。
  - 新增 `src/modules/ai/components/APIGuideCard.tsx`：API 配置引导页，用户首次进入 /ai 未配置 Key 时展示，列出四个服务商及直达 Key 获取链接（DeepSeek、豆包、OpenAI、智谱），点击跳转外部页面。
  - 新增 `src/modules/ai/ChatPage.tsx`：聊天主页面，组合 ChatHeader + ChatMessages + ChatInput + APISettingsDialog。
  - 修改 `src/app/ai/page.tsx`：路由从 AIPage 切换到 ChatPage。
  - 修改 `src/modules/ai/index.ts`：同时导出 ChatPage 和保留旧 AIPage。
  - 保留旧 `AIPage.tsx` 未删除，可在未来作为功能卡片备用或清理。
- 课程板块追加精修：
  - 新增 `src/modules/courses/index.ts`，让 `/courses` 通过课程模块统一入口渲染。
  - 将 `CoursesWorkspace` 迁移到 `src/modules/courses/components/CoursesWorkspace.tsx`，移除旧的 `src/components/course` 业务组件位置。
  - 手机端统计卡改为三栏紧凑展示，课程详情 tab 使用内部横向滚动并隐藏滚动条，避免页面级横向溢出。
  - 聊天输入、DDL 行、成员状态和组队卡片在手机端改为自然换行/纵向排列，保证 360px-430px 下可点击、不挤压。

## 修改了哪些文件

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/schedule/page.tsx`
- `src/app/ai/page.tsx`
- `src/app/courses/page.tsx`
- `src/app/clubs/page.tsx`
- `src/components/navigation/GlobalDock.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/index.ts`
- `src/components/ui/GlassPanel.tsx`
- `src/components/ui/index.ts`
- `src/modules/clubs/ClubsPage.tsx`
- `src/modules/clubs/data.ts`
- `src/modules/clubs/types.ts`
- `src/modules/clubs/index.ts`
- `src/modules/home/HomePage.tsx`
- `src/modules/home/index.ts`
- `src/modules/ai/AIPage.tsx`
- `src/modules/ai/index.ts`
- `src/modules/ai/ChatPage.tsx`
- `src/modules/ai/types.ts`
- `src/modules/ai/utils/systemPrompt.ts`
- `src/modules/ai/utils/parser.ts`
- `src/modules/ai/utils/schedule.ts`
- `src/modules/ai/hooks/useChat.ts`
- `src/modules/ai/hooks/useAPISettings.ts`
- `src/modules/ai/components/ChatBubble.tsx`
- `src/modules/ai/components/ScheduleConfirmCard.tsx`
- `src/modules/ai/components/ChatInput.tsx`
- `src/modules/ai/components/ChatSuggestions.tsx`
- `src/modules/ai/components/ChatMessages.tsx`
- `src/modules/ai/components/ChatHeader.tsx`
- `src/modules/ai/components/APISettingsDialog.tsx`
- `src/app/api/chat/route.ts`
- `src/modules/courses/page.tsx`
- `src/modules/courses/index.ts`
- `src/modules/courses/components/CoursesWorkspace.tsx`
- `src/modules/schedule/page.tsx`
- `src/modules/schedule/ScheduleWorkspace.tsx`
- `src/modules/schedule/index.ts`
- `DEVELOPMENT_SUMMARY.md`

## 当前结构总结

- `src/app`：App Router 页面入口，包含五个主路由页面与全局 layout/styles。
- `src/components/layout`：全局页面骨架，例如 `AppShell`。路由与模块页面优先复用这里的页面壳，避免每个业务板块重复维护底部导航、safe-area 和页面容器。
- `src/components/ui`：跨模块 UI 基础件，例如 `GlassPanel`。后续抽取按钮、表单、卡片时优先放这里。
- `src/components/navigation`：全局底部 dock 与个人主页预览按钮。
- `src/modules/schedule`：日程业务模块，包含课表视图、添加日程、导入、隐私可见性和日程详情。
- `src/modules/courses`：课程业务模块，包含课程搜索/添加/我的课程、课程详情、聊天室、笔记、AI 自学、DDL、成员和组队。
- `src/modules/clubs`：社团业务模块，包含社团首页组件、活动/招新 mock 数据和模块类型。
- `src/modules/home`：首页业务模块，`/` 路由只渲染该模块。
- `src/modules/ai`：AI 业务模块，`/ai` 路由只渲染该模块。
- `src/lib`：课程和日程 mock 数据、选项、时间工具函数。
- `src/types`：课程、日程与更完整的产品领域模型类型定义。

## 移动端适配策略

- 不重写项目，不引入新依赖，优先复用 Tailwind class 和已有 liquid glass / paper board 样式。
- 使用 mobile-first 收紧：手机端降低字号、内边距、卡片圆角和首屏高度，桌面端保留原有宽松视觉。
- 将多列布局限制在 `sm`、`lg`、`xl` 以上，手机端默认单列纵向排列。
- 用 `mobile-page-shell` 统一处理底部导航避让，避免内容被 fixed Tab Bar 遮挡。
- 用 `env(safe-area-inset-bottom)` 支持 iPhone 安全区域。
- 对底部导航单独设置移动端 icon 尺寸，避免原桌面 dock 在 390px 宽度下过高、过挤。
- 课程详情页的 tab 保留横向内部滚动，并隐藏滚动条，避免页面级横向溢出；聊天和任务类表单在手机端改为纵向控件。
- 后续开发遵循“一个模块一个模块精修”：先在 `src/modules/<module>` 内完成业务结构与页面体验，再把真正跨模块复用的布局/UI 提升到 `src/components/layout` 或 `src/components/ui`。
- 路由层约束：`src/app/**/page.tsx` 不承载业务状态、mock 数据或复杂 JSX，只导入并渲染模块页面。

## 自检结果

- `npm run lint`：通过。
- `npm run build`：通过。
- 日程板块追加修正后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，`/`、`/schedule`、`/ai`、`/courses`、`/clubs` 均正常生成。
- 日程板块三日表重构后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含五个主路由。
- 日程板块手势缩放修正后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含五个主路由。
- 日程隐私状态恢复后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含五个主路由。
- 日程卡片图标层级恢复后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含五个主路由。
- 日程卡片视觉对齐参考稿后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含五个主路由与 `/api/chat`。
- 日程表溢出与 FAB 修复后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含五个主路由与 `/api/chat`。
- 社团板块追加精修后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，`/`、`/ai`、`/clubs` 均正常生成。
- 全局骨架与模块边界整理后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，五个主路由均正常生成。
  - 使用已通过的生产构建启动 `next start --hostname 127.0.0.1 --port 3003` 时，`/`、`/ai`、`/schedule`、`/courses`、`/clubs` 均返回 200。
- 课程板块追加精修后再次运行：
  - `npm run lint`：通过。
  - `npm run build`：通过，构建输出包含 `/`、`/ai`、`/schedule`、`/courses`、`/clubs`。
- AI 模块 ChatPage 改造后再次运行：
  - `npm run lint`：通过（修复 3 个问题后：2 个 set-state-in-effect + 1 个 unused import）。
  - `npm run build`：通过，`/ai` 为静态页，`/api/chat` 为动态路由。
- 本地已有 Next dev server 在 `http://localhost:3000` 运行，但该进程请求超时；未中断它。
- 已启动新的 Next dev server 在 `http://localhost:3001`，并用 `curl` 验证五个主路由均返回 200：
  - `/`
  - `/schedule`
  - `/ai`
  - `/courses`
  - `/clubs`

## 如何本地运行

```bash
npm run dev
```

然后访问：

```text
http://localhost:3001
```

## TODO / 不确定决策记录

- 当前适配以 CSS/Tailwind 响应式布局为主，没有引入真实设备截图依赖；本会话中浏览器插件所需控制入口不可用，因此视觉 QA 采用构建检查与路由可达性检查兜底。
- 后续如果接入可用浏览器自动化，建议补充 360px、390px、414px、430px 视口截图验收。
- 日程时间轴仍保留横向内部滚动，这是课表类信息在手机浏览器中的合理交互；页面本身已避免横向滚动。
- `GlassPanel` 目前是基础 UI 边界占位，后续精修单个模块时再逐步替换重复的 `liquid-glass` / `liquid-soft` / `paper-board` JSX，避免一次性大重构。
- 当前本机 `3000` 上已有一个 dev server 进程但请求超时，`3001` Turbopack dev 启动遇到本地 `.next/dev` 缓存错误；代码层面以 `npm run build` 和 `next start` 验证通过。需要继续 dev 预览时，建议先停止旧的 3000 进程或清理本地 `.next/dev` 缓存后再运行 `npm run dev`。

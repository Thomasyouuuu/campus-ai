<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Product Design Iron Rule

The visual quality must feel genuinely premium. Every screen should be calm, refined, and deliberate: high-end spacing, typography, hierarchy, motion, color, translucency, and component details. Avoid cheap template aesthetics, flat generic cards, muddy glass effects, cluttered decoration, and anything that feels merely “acceptable.” For this product, design quality is a core feature, not polish after the fact.

# Campus AI Agent Instructions

你正在开发一个 Next.js 项目：campus-ai-app。

## 当前任务

基于现有代码，开发适合手机浏览器使用的移动端版本。

注意：这不是重写项目，也不是开发原生 App，而是在现有 Web 项目基础上进行 mobile browser adaptation。

## 当前分支

开发必须在：

`mobile-browser-version`

这个分支上进行。

不要切回 main，不要修改 main。

## 路由结构

必须保持以下路由：

- 主页：/
- 日程：/schedule
- AI：/ai
- 课程：/courses
- 社团：/clubs

## 设计风格

延续当前项目已有视觉体系。

关键词：

- liquid glass
- 半透明
- 柔和阴影
- 圆角
- 轻量动效
- 校园效率工具
- 清爽但不空
- 像一个认真做出来的校园 AI 产品

不要把项目改成完全不同的视觉风格。

## 移动端适配目标

主要适配手机浏览器。

优先保证：

- iPhone 390px 宽度体验良好
- 兼容 360px、414px、430px 宽度
- 页面不能横向滚动
- 底部 Tab Bar 固定在底部
- 支持 iPhone safe-area
- 页面内容不能被底部导航遮挡
- 卡片在移动端纵向排列
- 按钮和输入框要适合手指点击
- 字号层级清楚
- 首屏信息不要过度拥挤
- 桌面端不要明显崩坏

## 底部导航要求

移动端底部导航必须包含：

- 主页 /
- 日程 /schedule
- AI /ai
- 课程 /courses
- 社团 /clubs

要求：

- fixed bottom
- liquid glass 风格
- active 状态明显
- 图标和文字都要清楚
- 不遮挡页面内容
- 支持 safe-area-inset-bottom

## 开发原则

1. 先阅读项目结构，不要马上改代码。
2. 先理解 package.json、src/app、src/components、src/lib、src/types。
3. 优先复用已有组件和样式。
4. 不要大规模推翻现有代码。
5. 不要引入大量新依赖。
6. 不要引用不存在的 icon、组件或导出。
7. 如果遇到组件导出错误，先搜索项目内已有文件。
8. 不要删除已有功能。
9. 不要为了移动端适配破坏桌面端。
10. 每完成一个阶段，都要检查代码。

## 自检流程

每完成一个页面或关键组件后，必须运行：

```bash
npm run lint
npm run build
```
如果失败：

1. 阅读报错
2. 定位问题
3. 修复问题
4. 再次运行
5. 直到通过

不要把失败状态当成完成。

## 工作顺序

### 第一阶段：项目体检

- 阅读项目结构
- 总结当前页面和组件
- 找出移动端问题
- 给出改造计划

### 第二阶段：全局移动端基础

- 检查 layout
- 检查 globals.css
- 处理 html/body/root 高度
- 处理横向溢出
- 处理底部安全区域
- 处理页面底部 padding

### 第三阶段：底部 Tab Bar

- 新建或改造 bottom tab 组件
- 连接五个主路由
- 处理 active 状态
- 保持 liquid glass 风格

### 第四阶段：逐页适配

依次处理：

1. /
2. /schedule
3. /ai
4. /courses
5. /clubs

每个页面都要保证：

- 390px 宽度无横向滚动
- 布局自然
- 卡片不挤压
- 按钮可点击
- 内容不被底部导航遮挡

### 第五阶段：最终验收

完成后运行：

```bash
npm run lint
npm run build
git status
git diff main
```
检查：

- 是否有 TypeScript 报错
- 是否有不存在的导入
- 是否有无用文件
- 是否所有主路由可访问
- 是否没有破坏 main 分支

## 最终交付

完成后创建或更新：

`DEVELOPMENT_SUMMARY.md`

内容包括：

- 本次完成了什么
- 修改了哪些文件
- 移动端适配策略
- 自检结果
- 如何本地运行
- 还剩哪些 TODO

## 决策规则

如果遇到产品细节不明确的问题，不要停下来反复问用户。

优先选择最符合以下方向的方案：

- 校园效率工具
- 手机浏览器优先
- 轻量、顺滑、清爽
- liquid glass 视觉体系
- 不破坏现有代码结构

把不确定的决策记录到 `DEVELOPMENT_SUMMARY.md`。

## 模块化架构规则

本项目采用按业务模块拆分的结构。

### 路由层

`src/app` 只负责 Next.js 路由，不承载复杂业务逻辑。

例如：

- `src/app/courses/page.tsx` 只导入并渲染 `CoursesPage`
- `src/app/schedule/page.tsx` 只导入并渲染 `SchedulePage`
- `src/app/ai/page.tsx` 只导入并渲染 `AIPage`

### 业务模块层

每个主功能必须放在独立模块中：

- `src/modules/home`
- `src/modules/schedule`
- `src/modules/ai`
- `src/modules/courses`
- `src/modules/clubs`

每个模块内部可包含：

- `components/`：该模块专属组件
- `hooks/`：该模块专属状态逻辑
- `data/`：mock 数据或静态配置
- `types.ts`：该模块专属类型
- `utils.ts`：该模块专属工具函数
- `index.ts`：统一导出入口

### 通用组件层

真正跨模块复用的组件放在：

- `src/components/ui`
- `src/components/layout`

例如：

- `GlassCard`
- `PrimaryButton`
- `SearchInput`
- `EmptyState`
- `BottomTabBar`
- `AppShell`

不要把业务组件放进 `src/components/ui`。

### 代码边界规则

1. 不要把所有逻辑写进 `page.tsx`。
2. 不要让一个模块直接修改另一个模块的内部文件。
3. 如果有跨模块复用需求，先抽象到 `src/components`、`src/lib` 或 `src/types`。
4. 每个模块应该可以独立精修、独立测试、独立替换。
5. 修改课程模块时，除非必要，不要改动日程、AI、社团模块。
6. 修改社团模块时，除非必要，不要改动课程、日程、AI 模块。
7. 每完成一个模块，运行 `npm run lint` 和 `npm run build`。
8. 每完成一个模块，在 `DEVELOPMENT_SUMMARY.md` 中记录该模块的改动。
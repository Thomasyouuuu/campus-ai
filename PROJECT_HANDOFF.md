# Campus AI Project Handoff

## 1. Current Tech Stack

Project path:

```txt
/Users/thomasyou/Desktop/campus-ai-app
```

GitHub repository:

```txt
https://github.com/Thomasyouuuu/campus-ai
```

Stack:

- Next.js: `16.2.6`
- React: `19.2.4`
- TypeScript
- Router: App Router, using `src/app`
- Tailwind CSS: Tailwind v4, global styles in `src/app/globals.css`
- `lucide-react`: `^1.14.0`
- shadcn/ui: not installed
- framer-motion: not installed
- Supabase / Prisma: not connected yet
- Current state is mostly frontend prototype + mock data

Important structure:

```txt
src/app/
  layout.tsx
  page.tsx
  schedule/page.tsx
  globals.css

src/components/
  schedule/ScheduleWorkspace.tsx
  course/CoursesWorkspace.tsx

src/lib/
  schedule/mock.ts
  schedule/options.ts
  schedule/time.ts
  course/mock.ts

src/types/
  schedule.ts
  course.ts
```

Git status at the time of this handoff may include uncommitted changes:

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/schedule/ScheduleWorkspace.tsx`
- `src/components/course/`
- `src/lib/course/`
- `src/types/course.ts`
- There may be an empty untracked file named `main`; it should be deleted or ignored.

Last known stable commit:

```txt
bc735b7 update home tools workspace
```

## 2. Existing Pages and Routes

### `/`

Current homepage is being redesigned.

Completed or partially completed:

- Top Liquid Glass hero.
- Paper-tab layout with two large tabs:
  - `Tools`
  - `Tag World`
- Tools direction:
  - Bottom floating circular Liquid Glass Dock.
  - Entries should be: `主页 / 日程 / AI / 课程 / 社团`.
  - AI is centered and larger.
- Homepage content currently includes:
  - Mini schedule preview.
  - Course card.
  - DDL card.
  - Club activity card.

Latest user direction:

- `主页 / 日程 / AI / 课程 / 社团` should be floating circular cards at the bottom.
- Visual style should be pure transparent Liquid Glass, with perspective and refraction of the content underneath.
- The previous top tool-card position should become two cards:
  - `校内工具`
  - `DDL`
- These two cards should keep the previous glass-card style.

Not done:

- Need to check the real browser result of the bottom Dock.
- Need to run `npm run lint` / `npm run build` after latest changes.
- Need to connect Course / AI / Club entries to real routes.

### `/schedule`

Exists.

File:

```txt
src/app/schedule/page.tsx
```

Uses:

```txt
ScheduleWorkspace
```

Current features:

- Three-day horizontal schedule view.
- Drag horizontally to see later days.
- Full 24-hour timeline.
- Add course / personal schedule.
- AI import schedule entry, currently mock only.
- Three visibility states:
  - Full public.
  - Busy only.
  - Fully hidden.
- Course cards can be clicked into a course-board-like detail page.
- Detail includes:
  - AI course summary.
  - Chat room.
  - Shared notes.
  - Question unit.

Important note:

- A 10-hour scroll-window version was tried and rejected by the user.
- Keep the full 24-hour expanded schedule unless the user explicitly asks otherwise again.

### `/ai`

Not created yet.

Planned direction:

- SkillsAI-style self-learning system.
- Do not directly give answers.
- Guide students step by step toward understanding.
- Each AI feature should navigate to a new page.

Possible feature entries:

- Photo problem learning.
- Concept explanation.
- Self-test generation.
- Mistake review.
- Course summary.
- Study plan.

### `/courses`

Not created yet.

Existing component:

```txt
src/components/course/CoursesWorkspace.tsx
```

Planned / partially implemented in component:

- Search courses.
- Add courses.
- My courses.
- Click a course to open course detail.
- Course detail includes:
  - Course materials.
  - Tasks / DDL.
  - Notes.
  - Chat room.
  - Members.
  - Teaming.
  - AI self-learning entry.

Not done:

- Create `src/app/courses/page.tsx`.
- Fix build errors in `CoursesWorkspace.tsx`.
- Connect real navigation.
- Align visuals with the homepage Liquid Glass system.

### `/clubs`

Not created yet.

Planned:

- Club homepage.
- Activity calendar.
- Event registration.
- Recruitment info.
- Member showcase.
- AI-generated recruitment copy / activity planning.

Current state:

- Only homepage entry and mock card exist.

## 3. Current Visual System

Overall style:

- Liquid Glass.
- Campus efficiency app.
- Lightweight transparent UI.
- Rounded cards.
- Frosted glass.
- Sticky-note paper texture.
- Premium and restrained.

Important style file:

```txt
src/app/globals.css
```

Important classes:

- `.liquid-page`
- `.liquid-glass`
- `.liquid-soft`
- `.liquid-orb`
- `.liquid-dock`
- `.liquid-dock-orb`
- `.paper-board`
- `.liquid-distort-shell`
- `.liquid-distort-glass`
- `.glass-lens`

Design rules:

- Use light gradients and subtle colored glows for the page background.
- Cards should be transparent, frosted, with thin white borders and highlight shadows.
- Important floating layers should use Liquid Glass, not solid white cards.
- Schedule board background should be micro-yellow sticky-note paper.
- Schedule cards should feel like transparent glass with projection/refraction.
- Bottom nav should use pure transparent circular glass buttons.
- AI button should be centered and larger.
- Large cards usually use `28px - 34px` radius.
- Do not suddenly switch to generic SaaS dashboard style, backend-admin style, or heavy template styling.

## 4. Current Functional Plan

### Home

Goal:

- Personal campus workspace.
- Default view should aggregate the user’s important info.

Should contain:

- Personal schedule.
- Courses.
- DDL.
- Club activities.
- Bottom Dock switching:
  - Home.
  - Schedule.
  - AI.
  - Courses.
  - Clubs.

### Schedule

Goal:

- Tool-first.
- Solve personal time management first, then naturally lead into social features.

Existing:

- Manual course / personal schedule creation.
- Three-day horizontal view.
- 24-hour format.
- Visibility states.
- Matching/profile switches.
- Mock AI schedule import.
- Course detail entry.

### AI

Goal:

- SkillsAI-style self-learning system.
- Do not directly give answers.
- Step-by-step guidance.
- Each feature enters its own page.

Need to build:

- `/ai`.
- AI feature homepage.
- Feature cards:
  - Photo problem learning.
  - Concept explanation.
  - Self-test generation.
  - Mistake review.
  - Course summary.
  - Study plan.

### Courses

Goal:

- Courses are not just a list. They are learning communities + AI study workspaces.

Required:

- Search courses.
- Add courses.
- My courses.
- Click course to enter course detail.
- Detail page should include:
  - Course materials.
  - Tasks / DDL.
  - Notes.
  - AI tutoring entry.
  - Chat room.
  - Questions.

Existing:

- `CoursesWorkspace.tsx`.
- `course/mock.ts`.
- `course.ts`.

Not complete:

- Route `/courses`.
- Build fixes.
- Real navigation.
- Visual consistency.

### Clubs

Goal:

- Later extension for clubs and activities.

First version only needs:

- `/clubs` entry page.
- Club activity cards.
- Recruitment / calendar / registration as mock.

## 5. Current Known Errors

### Error 1: Google Fonts build error

Recent `npm run build` error:

```txt
next/font: error:
Failed to fetch `Geist` from Google Fonts.

Failed to fetch `Geist Mono` from Google Fonts.
```

File:

```txt
src/app/layout.tsx
```

Cause:

`layout.tsx` uses:

```ts
import { Geist, Geist_Mono } from "next/font/google";
```

Build needs access to:

```txt
https://fonts.googleapis.com
```

The current network timed out while fetching Google Fonts.

Tried:

- Confirmed this is not caused by page code.
- `npm run lint` was able to pass before.
- Build failed at font fetching.

Suggested fixes:

- Use local fonts instead of `next/font/google`.
- Or temporarily remove `next/font/google`.
- Or build in an environment that can access Google Fonts.

### Error 2: `Export CircleStack doesn't exist in target module`

Error keyword:

```txt
Export CircleStack doesn't exist in target module
```

Related file:

```txt
src/components/course/CoursesWorkspace.tsx
```

Problem import:

```ts
import {
  CircleStack,
} from "lucide-react";
```

Cause:

- Current `lucide-react@^1.14.0` does not export `CircleStack`.

Fix:

- Replace `CircleStack` with a real lucide icon, for example:
  - `Layers`
  - `Database`
  - `LibraryBig`
  - `BookOpen`
  - `Boxes`

Example:

```tsx
import { Layers } from "lucide-react";

<Layers size={20} />
```

Also check other icons in `CoursesWorkspace.tsx`, such as `ChatBubble`, before building. Do not import icons that do not exist.

## 6. Suggested Next Steps

Recommended order for the next Codex session:

1. Fix build first.
   - Replace invalid lucide icons such as `CircleStack`.
   - Check all icons in `CoursesWorkspace.tsx`.
   - Fix or bypass Google Fonts build issue.

2. Then unify visual components.
   - Stabilize Liquid Glass card, circular Dock, and paper-tab styles.
   - Avoid duplicated ad-hoc styles across pages.

3. Then add route navigation.
   - Create `/ai`.
   - Create `/courses`.
   - Create `/clubs`.
   - Decide whether bottom Dock switches in-place or routes to pages, then keep it consistent.

4. Then build course detail page.
   - Search course.
   - Add course.
   - My courses.
   - Course detail.
   - Materials / tasks / notes / AI tutoring entry.

5. Then build AI self-learning system.
   - SkillsAI style.
   - No direct answers.
   - Step-by-step understanding.
   - Each function opens its own page.

6. Finally polish motion and mobile.
   - Bottom Dock mobile fit.
   - Card text overflow.
   - Schedule mobile drag.
   - Liquid Glass should not turn gray or black.

## 7. Development Constraints for Next Codex

Must follow:

- Do not make broad changes across all files at once.
- Complete one small task at a time.
- After every change, run:

```bash
npm run lint
```

or:

```bash
npm run build
```

- If there is an error, fix the error before adding more features.
- Do not import nonexistent icons / components / paths.
- Do not break the current Liquid Glass visual system.
- Do not turn the UI into a generic admin dashboard.
- Do not delete existing schedule functionality.
- Do not change the schedule back to a 10-hour scroll window unless the user explicitly asks again.

Current navigation direction:

- Bottom Dock:
  - 主页
  - 日程
  - AI
  - 课程
  - 社团

- Top / quick cards:
  - 校内工具
  - DDL

Most important next task:

Stop adding features, fix build, then organize routes.

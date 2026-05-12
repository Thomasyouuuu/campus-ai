const todayCourses = [
  {
    name: "计量经济学",
    time: "10:00 - 11:40",
    place: "经管楼 B302",
    status: "想找复习搭子",
  },
  {
    name: "传播学专题",
    time: "14:00 - 15:40",
    place: "三教 205",
    status: "偶尔去",
  },
];

const tags = ["摄影", "Citywalk", "论文互助", "自习搭子", "社恐友好"];

const recommendations = [
  {
    name: "林同学",
    score: 86,
    reason: "你们都上计量经济学，并且都标记了自习搭子。",
  },
  {
    name: "周同学",
    score: 78,
    reason: "你们有 4 个共同 Tag，周五下午也都有空。",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:py-10">
        <nav className="flex items-center justify-between border-b border-stone-200 pb-5">
          <div>
            <p className="text-sm font-medium text-teal-700">Campus AI</p>
            <h1 className="text-2xl font-semibold tracking-normal">
              AI 校园学习与生活助手
            </h1>
          </div>
          <Link
            className="rounded-md bg-stone-950 px-4 py-2 text-sm font-medium text-white"
            href="/schedule"
          >
            打开日程表
          </Link>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">今日工具台</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-normal">
                  先管理学习生活，再自然遇见同频的人
                </h2>
              </div>
              <span className="w-fit rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
                MVP v0.1
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["课表", "手动添加课程、公开设置、匹配开关"],
                ["主页", "模块化编辑个人校园空间"],
                ["Tag", "整理兴趣、学习目标和搭子需求"],
              ].map(([title, desc]) => (
                <div
                  className="rounded-md border border-stone-200 bg-[#fbfbf7] p-4"
                  key={title}
                >
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-stone-500">我的 Tag</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-md bg-stone-950 p-4 text-white">
              <p className="text-sm text-stone-300">AI 主页助手</p>
              <p className="mt-2 text-lg font-medium">
                帮你把“我是谁、想找谁、最近在做什么”写得自然一点。
              </p>
            </div>
          </aside>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">今天的课程</h2>
              <span className="text-sm text-stone-500">周视图稍后接入</span>
            </div>
            <div className="mt-4 space-y-3">
              {todayCourses.map((course) => (
                <article
                  className="rounded-md border border-stone-200 p-4"
                  key={course.name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {course.time} · {course.place}
                      </p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                      {course.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">可能同频</h2>
              <span className="text-sm text-stone-500">推荐后置，不打扰</span>
            </div>
            <div className="mt-4 space-y-3">
              {recommendations.map((item) => (
                <article
                  className="rounded-md border border-stone-200 p-4"
                  key={item.name}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-sm font-semibold text-teal-700">
                      {item.score} 分
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {item.reason}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
import Link from "next/link";

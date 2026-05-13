import { CoursesWorkspace } from "@/components/course/CoursesWorkspace";
import { GlobalDock } from "@/components/navigation/GlobalDock";

export default function CoursesPage() {
  return (
    <>
      <div className="pb-48">
        <CoursesWorkspace />
      </div>
      <GlobalDock />
    </>
  );
}

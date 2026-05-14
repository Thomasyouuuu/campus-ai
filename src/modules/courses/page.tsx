import { GlobalDock } from "@/components/navigation/GlobalDock";
import { CoursesWorkspace } from "./components/CoursesWorkspace";

export function CoursesPage() {
  return (
    <>
      <div className="mobile-page-shell">
        <CoursesWorkspace />
      </div>
      <GlobalDock />
    </>
  );
}

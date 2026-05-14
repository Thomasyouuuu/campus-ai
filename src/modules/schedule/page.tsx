import { GlobalDock } from "@/components/navigation/GlobalDock";
import { ScheduleWorkspace } from "./ScheduleWorkspace";

export function SchedulePage() {
  return (
    <>
      <div className="mobile-page-shell">
        <ScheduleWorkspace />
      </div>
      <GlobalDock />
    </>
  );
}

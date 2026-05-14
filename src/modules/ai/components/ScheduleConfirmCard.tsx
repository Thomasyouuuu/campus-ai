import { CalendarPlus, MapPin, Clock } from "lucide-react";
import type { ScheduleAction } from "../types";

const WEEKDAY_LABELS: Record<number, string> = {
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
  7: "周日",
};

type ScheduleConfirmCardProps = {
  action: ScheduleAction;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function ScheduleConfirmCard({
  action,
  onConfirm,
  onDismiss,
}: ScheduleConfirmCardProps) {
  const dayLabel = WEEKDAY_LABELS[action.weekday] || `周${action.weekday}`;

  return (
    <div className="paper-board rounded-[22px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100/60 text-amber-700">
          <CalendarPlus size={16} />
        </span>
        <span className="text-xs font-semibold text-amber-800">
          日程建议
        </span>
      </div>

      <p className="text-base font-semibold text-slate-900 mb-2">
        {action.courseName}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-4">
        <span className="inline-flex items-center gap-1">
          <Clock size={13} />
          {dayLabel} {action.startTime}-{action.endTime}
        </span>
        {action.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {action.location}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition active:scale-95"
          onClick={onConfirm}
          type="button"
        >
          确认添加
        </button>
        <button
          className="liquid-soft inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-slate-600 transition active:scale-95"
          onClick={onDismiss}
          type="button"
        >
          忽略
        </button>
      </div>
    </div>
  );
}

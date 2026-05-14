import type { ScheduleAction } from "../types";

type ParseResult = {
  displayText: string;
  scheduleAction: ScheduleAction | null;
};

export function parseAIResponse(rawText: string): ParseResult {
  const jsonRegex = /```json\s*([\s\S]*?)```/;
  const match = rawText.match(jsonRegex);

  if (!match) {
    return { displayText: rawText.trim(), scheduleAction: null };
  }

  const jsonStr = match[1].trim();
  const displayText = rawText.replace(jsonRegex, "").trim();

  try {
    const parsed = JSON.parse(jsonStr);

    if (!parsed.scheduleAction) {
      return { displayText: rawText.trim(), scheduleAction: null };
    }

    const action = parsed.scheduleAction;

    if (
      !action.courseName ||
      typeof action.weekday !== "number" ||
      action.weekday < 1 ||
      action.weekday > 7 ||
      !action.startTime ||
      !action.endTime
    ) {
      console.warn("Incomplete scheduleAction, missing required fields:", action);
      return { displayText: rawText.trim(), scheduleAction: null };
    }

    const scheduleAction: ScheduleAction = {
      courseName: String(action.courseName).trim(),
      weekday: Math.max(1, Math.min(7, Math.round(action.weekday))),
      startTime: String(action.startTime).trim(),
      endTime: String(action.endTime).trim(),
      location: action.location ? String(action.location).trim() : "",
      itemType:
        action.itemType === "course" ? "course" : "personal",
      note: action.note ? String(action.note).trim() : "",
    };

    return { displayText, scheduleAction };
  } catch {
    console.warn("Failed to parse scheduleAction JSON:", jsonStr);
    return { displayText: rawText.trim(), scheduleAction: null };
  }
}

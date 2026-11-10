import { useCallback, useState } from "react";

const STORAGE_KEY = "dialectverse-heard-questions";

function load(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/** 小念和爸爸聊完过的问题，用来在列表上点亮星星 */
export function useHeardQuestions() {
  const [heard, setHeard] = useState<readonly string[]>(load);
  const markHeard = useCallback((id: string) => {
    setHeard((previous) => {
      if (previous.includes(id)) return previous;
      const next = [...previous, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error("问题进度保存失败", error);
      }
      return next;
    });
  }, []);
  return { heard, markHeard };
}

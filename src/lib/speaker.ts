/**
 * 同一时间只让一个声音说话：动画配音、「听一听」，在这一页或别的标签页里一开口，
 * 其他正在出声的就停下。
 */
const otherTabs = typeof BroadcastChannel === "undefined" ? undefined : new BroadcastChannel("dialectverse-voice");
const thisTab = new Set<(speaker: string) => void>();

export function claimSpeaker(speaker: string) {
  otherTabs?.postMessage(speaker);
  for (const listener of thisTab) listener(speaker);
}

/** speaker 开口时通知 onOther（除了自己）；返回取消订阅的函数 */
export function watchSpeakers(self: string, onOther: () => void) {
  const onThisTab = (speaker: string) => {
    if (speaker !== self) onOther();
  };
  thisTab.add(onThisTab);
  otherTabs?.addEventListener("message", onOther);
  return () => {
    thisTab.delete(onThisTab);
    otherTabs?.removeEventListener("message", onOther);
  };
}

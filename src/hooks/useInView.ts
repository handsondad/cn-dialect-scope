import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(initial = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

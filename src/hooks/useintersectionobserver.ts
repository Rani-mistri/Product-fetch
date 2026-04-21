
import { useEffect } from "react";

export function useIntersectionObserver(
  // to give ref null value in inital stage 
  ref: React.RefObject<HTMLDivElement | null>, 
  callback: () => void
) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { rootMargin: "300px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);
}

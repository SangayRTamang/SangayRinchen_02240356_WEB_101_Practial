import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
} = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { root, rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []); // ✅ empty deps — only run once on mount

  return [ref, isIntersecting];
}
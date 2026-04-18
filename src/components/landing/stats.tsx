"use client";

import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Happy Clients" },
  { value: 1000000, suffix: "+", label: "Orders Completed" },
  { value: 500, suffix: "+", label: "Services Available" },
  { value: 99, suffix: "%", label: "Satisfaction Rate" },
];

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, ref };
}

export function Stats() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const { count, ref } = useCountUp(stat.value);
            return (
              <div
                key={i}
                ref={ref as React.RefObject<HTMLDivElement>}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[var(--accent)] md:text-5xl">
                  {count.toLocaleString()}{stat.suffix}
                </div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const items = [
  "Crop Farming",
  "Poultry",
  "Aquaculture",
  "Greenhouses",
  "Fruit Farming",
  "Vegetable Farming",
  "Sustainable Agriculture",
];

export default function Marquee() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    if (!section || !marquee) return;

    let isIntersecting = false;
    const tween = gsap.to(marquee, {
      xPercent: -50,
      duration: 20,
      ease: "none",
      repeat: -1,
      paused: true,
    });

    const syncPlayback = () => {
      if (isIntersecting && document.visibilityState === "visible") {
        tween.play();
      } else {
        tween.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      syncPlayback();
    });

    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-[6rem] overflow-hidden bg-gray-300"
    >
      <div
        ref={marqueeRef}
        className="flex gap-8 whitespace-nowrap text-3xl font-bold uppercase will-change-transform"
      >
        {[...items, ...items].map((item, index) => (
          <div key={`${item}-${index}`} className="rounded-full px-6 py-3">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

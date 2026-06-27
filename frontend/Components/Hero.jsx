"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTextTop from "./heroTextTop";
import HeroImage from "./heroImage";
import HeroTextBottom from "./HeroTextBottom";
import RevealedSection from "./RevealedSection";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const outerRef = useRef(null);
  const textTopRef = useRef(null);
  const textBotRef = useRef(null);
  const imageRef = useRef(null);
  const revealRef = useRef(null);

  useEffect(() => {
    if (
      !outerRef.current ||
      !textTopRef.current ||
      !textBotRef.current ||
      !imageRef.current ||
      !revealRef.current
    ) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top top",
            end: "+=1000",
            scrub: 2,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            revealRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, ease: "power2.out", duration: 2 },
            0,
          )
          .to(
            textTopRef.current,
            {
              x: "-110%",
              ease: "power2.in",
              opacity: 0,
              duration: 1.2,
            },
            0,
          )
          .to(
            textBotRef.current,
            {
              y: "150%",
              ease: "power2.in",
              opacity: 0,
              duration: 1.2,
            },
            0,
          )
          .to(
            imageRef.current,
            {
              x: "110%",
              ease: "power2.in",
              opacity: 0,
              duration: 1.3,
            },
            0,
          );
      });

      return () => media.revert();
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} className="relative lg:min-h-screen">
      <div className="relative pt-20 pb-8 lg:top-15 lg:h-screen lg:overflow-hidden lg:pt-0 lg:pb-0">
        <div className="hidden lg:block">
          <RevealedSection ref={revealRef} />
        </div>

        <div className="grid gap-4 lg:h-full lg:gap-0 lg:grid-cols-2">
          <div className="grid gap-4 lg:gap-0 lg:grid-rows-2">
            <HeroTextTop ref={textTopRef} />
            <HeroTextBottom ref={textBotRef} />
          </div>

          <HeroImage ref={imageRef} />
        </div>
      </div>
    </div>
  );
};

export default Hero;

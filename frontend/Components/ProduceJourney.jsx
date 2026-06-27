"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tomato_2 } from "./models/Tomato_2";
import ValueOfferSection from "./ValueOffer";
import OwnershipSteps from "./OwnershipSteps";
import styles from "./produceJourney.module.css";

gsap.registerPlugin(ScrollTrigger);

function JourneyTomato({ journeyRef, valueStageRef, ownershipRef, orbitRef }) {
  const dropRef = useRef(null);
  const travelRef = useRef(null);
  const sectionScaleRef = useRef(null);
  const followRef = useRef(null);
  const spinRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.55;

    if (followRef.current) {
      const smoothing = 1 - Math.exp(-delta * 5);
      const targetX = pointerRef.current.x * 0.2;
      const targetY = pointerRef.current.y * 0.14;

      followRef.current.position.x +=
        (targetX - followRef.current.position.x) * smoothing;
      followRef.current.position.y +=
        (targetY - followRef.current.position.y) * smoothing;
      followRef.current.rotation.x +=
        (pointerRef.current.y * 0.05 - followRef.current.rotation.x) * smoothing;
      followRef.current.rotation.z +=
        (-pointerRef.current.x * 0.06 - followRef.current.rotation.z) * smoothing;
    }
  });

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey) return;

    const handlePointerMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const resetPointer = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    journey.addEventListener("pointermove", handlePointerMove);
    journey.addEventListener("pointerleave", resetPointer);

    return () => {
      journey.removeEventListener("pointermove", handlePointerMove);
      journey.removeEventListener("pointerleave", resetPointer);
    };
  }, [journeyRef]);

  useEffect(() => {
    const journey = journeyRef.current;
    const stage = valueStageRef.current;
    const ownership = ownershipRef.current;
    const orbit = orbitRef.current;
    const drop = dropRef.current;
    const travel = travelRef.current;
    const sectionScale = sectionScaleRef.current;

    if (
      !journey ||
      !stage ||
      !ownership ||
      !orbit ||
      !drop ||
      !travel ||
      !sectionScale
    ) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
      })
        .to(drop.position, {
          y: -0.1,
          duration: 0.55,
          ease: "power2.in",
        }, 0)
        .to(drop.position, {
          y: 0.28,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(drop.position, {
          y: 0,
          duration: 0.24,
          ease: "bounce.out",
        })
        .to(drop.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.55,
          ease: "power2.in",
        }, 0)
        .to(drop.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.8,
          ease: "power2.out",
        }, 0.25);

      const media = gsap.matchMedia();

      gsap.to(sectionScale.scale, {
        x: 1,
        y: 1,
        z: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ownership,
          start: "top 92%",
          end: "top 8%",
          scrub: 0.8,
        },
      });

      gsap.fromTo(
        orbit,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ownership,
            start: "top 88%",
            end: "top 20%",
            scrub: 0.8,
          },
        },
      );

      media.add("(min-width: 901px)", () => {
        gsap.to(travel.position, {
          x: -1.88,
          ease: "none",
          scrollTrigger: {
            trigger: ownership,
            start: "top 92%",
            end: "top 8%",
            scrub: 0.8,
          },
        });
      });

      media.add("(max-width: 900px)", () => {
        gsap.to(travel.position, {
          y: 0.82,
          ease: "none",
          scrollTrigger: {
            trigger: ownership,
            start: "top 92%",
            end: "top 15%",
            scrub: 0.8,
          },
        });
      });

      gsap.fromTo(
        ownership,
        {
          backgroundColor: "#fafbf8",
          color: "#10140d",
          "--line-color": "rgba(40, 82, 11, 0.2)",
          "--muted": "rgba(16, 20, 13, 0.64)",
        },
        {
          backgroundColor: "#0d190c",
          color: "#f5f7f1",
          "--line-color": "rgba(216, 255, 142, 0.22)",
          "--muted": "rgba(245, 247, 241, 0.62)",
          ease: "none",
          scrollTrigger: {
            trigger: ownership,
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
          },
        },
      );

      return () => media.revert();
    }, journey);

    return () => ctx.revert();
  }, [journeyRef, orbitRef, ownershipRef, valueStageRef]);

  return (
    <group
      ref={dropRef}
      position={[0, 4.2, 0]}
      rotation={[0.2, 0.35, 0.12]}
      scale={0.72}
    >
      <group ref={travelRef}>
        <group ref={sectionScaleRef} scale={0.9}>
          <group ref={followRef}>
            <group ref={spinRef}>
              <Tomato_2 scale={0.72} position={[0, 0.12, -1.163]} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function ProduceJourney() {
  const journeyRef = useRef(null);
  const valueSectionRef = useRef(null);
  const valueStageRef = useRef(null);
  const ownershipRef = useRef(null);
  const orbitRef = useRef(null);
  const [canvasActive, setCanvasActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const syncDesktop = () => setIsDesktop(query.matches);

    syncDesktop();
    query.addEventListener("change", syncDesktop);

    return () => query.removeEventListener("change", syncDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const journey = journeyRef.current;
    if (!journey) return;

    let isIntersecting = false;

    const syncFrameLoop = () => {
      setCanvasActive(
        isIntersecting && document.visibilityState === "visible",
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncFrameLoop();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(journey);
    document.addEventListener("visibilitychange", syncFrameLoop);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncFrameLoop);
    };
  }, [isDesktop]);

  return (
    <div ref={journeyRef} className={styles.journey}>
      {isDesktop ? (
        <div className={styles.scene} aria-label="A tomato moving between sections">
          <div ref={orbitRef} className={styles.ownershipOrbit} aria-hidden="true" />
          <Canvas
            camera={{ position: [0, 0, 5], fov: 35 }}
            dpr={[1, 1.5]}
            frameloop={canvasActive ? "always" : "never"}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <ambientLight intensity={1.25} />
            <directionalLight position={[4, 5, 4]} intensity={2.5} />
            <directionalLight position={[-3, 1, 2]} intensity={0.7} />
            <JourneyTomato
              journeyRef={journeyRef}
              valueStageRef={valueStageRef}
              ownershipRef={ownershipRef}
              orbitRef={orbitRef}
            />
          </Canvas>
        </div>
      ) : null}

      <div className={styles.sections}>
        <ValueOfferSection
          sectionRef={valueSectionRef}
          stageRef={valueStageRef}
        />
        <OwnershipSteps sectionRef={ownershipRef} />
      </div>
    </div>
  );
}

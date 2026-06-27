"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { Tomato_2 } from "./models/Tomato_2";
import styles from "./styles.module.css";

const reveal = {
  initial: { opacity: 0, y: 30, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
};

function MobileTomato() {
  const tomatoRef = useRef(null);

  useFrame((_, delta) => {
    if (tomatoRef.current) tomatoRef.current.rotation.y += delta * 0.45;
  });

  return (
    <group ref={tomatoRef} rotation={[0.08, 0.2, 0]}>
      <Tomato_2 scale={0.82} position={[0.18, -0.18, -1.2]} />
    </group>
  );
}

function subscribeToMobile(callback) {
  const query = window.matchMedia("(max-width: 900px)");
  query.addEventListener("change", callback);

  return () => query.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function MobileTomatoStage() {
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    () => false,
  );

  if (!isMobile) return null;

  return (
    <Canvas
      className={styles.mobileTomatoCanvas}
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, 1.35]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 5, 4]} intensity={2.4} />
      <directionalLight position={[-3, 1, 2]} intensity={0.65} />
      <MobileTomato />
    </Canvas>
  );
}

export default function ValueOfferSection({ sectionRef, stageRef }) {
  return (
    <section ref={sectionRef} className={styles.valueSection}>
      <div className={styles.intro}>
        <motion.span className={styles.eyebrow} {...reveal}>
          A new kind of ownership
        </motion.span>
        <motion.h2 {...reveal} transition={{ ...reveal.transition, delay: 0.08 }}>
          Produce is the <span>PRODUCT</span>
        </motion.h2>
      </div>

      <div ref={stageRef} className={styles.offerStage}>
        <motion.article
          className={`${styles.copyPanel} ${styles.copyPanelLeft}`}
          initial={{ opacity: 0, x: -48, rotate: -1 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.panelNumber}>01</p>
          <h3>You don&apos;t need to own the farm.</h3>
          <p className={styles.panelBody}>
            Start with the harvest—not the hectares. Invest directly in the
            produce farmers are already growing.
          </p>
        </motion.article>

        <div className={styles.tomatoWrap} aria-hidden="true">
          <div className={styles.backShadow} />
          <MobileTomatoStage />
        </div>

        <motion.article
          className={`${styles.copyPanel} ${styles.copyPanelRight}`}
          initial={{ opacity: 0, x: 48, rotate: 1 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.panelNumber}>02</p>
          <h3>You can own what it produces.</h3>
          <p className={styles.panelBody}>
            Your investment helps a real crop reach its potential—and lets you
            participate in the value it creates.
          </p>
        </motion.article>
      </div>

      <motion.p
        className={styles.closingLine}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Agriculture, made tangible. <span>One harvest at a time.</span>
      </motion.p>
    </section>
  );
}

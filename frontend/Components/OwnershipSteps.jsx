"use client";

import { motion } from "framer-motion";
import styles from "./ownershipSteps.module.css";

const steps = [
  {
    title: "Pick a harvest",
    detail: "Choose a verified crop with a clear season and target.",
  },
  {
    title: "Back the grower",
    detail: "Put capital behind the farmer, inputs and fieldwork.",
  },
  {
    title: "Track the season",
    detail: "Follow real milestones from planting through harvest.",
  },
  {
    title: "Receive the produce",
    detail: "The harvest is delivered to you—the virtual farmer.",
  },
];

export default function OwnershipSteps({ sectionRef }) {
  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.tomatoField} aria-hidden="true" />

      <div className={styles.content}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55 }}
        >
          Own the outcome
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 38, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Your farm, minus the land.
        </motion.h2>
        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          Four steps. Zero acres required.
        </motion.p>

        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              className={styles.step}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{
                duration: 0.6,
                delay: index * 0.055,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

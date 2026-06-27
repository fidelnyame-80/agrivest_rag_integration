"use client";

import { motion } from "framer-motion";
import styles from "./faqSection.module.css";

const faqs = [
  {
    question: "Do I need farmland?",
    answer:
      "No. You choose a verified harvest and participate in the value it creates.",
  },
  {
    question: "What am I backing?",
    answer:
      "A real crop season: farmer, inputs, fieldwork, milestones and delivery.",
  },
  {
    question: "How do I track progress?",
    answer:
      "Each harvest has visible updates, so the season feels tangible from start to finish.",
  },
  {
    question: "What happens after harvest?",
    answer:
      "Produce is delivered to you as the virtual farmer, with the outcome clearly reported.",
  },
];

export default function FAQSection() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.shell}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.eyebrow}>Questions, harvested</p>
          <h2>Simple enough to start. Serious enough to trust.</h2>
          <p>
            AgriVest turns agriculture into a visible season, not a distant
            promise.
          </p>
        </motion.div>

        <div className={styles.list}>
          {faqs.map((faq, index) => (
            <motion.details
              key={faq.question}
              className={styles.item}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {faq.question}
              </summary>
              <p>{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

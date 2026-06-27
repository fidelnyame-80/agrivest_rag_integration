"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./harvestFields.module.css";

const harvests = [
  {
    crop: "Tomatoes",
    field: "Greenhouse",
    cycle: "12–16 weeks",
    note: "Fast cycle",
    theme: "tomato",
    image: "/tomatoInvest.webp",
  },
  {
    crop: "Maize",
    field: "Open field",
    cycle: "16–20 weeks",
    note: "Staple crop",
    theme: "maize",
    image: "/maizeInvest.webp",
  },
  {
    crop: "Peppers",
    field: "Irrigated field",
    cycle: "12–14 weeks",
    note: "High demand",
    theme: "pepper",
    image: "/pepperInvest.webp",
  },
  {
    crop: "Plantain",
    field: "Orchard",
    cycle: "9–12 months",
    note: "Long season",
    theme: "plantain",
    image: "/plantainInvest.webp",
  },
];

export default function HarvestFields() {
  return (
    <section className={styles.section} id="harvests">
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className={styles.eyebrow}>Harvest catalogue</p>
          <h2>Different fields. Different wins.</h2>
        </div>
        <p className={styles.intro}>
          Choose a crop that fits your timeline. Every field is verified and
          every season is visible.
        </p>
      </motion.header>

      <div className={styles.grid}>
        {harvests.map((harvest, index) => (
          <motion.article
            key={harvest.crop}
            className={`${styles.card} ${styles[harvest.theme]}`}
            initial={{ opacity: 0, y: 42, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.72,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -7 }}
          >
            <div className={styles.visual} aria-hidden="true">
              <span className={styles.fieldLabel}>{harvest.field}</span>
              {harvest.image ? (
                <Image
                  src={harvest.image}
                  alt=""
                  fill
                  sizes="(max-width: 800px) 100vw, 42rem"
                  className={styles.harvestImage}
                />
              ) : (
                <div className={styles.plot}>
                  {Array.from({ length: 18 }, (_, dotIndex) => (
                    <i key={dotIndex} />
                  ))}
                </div>
              )}
              <span className={styles.cardIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div>
                <p className={styles.note}>{harvest.note}</p>
                <h3>{harvest.crop}</h3>
              </div>
              <dl className={styles.meta}>
                <div>
                  <dt>Field</dt>
                  <dd>{harvest.field}</dd>
                </div>
                <div>
                  <dt>Cycle</dt>
                  <dd>{harvest.cycle}</dd>
                </div>
              </dl>
              <button type="button" className={styles.action}>
                View harvest <span aria-hidden="true">↗</span>
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

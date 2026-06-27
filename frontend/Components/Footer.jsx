"use client";

import { motion } from "framer-motion";
import styles from "./footer.module.css";

const links = [
  { label: "Home", href: "#" },
  { label: "Harvests", href: "#harvests" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <motion.div
        className={styles.top}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles.brand}>Agrivest</p>
        <h2>Own the harvest, not the headache.</h2>
      </motion.div>

      <motion.div
        className={styles.bottom}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.12 }}
      >
        <p>© 2026 Agrivest. Agriculture, made tangible.</p>
        <nav aria-label="Footer navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </footer>
  );
}

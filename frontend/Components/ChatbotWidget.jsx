"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./chatbotWidget.module.css";

const starterPrompts = [
  "Which harvest fits a short timeline?",
  "How does AgriVest verify farmers?",
  "What happens after harvest?",
];

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hi, I'm AgriVest Guide. Ask me about harvests, timelines, farmer verification, or how produce ownership works.",
  },
];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

function renderMessageContent(content) {
  const parts = String(content)
    .replace(/\n{3,}/g, "\n\n")
    .split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (value = input) => {
    const trimmed = value.trim();
    if (!trimmed || isThinking) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setIsThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the server. Please try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={styles.widget} aria-live="polite">
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              className={styles.backdrop}
              aria-label="Close AgriVest AI"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className={styles.panel}
              initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
            <header className={styles.header}>
              <div>
                <p>AgriVest AI</p>
                <h2>Harvest guide</h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                x
              </button>
            </header>

            <div className={styles.messages}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  className={`${styles.message} ${
                    message.role === "user"
                      ? styles.userMessage
                      : styles.assistantMessage
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24 }}
                >
                  <p>{renderMessageContent(message.content)}</p>
                </motion.div>
              ))}

              {isThinking ? (
                <motion.div
                  className={`${styles.message} ${styles.assistantMessage}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.typing}>
                    <i />
                    <i />
                    <i />
                  </div>
                </motion.div>
              ) : null}
            </div>

            <div className={styles.prompts}>
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className={styles.composer}
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about a harvest..."
                aria-label="Ask AgriVest AI"
              />
              <button type="submit" disabled={!input.trim() || isThinking}>
                Send
              </button>
            </form>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className={styles.launcher}
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close AgriVest AI" : "Open AgriVest AI"}
      >
        <span />
        Ask AgriVest
      </motion.button>
    </div>
  );
}

// components/Navbar.tsx
"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      style={{
        padding: "18px clamp(1.25rem, 3vw, 2.8rem)",
        borderBottom: "1px solid rgba(16, 20, 13, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.95rem",
        letterSpacing: "-0.02em",
      }}
      className="fixed
    top-0
    left-0
    right-0
    z-50
    bg-white/80
    backdrop-blur-md"
    >
      <h2
        style={{
          margin: 0,
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "-0.035em",
        }}
      >
        Agrivest
      </h2>

      <div
        style={{
          display: "flex",
          gap: "clamp(1rem, 2vw, 1.6rem)",
          alignItems: "center",
          fontWeight: 500,
        }}
      >
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;

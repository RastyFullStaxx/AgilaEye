/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#1877F2",
        primaryDeep: "#2563EB",
        ink: "#0F172A",
        muted: "#64748B",
        page: "#F3F4F6",
        authentic: "#16A34A",
        warning: "#F97316",
        generated: "#EF4444",
        eagle: "#F4B23A"
      },
      boxShadow: {
        detector: "0 18px 44px rgba(15, 23, 42, 0.18)",
        soft: "0 8px 24px rgba(15, 23, 42, 0.08)"
      },
      keyframes: {
        "fade-scale": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "scan-sweep": {
          "0%": { transform: "translateY(-32px)", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { transform: "translateY(385px)", opacity: "0" }
        },
        "progress-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(250%)" }
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "fade-scale": "fade-scale 220ms ease-out both",
        "scan-sweep": "scan-sweep 2.2s ease-in-out infinite",
        "progress-line": "progress-line 1.45s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

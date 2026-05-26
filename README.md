# AgilaEye / HaribonEye

HaribonEye is a polished front-end prototype for a lightweight explainable AI-based
AI-generated video detector during Facebook-style video browsing.

The prototype uses Tauri v2, Svelte 5, TypeScript, Vite, and Tailwind CSS. All
detection behavior is simulated with hardcoded event-driven state transitions.
It does not perform real AI inference, screen capture, scraping, browser
extension injection, webcam access, or video frame analysis.

## Run

```bash
npm install
npm run dev
```

For the desktop shell:

```bash
npm run tauri dev
```

Rust/Cargo is required for Tauri commands.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        custom: {
          "primary": "#6366f1",
          "primary-focus": "#4f46e5",
          "primary-content": "#ffffff",
          "secondary": "#f1f5f9",
          "secondary-focus": "#e2e8f0",
          "secondary-content": "#1e293b",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          "neutral": "#1e293b",
          "neutral-focus": "#0f172a",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#1e293b",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
    darkTheme: false,
  },
} 
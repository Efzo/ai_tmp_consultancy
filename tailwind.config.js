/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "rgb(var(--midnight-rgb) / <alpha-value>)",
        slate: {
          deep: "rgb(var(--slate-deep-rgb) / <alpha-value>)",
          muted: "rgb(var(--slate-muted-rgb) / <alpha-value>)",
        },
        electric: "rgb(var(--electric-rgb) / <alpha-value>)",
        cyan: {
          ai: "rgb(var(--cyan-ai-rgb) / <alpha-value>)",
        },
        platinum: "rgb(var(--platinum-rgb) / <alpha-value>)",
        glass: "rgba(255,255,255,0.12)",
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
    },
  },
  plugins: [],
}

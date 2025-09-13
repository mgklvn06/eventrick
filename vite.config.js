import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(
    {
          darkMode: "class", // 👈 enable manual dark mode toggle
          content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
          theme: { extend: {} },
          plugins: [],
        }
  )],
})

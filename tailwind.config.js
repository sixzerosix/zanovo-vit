/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts}"],  // Автоматическое сканирование
  theme: {
    extend: {},  // Если нужно, добавь свои цвета/шрифты позже
  },
  plugins: [
    require('tailwindcss-fluid-type')
  ],
}
/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require('@iconify/tailwind')

module.exports = {
  darkMode: 'selector',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        base: 'ZCOOLXiaoWei',
      },
      backgroundImage: {
        avatar: 'url(\'/src/assets/avatar.jpg\')',
      },
    },
  },
  plugins: [
    addDynamicIconSelectors(),
  ],
}

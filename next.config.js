/** @type {import('next').NextConfig} */

const UnoCSS = require('@unocss/webpack').default
const presetUno = require('@unocss/preset-uno').default
const presetIcons = require('@unocss/preset-icons').default

const nextConfig = {
  reactStrictMode: true,

  webpack(config, context) {
    config.plugins.push(
      UnoCSS({
        shortcuts: [
          ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
          ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
        ],
        presets: [
          presetUno(),
          presetIcons({
            scale: 1.2,
            warn: true,
          })],
      }))

    if (context.buildId !== 'development') {
      // * disable filesystem cache for build
      // * https://github.com/unocss/unocss/issues/419
      // * https://webpack.js.org/configuration/cache/
      config.cache = false
    }

    return config
  },
}

module.exports = nextConfig

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
          ['icon-btn', 'text-[1.2em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100'],
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

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
            collections: {
              custom: {
                logo: '<svg width="143" height="192" viewBox="0 0 143 192" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="143" height="192"/><g fill="currentColor"><path opacity="0.8" fill-rule="evenodd" clip-rule="evenodd" d="M143 95.5224C143 148.278 100.233 191.045 47.4776 191.045C30.5794 191.045 14.706 186.657 0.934601 178.958C1.21984 179.118 1.50599 179.276 1.79302 179.432V11.6123C15.364 4.20799 30.9294 0 47.4776 0C100.233 0 143 42.7668 143 95.5224ZM84.8559 95.5224C84.8559 116.166 68.1211 132.901 47.4776 132.901C26.8342 132.901 10.0993 116.166 10.0993 95.5224C10.0993 74.8789 26.8342 58.1441 47.4776 58.1441C68.1211 58.1441 84.8559 74.8789 84.8559 95.5224Z" /><path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M51.6941 58.3793C41.7567 38.4166 24.0515 21.9183 1.79304 11.6124L1.79303 179.432C24.0515 169.127 41.7568 152.628 51.6942 132.666C50.3101 132.821 48.9032 132.901 47.4776 132.901C26.8342 132.901 10.0993 116.166 10.0993 95.5224C10.0993 74.8789 26.8342 58.1441 47.4776 58.1441C48.9032 58.1441 50.3101 58.2239 51.6941 58.3793Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M51.6308 95.5224C51.6308 59.3151 31.486 27.8129 1.79302 11.6123L1.79301 179.432C31.486 163.232 51.6308 131.73 51.6308 95.5224Z" /></g></svg>',
                juejin: '<svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5875 6.77268L21.8232 3.40505L17.5875 0.00748237L17.5837 0L13.3555 3.39757L17.5837 6.76894L17.5875 6.77268ZM17.5863 17.3955H17.59L28.5161 8.77432L25.5526 6.39453L17.59 12.6808H17.5863L17.5825 12.6845L9.61993 6.40201L6.66016 8.78181L17.5825 17.3992L17.5863 17.3955ZM17.5828 23.2891L17.5865 23.2854L32.2133 11.7456L35.1768 14.1254L28.5238 19.3752L17.5865 28L0.284376 14.3574L0 14.1291L2.95977 11.7531L17.5828 23.2891Z" fill="currentColor"/></svg>',
              },
            },
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

import fs from 'node:fs'
import gulp from 'gulp'
import Fontmin from 'fontmin'

function gulpCallback() {
  gulp.watch(['./src/i18n/*.json'], { ignoreInitial: false }, (cb) => {
    const allText = getAllText()
    console.log(allText)
    new Fontmin().use(Fontmin.glyph({
      text: allText,
      hinting: false,
    })).src('./src/assets/ZCOOLXiaoWei-Regular.ttf').dest('./src/assets/font-tiny').run((err) => {
      if (err)
        throw err
      cb()
    })
  })
}

function getAllText() {
  const i18nPath = './src/i18n/'
  const files = fs.readdirSync(i18nPath)
  let allText = ''
  files.forEach((filePath) => {
    Object.values(JSON.parse(String(fs.readFileSync(i18nPath + filePath)))).forEach(t => allText += t)
  })
  return allText
}

export default gulpCallback

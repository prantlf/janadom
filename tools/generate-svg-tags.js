const { writeFileSync } = require('fs')
const html = require('html-tag-names')
const allSvg = require('svg-tag-names')

const onlySvg = allSvg.filter(tag => !html.includes(tag))
writeFileSync(`${__dirname}/../src/svg-tags.ts`,
  `export default ${JSON.stringify(onlySvg, undefined, 2)}`)

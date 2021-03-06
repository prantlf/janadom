const { transformFileAsync: build } = require("@babel/core")
const { writeFile } = require('fs/promises')

module.exports = async function babel({ infile, outfile }) {
  try {
    const { code, map } = await build(infile, { sourceMaps: true })
    await Promise.all([
      writeFile(outfile, code.toString()),
      writeFile(`${outfile}.map`, map.toString())
    ])
  } catch (err) {
    console.error(err)
    throw err
  }
}

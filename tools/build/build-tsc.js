const {
  flattenDiagnosticMessageText, parseConfigFileTextToJson,
  parseJsonConfigFileContent, createProgram, getPreEmitDiagnostics, sys
} = require('typescript')
const { readFile } = require('fs/promises')
const { dirname } = require('path')

function reportErrors(diags) {
  for (const diag of diags) {
    let msg
    if (diag.file) {
      const where = diag.file.getLineAndCharacterOfPosition(diag.start)
      msg += ` ${diag.file.fileName}:${where.line},${where.character + 1}`
    } else {
      msg = 'Error'
    }
    msg += ': ' + flattenDiagnosticMessageText(diag.messageText, '\n')
    console.error(msg)
  }
  if (diags.length) throw new Error()
}

async function readConfig(name) {
  const content = await readFile(name, 'utf8')
  const { config } = parseConfigFileTextToJson(name, content)
  if (!config) reportErrors([result.error])
  const parsedCfg = parseJsonConfigFileContent(config, sys, dirname(name))
  if (parsedCfg.errors.length > 0) reportErrors(parsedCfg.errors)
  return parsedCfg
}

module.exports = async function tsc(dir) {
  const cwd = process.cwd()
  try {
    process.chdir(dir)
    const config = await readConfig('tsconfig.json')
    const program = createProgram(config.fileNames, config.options)
    const emitResult = program.emit()
    reportErrors(getPreEmitDiagnostics(program).concat(emitResult.diagnostics));
    if (emitResult.emitSkipped) throw new Error()
  } catch (err) {
    if (err.message) console.error(err)
    throw err
  } finally {
    process.chdir(cwd)
  }
}

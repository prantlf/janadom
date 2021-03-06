const { build } = require('@prantlf/esbuild')

module.exports = function esbuild(opts, watch) {
  return build({ ...opts, sourcemap: true, watch })
}

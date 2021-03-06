const esbuild = require('./build/build-esbuild')
const babel = require('./build/build-babel')
const tsc = require('./build/build-tsc')

const task = process.argv[2]
const watch = task === 'watch'
const builds = []

if (task === 'dist' || watch)
  builds.push(
    {
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.esm.js',
      format: 'esm',
      bundle: true
    },
    {
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.umd.js',
      format: 'umd',
      globalName: 'janadom'
    },
    {
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.umd.min.js',
      format: 'umd',
      globalName: 'janadom',
      bundle: true,
      minify: true
    },
    {
      entryPoints: ['src/index.ts'],
      outfile: 'dist/index.js',
      format: 'cjs',
      bundle: true
    }
  )

if (task === 'test' || task === 'check' || watch)
  builds.push(
    {
      entryPoints: ['test/compiled.test.tsx'],
      outfile: 'test/compiled.test1.js',
      format: 'cjs'
    }
  )

if (task === 'test' || watch)
  builds.push(
    {
      infile: 'test/compiled.test.jsx',
      outfile: 'test/compiled.test2.js'
    },
    'test'
  )

Promise
  .all(builds.map(opts => {
    if (opts.infile) return babel(opts)
    if (opts.entryPoints) return esbuild(opts, watch)
    return tsc(opts)
  }))
  .catch(() => process.exit(1))

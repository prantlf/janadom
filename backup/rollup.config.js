import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'janadom',
      sourcemap: true
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'test/compiled.test.tsx',
    output: {
      dir: 'test',
      format: 'cjs',
      exports: 'auto',
      sourcemap: true
    },
    plugins: [
      typescript(),
      commonjs({ extensions: ['.js', '.ts'] }),
      nodeResolve()
    ]
  }
]

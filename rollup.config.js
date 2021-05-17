
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'compiled/index.js',
    output: {
      file: 'dist/nuro.js',
      format: 'es'
    }
  },
  {
    input: 'compiled/index.js',
    output: {
      file: 'dist/nuro.min.js',
      format: 'es'
    },
    plugins: [terser()]
  },
  {
    input: 'compiled/index-umd.js',
    output: {
      file: 'dist/nuro.umd.js',
      format: 'umd',
      name: 'Nuro'
    }
  },
  {
    input: 'compiled/index-umd.js',
    output: {
      file: 'dist/nuro.umd.min.js',
      format: 'umd',
      name: 'Nuro'
    },
    plugins: [terser()]
  }
]

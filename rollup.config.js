export default [
  {
    input: 'compiled/index.js',
    output: {
      file: 'dist/nuro.js',
      format: 'es'
    }
  },
  {
    input: 'compiled/index-umd.js',
    output: {
      file: 'dist/nuro.umd.js',
      format: 'umd',
      name: 'Nuro'
    }
  }
]

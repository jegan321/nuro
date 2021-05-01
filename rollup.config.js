export default [
  {
    input: 'build/compiled/index.js',
    output: {
      file: 'build/dist/nuro.js',
      format: 'es'
    }
  },
  {
    input: 'build/compiled/index-umd.js',
    output: {
      file: 'build/dist/nuro.umd.js',
      format: 'umd',
      name: 'Nuro'
    }
  }
]

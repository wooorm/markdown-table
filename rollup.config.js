import typescript from 'rollup-plugin-typescript2'

export default {
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: './dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  input: './src/index.ts',
  plugins: [typescript()]
}

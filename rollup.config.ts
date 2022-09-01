import typescript from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'
import {RollupOptions} from 'rollup'
import pkg from './package.json'

const banner: string = `
/** ${pkg.name}
 *
 * @license ${pkg.license}
 */`.trim()

/** Export rollup.config */
export default async (): Promise<RollupOptions | RollupOptions[]> => {
  const outType: Array<'cjs' | 'es'> = ['cjs', 'es']

  return outType.map((format) => {
    return {
      input: 'lib/index.ts',
      plugins: [
        typescript({
          clean: true,
          useTsconfigDeclarationDir: true,
          abortOnError: true
        }),
        // Compress
        terser()
      ],
      output: {
        exports: 'auto',
        inlineDynamicImports: true,
        banner,
        format,
        file: `dist/index.${format}.js`
      }
    }
  })
}

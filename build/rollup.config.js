const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const replace = require('rollup-plugin-replace')
const del = require('del')

const env = process.env.NODE_ENV
const pkg = require('../package.json')

const banner =
`/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} Tianzhen mecoepcoo@vip.qq.com
 * @license MIT
 */`

export default async function () {
  await del('dist')

  const buildConfig = {
    input: 'src/index.ts',
    output: {
      dir: 'dist/',
      format: 'es',
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      sourcemap: true,
      banner
    },
    watch: {
      include: 'src/**',
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      typescript(),
      commonjs(),
      resolve(),
    ],
  }

  return buildConfig
}

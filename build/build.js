import {build} from 'esbuild'
import {mkdirSync} from 'fs'

mkdirSync(new URL('../dist/', import.meta.url), {recursive: true})

for (const name of ['index', 'react']) {
  await build({
    entryPoints: [new URL(`../${name}.js`, import.meta.url).pathname],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    outfile: new URL(`../dist/${name}.cjs`, import.meta.url).pathname,
    footer: {js: 'if(module.exports.default)module.exports=Object.assign(module.exports.default,module.exports);'},
  })
}
console.log('build: dist/index.cjs + dist/react.cjs')

// Compile-only check of the bundled type declarations (tsc --noEmit --strict).
import equal, {react, circular} from '../index.js'
import reactDefault from '../react.js'

const a: boolean = equal({x: 1}, {x: 1})
const b: boolean = react({x: 1}, {x: 1})
const c: boolean = circular({x: 1}, {x: 1})
const d: boolean = reactDefault({x: 1}, {x: 1})

// type guard narrowing
const value: unknown = {kind: 'a', n: 1}
const target = {kind: 'a' as const, n: 1}
if (equal(value, target)) {
    const narrowed: {kind: 'a'; n: number} = value
    void narrowed.n
}

void [a, b, c, d]

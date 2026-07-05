# @bybrave/fast-deep-equal2

Maintained, drop-in fork of [`fast-deep-equal`](https://github.com/epoberezkin/fast-deep-equal) — the fastest deep-equality check for JavaScript.

The original has had no release since 2020 (`3.1.3`) while still pulling ~710M downloads/month. This fork fixes the null-prototype crash, adds a circular-safe variant, folds Map/Set/TypedArray support into the default function, and ships ESM plus improved bundled types.

```sh
npm install @bybrave/fast-deep-equal2
```

```js
const equal = require('@bybrave/fast-deep-equal2');   // CommonJS
import equal from '@bybrave/fast-deep-equal2';         // ESM
import { equal, react, circular } from '@bybrave/fast-deep-equal2';

equal({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }); // true
```

The default `equal(a, b)` is the same fast function as upstream, and remains a TypeScript type guard (`a is T`). Map, Set, TypedArray and BigInt are compared out of the box — no separate `es6` entry needed.

## What's fixed

| Issue | Problem | Fix |
|---|---|---|
| [#49](https://github.com/epoberezkin/fast-deep-equal/issues/49) / [#111](https://github.com/epoberezkin/fast-deep-equal/issues/111) | Comparing objects created with `Object.create(null)` threw `a.valueOf is not a function` (21+ 👍). | `valueOf`/`toString` are only called when the object actually overrides them and they're callable — null-prototype objects compare by their own keys instead. |
| [#17](https://github.com/epoberezkin/fast-deep-equal/issues/17) | Circular references caused a `RangeError` (stack overflow). | New `circular` export tracks visited pairs and handles cycles. The default `equal` stays allocation-free and fast. |
| [#81](https://github.com/epoberezkin/fast-deep-equal/issues/81) | Type fixes weren't shipped. | Bundled, improved types (default + `react` + `circular`), verified with `tsc --strict`. |
| — | Map/Set/TypedArray lived in a separate `es6` entry. | Folded into the default function (Node 18+ has them). |

## Exports

- **`equal(a, b)`** (default) — fast deep equality, Map/Set/TypedArray/BigInt aware, null-prototype safe. Throws on circular references (use `circular` for those).
- **`circular(a, b)`** — same, but safe against circular references (tracks visited object pairs; slightly slower).
- **`react(a, b)`** — ignores React elements' circular `_owner`. Also available as the subpath `@bybrave/fast-deep-equal2/react` for drop-in parity with `fast-deep-equal/react`.

## Migration from `fast-deep-equal`

Replace the dependency and the import. `equal` behaves the same, except comparing `Object.create(null)` objects now works instead of throwing. If you imported `fast-deep-equal/es6`, just use the default — Map/Set/TypedArray are built in. `fast-deep-equal/react` → `@bybrave/fast-deep-equal2/react`.

## Support

If this package saves you time, you can support maintenance:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy%20me%20a%20coffee-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/bybrave)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-BTC-F7931A?logo=bitcoin&logoColor=white)](#support)

Bitcoin (BTC): `bc1q37557q5jpeaxqydzwvf3jgj7zhnfpn2td3q40q`

## Credits & license

MIT, same as the original — see [LICENSE](./LICENSE).
Based on [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) by Evgeny Poberezkin.

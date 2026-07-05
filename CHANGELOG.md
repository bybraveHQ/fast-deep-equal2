# Changelog

Maintained fork of [epoberezkin/fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) (no upstream release since 2020). The default `equal` export remains the same fast, allocation-free type guard.

## 4.0.0 — 2026-07-05

### Added
- `circular` export that tracks visited pairs to safely compare structures with circular references (#17).
- Bundled, improved TypeScript types for the `default`, `react`, and `circular` exports, verified with `tsc --strict` (#81).
- Single ESM build with a `/react` subpath (drop-in for `fast-deep-equal/react`).

### Fixed
- **#49 / #111 — null-prototype crash.** Comparing `Object.create(null)` objects threw `a.valueOf is not a function`. `valueOf`/`toString` are now called only when actually overridden and callable, so null-prototype objects compare by their own keys.

### Unchanged
- The default `equal` export stays fast and allocation-free, and throws `RangeError` on circular structures as before (use the `circular` export for cycle-safe comparison).
- Map, Set, TypedArray, and BigInt are compared by the default function directly — no separate `es6` entry point is needed.

'use strict';

var envHasBigInt64Array = typeof BigInt64Array !== 'undefined';

// Build a deep-equality function with compile-time flags baked in, so the hot
// path carries no per-call option overhead. `react` skips React elements'
// circular `_owner`; `cycles` tracks visited object pairs to survive circular
// references (#17).
function build(react, cycles) {
  return function equal(a, b, seen) {
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
      if (a.constructor !== b.constructor) return false;

      var length, i, keys;

      if (cycles) {
        if (!seen) seen = new WeakMap();
        var seenB = seen.get(a);
        if (seenB) {
          // If we've already started comparing this pair, assume equal to break
          // the cycle; a real mismatch elsewhere will still surface.
          if (seenB.has(b)) return true;
          seenB.add(b);
        } else {
          seenB = new WeakSet();
          seenB.add(b);
          seen.set(a, seenB);
        }
      }

      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (!equal(a[i], b[i], seen)) return false;
        return true;
      }

      if ((a instanceof Map) && (b instanceof Map)) {
        if (a.size !== b.size) return false;
        for (i of a.entries())
          if (!b.has(i[0])) return false;
        for (i of a.entries())
          if (!equal(i[1], b.get(i[0]), seen)) return false;
        return true;
      }

      if ((a instanceof Set) && (b instanceof Set)) {
        if (a.size !== b.size) return false;
        for (i of a.entries())
          if (!b.has(i[0])) return false;
        return true;
      }

      if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (a[i] !== b[i]) return false;
        return true;
      }

      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      // Only defer to valueOf/toString when the object actually overrides them
      // AND they are callable — objects created with `Object.create(null)` have
      // neither, and calling a missing valueOf used to throw (#49/#111).
      if (a.valueOf !== Object.prototype.valueOf && typeof a.valueOf === 'function')
        return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString && typeof a.toString === 'function')
        return a.toString() === b.toString();

      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0;)
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

      for (i = length; i-- !== 0;) {
        var key = keys[i];

        if (react && key === '_owner' && a.$$typeof) {
          // React elements' _owner contains circular references and is not part
          // of the element's identity.
          continue;
        }

        if (!equal(a[key], b[key], seen)) return false;
      }

      return true;
    }

    // true if both NaN, false otherwise
    return a !== a && b !== b;
  };
}

// eslint keeps envHasBigInt64Array referenced for parity with upstream's es6 build.
void envHasBigInt64Array;

var equal = build(false, false);
var react = build(true, false);
var circular = build(false, true);

export default equal;
export {equal, react, circular};

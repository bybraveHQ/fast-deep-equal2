declare function equal<T>(a: any, b: T): a is T;

export default equal;
export {equal};

/**
 * Deep equality that ignores React elements' circular `_owner` field.
 */
export function react<T>(a: any, b: T): a is T;

/**
 * Deep equality that is safe against circular references (tracks visited
 * object pairs). Slightly slower than the default `equal`.
 */
export function circular<T>(a: any, b: T): a is T;

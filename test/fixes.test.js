import {test} from 'node:test'
import assert from 'node:assert'
import equal, {react, circular} from '../index.js'

// #49 / #111 — objects with a null prototype no longer throw.
test('#49: two equal null-prototype objects', () => {
    const a = Object.create(null)
    a.x = 1
    const b = Object.create(null)
    b.x = 1
    assert.strictEqual(equal(a, b), true)
})

test('#49: null-prototype objects with different values', () => {
    const a = Object.create(null)
    a.x = 1
    const b = Object.create(null)
    b.x = 2
    assert.strictEqual(equal(a, b), false)
})

test('#49: null-prototype vs plain object differ by constructor', () => {
    assert.strictEqual(equal(Object.create(null), {}), false)
    assert.strictEqual(equal({}, Object.create(null)), false)
})

test('#49: nested null-prototype objects', () => {
    const a = Object.create(null)
    a.inner = Object.create(null)
    a.inner.v = 1
    const b = Object.create(null)
    b.inner = Object.create(null)
    b.inner.v = 1
    assert.strictEqual(equal(a, b), true)
})

// #17 — circular variant survives cycles; default is fast (and throws on cycles).
test('#17: circular handles a self-referencing pair', () => {
    const a = {v: 1}
    a.self = a
    const b = {v: 1}
    b.self = b
    assert.strictEqual(circular(a, b), true)
})

test('#17: circular detects a real difference behind a cycle', () => {
    const a = {v: 1}
    a.self = a
    const b = {v: 2}
    b.self = b
    assert.strictEqual(circular(a, b), false)
})

test('#17: circular handles mutual references', () => {
    const a1 = {}, a2 = {}
    a1.other = a2
    a2.other = a1
    const b1 = {}, b2 = {}
    b1.other = b2
    b2.other = b1
    assert.strictEqual(circular(a1, b1), true)
})

test('#17: default equal throws on cycles (by design)', () => {
    const a = {}
    a.self = a
    const b = {}
    b.self = b
    assert.throws(() => equal(a, b), RangeError)
})

test('#17: circular still works on acyclic data', () => {
    assert.strictEqual(circular({a: [1, 2, {b: 3}]}, {a: [1, 2, {b: 3}]}), true)
    assert.strictEqual(circular({a: 1}, {a: 2}), false)
})

// react — ignores the circular _owner of React elements.
test('react: ignores _owner on react elements', () => {
    const el1 = {$$typeof: Symbol.for('react.element'), type: 'div', props: {x: 1}, _owner: {a: 1}}
    const el2 = {$$typeof: Symbol.for('react.element'), type: 'div', props: {x: 1}, _owner: {b: 2}}
    assert.strictEqual(react(el1, el2), true)
})

test('react: still compares non-owner fields', () => {
    const el1 = {$$typeof: Symbol.for('react.element'), type: 'div', props: {x: 1}, _owner: {a: 1}}
    const el2 = {$$typeof: Symbol.for('react.element'), type: 'span', props: {x: 1}, _owner: {a: 1}}
    assert.strictEqual(react(el1, el2), false)
})

test('react: plain equal still compares _owner', () => {
    assert.strictEqual(equal({_owner: {a: 1}}, {_owner: {b: 2}}), false)
})

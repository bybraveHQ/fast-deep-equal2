import {test} from 'node:test'
import assert from 'node:assert'
import equal, {react} from '../index.js'

// Ported from the original spec/react.spec.js, which relied on react +
// react-test-renderer + sinon. The behaviour under test is: the react-aware
// variant ignores an element's `_owner` field (which React fills with a
// circular reference to the owning fiber), so two structurally-equal elements
// compare equal without recursing into the cyclic owner.
//
// We reproduce React element shape as plain objects with `$$typeof` set and a
// circular `_owner`, avoiding the external dependencies.

const REACT_ELEMENT = Symbol.for('react.element')

function reactElement(type, props) {
  const el = {
    $$typeof: REACT_ELEMENT,
    type,
    key: null,
    ref: null,
    props,
    _owner: null
  }
  // Give it a circular owner, like React does: owner references the element,
  // which references the owner. Traversing it without skipping `_owner` would
  // blow the stack (the default `equal` has no cycle guard).
  const owner = {stateNode: null}
  owner.element = el
  el._owner = owner
  return el
}

test('react: element with circular _owner compares without throwing', () => {
  const a = reactElement('h1', {title: 'Hello'})
  const b = reactElement('h1', {title: 'Hello'})
  assert.doesNotThrow(() => react(a, b))
})

test('react: elements of same type and props are equal', () => {
  const a = reactElement('h1', {title: 'Hello'})
  const b = reactElement('h1', {title: 'Hello'})
  assert.strictEqual(react(a, b), true)
  assert.strictEqual(react(b, a), true)
})

test('react: elements of same type with different props are not equal', () => {
  const a = reactElement('h1', {title: 'Hello'})
  const b = reactElement('h1', {title: 'New'})
  assert.strictEqual(react(a, b), false)
  assert.strictEqual(react(b, a), false)
})

test('react: nested children with circular owners are equal', () => {
  const a = reactElement('div', {
    children: [reactElement('h1', {title: 't'}), reactElement('h2', {title: 's'})]
  })
  const b = reactElement('div', {
    children: [reactElement('h1', {title: 't'}), reactElement('h2', {title: 's'})]
  })
  assert.strictEqual(react(a, b), true)
})

test('react: default equal recurses into circular _owner (guard is react-only)', () => {
  // Sanity check that _owner really is cyclic: the plain `equal` variant, which
  // does not skip _owner, blows up on the circular reference. This proves the
  // react variant's skip is what makes the comparison above succeed.
  const a = reactElement('h1', {title: 'Hello'})
  const b = reactElement('h1', {title: 'Hello'})
  assert.throws(() => equal(a, b), RangeError)
})

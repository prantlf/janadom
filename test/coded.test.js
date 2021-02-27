const test = require('@prantlf/baretest')('coded')
const assert = require('assert')
const { document, DocumentFragment, Event } = require('./dom/dom-globals')
const { createEl, createRef } = require('..')

test('a tag name', () => {
  const el = createEl('div', null)
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an element factory', () => {
  const div = document.createElement('div')
  function HTMLDivElement() {
    return div
  }

  const el = createEl(HTMLDivElement, null)
  assert.strictEqual(el, div)
})

test('a document fragment', () => {
  const el = createEl(DocumentFragment, null)
  assert.ok(el instanceof DocumentFragment)
})

test('a template', () => {
  const child = document.createElement('span')
  const el = createEl('template', null, child)
  assert.strictEqual(el.outerHTML, '<template><span></span></template>')
})

test('an attribute with a string value', () => {
  const el = createEl('div', { title: 'test' })
  assert.strictEqual(el.outerHTML, '<div title="test"></div>')
})

test('an attribute with a number value', () => {
  const el = createEl('div', { tabindex: 1 })
  assert.strictEqual(el.outerHTML, '<div tabindex="1"></div>')
})

test('an attribute without a true value', () => {
  const el = createEl('div', { disabled: true })
  assert.strictEqual(el.outerHTML, '<div disabled=""></div>')
})

test('an attribute with a false value', () => {
  const el = createEl('div', { disabled: false })
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an attribute with a null value', () => {
  const el = createEl('div', { title: null })
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an attribute with an undefined value', () => {
  const el = createEl('div', { title: undefined })
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an attribute with an invalid value', () => {
  try {
    const el = createEl('div', { title: Symbol('test') })
    assert.fail('invalid attribute accepted')
  } catch {
    assert.ok(true)
  }
})

test('a value attribute starting with "on"', () => {
  const el = createEl('div', { once: true })
  assert.strictEqual(el.outerHTML, '<div once=""></div>')
})

test('a value attribute called "ref"', () => {
  const el = createEl('div', { ref: "true" })
  assert.strictEqual(el.outerHTML, '<div ref="true"></div>')
})

test('a style attribute as a string', () => {
  const el = createEl('div', { style: 'display: inline-block' })
  assert.strictEqual(el.outerHTML, '<div style="display: inline-block"></div>')
})

test('a style attribute as an object', () => {
  const el = createEl('div', { style: { display: 'inline-block' } })
  assert.strictEqual(el.outerHTML, '<div style="display: inline-block"></div>')
})

test('an event attribute', () => {
  const dispatched = new Event('click')
  let received
  const el = createEl('div', { onclick: event => received = event })
  assert.strictEqual(el.outerHTML, '<div></div>')
  el.dispatchEvent(dispatched)
  assert.strictEqual(received, dispatched)
})

test('an event attribute with an upper-case letter', () => {
  const dispatched = new Event('click')
  let received
  const el = createEl('div', { onClick: event => received = event })
  assert.strictEqual(el.outerHTML, '<div></div>')
  el.dispatchEvent(dispatched)
  assert.strictEqual(received, dispatched)
})

test('an event attribute with use capture enabled', () => {
  const dispatched = new Event('click')
  const received = []
  const el = createEl('div', {
    onClickCapture: event => received.push({ captured: true, event }),
    onClick: event => received.push({ triggered: true, event })
  })
  assert.strictEqual(el.outerHTML, '<div></div>')
  el.dispatchEvent(dispatched)
  assert.strictEqual(received.length, 2)
  assert.strictEqual(received[0].captured, true)
  assert.strictEqual(received[0].event, dispatched)
  assert.strictEqual(received[1].triggered, true)
  assert.strictEqual(received[1].event, dispatched)
})

test('an element reference with object', () => {
  const ref = createRef()
  const el = createEl('div', { ref })
  assert.strictEqual(el.outerHTML, '<div></div>')
  assert.strictEqual(ref.current, el)
})

test('an element reference with function', () => {
  let ref
  const el = createEl('div', { ref: el => ref = el })
  assert.strictEqual(el.outerHTML, '<div></div>')
  assert.strictEqual(ref, el)
})

test('an element as a child', () => {
  const child = document.createElement('span')
  const el = createEl('div', null, child)
  assert.strictEqual(el.outerHTML, '<div><span></span></div>')
})

test('two elements as children', () => {
  const child = document.createElement('span')
  const hr = document.createElement('hr')
  const el = createEl('div', null, child, hr)
  assert.strictEqual(el.outerHTML, '<div><span></span><hr></div>')
})

test('two elements as an array', () => {
  const child = document.createElement('span')
  const hr = document.createElement('hr')
  const el = createEl('div', null, [child, hr])
  assert.strictEqual(el.outerHTML, '<div><span></span><hr></div>')
})

test('a string value as a child', () => {
  const el = createEl('div', null, 'test')
  assert.strictEqual(el.outerHTML, '<div>test</div>')
})

test('a boolean value as a child', () => {
  const el = createEl('div', null, true)
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('a number value as a child', () => {
  const el = createEl('div', null, 1)
  assert.strictEqual(el.outerHTML, '<div>1</div>')
})

test('a null value as a child', () => {
  const el = createEl('div', null, null)
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an undefined value as a child', () => {
  const el = createEl('div', null, undefined)
  assert.strictEqual(el.outerHTML, '<div></div>')
})

if (module === require.main) test.run()
else module.exports = test

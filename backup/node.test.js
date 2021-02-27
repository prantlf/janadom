const test = require('tape')
const {
  document, DocumentFragment, HTMLTemplateElement, HTMLDivElement, getFirstEventListener
} = require('./dom/dom-globals')
const { createEl } = require('..')

test('an element class', t => {
  const el = createEl(HTMLDivElement, null)
  t.ok(el instanceof HTMLDivElement)
  t.end()
})

test('a document fragment', t => {
  const el = createEl(DocumentFragment, null)
  t.ok(el instanceof DocumentFragment)
  t.end()
})

test('a template', t => {
  const el = createEl(HTMLTemplateElement, null)
  t.ok(el instanceof HTMLTemplateElement)
  t.end()
})

test('an empty element', t => {
  const el = createEl('div', null)
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

test('an attribute with a string value', t => {
  const el = createEl('div', { title: 'test' })
  t.equal(el.outerHTML, '<div title="test"></div>')
  t.end()
})

test('an attribute with a number value', t => {
  const el = createEl('div', { tabindex: 1 })
  t.equal(el.outerHTML, '<div tabindex="1"></div>')
  t.end()
})

test('an attribute without a true value', t => {
  const el = createEl('div', { disabled: true })
  t.equal(el.outerHTML, '<div disabled=""></div>')
  t.end()
})

test('an attribute with a false value', t => {
  const el = createEl('div', { disabled: false })
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

test('an attribute with a null value', t => {
  const el = createEl('div', { title: null })
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

test('an attribute with an undefined value', t => {
  const el = createEl('div', { title: undefined })
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

test('a value attribute starting with "on"', t => {
  const el = createEl('div', { once: true })
  t.equal(el.outerHTML, '<div once=""></div>')
  t.end()
})

test('a value attribute called "ref"', t => {
  const el = createEl('div', { ref: "true" })
  t.equal(el.outerHTML, '<div ref="true"></div>')
  t.end()
})

test('a style attribute as a string', t => {
  const el = createEl('div', { style: 'display: inline-block' })
  t.equal(el.outerHTML, '<div style="display: inline-block"></div>')
  t.end()
})

test('a style attribute as an object', t => {
  const el = createEl('div', { style: { display: 'inline-block' } })
  t.equal(el.outerHTML, '<div style="display: inline-block"></div>')
  t.end()
})

test('an event attribute', t => {
  const handler = t => {}
  const el = createEl('div', { onclick: handler })
  t.equal(el.outerHTML, '<div></div>')
  const listener = getFirstEventListener(el, 'click')
  t.equal(listener.handler, handler)
  t.equal(listener.useCapture, false)
  t.end()
})

test('an event attribute with an upper-case letter', t => {
  const handler = t => {}
  const el = createEl('div', { onClick: handler })
  t.equal(el.outerHTML, '<div></div>')
  const listener = getFirstEventListener(el, 'click')
  t.equal(listener.handler, handler)
  t.equal(listener.useCapture, false)
  t.end()
})

test('an event attribute with use capture enabled', t => {
  const handler = t => {}
  const el = createEl('div', { onClickCapture: handler })
  t.equal(el.outerHTML, '<div></div>')
  const listener = getFirstEventListener(el, 'click')
  t.equal(listener.handler, handler)
  t.equal(listener.useCapture, true)
  t.end()
})

test('an element reference', t => {
  let ref
  const el = createEl('div', { ref: el => ref = el })
  t.equal(el.outerHTML, '<div></div>')
  t.equal(ref, el)
  t.end()
})

test('an element as a child', t => {
  const child = document.createElement('span')
  const el = createEl('div', null, child)
  t.equal(el.outerHTML, '<div><span></span></div>')
  t.end()
})

test('two elements as children', t => {
  const child = document.createElement('span')
  const hr = document.createElement('hr')
  const el = createEl('div', null, child, hr)
  t.equal(el.outerHTML, '<div><span></span><hr></div>')
  t.end()
})

test('a string value as a child', t => {
  const el = createEl('div', null, 'test')
  t.equal(el.outerHTML, '<div>test</div>')
  t.end()
})

test('a boolean value as a child', t => {
  const el = createEl('div', null, true)
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

test('a number value as a child', t => {
  const el = createEl('div', null, 1)
  t.equal(el.outerHTML, '<div>1</div>')
  t.end()
})

test('a null value as a child', t => {
  const el = createEl('div', null, null)
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

test('an undefined value as a child', t => {
  const el = createEl('div', null, undefined)
  t.equal(el.outerHTML, '<div></div>')
  t.end()
})

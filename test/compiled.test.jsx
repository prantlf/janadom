import suite from '@prantlf/baretest'
import assert from 'assert'
import { Event } from './dom/dom-globals'
import { createEl, createRef } from '..'

const test = suite('compiled')

test('a static tag name', () => {
  const el = <div></div>
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('a dynamic tag name', () => {
  const Name = 'div'
  const el = <Name />
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an svg tag name', () => {
  const el = <svg></svg>
  assert.strictEqual(el.outerHTML, '<svg></svg>')
})

test('an element factory', () => {
  function HTMLDivElement() {
    return <div></div>
  }

  const el = <HTMLDivElement />
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('a document fragment', () => {
  const el = <><span></span><span></span></>
  assert.strictEqual(el.outerHTML, '<span></span><span></span>')
})

test('a template', () => {
  const el = <template><hr /></template>
  assert.strictEqual(el.outerHTML, '<template><hr></template>')
})

test('an invalid type', () => {
  const Invalid = true
  try {
    <Invalid />
    assert.fail('invalid type accepted')
  } catch {
    assert.ok(true)
  }
})

test('an attribute with a literal', () => {
  const el = <div title="test"></div>
  assert.strictEqual(el.outerHTML, '<div title="test"></div>')
})

test('an attribute with a string value', () => {
  const el = <div title={ 'test' }></div>
  assert.strictEqual(el.outerHTML, '<div title="test"></div>')
})

test('a xlink attribute', () => {
  const el = <use xlink:href="http://localhost"></use>
  assert.strictEqual(el.outerHTML, '<use xlink:href="http://localhost"></use>')
})

test('an attribute with a number value', () => {
  const el = <div tabindex={ 1 }></div>
  assert.strictEqual(el.outerHTML, '<div tabindex="1"></div>')
})

test('an attribute with a true value', () => {
  const el = <div disabled={ true }></div>
  assert.strictEqual(el.outerHTML, '<div disabled=""></div>')
})

test('an attribute with a false value', () => {
  const el = <div disabled={ false }></div>
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an attribute without a true value', () => {
  const el = <div disabled></div>
  assert.strictEqual(el.outerHTML, '<div disabled=""></div>')
})

test('an attribute with an invalid value', () => {
  try {
    <div title={ Symbol('test') }></div>
    assert.fail('invalid attribute accepted')
  } catch {
    assert.ok(true)
  }
})

test('a value attribute starting with "on"', () => {
  const el = <div once=""></div>
  assert.strictEqual(el.outerHTML, '<div once=""></div>')
})

test('a value attribute called "ref"', () => {
  const el = <div ref="true"></div>
  assert.strictEqual(el.outerHTML, '<div ref="true"></div>')
})

test('a style attribute as a string', () => {
  const el = <div style="display: inline-block"></div>
  assert.strictEqual(el.outerHTML, '<div style="display: inline-block"></div>')
})

test('a style attribute as an object', () => {
  const el = <div style={ { display: 'inline-block'} }></div>
  assert.strictEqual(el.outerHTML, '<div style="display: inline-block"></div>')
})

test('attributes as an object', () => {
  const attrs = { title: 'test' }
  const el = <div { ...attrs }></div>
  assert.strictEqual(el.outerHTML, '<div title="test"></div>')
})

test('an event attribute', () => {
  const dispatched = new Event('click')
  let received
  const el = <div onclick={ event => received = event }></div>
  assert.strictEqual(el.outerHTML, '<div></div>')
  el.dispatchEvent(dispatched)
  assert.strictEqual(received, dispatched)
})

test('an event attribute with an upper-case letter', () => {
  const dispatched = new Event('click')
  let received
  const el = <div onClick={ event => received = event }></div>
  assert.strictEqual(el.outerHTML, '<div></div>')
  el.dispatchEvent(dispatched)
  assert.strictEqual(received, dispatched)
})

test('an event attribute with use capture enabled', () => {
  const dispatched = new Event('click')
  const received = []
  const el = <div
    onClickCapture={ event => received.push({ captured: true, event }) }
    onClick={ event => received.push({ triggered: true, event }) }
  ></div>
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
  const el = <div ref={ ref }></div>
  assert.strictEqual(el.outerHTML, '<div></div>')
  assert.strictEqual(ref.current, el)
})

test('an element reference with function', () => {
  let ref
  const el = <div ref={ el => ref = el }></div>
  assert.strictEqual(el.outerHTML, '<div></div>')
  assert.strictEqual(ref, el)
})

test('an element as a child', () => {
  const el = <div><span></span></div>
  assert.strictEqual(el.outerHTML, '<div><span></span></div>')
})

test('two elements as children', () => {
  const el = <div><span></span><hr /></div>
  assert.strictEqual(el.outerHTML, '<div><span></span><hr></div>')
})

test('two elements as an array', () => {
  function Children() {
    return [<span></span>, <hr />]
  }

  const el = <div><Children /></div>
  assert.strictEqual(el.outerHTML, '<div><span></span><hr></div>')
})

test('element as a child', () => {
  function Repeat(props, ...children) {
    const items = []
    for (let i = 0, l = props.count; i < l; ++i) {
      for (const child of children) items.push(child(i))
    }
    return <div>{ items }</div>
  }

  const el = <Repeat count={ 2 }>{ index => <span>{ index }</span> }</Repeat>
  assert.strictEqual(el.outerHTML, '<div><span>0</span><span>1</span></div>')
})

test('elements as children', () => {
  function Item(props) {
    return <li>{ props.message }</li>
  }

  const todos = ['start', 'finish']
  const el = <ul>{ todos.map(message => <Item message={ message } />) }</ul>
  assert.strictEqual(el.outerHTML, '<ul><li>start</li><li>finish</li></ul>')
})

test('a property as a child', () => {
  const title = 'test'
  const el = <div>{ title }</div>
  assert.strictEqual(el.outerHTML, '<div>test</div>')
})

test('a literal as a child', () => {
  const el = <div>test</div>
  assert.strictEqual(el.outerHTML, '<div>test</div>')
})

test('a string value as a child', () => {
  const el = <div>{ 'test' }</div>
  assert.strictEqual(el.outerHTML, '<div>test</div>')
})

test('a true value as a child', () => {
  const el = <div>{ true }</div>
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('a false value as a child', () => {
  const el = <div>{ false }</div>
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('a null value as a child', () => {
  const el = <div>{ null }</div>
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('an undefined value as a child', () => {
  const el = <div>{ undefined }</div>
  assert.strictEqual(el.outerHTML, '<div></div>')
})

test('a number value as a child', () => {
  const el = <div>{ 1 }</div>
  assert.strictEqual(el.outerHTML, '<div>1</div>')
})

if (module === require.main) test.run()
export default test

import svgTags from './svg-tags'

// Either an element (`HTMLElement` or `SVGElement`) with attributes and children,
// or a `DocumentFragment` with children only, returned from `createEl` either
// by `document.createElement` or `Factory`.
export type Parent = Element | DocumentFragment

// An event listener expected for `on*` attibutes and passed to `addEventListener`.
export type Listener = (e: Event) => void

// An element callback for pinning an element to a variable using the `ref` attribute.
export type Setter = (el: Element) => void

// A function returning a `Parent` object for the specified properties and children.
export type Factory = (props: Props, ...children: Child[]) => Parent

// A source for creation of an element used by `createEl`. The `string` has to start
// with a lower-case letter to differ from `Factory`, which has to start with an
// upper-case letter. The `string` will be passed to `createElement`.
export type Type = string | typeof DocumentFragment | Factory

// A host for an element. Convenience wrapper for elements grabbed by `ref` properties.
export type Ref = { current: null | Element }

// A value of a property expected by `createEl` to create attributes and handle
// attribute-like constructs (event listeners and element setters).
export type PropValue = undefined | null | AttrValue | Listener | Setter | Ref

// Properties as expected by `createEl` to create attributes and handle
// attribute-like constructs (event listeners and element setters).
export type Props = { [key: string]: PropValue }

// A value for an attribute if the property handler ends up with `setAttribute`.
// The `string` is used as-is, the `number` is converted to a string by `toString`
// and the `boolean` is converted to an empty string (`true`) or to a call to
// `removeAttribute` (`false`).
export type AttrValue = string | number | boolean

// A body of an element as one item or an array of multiple items. The `string`
// and `number` will be converted in the same way as attribute values. Except
// for them and an element instance, all other value types will be ignored.
// Other values may be returned from expressions that only sometimes lead to a
// child like `(condition && element)`, where the `condition` evaluates to `false`.
export type Child = Element | string | number | any | Child[]

// Creates an object that can host an element to be used in a `ref` property.
export function createRef(el: null | Element = null): Ref {
  return { current: el }
}

// Creates an element, with attributes and children according to the input parameters.
export function createEl(type: Type, props: Props, ...children: Child[]): Parent {
  let el
  if (typeof type === 'string') {
    el = svgTags.includes(type)
      ? document.createElementNS('http://www.w3.org/2000/svg', type)
      : document.createElement(type)
  } else if (type === DocumentFragment) {
    el = document.createDocumentFragment()
  } else if (typeof type === 'function') {
    return (type as Factory)(props, ...children)
  } else {
    throw new TypeError(`invalid element type ${type}`)
  }

  for (const name in props) {
    const value = props[name]
    if (value != null && value !== false) {
      if (name === 'ref') {
        if (typeof value === 'object') (value as Ref).current = el
        else if (typeof value === 'function') value(el)
        else setAttr(el, name, value)
      } else if (name === 'style') {
        if (typeof value !== 'object') setAttr(el, name, value as AttrValue)
        else Object.assign(el.style, value)
      } else if (name.startsWith('on') && typeof value === 'function') {
        listenTo(el, name, value as Listener)
      } else {
        setAttr(el, name, value as AttrValue)
      }
    }
  }

  const parent = el instanceof HTMLTemplateElement ? el.content : el
  for (const child of children) appendChild(parent, child)

  return el
}

function setAttr(el: Element, name: string, value: AttrValue): void {
  if (typeof value === 'string') {
    if (name.startsWith('xlink:'))
      el.setAttributeNS( 'http://www.w3.org/1999/xlink', name, value)
    else
      el.setAttribute(name, value)
  } else if (typeof value === 'number') {
    el.setAttribute(name, value.toString())
  } else if (typeof value === 'boolean') {
    el.setAttribute(name, '')
  } else {
    throw new TypeError(`invalid attribute type ${typeof value} for ${name}`)
  }
}

function listenTo(el: Element, name: string, listener: Listener): void {
  let useCapture: boolean
  if (name.endsWith('Capture')) {
    name = name.substring(2, name.length - 7)
    useCapture = true
  } else {
    name = name.substr(2)
  }
  el.addEventListener(name.toLowerCase(), listener, useCapture)
}

function appendChild(parent: Parent, child: Child): void {
  if (typeof child === 'string')
    parent.appendChild(document.createTextNode(child))
  else if (typeof child === 'number')
    parent.appendChild(document.createTextNode(child.toString()))
  else if (child instanceof Element)
    parent.appendChild(child)
  else if (Array.isArray(child))
    for (const grandchild of child) appendChild(parent, grandchild)
}

// Either an element (`HTMLElement` or `SVGElement`) with attributes and children,
// or a `DocumentFragment` with children only, returned from `createEl` either
// by `Creatable` or `Factory`.
export type Parent = Element | DocumentFragment

// An event listener expected for `on*` attibutes and passed to `addEventListener`.
export type Listener = (e: Event) => void

// An element callback for pinning an element to a variable using the `ref` attribute.
export type Setter = (el: Element) => void

// A class descending from `Parent` with a default constructor.
export type Creatable = { new(): Parent }

// A function returning a `Parent` object for the specified properties and children.
export type Factory = (props: Props, ...children: Child[]) => Parent

// A source for creation of an element used by `createEl`. The `string` has to start
// with a lower-case letter to differ from `Creatable` and `Factory`, which have to
// start with an upper-case letter.
export type Type = string | Creatable | Factory

// A value of a property expected by `createEl` to create attributes and handle
// attribute-like constructs (event listeners and element setters).
export type PropValue = undefined | null | string | number | boolean | object | Listener | Setter

export type Props = { [key: string]: PropValue }
export type AttrValue = string | number | boolean | object
export type Child = Element | string | number | undefined | null | Child[]

export function createEl(type: Type, props: Props, ...children: Child[]): Parent {
  let el
  if (typeof type === 'string') el = document.createElement(type)
  else if (type === DocumentFragment) el = document.createDocumentFragment()
  else if (type.prototype instanceof Element) el = new (type as Creatable)()
  else if (typeof type === 'function') return (type as Factory)(props, ...children)
  else throw new TypeError(`invalid element type ${type}`)

  for (const name in props) {
    const value = props[name]
    if (value != null) {
      if (name === 'ref') {
        if (typeof value === 'function') value(el)
        else setAttr(el, name, value)
      } else if (name === 'style') {
        if (typeof value === 'object') Object.assign(el.style, value)
        else setAttr(el, name, value as AttrValue)
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
    if (name === 'className') name = 'class'
    if (name === 'htmlFor') name = 'for'
    el.setAttribute(name, value)
  } else if (typeof value === 'number') {
    el.setAttribute(name, value.toString())
  } else if (typeof value === 'boolean') {
    if (value) el.setAttribute(name, '')
    else el.removeAttribute(name)
  } else if (typeof value === 'object') {
    el.setAttribute(name, JSON.stringify(value))
  } else {
    throw new TypeError(`invalid attribute type ${typeof value}`)
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
  if (typeof child === 'string') {
    parent.appendChild(document.createTextNode(child))
  } else if (typeof child === 'number') {
    parent.appendChild(document.createTextNode(child.toString()))
  } else if (child instanceof Element) {
    parent.appendChild(child)
  } else if (Array.isArray(child)) {
    for (const grandchild of child) appendChild(parent, grandchild)
  }
}

export type Type = string | { new(): HTMLElement | DocumentFragment }
export type Value = undefined | null | string | number | boolean | Function
export type Props = { [key: string]: Value }
export type AttrValue = string | number | boolean
export type Child = HTMLElement | SVGElement | string | number | Child[]
export type Parent = HTMLElement | SVGElement | DocumentFragment

const xlink = ['xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role',
  'xlink:show', 'xlink:title', 'xlink:type']

export function createEl (type: Type, props: Props, ...children: Child[]): Parent {
  let el
  if (typeof type === 'string') {
    el = document.createElement(type)
  } else if (type === DocumentFragment) {
    el = document.createDocumentFragment()
  } else if (typeof type === 'function') {
    el = new type()
  } else {
    throw new TypeError(`Element type "${typeof type}" is not supported.`)
  }

  for (let name in props) {
    let value = props[name]
    if (value === undefined || value === null) continue
    if (name === 'ref') {
      if (typeof value === 'function') value(el)
      else setAttr(el, name, value)
    } else if (name === 'style') {
      if (typeof value === 'object') Object.assign(el.style, value)
      else el.setAttribute(name, value)
    } else if (name.startsWith('on') && typeof value === 'function') {
      let useCapture
      if (name.endsWith('Capture')) {
        name = name.substring(2, name.length - 7)
        useCapture = true
      } else {
        name = name.substr(2)
      }
      el.addEventListener(name.toLowerCase(), value, useCapture)
    } else if (xlink.includes(name)) {
      el.setAttributeNS('http://www.w3.org/1999/xlink', name, value)
    } else {
      setAttr(el, name, value as AttrValue)
    }
  }

  const parent = el instanceof HTMLTemplateElement ? el.content : el
  for (const child of children) appendChild(parent, child)

  return el
}

function setAttr(el: Element, name: string, value: AttrValue) {
  if (typeof value === 'boolean') {
    if (value) el.setAttribute(name, '')
    else el.removeAttribute(name)
  } else {
    if (name === 'className') name = 'class'
    else if (name === 'htmlFor') name = 'for'
    el.setAttribute(name, String(value))
  }
}

function appendChild (parent: Parent, child: Child): void {
  if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
    parent.appendChild(document.createTextNode(String(child)))
  } else if (child instanceof HTMLElement) {
    parent.appendChild(child)
  } else if (Array.isArray(child)) {
    for (const grandchild of child) appendChild(parent, grandchild)
  } else {
    throw new TypeError(`Child type "${typeof child}" is not supported.`)
  }
}

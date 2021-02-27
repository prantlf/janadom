const { document, HTMLElement } = require('dom-lite')
const { Event } = require('./dom-events')

const { constructor: DocumentFragment } =
  Object.getPrototypeOf(document.createDocumentFragment())

class HTMLTemplateElement extends HTMLElement {
  constructor() {
    super('template')
    this.content = this // simplification for tests
  }
}

global.document = document
global.Element = HTMLElement
global.DocumentFragment = DocumentFragment
global.HTMLTemplateElement = HTMLTemplateElement
global.Event = Event

module.exports = {
  document, HTMLElement, DocumentFragment, HTMLTemplateElement, Event
}

const { HTMLElement } = require('dom-lite')

class ClassList extends Array {
  add() {
    this.push.apply(arguments)
    this.setAttribute('class', this.join(' '))
  }
}

HTMLElement.prototype.classList = new ClassList()

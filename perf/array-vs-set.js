const tagArray = require('svg-tag-names')
const { Suite } = require('benchmark')

const tagSet = new Set(tagArray)
const suite = new Suite('test')

console.log(`Comparing array.include and set.has for ${tagArray.length} items...`)
suite
  .add('array.includes', () => {
    tagArray.includes('g')
    tagArray.includes('svg')
    tagArray.includes('radialGradient')
    tagArray.includes('div')
  })
  .add('set.has', () => {
    tagSet.has('g')
    tagSet.has('svg')
    tagSet.has('radialGradient')
    tagSet.has('div')
  })
  .on('cycle', ({ target }) => console.log(`  ${String(target)}`))
  .on('complete', () =>
    console.log(`  Fastest is ${suite.filter('fastest').map('name')}`))
  .run()

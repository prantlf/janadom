## JSX Native DOM (janadom)

[![NPM version](https://badge.fury.io/js/janadom.png)](http://badge.fury.io/js/janadom)
[![Build Status](https://github.com/prantlf/janadom/workflows/Test/badge.svg)](https://github.com/prantlf/janadom/actions)
[![Dependency Status](https://david-dm.org/prantlf/janadom.svg)](https://david-dm.org/prantlf/janadom)
[![devDependency Status](https://david-dm.org/prantlf/janadom/dev-status.svg)](https://david-dm.org/prantlf/janadom#info=devDependencies)

A minimal and complete implementation of [React JSX] for creating native DOM elements. Can be used to generate dynamic HTML content on HTML pages, or to render bodies of web components.

* Supports both HTML and SVG elements.
* Tiny size - 2.41 kB minified, 1.08 kB gzipped.
* Consumable as ESM, UMD and CJS modules.
* Zero dependencies.
* Written in TypeScript.
* Tests in Node.js feasible using [dom-lite].

If you need just HTML and not SVG, have a look at the [version 0.0.1], which is only half of the full package size.

## Synopsis

```tsx
import { createEl } from 'janadom'

// Return an element instance ready to be appended to the DOM.
function render(items: string[]): HTMLElement {
  return <ul>
          { items.map(name => <li>{name}</li>) }
         </ul>
}
```

```tsx
import { createEl } from 'janadom'

@comp({ tag: 'greet-me' })
class GreetMeElement extends HTMLElement {
  // Place the content of a document fragment to the custom element.
  connectedCallback(): void {
    this.appendChild(
      <>Hello, <span class="name">{this.name}</span>!</>
    )
  }
}
```

## Installation

You can install this package using your favourite Node.js package manager:

```sh
npm i -D janadom
yarn add -D janadom
pnpm i -D janadom
```

If you do not want to bundle this package in your build output, you can load it separately on your web page before your script bundle:

```html
<script src=https://unpkg.com/janadom@0.1.0/dist/index.umd.min.js></script>
<script src=build/index.js></script>
```

## Configuration

If you write TypeScript and compile with `tsc`, you can configure the JSX processing in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "createEl",
    "jsxFragmentFactory": "DocumentFragment",
    ...
  }
}
```

If you write JavaScript or TypeScript and compile with `esbuild`, you can use either command-line parameters, or `tsconfig.json` with the content as described above:

    esbuild --jsx-factory=createEl --jsx-fragment=DocumentFragment source.jsx
    esbuild --tsconfig=tsconfig.json source.tsx

If you use other compiler that supports JSX, find out how to configure factories for an element and a document fragment with the following values:

    element factory:           createEl         (named export from `janadom`)
    document fragment factory: DocumentFragment (built-in DOM class name)

For example, if you use `swc`, follow [their documentation](https://swc.rs/docs/configuring-swc/#jsctransform).

## Usage

The element factory is the function `createEl`, a named export of this package. The easiest way is to import it in the source files where you use JSX:

```jsx
import { createEl } from 'janadom'
```

If you load this package on the page separately, or if you include it in your output JavaScript bundle by a custom build step, you can just declare it as a built-in global, so tha the compiler will not complain:

```jsx
/* global createEl */
```

If the identifier `createEl` is already used in your code, you can rename the imported function and specify the changed name in the compiler configuration as [described above](#configuration):

```jsx
import { createEl as newElement } from 'janadom'
```

The document fragment factory is the function object `DocumentFragment`, which is a built-in global identifier. If the compiler complains about an unknown identifier, set the browser as the output target.

## API

This package exposes the following functions as named exports - `createEl` and `createRef`.

```ts
createEl(
  type: string | typeof DocumentFragment |
        (props: Props, ...children: Child[]) => Parent,
  props: { [key: string]: undefined | null | string | number | boolean |
                          (e: Event) => void | (el: Element) => void |
                          { current: null | Element } },
  ...children: Element | string | number | any | Child[]
): Element | DocumentFragment
```

The `createEl` is called from the transpiled code that the compiler translates the JSX to. It is a factory that returns an element created using the `type`, `props` and `children` arguments. For example, the JSX input and the transpiled JavaScript output:

```tsx
// Input JSX
<div id="test"><span>test</span><hr /></div>
// Output JavaScript
createEl('div', { id: 'test' },
  createEl('span', null, 'test'),
  createEl('hr', null)
)
// Output JavaScript
// Renders <div id="test"><span>test</span><hr></div>
```

```ts
createRef(el: null | Element = null): { current: null | Element }
```

The `createRef` is used in the (written) source code to create an object, which will host a DOM element pointing to an element created by the JSX code. It is a convenient way how to locate elements in the generated DOM withtou querying for them later. See [element references](#references) for more information.

See also the documentation of [React JSX] for a full reference of the JSX syntax.

### Element Type

Start with a lower-case letter to specify a tag name:

```jsx
<p>JSX is fun!</p>
```

Start with an upper-case letter to specify a custom factory name:

```jsx
<FormattedName firstName="John" lastName="Doe" />
```

The factory is a function that returns an element and gets an object with properties and child elements as variadic arguments. You can use JSX in it too:

```js
function FormattedName({ firstName, lastName }) {
  return <span class="name">{firstName} {lastName}</span>
}
```

Use an empty tag name to specify a document fragment, if you need to return multiple elements without a single root from a function, which you will append to a parent element later:

```jsx
<>
  <span class="icon icon-open"></span>
  <span>
</>
```

Values of other types passed as the opening tag will be rejected by throwing an error.

### Attributes

Properties with primitive values are rendered as attributes. Property names will be used as attribute names without any changes. Property values will be converted to attribute values according to the following rules:

| Type                  | Operation                                         |
|-----------------------|---------------------------------------------------|
| `string`              | printed as-is                                     |
| `number`              | converted to string                               |
| `boolean`             | converts to `""` if `true` otherwise not rendered |
| `null` or `undefined` | ignored, not rendered                             |
| anything else         | fails by throwing an error                        |

```jsx
<p id={'text'}>...</p>
// Renders <p id="text">...</p>

<button tabindex={1}>...</button>
// Renders <button tabindex="1">...</button>

<input type="checkbox" checked={true} />
// Renders <input type="checkbox" checked>

let forceDownload = true
let fileName = 'test.txt'
<a href="..." download={forceDownload && fileName}>...</a>
// Renders <a href="..." download="test.txt">...</a>

let className
<div class={className}>...</div>
// Renders <div>...</div>
```

You can set multiple attributes by passing an object literal after the element type or using the spread operator with an object:

```jsx
<button {{ id: 'stop', tabindex: 2 }}>...</button>
// Renders <button id="stop" tabindex="1">...</button>

let props = { id: 'stop', tabindex: 2 }
<button {...props}>...</button>
// Renders <button id="stop" tabindex="1">...</button>
```

The object does not have to contain only attributes with primitive values, but also properties with special handling like [style objects](#styles), [element references](#references) and [event listeners](#events) described below.

### Styles

The value of the `style` property attribute can be either a `string`:

```jsx
<p style="display:none">...</p>
// Renders <p style="display:none">...</p>
```

...or an `object` with [CSS properties]:

```jsx
<p style={{ margin: '10px'; color: 'red' }}>...</p>
// Renders <p style="margin: 10px; color: red;">...</p>
```

### Events

Event listeners can be attached by properties starting with `on` and ending with the (case-insensitive) event name:

```jsx
function handleClick(e) {
  e.preventDefault()
  ...
}

<button onclick={handleClick}>...</button>
```

Capturing events can be specified by appending `Capture` (cese-sensitive) to the property name:

```jsx
<button id="stop" onClickCapture={e => console.log(`on ${e.target.id}`)}>...</button>
```

If the value of an `on*` property is not a `function`, it will be rendered as an attribute using the [rules described above](#attributes).

### References

If you want to grab an element and store it in a variable, you can use the `ref` attribute. It expects a function callback, which will obtain the element as an argument:

```jsx
let title
<h2 ref={el => title = el}>...</h2>
```

You can use the variable to access the element in an event handler later, for example, without having to search for it using the element's selector. Because grabbing an element is needed so often, you can shorten it by passing a reference object created by `createRef`:

```jsx
import { createEl, createRef } from 'janadom'

let title = createRef()
<h2 ref={title}>...</h2>
// title.current will point to the element instance
```

### Children

Children of an element can be specified between the opening and closing tags. They can be either elements, document fragments, primitive values or arrays, which will be converted to text nodes using the following rules:

| Type                  | Operation                                        |
|-----------------------|--------------------------------------------------|
| `string`              | printed as-is                                    |
| `number`              | converted to string                              |
| `Array`               | processed recursively child-by-child (flattened) |
| anything else         | ignored, not rendered                            |

```jsx
<p>{'text'}</p>
// Renders <p>text</p>

<span>Count {1}</span>
// Renders <span>Count 1</span>

let isSecret = true
let value = 'password'
<span>{isSecret || value}</span>
// Renders <span></span>

let children
<div>{children}</div>
// Renders <div></div>
```


## Differences from React

No need to use `className` and `htmlFor` as property names. Just use the standard attribute names `class` and `for`. For example:

```jsx
const labelClass = ...
<label class={labelClass} for="name">...
```

No need to pass child elements as a `children` property to an element factory. Just pass them as you would static element children. The factory will obtain them as variadic arguments. For example:

```jsx
function DivFactory(props, ...children) {
  return <div {...props}>{...children}</div>
}

<DivFactory id="first" class="start">
  Hello, <span class="name">John</span>!
</DivFactory>
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using `npm test`.

## License

Copyright (c) 2021 Ferdinand Prantl

Licensed under the MIT license.

[React JSX]: https://reactjs.org/docs/jsx-in-depth.html
[dom-lite]: https://github.com/litejs/dom-lite#readme
[CSS properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference
[version 0.0.1]: https://github.com/prantlf/janadom/tree/v0.0.1#readme

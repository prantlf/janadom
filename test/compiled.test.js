var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  default: () => compiled_test_default
});
var import_baretest = __toModule(require("@prantlf/baretest"));
var import_assert = __toModule(require("assert"));
var import_dom_globals = __toModule(require("./dom/dom-globals"));
var import__ = __toModule(require(".."));
const test = import_baretest.default("compiled");
test("a static tag name", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("a dynamic tag name", () => {
  const Name = "div";
  const el = /* @__PURE__ */ import__.createEl(Name, null);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("an element factory", () => {
  function HTMLDivElement() {
    return /* @__PURE__ */ import__.createEl("div", null);
  }
  const el = /* @__PURE__ */ import__.createEl(HTMLDivElement, null);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("a document fragment", () => {
  const el = /* @__PURE__ */ import__.createEl(DocumentFragment, null, /* @__PURE__ */ import__.createEl("span", null), /* @__PURE__ */ import__.createEl("span", null));
  import_assert.default.strictEqual(el.outerHTML, "<span></span><span></span>");
});
test("a template", () => {
  const el = /* @__PURE__ */ import__.createEl("template", null, /* @__PURE__ */ import__.createEl("hr", null));
  import_assert.default.strictEqual(el.outerHTML, "<template><hr></template>");
});
test("an invalid type", () => {
  const Invalid = true;
  try {
    /* @__PURE__ */ import__.createEl(Invalid, null);
    import_assert.default.fail("invalid type accepted");
  } catch {
    import_assert.default.ok(true);
  }
});
test("an attribute with a literal", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    title: "test"
  });
  import_assert.default.strictEqual(el.outerHTML, '<div title="test"></div>');
});
test("an attribute with a string value", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    title: "test"
  });
  import_assert.default.strictEqual(el.outerHTML, '<div title="test"></div>');
});
test("an attribute with a number value", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    tabindex: 1
  });
  import_assert.default.strictEqual(el.outerHTML, '<div tabindex="1"></div>');
});
test("an attribute with a true value", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    disabled: true
  });
  import_assert.default.strictEqual(el.outerHTML, '<div disabled=""></div>');
});
test("an attribute with a false value", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    disabled: false
  });
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("an attribute without a true value", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    disabled: true
  });
  import_assert.default.strictEqual(el.outerHTML, '<div disabled=""></div>');
});
test("an attribute with an invalid value", () => {
  try {
    /* @__PURE__ */ import__.createEl("div", {
      title: Symbol("test")
    });
    import_assert.default.fail("invalid attribute accepted");
  } catch {
    import_assert.default.ok(true);
  }
});
test('a value attribute starting with "on"', () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    once: ""
  });
  import_assert.default.strictEqual(el.outerHTML, '<div once=""></div>');
});
test('a value attribute called "ref"', () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    ref: "true"
  });
  import_assert.default.strictEqual(el.outerHTML, '<div ref="true"></div>');
});
test("a style attribute as a string", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    style: "display: inline-block"
  });
  import_assert.default.strictEqual(el.outerHTML, '<div style="display: inline-block"></div>');
});
test("a style attribute as an object", () => {
  const el = /* @__PURE__ */ import__.createEl("div", {
    style: {display: "inline-block"}
  });
  import_assert.default.strictEqual(el.outerHTML, '<div style="display: inline-block"></div>');
});
test("attributes as an object", () => {
  const attrs = {title: "test"};
  const el = /* @__PURE__ */ import__.createEl("div", {
    ...attrs
  });
  import_assert.default.strictEqual(el.outerHTML, '<div title="test"></div>');
});
test("an event attribute", () => {
  const dispatched = new import_dom_globals.Event("click");
  let received;
  const el = /* @__PURE__ */ import__.createEl("div", {
    onclick: (event) => received = event
  });
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
  el.dispatchEvent(dispatched);
  import_assert.default.strictEqual(received, dispatched);
});
test("an event attribute with an upper-case letter", () => {
  const dispatched = new import_dom_globals.Event("click");
  let received;
  const el = /* @__PURE__ */ import__.createEl("div", {
    onClick: (event) => received = event
  });
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
  el.dispatchEvent(dispatched);
  import_assert.default.strictEqual(received, dispatched);
});
test("an event attribute with use capture enabled", () => {
  const dispatched = new import_dom_globals.Event("click");
  const received = [];
  const el = /* @__PURE__ */ import__.createEl("div", {
    onClickCapture: (event) => received.push({captured: true, event}),
    onClick: (event) => received.push({triggered: true, event})
  });
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
  el.dispatchEvent(dispatched);
  import_assert.default.strictEqual(received.length, 2);
  import_assert.default.strictEqual(received[0].captured, true);
  import_assert.default.strictEqual(received[0].event, dispatched);
  import_assert.default.strictEqual(received[1].triggered, true);
  import_assert.default.strictEqual(received[1].event, dispatched);
});
test("an element reference with object", () => {
  const ref = import__.createRef();
  const el = /* @__PURE__ */ import__.createEl("div", {
    ref
  });
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
  import_assert.default.strictEqual(ref.current, el);
});
test("an element reference with function", () => {
  let ref;
  const el = /* @__PURE__ */ import__.createEl("div", {
    ref: (el2) => ref = el2
  });
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
  import_assert.default.strictEqual(ref, el);
});
test("an element as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, /* @__PURE__ */ import__.createEl("span", null));
  import_assert.default.strictEqual(el.outerHTML, "<div><span></span></div>");
});
test("two elements as children", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, /* @__PURE__ */ import__.createEl("span", null), /* @__PURE__ */ import__.createEl("hr", null));
  import_assert.default.strictEqual(el.outerHTML, "<div><span></span><hr></div>");
});
test("two elements as an array", () => {
  function Children() {
    return [/* @__PURE__ */ import__.createEl("span", null), /* @__PURE__ */ import__.createEl("hr", null)];
  }
  const el = /* @__PURE__ */ import__.createEl("div", null, /* @__PURE__ */ import__.createEl(Children, null));
  import_assert.default.strictEqual(el.outerHTML, "<div><span></span><hr></div>");
});
test("element as a child", () => {
  function Repeat(props, ...children) {
    const items = [];
    for (let i = 0, l = props.count; i < l; ++i) {
      for (const child of children)
        items.push(child(i));
    }
    return /* @__PURE__ */ import__.createEl("div", null, items);
  }
  const el = /* @__PURE__ */ import__.createEl(Repeat, {
    count: 2
  }, (index) => /* @__PURE__ */ import__.createEl("span", null, index));
  import_assert.default.strictEqual(el.outerHTML, "<div><span>0</span><span>1</span></div>");
});
test("elements as children", () => {
  function Item(props) {
    return /* @__PURE__ */ import__.createEl("li", null, props.message);
  }
  const todos = ["start", "finish"];
  const el = /* @__PURE__ */ import__.createEl("ul", null, todos.map((message) => /* @__PURE__ */ import__.createEl(Item, {
    message
  })));
  import_assert.default.strictEqual(el.outerHTML, "<ul><li>start</li><li>finish</li></ul>");
});
test("a property as a child", () => {
  const title = "test";
  const el = /* @__PURE__ */ import__.createEl("div", null, title);
  import_assert.default.strictEqual(el.outerHTML, "<div>test</div>");
});
test("a literal as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, "test");
  import_assert.default.strictEqual(el.outerHTML, "<div>test</div>");
});
test("a string value as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, "test");
  import_assert.default.strictEqual(el.outerHTML, "<div>test</div>");
});
test("a true value as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, true);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("a false value as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, false);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("a null value as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, null);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("an undefined value as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, void 0);
  import_assert.default.strictEqual(el.outerHTML, "<div></div>");
});
test("a number value as a child", () => {
  const el = /* @__PURE__ */ import__.createEl("div", null, 1);
  import_assert.default.strictEqual(el.outerHTML, "<div>1</div>");
});
if (module === require.main)
  test.run();
var compiled_test_default = test;
//# sourceMappingURL=compiled.test.js.map

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
let is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function upper_bound(low, high, key, value) {
  while (low < high) {
    const mid = low + (high - low >> 1);
    if (key(mid) <= value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function init_hydrate(target) {
  if (target.hydrate_init)
    return;
  target.hydrate_init = true;
  let children2 = target.childNodes;
  if (target.nodeName === "HEAD") {
    const myChildren = [];
    for (let i = 0; i < children2.length; i++) {
      const node = children2[i];
      if (node.claim_order !== void 0) {
        myChildren.push(node);
      }
    }
    children2 = myChildren;
  }
  const m = new Int32Array(children2.length + 1);
  const p = new Int32Array(children2.length);
  m[0] = -1;
  let longest = 0;
  for (let i = 0; i < children2.length; i++) {
    const current = children2[i].claim_order;
    const seqLen = (longest > 0 && children2[m[longest]].claim_order <= current ? longest + 1 : upper_bound(1, longest, (idx) => children2[m[idx]].claim_order, current)) - 1;
    p[i] = m[seqLen] + 1;
    const newLen = seqLen + 1;
    m[newLen] = i;
    longest = Math.max(newLen, longest);
  }
  const lis = [];
  const toMove = [];
  let last = children2.length - 1;
  for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
    lis.push(children2[cur - 1]);
    for (; last >= cur; last--) {
      toMove.push(children2[last]);
    }
    last--;
  }
  for (; last >= 0; last--) {
    toMove.push(children2[last]);
  }
  lis.reverse();
  toMove.sort((a, b) => a.claim_order - b.claim_order);
  for (let i = 0, j = 0; i < toMove.length; i++) {
    while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
      j++;
    }
    const anchor = j < lis.length ? lis[j] : null;
    target.insertBefore(toMove[i], anchor);
  }
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
}
function append_hydration(target, node) {
  if (is_hydrating) {
    init_hydrate(target);
    if (target.actual_end_child === void 0 || target.actual_end_child !== null && target.actual_end_child.parentElement !== target) {
      target.actual_end_child = target.firstChild;
    }
    while (target.actual_end_child !== null && target.actual_end_child.claim_order === void 0) {
      target.actual_end_child = target.actual_end_child.nextSibling;
    }
    if (node !== target.actual_end_child) {
      if (node.claim_order !== void 0 || node.parentNode !== target) {
        target.insertBefore(node, target.actual_end_child);
      }
    } else {
      target.actual_end_child = node.nextSibling;
    }
  } else if (node.parentNode !== target || node.nextSibling !== null) {
    target.appendChild(node);
  }
}
function insert_hydration(target, node, anchor) {
  if (is_hydrating && !anchor) {
    append_hydration(target, node);
  } else if (node.parentNode !== target || node.nextSibling != anchor) {
    target.insertBefore(node, anchor || null);
  }
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function init_claim_info(nodes) {
  if (nodes.claim_info === void 0) {
    nodes.claim_info = { last_index: 0, total_claimed: 0 };
  }
}
function claim_node(nodes, predicate, processNode, createNode, dontUpdateLastIndex = false) {
  init_claim_info(nodes);
  const resultNode = (() => {
    for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
      const node = nodes[i];
      if (predicate(node)) {
        const replacement = processNode(node);
        if (replacement === void 0) {
          nodes.splice(i, 1);
        } else {
          nodes[i] = replacement;
        }
        if (!dontUpdateLastIndex) {
          nodes.claim_info.last_index = i;
        }
        return node;
      }
    }
    for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
      const node = nodes[i];
      if (predicate(node)) {
        const replacement = processNode(node);
        if (replacement === void 0) {
          nodes.splice(i, 1);
        } else {
          nodes[i] = replacement;
        }
        if (!dontUpdateLastIndex) {
          nodes.claim_info.last_index = i;
        } else if (replacement === void 0) {
          nodes.claim_info.last_index--;
        }
        return node;
      }
    }
    return createNode();
  })();
  resultNode.claim_order = nodes.claim_info.total_claimed;
  nodes.claim_info.total_claimed += 1;
  return resultNode;
}
function claim_element_base(nodes, name, attributes, create_element) {
  return claim_node(nodes, (node) => node.nodeName === name, (node) => {
    const remove = [];
    for (let j = 0; j < node.attributes.length; j++) {
      const attribute = node.attributes[j];
      if (!attributes[attribute.name]) {
        remove.push(attribute.name);
      }
    }
    remove.forEach((v) => node.removeAttribute(v));
    return void 0;
  }, () => create_element(name));
}
function claim_element(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, element);
}
function claim_svg_element(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, svg_element);
}
function claim_text(nodes, data) {
  return claim_node(nodes, (node) => node.nodeType === 3, (node) => {
    const dataStr = "" + data;
    if (node.data.startsWith(dataStr)) {
      if (node.data.length !== dataStr.length) {
        return node.splitText(dataStr.length);
      }
    } else {
      node.data = dataStr;
    }
  }, () => text(data), true);
}
function claim_space(nodes) {
  return claim_text(nodes, " ");
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
const managed_styles = new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1);
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { stylesheet } = info;
      let i = stylesheet.cssRules.length;
      while (i--)
        stylesheet.deleteRule(i);
      info.rules = {};
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  let config = fn(node, params);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick: tick2 = noop, css } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick2(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  let config = fn(node, params);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick: tick2 = noop, css } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config();
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function claim_component(block, parent_nodes) {
  block && block.l(parent_nodes);
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe };
}
const defaults = {
  color: "currentColor",
  class: "",
  opacity: 0.1,
  centered: false,
  spreadingDuration: ".4s",
  spreadingDelay: "0s",
  spreadingTimingFunction: "linear",
  clearingDuration: "1s",
  clearingDelay: "0s",
  clearingTimingFunction: "ease-in-out"
};
function RippleStart(e, options = {}) {
  e.stopImmediatePropagation();
  const opts = __spreadValues(__spreadValues({}, defaults), options);
  const isTouchEvent = e.touches ? !!e.touches[0] : false;
  const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;
  const ripple = document.createElement("div");
  const rippleStyle = ripple.style;
  ripple.className = `material-ripple ${opts.class}`;
  rippleStyle.position = "absolute";
  rippleStyle.color = "inherit";
  rippleStyle.borderRadius = "50%";
  rippleStyle.pointerEvents = "none";
  rippleStyle.width = "100px";
  rippleStyle.height = "100px";
  rippleStyle.marginTop = "-50px";
  rippleStyle.marginLeft = "-50px";
  target.appendChild(ripple);
  rippleStyle.opacity = opts.opacity;
  rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
  rippleStyle.transform = "scale(0) translate(0,0)";
  rippleStyle.background = opts.color;
  const targetRect = target.getBoundingClientRect();
  if (opts.centered) {
    rippleStyle.top = `${targetRect.height / 2}px`;
    rippleStyle.left = `${targetRect.width / 2}px`;
  } else {
    const distY = isTouchEvent ? e.touches[0].clientY : e.clientY;
    const distX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    rippleStyle.top = `${distY - targetRect.top}px`;
    rippleStyle.left = `${distX - targetRect.left}px`;
  }
  rippleStyle.transform = `scale(${Math.max(targetRect.width, targetRect.height) * 0.02}) translate(0,0)`;
  return ripple;
}
function RippleStop(ripple) {
  if (ripple) {
    ripple.addEventListener("transitionend", (e) => {
      if (e.propertyName === "opacity")
        ripple.remove();
    });
    ripple.style.opacity = 0;
  }
}
var Ripple = (node, _options = {}) => {
  let options = _options;
  let destroyed = false;
  let ripple;
  let keyboardActive = false;
  const handleStart = (e) => {
    ripple = RippleStart(e, options);
  };
  const handleStop = () => RippleStop(ripple);
  const handleKeyboardStart = (e) => {
    if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
      ripple = RippleStart(e, __spreadProps(__spreadValues({}, options), { centered: true }));
      keyboardActive = true;
    }
  };
  const handleKeyboardStop = () => {
    keyboardActive = false;
    handleStop();
  };
  function setup() {
    node.classList.add("s-ripple-container");
    node.addEventListener("pointerdown", handleStart);
    node.addEventListener("pointerup", handleStop);
    node.addEventListener("pointerleave", handleStop);
    node.addEventListener("keydown", handleKeyboardStart);
    node.addEventListener("keyup", handleKeyboardStop);
    destroyed = false;
  }
  function destroy() {
    node.classList.remove("s-ripple-container");
    node.removeEventListener("pointerdown", handleStart);
    node.removeEventListener("pointerup", handleStop);
    node.removeEventListener("pointerleave", handleStop);
    node.removeEventListener("keydown", handleKeyboardStart);
    node.removeEventListener("keyup", handleKeyboardStop);
    destroyed = true;
  }
  if (options)
    setup();
  return {
    update(newOptions) {
      options = newOptions;
      if (options && destroyed)
        setup();
      else if (!(options || destroyed))
        destroy();
    },
    destroy
  };
};
var ClickOutside = (node, _options = {}) => {
  const options = __spreadValues({ include: [] }, _options);
  function detect({ target }) {
    if (!node.contains(target) || options.include.some((i) => target.isSameNode(i))) {
      node.dispatchEvent(new CustomEvent("clickOutside"));
    }
  }
  document.addEventListener("click", detect, { passive: true, capture: true });
  return {
    destroy() {
      document.removeEventListener("click", detect);
    }
  };
};
var MaterialApp_svelte_svelte_type_style_lang = "";
function create_fragment$d(ctx) {
  let div;
  let div_class_value;
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[1], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-app theme--" + ctx[0]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[1], !current ? get_all_dirty_from_scope(ctx2[1]) : get_slot_changes(default_slot_template, ctx2[1], dirty, null), null);
        }
      }
      if (!current || dirty & 1 && div_class_value !== (div_class_value = "s-app theme--" + ctx2[0])) {
        attr(div, "class", div_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { theme = "light" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("theme" in $$props2)
      $$invalidate(0, theme = $$props2.theme);
    if ("$$scope" in $$props2)
      $$invalidate(1, $$scope = $$props2.$$scope);
  };
  return [theme, $$scope, slots];
}
class MaterialApp extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, { theme: 0 });
  }
}
var MaterialAppMin_svelte_svelte_type_style_lang = "";
function format$1(input) {
  if (typeof input === "number")
    return `${input}px`;
  return input;
}
var Style = (node, _styles) => {
  let styles = _styles;
  Object.entries(styles).forEach(([key, value]) => {
    if (value)
      node.style.setProperty(`--s-${key}`, format$1(value));
  });
  return {
    update(newStyles) {
      Object.entries(newStyles).forEach(([key, value]) => {
        if (value) {
          node.style.setProperty(`--s-${key}`, format$1(value));
          delete styles[key];
        }
      });
      Object.keys(styles).forEach((name) => node.style.removeProperty(`--s-${name}`));
      styles = newStyles;
    }
  };
};
var Icon_svelte_svelte_type_style_lang = "";
function create_if_block$5(ctx) {
  let svg;
  let path_1;
  let svg_viewBox_value;
  let if_block = ctx[10] && create_if_block_1$1(ctx);
  return {
    c() {
      svg = svg_element("svg");
      path_1 = svg_element("path");
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        xmlns: true,
        width: true,
        height: true,
        viewBox: true
      });
      var svg_nodes = children(svg);
      path_1 = claim_svg_element(svg_nodes, "path", { d: true });
      var path_1_nodes = children(path_1);
      if (if_block)
        if_block.l(path_1_nodes);
      path_1_nodes.forEach(detach);
      svg_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(path_1, "d", ctx[9]);
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "width", ctx[0]);
      attr(svg, "height", ctx[1]);
      attr(svg, "viewBox", svg_viewBox_value = "0 0 " + ctx[4] + " " + ctx[5]);
    },
    m(target, anchor) {
      insert_hydration(target, svg, anchor);
      append_hydration(svg, path_1);
      if (if_block)
        if_block.m(path_1, null);
    },
    p(ctx2, dirty) {
      if (ctx2[10]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1$1(ctx2);
          if_block.c();
          if_block.m(path_1, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & 512) {
        attr(path_1, "d", ctx2[9]);
      }
      if (dirty & 1) {
        attr(svg, "width", ctx2[0]);
      }
      if (dirty & 2) {
        attr(svg, "height", ctx2[1]);
      }
      if (dirty & 48 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + ctx2[4] + " " + ctx2[5])) {
        attr(svg, "viewBox", svg_viewBox_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(svg);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block_1$1(ctx) {
  let title;
  let t;
  return {
    c() {
      title = svg_element("title");
      t = text(ctx[10]);
    },
    l(nodes) {
      title = claim_svg_element(nodes, "title", {});
      var title_nodes = children(title);
      t = claim_text(title_nodes, ctx[10]);
      title_nodes.forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, title, anchor);
      append_hydration(title, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1024)
        set_data(t, ctx2[10]);
    },
    d(detaching) {
      if (detaching)
        detach(title);
    }
  };
}
function create_fragment$c(ctx) {
  let i;
  let t;
  let i_class_value;
  let Style_action;
  let current;
  let mounted;
  let dispose;
  let if_block = ctx[9] && create_if_block$5(ctx);
  const default_slot_template = ctx[13].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[12], null);
  return {
    c() {
      i = element("i");
      if (if_block)
        if_block.c();
      t = space();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      i = claim_element(nodes, "I", {
        "aria-hidden": true,
        class: true,
        "aria-label": true,
        "aria-disabled": true,
        style: true
      });
      var i_nodes = children(i);
      if (if_block)
        if_block.l(i_nodes);
      t = claim_space(i_nodes);
      if (default_slot)
        default_slot.l(i_nodes);
      i_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(i, "aria-hidden", "true");
      attr(i, "class", i_class_value = "s-icon " + ctx[2]);
      attr(i, "aria-label", ctx[10]);
      attr(i, "aria-disabled", ctx[8]);
      attr(i, "style", ctx[11]);
      toggle_class(i, "spin", ctx[7]);
      toggle_class(i, "disabled", ctx[8]);
    },
    m(target, anchor) {
      insert_hydration(target, i, anchor);
      if (if_block)
        if_block.m(i, null);
      append_hydration(i, t);
      if (default_slot) {
        default_slot.m(i, null);
      }
      current = true;
      if (!mounted) {
        dispose = action_destroyer(Style_action = Style.call(null, i, {
          "icon-size": ctx[3],
          "icon-rotate": `${ctx[6]}deg`
        }));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (ctx2[9]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$5(ctx2);
          if_block.c();
          if_block.m(i, t);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4096)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[12], !current ? get_all_dirty_from_scope(ctx2[12]) : get_slot_changes(default_slot_template, ctx2[12], dirty, null), null);
        }
      }
      if (!current || dirty & 4 && i_class_value !== (i_class_value = "s-icon " + ctx2[2])) {
        attr(i, "class", i_class_value);
      }
      if (!current || dirty & 1024) {
        attr(i, "aria-label", ctx2[10]);
      }
      if (!current || dirty & 256) {
        attr(i, "aria-disabled", ctx2[8]);
      }
      if (!current || dirty & 2048) {
        attr(i, "style", ctx2[11]);
      }
      if (Style_action && is_function(Style_action.update) && dirty & 72)
        Style_action.update.call(null, {
          "icon-size": ctx2[3],
          "icon-rotate": `${ctx2[6]}deg`
        });
      if (dirty & 132) {
        toggle_class(i, "spin", ctx2[7]);
      }
      if (dirty & 260) {
        toggle_class(i, "disabled", ctx2[8]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(i);
      if (if_block)
        if_block.d();
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { size = "24px" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { viewWidth = "24" } = $$props;
  let { viewHeight = "24" } = $$props;
  let { rotate = 0 } = $$props;
  let { spin = false } = $$props;
  let { disabled = false } = $$props;
  let { path = null } = $$props;
  let { label = null } = $$props;
  let { style = null } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(2, klass = $$props2.class);
    if ("size" in $$props2)
      $$invalidate(3, size = $$props2.size);
    if ("width" in $$props2)
      $$invalidate(0, width = $$props2.width);
    if ("height" in $$props2)
      $$invalidate(1, height = $$props2.height);
    if ("viewWidth" in $$props2)
      $$invalidate(4, viewWidth = $$props2.viewWidth);
    if ("viewHeight" in $$props2)
      $$invalidate(5, viewHeight = $$props2.viewHeight);
    if ("rotate" in $$props2)
      $$invalidate(6, rotate = $$props2.rotate);
    if ("spin" in $$props2)
      $$invalidate(7, spin = $$props2.spin);
    if ("disabled" in $$props2)
      $$invalidate(8, disabled = $$props2.disabled);
    if ("path" in $$props2)
      $$invalidate(9, path = $$props2.path);
    if ("label" in $$props2)
      $$invalidate(10, label = $$props2.label);
    if ("style" in $$props2)
      $$invalidate(11, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(12, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 8) {
      {
        $$invalidate(0, width = size);
        $$invalidate(1, height = size);
      }
    }
  };
  return [
    width,
    height,
    klass,
    size,
    viewWidth,
    viewHeight,
    rotate,
    spin,
    disabled,
    path,
    label,
    style,
    $$scope,
    slots
  ];
}
class Icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
      class: 2,
      size: 3,
      width: 0,
      height: 1,
      viewWidth: 4,
      viewHeight: 5,
      rotate: 6,
      spin: 7,
      disabled: 8,
      path: 9,
      label: 10,
      style: 11
    });
  }
}
const filter = (classes) => classes.filter((x) => !!x);
const format = (classes) => classes.split(" ").filter((x) => !!x);
var Class = (node, _classes) => {
  let classes = _classes;
  node.classList.add(...format(filter(classes).join(" ")));
  return {
    update(_newClasses) {
      const newClasses = _newClasses;
      newClasses.forEach((klass, i) => {
        if (klass)
          node.classList.add(...format(klass));
        else if (classes[i])
          node.classList.remove(...format(classes[i]));
      });
      classes = newClasses;
    }
  };
};
var Button_svelte_svelte_type_style_lang = "";
function create_fragment$b(ctx) {
  let button_1;
  let span;
  let button_1_class_value;
  let Class_action;
  let Ripple_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[19].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[18], null);
  let button_1_levels = [
    {
      class: button_1_class_value = "s-btn size-" + ctx[5] + " " + ctx[1]
    },
    { type: ctx[14] },
    { style: ctx[16] },
    { disabled: ctx[11] },
    { "aria-disabled": ctx[11] },
    ctx[17]
  ];
  let button_1_data = {};
  for (let i = 0; i < button_1_levels.length; i += 1) {
    button_1_data = assign(button_1_data, button_1_levels[i]);
  }
  return {
    c() {
      button_1 = element("button");
      span = element("span");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      button_1 = claim_element(nodes, "BUTTON", {
        class: true,
        type: true,
        style: true,
        "aria-disabled": true
      });
      var button_1_nodes = children(button_1);
      span = claim_element(button_1_nodes, "SPAN", { class: true });
      var span_nodes = children(span);
      if (default_slot)
        default_slot.l(span_nodes);
      span_nodes.forEach(detach);
      button_1_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(span, "class", "s-btn__content");
      set_attributes(button_1, button_1_data);
      toggle_class(button_1, "s-btn--fab", ctx[2]);
      toggle_class(button_1, "icon", ctx[3]);
      toggle_class(button_1, "block", ctx[4]);
      toggle_class(button_1, "tile", ctx[6]);
      toggle_class(button_1, "text", ctx[7] || ctx[3]);
      toggle_class(button_1, "depressed", ctx[8] || ctx[7] || ctx[11] || ctx[9] || ctx[3]);
      toggle_class(button_1, "outlined", ctx[9]);
      toggle_class(button_1, "rounded", ctx[10]);
      toggle_class(button_1, "disabled", ctx[11]);
    },
    m(target, anchor) {
      insert_hydration(target, button_1, anchor);
      append_hydration(button_1, span);
      if (default_slot) {
        default_slot.m(span, null);
      }
      if (button_1.autofocus)
        button_1.focus();
      ctx[21](button_1);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(Class_action = Class.call(null, button_1, [ctx[12] && ctx[13]])),
          action_destroyer(Ripple_action = Ripple.call(null, button_1, ctx[15])),
          listen(button_1, "click", ctx[20])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 262144)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[18], !current ? get_all_dirty_from_scope(ctx2[18]) : get_slot_changes(default_slot_template, ctx2[18], dirty, null), null);
        }
      }
      set_attributes(button_1, button_1_data = get_spread_update(button_1_levels, [
        (!current || dirty & 34 && button_1_class_value !== (button_1_class_value = "s-btn size-" + ctx2[5] + " " + ctx2[1])) && { class: button_1_class_value },
        (!current || dirty & 16384) && { type: ctx2[14] },
        (!current || dirty & 65536) && { style: ctx2[16] },
        (!current || dirty & 2048) && { disabled: ctx2[11] },
        (!current || dirty & 2048) && { "aria-disabled": ctx2[11] },
        dirty & 131072 && ctx2[17]
      ]));
      if (Class_action && is_function(Class_action.update) && dirty & 12288)
        Class_action.update.call(null, [ctx2[12] && ctx2[13]]);
      if (Ripple_action && is_function(Ripple_action.update) && dirty & 32768)
        Ripple_action.update.call(null, ctx2[15]);
      toggle_class(button_1, "s-btn--fab", ctx2[2]);
      toggle_class(button_1, "icon", ctx2[3]);
      toggle_class(button_1, "block", ctx2[4]);
      toggle_class(button_1, "tile", ctx2[6]);
      toggle_class(button_1, "text", ctx2[7] || ctx2[3]);
      toggle_class(button_1, "depressed", ctx2[8] || ctx2[7] || ctx2[11] || ctx2[9] || ctx2[3]);
      toggle_class(button_1, "outlined", ctx2[9]);
      toggle_class(button_1, "rounded", ctx2[10]);
      toggle_class(button_1, "disabled", ctx2[11]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(button_1);
      if (default_slot)
        default_slot.d(detaching);
      ctx[21](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "class",
    "fab",
    "icon",
    "block",
    "size",
    "tile",
    "text",
    "depressed",
    "outlined",
    "rounded",
    "disabled",
    "active",
    "activeClass",
    "type",
    "ripple",
    "style",
    "button"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { fab = false } = $$props;
  let { icon = false } = $$props;
  let { block = false } = $$props;
  let { size = "default" } = $$props;
  let { tile = false } = $$props;
  let { text: text2 = false } = $$props;
  let { depressed = false } = $$props;
  let { outlined = false } = $$props;
  let { rounded = false } = $$props;
  let { disabled = null } = $$props;
  let { active: active2 = false } = $$props;
  let { activeClass = "active" } = $$props;
  let { type = "button" } = $$props;
  let { ripple = {} } = $$props;
  let { style = null } = $$props;
  let { button = null } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function button_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      button = $$value;
      $$invalidate(0, button);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(1, klass = $$new_props.class);
    if ("fab" in $$new_props)
      $$invalidate(2, fab = $$new_props.fab);
    if ("icon" in $$new_props)
      $$invalidate(3, icon = $$new_props.icon);
    if ("block" in $$new_props)
      $$invalidate(4, block = $$new_props.block);
    if ("size" in $$new_props)
      $$invalidate(5, size = $$new_props.size);
    if ("tile" in $$new_props)
      $$invalidate(6, tile = $$new_props.tile);
    if ("text" in $$new_props)
      $$invalidate(7, text2 = $$new_props.text);
    if ("depressed" in $$new_props)
      $$invalidate(8, depressed = $$new_props.depressed);
    if ("outlined" in $$new_props)
      $$invalidate(9, outlined = $$new_props.outlined);
    if ("rounded" in $$new_props)
      $$invalidate(10, rounded = $$new_props.rounded);
    if ("disabled" in $$new_props)
      $$invalidate(11, disabled = $$new_props.disabled);
    if ("active" in $$new_props)
      $$invalidate(12, active2 = $$new_props.active);
    if ("activeClass" in $$new_props)
      $$invalidate(13, activeClass = $$new_props.activeClass);
    if ("type" in $$new_props)
      $$invalidate(14, type = $$new_props.type);
    if ("ripple" in $$new_props)
      $$invalidate(15, ripple = $$new_props.ripple);
    if ("style" in $$new_props)
      $$invalidate(16, style = $$new_props.style);
    if ("button" in $$new_props)
      $$invalidate(0, button = $$new_props.button);
    if ("$$scope" in $$new_props)
      $$invalidate(18, $$scope = $$new_props.$$scope);
  };
  return [
    button,
    klass,
    fab,
    icon,
    block,
    size,
    tile,
    text2,
    depressed,
    outlined,
    rounded,
    disabled,
    active2,
    activeClass,
    type,
    ripple,
    style,
    $$restProps,
    $$scope,
    slots,
    click_handler,
    button_1_binding
  ];
}
class Button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {
      class: 1,
      fab: 2,
      icon: 3,
      block: 4,
      size: 5,
      tile: 6,
      text: 7,
      depressed: 8,
      outlined: 9,
      rounded: 10,
      disabled: 11,
      active: 12,
      activeClass: 13,
      type: 14,
      ripple: 15,
      style: 16,
      button: 0
    });
  }
}
var ItemGroup_svelte_svelte_type_style_lang = "";
function create_fragment$a(ctx) {
  let div;
  let div_class_value;
  let current;
  const default_slot_template = ctx[9].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[8], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, role: true, style: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-item-group " + ctx[0]);
      attr(div, "role", ctx[1]);
      attr(div, "style", ctx[2]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 256)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[8], !current ? get_all_dirty_from_scope(ctx2[8]) : get_slot_changes(default_slot_template, ctx2[8], dirty, null), null);
        }
      }
      if (!current || dirty & 1 && div_class_value !== (div_class_value = "s-item-group " + ctx2[0])) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & 2) {
        attr(div, "role", ctx2[1]);
      }
      if (!current || dirty & 4) {
        attr(div, "style", ctx2[2]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
const ITEM_GROUP = {};
function instance$a($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { activeClass = "" } = $$props;
  let { value = [] } = $$props;
  let { multiple = false } = $$props;
  let { mandatory = false } = $$props;
  let { max = Infinity } = $$props;
  let { role = null } = $$props;
  let { style = null } = $$props;
  const dispatch2 = createEventDispatcher();
  const valueStore = writable(value);
  let startIndex = -1;
  setContext(ITEM_GROUP, {
    select: (val) => {
      if (multiple) {
        if (value.includes(val)) {
          if (!mandatory || value.length > 1) {
            value.splice(value.indexOf(val), 1);
            $$invalidate(3, value);
          }
        } else if (value.length < max)
          $$invalidate(3, value = [...value, val]);
      } else if (value === val) {
        if (!mandatory)
          $$invalidate(3, value = null);
      } else
        $$invalidate(3, value = val);
    },
    register: (setValue) => {
      const u = valueStore.subscribe((val) => {
        setValue(multiple ? val : [val]);
      });
      onDestroy(u);
    },
    index: () => {
      startIndex += 1;
      return startIndex;
    },
    activeClass
  });
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("activeClass" in $$props2)
      $$invalidate(4, activeClass = $$props2.activeClass);
    if ("value" in $$props2)
      $$invalidate(3, value = $$props2.value);
    if ("multiple" in $$props2)
      $$invalidate(5, multiple = $$props2.multiple);
    if ("mandatory" in $$props2)
      $$invalidate(6, mandatory = $$props2.mandatory);
    if ("max" in $$props2)
      $$invalidate(7, max = $$props2.max);
    if ("role" in $$props2)
      $$invalidate(1, role = $$props2.role);
    if ("style" in $$props2)
      $$invalidate(2, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(8, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 8) {
      valueStore.set(value);
    }
    if ($$self.$$.dirty & 8) {
      dispatch2("change", value);
    }
  };
  return [
    klass,
    role,
    style,
    value,
    activeClass,
    multiple,
    mandatory,
    max,
    $$scope,
    slots
  ];
}
class ItemGroup extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
      class: 0,
      activeClass: 4,
      value: 3,
      multiple: 5,
      mandatory: 6,
      max: 7,
      role: 1,
      style: 2
    });
  }
}
var ButtonGroup_svelte_svelte_type_style_lang = "";
function create_default_slot$1(ctx) {
  let div;
  let div_class_value;
  let current;
  const default_slot_template = ctx[11].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[14], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-btn-group " + ctx[1]);
      attr(div, "style", ctx[10]);
      toggle_class(div, "elevated", ctx[2]);
      toggle_class(div, "borderless", ctx[3]);
      toggle_class(div, "tile", ctx[4]);
      toggle_class(div, "rounded", ctx[5]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16384)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[14], !current ? get_all_dirty_from_scope(ctx2[14]) : get_slot_changes(default_slot_template, ctx2[14], dirty, null), null);
        }
      }
      if (!current || dirty & 2 && div_class_value !== (div_class_value = "s-btn-group " + ctx2[1])) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & 1024) {
        attr(div, "style", ctx2[10]);
      }
      if (dirty & 6) {
        toggle_class(div, "elevated", ctx2[2]);
      }
      if (dirty & 10) {
        toggle_class(div, "borderless", ctx2[3]);
      }
      if (dirty & 18) {
        toggle_class(div, "tile", ctx2[4]);
      }
      if (dirty & 34) {
        toggle_class(div, "rounded", ctx2[5]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$9(ctx) {
  let itemgroup;
  let updating_value;
  let current;
  function itemgroup_value_binding(value) {
    ctx[12](value);
  }
  let itemgroup_props = {
    activeClass: ctx[6],
    multiple: ctx[8],
    mandatory: ctx[7],
    max: ctx[9],
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    itemgroup_props.value = ctx[0];
  }
  itemgroup = new ItemGroup({ props: itemgroup_props });
  binding_callbacks.push(() => bind(itemgroup, "value", itemgroup_value_binding));
  itemgroup.$on("change", ctx[13]);
  return {
    c() {
      create_component(itemgroup.$$.fragment);
    },
    l(nodes) {
      claim_component(itemgroup.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(itemgroup, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const itemgroup_changes = {};
      if (dirty & 64)
        itemgroup_changes.activeClass = ctx2[6];
      if (dirty & 256)
        itemgroup_changes.multiple = ctx2[8];
      if (dirty & 128)
        itemgroup_changes.mandatory = ctx2[7];
      if (dirty & 512)
        itemgroup_changes.max = ctx2[9];
      if (dirty & 17470) {
        itemgroup_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_value && dirty & 1) {
        updating_value = true;
        itemgroup_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      itemgroup.$set(itemgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(itemgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(itemgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(itemgroup, detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { elevated = false } = $$props;
  let { borderless = false } = $$props;
  let { tile = false } = $$props;
  let { rounded = false } = $$props;
  let { activeClass = "active" } = $$props;
  let { value = [] } = $$props;
  let { mandatory = false } = $$props;
  let { multiple = false } = $$props;
  let { max = Infinity } = $$props;
  let { style = null } = $$props;
  function itemgroup_value_binding(value$1) {
    value = value$1;
    $$invalidate(0, value);
  }
  function change_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(1, klass = $$props2.class);
    if ("elevated" in $$props2)
      $$invalidate(2, elevated = $$props2.elevated);
    if ("borderless" in $$props2)
      $$invalidate(3, borderless = $$props2.borderless);
    if ("tile" in $$props2)
      $$invalidate(4, tile = $$props2.tile);
    if ("rounded" in $$props2)
      $$invalidate(5, rounded = $$props2.rounded);
    if ("activeClass" in $$props2)
      $$invalidate(6, activeClass = $$props2.activeClass);
    if ("value" in $$props2)
      $$invalidate(0, value = $$props2.value);
    if ("mandatory" in $$props2)
      $$invalidate(7, mandatory = $$props2.mandatory);
    if ("multiple" in $$props2)
      $$invalidate(8, multiple = $$props2.multiple);
    if ("max" in $$props2)
      $$invalidate(9, max = $$props2.max);
    if ("style" in $$props2)
      $$invalidate(10, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(14, $$scope = $$props2.$$scope);
  };
  return [
    value,
    klass,
    elevated,
    borderless,
    tile,
    rounded,
    activeClass,
    mandatory,
    multiple,
    max,
    style,
    slots,
    itemgroup_value_binding,
    change_handler,
    $$scope
  ];
}
class ButtonGroup extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {
      class: 1,
      elevated: 2,
      borderless: 3,
      tile: 4,
      rounded: 5,
      activeClass: 6,
      value: 0,
      mandatory: 7,
      multiple: 8,
      max: 9,
      style: 10
    });
  }
}
var ButtonGroupItem_svelte_svelte_type_style_lang = "";
function create_default_slot(ctx) {
  let current;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[8], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 256)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[8], !current ? get_all_dirty_from_scope(ctx2[8]) : get_slot_changes(default_slot_template, ctx2[8], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$8(ctx) {
  let button;
  let current;
  button = new Button({
    props: {
      class: "s-btn-group-item " + ctx[0],
      activeClass: ctx[1],
      active: ctx[3],
      disabled: ctx[2],
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  button.$on("click", ctx[4]);
  button.$on("click", ctx[7]);
  return {
    c() {
      create_component(button.$$.fragment);
    },
    l(nodes) {
      claim_component(button.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const button_changes = {};
      if (dirty & 1)
        button_changes.class = "s-btn-group-item " + ctx2[0];
      if (dirty & 2)
        button_changes.activeClass = ctx2[1];
      if (dirty & 8)
        button_changes.active = ctx2[3];
      if (dirty & 4)
        button_changes.disabled = ctx2[2];
      if (dirty & 256) {
        button_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button.$set(button_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button, detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const ITEM = getContext(ITEM_GROUP);
  let active2;
  let { class: klass = "" } = $$props;
  let { value = ITEM.index() } = $$props;
  let { activeClass = ITEM.activeClass } = $$props;
  let { disabled = null } = $$props;
  ITEM.register((values) => {
    $$invalidate(3, active2 = values.includes(value));
  });
  function click() {
    if (!disabled)
      ITEM.select(value);
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("value" in $$props2)
      $$invalidate(5, value = $$props2.value);
    if ("activeClass" in $$props2)
      $$invalidate(1, activeClass = $$props2.activeClass);
    if ("disabled" in $$props2)
      $$invalidate(2, disabled = $$props2.disabled);
    if ("$$scope" in $$props2)
      $$invalidate(8, $$scope = $$props2.$$scope);
  };
  return [
    klass,
    activeClass,
    disabled,
    active2,
    click,
    value,
    slots,
    click_handler,
    $$scope
  ];
}
class ButtonGroupItem extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {
      class: 0,
      value: 5,
      activeClass: 1,
      disabled: 2
    });
  }
}
var Input_svelte_svelte_type_style_lang = "";
let IDX = 36;
let HEX = "";
while (IDX--)
  HEX += IDX.toString(36);
var Slider_svelte_svelte_type_style_lang = "";
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: (t) => `opacity: ${t * o}`
  };
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - od * u}`
  };
}
var Menu_svelte_svelte_type_style_lang = "";
const get_activator_slot_changes = (dirty) => ({});
const get_activator_slot_context = (ctx) => ({});
function create_if_block$4(ctx) {
  let div;
  let div_class_value;
  let div_style_value;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[26].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[25], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, role: true, style: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-menu " + ctx[1]);
      attr(div, "role", "menu");
      attr(div, "style", div_style_value = "" + (ctx[9] + ";transform-origin:" + ctx[8] + ";z-index:" + ctx[6] + ";" + ctx[7]));
      toggle_class(div, "tile", ctx[5]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(div, "click", ctx[11]);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (default_slot) {
        if (default_slot.p && (!current || dirty[0] & 33554432)) {
          update_slot_base(default_slot, default_slot_template, ctx, ctx[25], !current ? get_all_dirty_from_scope(ctx[25]) : get_slot_changes(default_slot_template, ctx[25], dirty, null), null);
        }
      }
      if (!current || dirty[0] & 2 && div_class_value !== (div_class_value = "s-menu " + ctx[1])) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty[0] & 960 && div_style_value !== (div_style_value = "" + (ctx[9] + ";transform-origin:" + ctx[8] + ";z-index:" + ctx[6] + ";" + ctx[7]))) {
        attr(div, "style", div_style_value);
      }
      if (dirty[0] & 34) {
        toggle_class(div, "tile", ctx[5]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (div_outro)
          div_outro.end(1);
        div_intro = create_in_transition(div, ctx[2], ctx[3]);
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (div_intro)
        div_intro.invalidate();
      div_outro = create_out_transition(div, ctx[2], ctx[4]);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      if (detaching && div_outro)
        div_outro.end();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$7(ctx) {
  let div;
  let t;
  let current;
  let mounted;
  let dispose;
  const activator_slot_template = ctx[26].activator;
  const activator_slot = create_slot(activator_slot_template, ctx, ctx[25], get_activator_slot_context);
  let if_block = ctx[0] && create_if_block$4(ctx);
  return {
    c() {
      div = element("div");
      if (activator_slot)
        activator_slot.c();
      t = space();
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (activator_slot)
        activator_slot.l(div_nodes);
      t = claim_space(div_nodes);
      if (if_block)
        if_block.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "s-menu__wrapper");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (activator_slot) {
        activator_slot.m(div, null);
      }
      append_hydration(div, t);
      if (if_block)
        if_block.m(div, null);
      ctx[27](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(ClickOutside.call(null, div)),
          listen(div, "clickOutside", ctx[12])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (activator_slot) {
        if (activator_slot.p && (!current || dirty[0] & 33554432)) {
          update_slot_base(activator_slot, activator_slot_template, ctx2, ctx2[25], !current ? get_all_dirty_from_scope(ctx2[25]) : get_slot_changes(activator_slot_template, ctx2[25], dirty, get_activator_slot_changes), get_activator_slot_context);
        }
      }
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$4(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(activator_slot, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(activator_slot, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (activator_slot)
        activator_slot.d(detaching);
      if (if_block)
        if_block.d();
      ctx[27](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { active: active2 = false } = $$props;
  let { absolute = false } = $$props;
  let { transition = fade } = $$props;
  let { inOpts = { duration: 250 } } = $$props;
  let { outOpts = { duration: 200 } } = $$props;
  let { offsetX = false } = $$props;
  let { offsetY = true } = $$props;
  let { nudgeX = 0 } = $$props;
  let { nudgeY = 0 } = $$props;
  let { openOnClick = true } = $$props;
  let { hover = false } = $$props;
  let { closeOnClickOutside = true } = $$props;
  let { closeOnClick = true } = $$props;
  let { bottom = false } = $$props;
  let { right = false } = $$props;
  let { tile = false } = $$props;
  let { disabled = false } = $$props;
  let { index = 8 } = $$props;
  let { style = "" } = $$props;
  let origin = "top left";
  let position;
  let wrapper;
  const dispatch2 = createEventDispatcher();
  const align = {
    x: right ? "right" : "left",
    y: bottom ? "bottom" : "top"
  };
  setContext("S_ListItemRole", "menuitem");
  setContext("S_ListItemRipple", true);
  function open(posX = 0, posY = 0) {
    $$invalidate(0, active2 = true);
    const rect = wrapper.getBoundingClientRect();
    let x = nudgeX;
    let y = nudgeY;
    if (absolute) {
      x += posX;
      y += posY;
    } else {
      if (offsetX)
        x += rect.width;
      if (offsetY)
        y += rect.height;
    }
    $$invalidate(9, position = `${align.y}:${y}px;${align.x}:${x}px`);
    $$invalidate(8, origin = `${align.y} ${align.x}`);
    dispatch2("open");
  }
  function close() {
    $$invalidate(0, active2 = false);
    dispatch2("close");
  }
  function triggerClick(e) {
    if (!disabled) {
      if (active2) {
        close();
      } else if (openOnClick) {
        open(e.offsetX, e.offsetY);
      }
    }
  }
  function menuClick() {
    if (active2 && closeOnClick)
      close();
  }
  function clickOutsideMenu() {
    if (active2 && closeOnClickOutside)
      close();
  }
  onMount(() => {
    const trigger = wrapper.querySelector("[slot='activator']");
    if (active2)
      open();
    trigger.addEventListener("click", triggerClick, { passive: true });
    if (hover) {
      wrapper.addEventListener("mouseenter", open, { passive: true });
      wrapper.addEventListener("mouseleave", close, { passive: true });
    }
    return () => {
      trigger.removeEventListener("click", triggerClick);
      if (hover) {
        wrapper.removeEventListener("mouseenter", open);
        wrapper.removeEventListener("mouseleave", close);
      }
    };
  });
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      wrapper = $$value;
      $$invalidate(10, wrapper);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(1, klass = $$props2.class);
    if ("active" in $$props2)
      $$invalidate(0, active2 = $$props2.active);
    if ("absolute" in $$props2)
      $$invalidate(13, absolute = $$props2.absolute);
    if ("transition" in $$props2)
      $$invalidate(2, transition = $$props2.transition);
    if ("inOpts" in $$props2)
      $$invalidate(3, inOpts = $$props2.inOpts);
    if ("outOpts" in $$props2)
      $$invalidate(4, outOpts = $$props2.outOpts);
    if ("offsetX" in $$props2)
      $$invalidate(14, offsetX = $$props2.offsetX);
    if ("offsetY" in $$props2)
      $$invalidate(15, offsetY = $$props2.offsetY);
    if ("nudgeX" in $$props2)
      $$invalidate(16, nudgeX = $$props2.nudgeX);
    if ("nudgeY" in $$props2)
      $$invalidate(17, nudgeY = $$props2.nudgeY);
    if ("openOnClick" in $$props2)
      $$invalidate(18, openOnClick = $$props2.openOnClick);
    if ("hover" in $$props2)
      $$invalidate(19, hover = $$props2.hover);
    if ("closeOnClickOutside" in $$props2)
      $$invalidate(20, closeOnClickOutside = $$props2.closeOnClickOutside);
    if ("closeOnClick" in $$props2)
      $$invalidate(21, closeOnClick = $$props2.closeOnClick);
    if ("bottom" in $$props2)
      $$invalidate(22, bottom = $$props2.bottom);
    if ("right" in $$props2)
      $$invalidate(23, right = $$props2.right);
    if ("tile" in $$props2)
      $$invalidate(5, tile = $$props2.tile);
    if ("disabled" in $$props2)
      $$invalidate(24, disabled = $$props2.disabled);
    if ("index" in $$props2)
      $$invalidate(6, index = $$props2.index);
    if ("style" in $$props2)
      $$invalidate(7, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(25, $$scope = $$props2.$$scope);
  };
  return [
    active2,
    klass,
    transition,
    inOpts,
    outOpts,
    tile,
    index,
    style,
    origin,
    position,
    wrapper,
    menuClick,
    clickOutsideMenu,
    absolute,
    offsetX,
    offsetY,
    nudgeX,
    nudgeY,
    openOnClick,
    hover,
    closeOnClickOutside,
    closeOnClick,
    bottom,
    right,
    disabled,
    $$scope,
    slots,
    div_binding
  ];
}
class Menu extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
      class: 1,
      active: 0,
      absolute: 13,
      transition: 2,
      inOpts: 3,
      outOpts: 4,
      offsetX: 14,
      offsetY: 15,
      nudgeX: 16,
      nudgeY: 17,
      openOnClick: 18,
      hover: 19,
      closeOnClickOutside: 20,
      closeOnClick: 21,
      bottom: 22,
      right: 23,
      tile: 5,
      disabled: 24,
      index: 6,
      style: 7
    }, null, [-1, -1]);
  }
}
var List_svelte_svelte_type_style_lang = "";
var ListItem_svelte_svelte_type_style_lang = "";
const get_append_slot_changes = (dirty) => ({});
const get_append_slot_context = (ctx) => ({});
const get_subtitle_slot_changes = (dirty) => ({});
const get_subtitle_slot_context = (ctx) => ({});
const get_prepend_slot_changes = (dirty) => ({});
const get_prepend_slot_context = (ctx) => ({});
function create_fragment$6(ctx) {
  let div3;
  let t0;
  let div2;
  let div0;
  let t1;
  let div1;
  let t2;
  let div3_class_value;
  let div3_tabindex_value;
  let div3_aria_selected_value;
  let Class_action;
  let Ripple_action;
  let current;
  let mounted;
  let dispose;
  const prepend_slot_template = ctx[14].prepend;
  const prepend_slot = create_slot(prepend_slot_template, ctx, ctx[13], get_prepend_slot_context);
  const default_slot_template = ctx[14].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[13], null);
  const subtitle_slot_template = ctx[14].subtitle;
  const subtitle_slot = create_slot(subtitle_slot_template, ctx, ctx[13], get_subtitle_slot_context);
  const append_slot_template = ctx[14].append;
  const append_slot = create_slot(append_slot_template, ctx, ctx[13], get_append_slot_context);
  return {
    c() {
      div3 = element("div");
      if (prepend_slot)
        prepend_slot.c();
      t0 = space();
      div2 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      t1 = space();
      div1 = element("div");
      if (subtitle_slot)
        subtitle_slot.c();
      t2 = space();
      if (append_slot)
        append_slot.c();
      this.h();
    },
    l(nodes) {
      div3 = claim_element(nodes, "DIV", {
        class: true,
        role: true,
        tabindex: true,
        "aria-selected": true,
        style: true
      });
      var div3_nodes = children(div3);
      if (prepend_slot)
        prepend_slot.l(div3_nodes);
      t0 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      if (default_slot)
        default_slot.l(div0_nodes);
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      if (subtitle_slot)
        subtitle_slot.l(div1_nodes);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      t2 = claim_space(div3_nodes);
      if (append_slot)
        append_slot.l(div3_nodes);
      div3_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "s-list-item__title");
      attr(div1, "class", "s-list-item__subtitle");
      attr(div2, "class", "s-list-item__content");
      attr(div3, "class", div3_class_value = "s-list-item " + ctx[1]);
      attr(div3, "role", ctx[10]);
      attr(div3, "tabindex", div3_tabindex_value = ctx[6] ? 0 : -1);
      attr(div3, "aria-selected", div3_aria_selected_value = ctx[10] === "option" ? ctx[0] : null);
      attr(div3, "style", ctx[9]);
      toggle_class(div3, "dense", ctx[3]);
      toggle_class(div3, "disabled", ctx[4]);
      toggle_class(div3, "multiline", ctx[5]);
      toggle_class(div3, "link", ctx[6]);
      toggle_class(div3, "selectable", ctx[7]);
    },
    m(target, anchor) {
      insert_hydration(target, div3, anchor);
      if (prepend_slot) {
        prepend_slot.m(div3, null);
      }
      append_hydration(div3, t0);
      append_hydration(div3, div2);
      append_hydration(div2, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      if (subtitle_slot) {
        subtitle_slot.m(div1, null);
      }
      append_hydration(div3, t2);
      if (append_slot) {
        append_slot.m(div3, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(Class_action = Class.call(null, div3, [ctx[0] && ctx[2]])),
          action_destroyer(Ripple_action = Ripple.call(null, div3, ctx[8])),
          listen(div3, "click", ctx[11]),
          listen(div3, "click", ctx[15]),
          listen(div3, "dblclick", ctx[16])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (prepend_slot) {
        if (prepend_slot.p && (!current || dirty & 8192)) {
          update_slot_base(prepend_slot, prepend_slot_template, ctx2, ctx2[13], !current ? get_all_dirty_from_scope(ctx2[13]) : get_slot_changes(prepend_slot_template, ctx2[13], dirty, get_prepend_slot_changes), get_prepend_slot_context);
        }
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8192)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[13], !current ? get_all_dirty_from_scope(ctx2[13]) : get_slot_changes(default_slot_template, ctx2[13], dirty, null), null);
        }
      }
      if (subtitle_slot) {
        if (subtitle_slot.p && (!current || dirty & 8192)) {
          update_slot_base(subtitle_slot, subtitle_slot_template, ctx2, ctx2[13], !current ? get_all_dirty_from_scope(ctx2[13]) : get_slot_changes(subtitle_slot_template, ctx2[13], dirty, get_subtitle_slot_changes), get_subtitle_slot_context);
        }
      }
      if (append_slot) {
        if (append_slot.p && (!current || dirty & 8192)) {
          update_slot_base(append_slot, append_slot_template, ctx2, ctx2[13], !current ? get_all_dirty_from_scope(ctx2[13]) : get_slot_changes(append_slot_template, ctx2[13], dirty, get_append_slot_changes), get_append_slot_context);
        }
      }
      if (!current || dirty & 2 && div3_class_value !== (div3_class_value = "s-list-item " + ctx2[1])) {
        attr(div3, "class", div3_class_value);
      }
      if (!current || dirty & 64 && div3_tabindex_value !== (div3_tabindex_value = ctx2[6] ? 0 : -1)) {
        attr(div3, "tabindex", div3_tabindex_value);
      }
      if (!current || dirty & 1 && div3_aria_selected_value !== (div3_aria_selected_value = ctx2[10] === "option" ? ctx2[0] : null)) {
        attr(div3, "aria-selected", div3_aria_selected_value);
      }
      if (!current || dirty & 512) {
        attr(div3, "style", ctx2[9]);
      }
      if (Class_action && is_function(Class_action.update) && dirty & 5)
        Class_action.update.call(null, [ctx2[0] && ctx2[2]]);
      if (Ripple_action && is_function(Ripple_action.update) && dirty & 256)
        Ripple_action.update.call(null, ctx2[8]);
      if (dirty & 10) {
        toggle_class(div3, "dense", ctx2[3]);
      }
      if (dirty & 18) {
        toggle_class(div3, "disabled", ctx2[4]);
      }
      if (dirty & 34) {
        toggle_class(div3, "multiline", ctx2[5]);
      }
      if (dirty & 66) {
        toggle_class(div3, "link", ctx2[6]);
      }
      if (dirty & 130) {
        toggle_class(div3, "selectable", ctx2[7]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(prepend_slot, local);
      transition_in(default_slot, local);
      transition_in(subtitle_slot, local);
      transition_in(append_slot, local);
      current = true;
    },
    o(local) {
      transition_out(prepend_slot, local);
      transition_out(default_slot, local);
      transition_out(subtitle_slot, local);
      transition_out(append_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      if (prepend_slot)
        prepend_slot.d(detaching);
      if (default_slot)
        default_slot.d(detaching);
      if (subtitle_slot)
        subtitle_slot.d(detaching);
      if (append_slot)
        append_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const role = getContext("S_ListItemRole");
  const ITEM_GROUP2 = getContext("S_ListItemGroup");
  const DEFAULTS = {
    select: () => null,
    register: () => null,
    index: () => null,
    activeClass: "active"
  };
  const ITEM = ITEM_GROUP2 ? getContext(ITEM_GROUP2) : DEFAULTS;
  let { class: klass = "" } = $$props;
  let { activeClass = ITEM.activeClass } = $$props;
  let { value = ITEM.index() } = $$props;
  let { active: active2 = false } = $$props;
  let { dense = false } = $$props;
  let { disabled = null } = $$props;
  let { multiline = false } = $$props;
  let { link = role } = $$props;
  let { selectable = !link } = $$props;
  let { ripple = getContext("S_ListItemRipple") || role || false } = $$props;
  let { style = null } = $$props;
  ITEM.register((values) => {
    $$invalidate(0, active2 = values.includes(value));
  });
  function click() {
    if (!disabled)
      ITEM.select(value);
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function dblclick_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(1, klass = $$props2.class);
    if ("activeClass" in $$props2)
      $$invalidate(2, activeClass = $$props2.activeClass);
    if ("value" in $$props2)
      $$invalidate(12, value = $$props2.value);
    if ("active" in $$props2)
      $$invalidate(0, active2 = $$props2.active);
    if ("dense" in $$props2)
      $$invalidate(3, dense = $$props2.dense);
    if ("disabled" in $$props2)
      $$invalidate(4, disabled = $$props2.disabled);
    if ("multiline" in $$props2)
      $$invalidate(5, multiline = $$props2.multiline);
    if ("link" in $$props2)
      $$invalidate(6, link = $$props2.link);
    if ("selectable" in $$props2)
      $$invalidate(7, selectable = $$props2.selectable);
    if ("ripple" in $$props2)
      $$invalidate(8, ripple = $$props2.ripple);
    if ("style" in $$props2)
      $$invalidate(9, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(13, $$scope = $$props2.$$scope);
  };
  return [
    active2,
    klass,
    activeClass,
    dense,
    disabled,
    multiline,
    link,
    selectable,
    ripple,
    style,
    role,
    click,
    value,
    $$scope,
    slots,
    click_handler,
    dblclick_handler
  ];
}
class ListItem extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {
      class: 1,
      activeClass: 2,
      value: 12,
      active: 0,
      dense: 3,
      disabled: 4,
      multiline: 5,
      link: 6,
      selectable: 7,
      ripple: 8,
      style: 9
    });
  }
}
var ListGroup_svelte_svelte_type_style_lang = "";
var ListItemGroup_svelte_svelte_type_style_lang = "";
var Chip_svelte_svelte_type_style_lang = "";
var Checkbox_svelte_svelte_type_style_lang = "";
var Select_svelte_svelte_type_style_lang = "";
var Switch_svelte_svelte_type_style_lang = "";
var Radio_svelte_svelte_type_style_lang = "";
var Alert_svelte_svelte_type_style_lang = "";
var DataTable_svelte_svelte_type_style_lang = "";
var DataTableHead_svelte_svelte_type_style_lang = "";
var DataTableBody_svelte_svelte_type_style_lang = "";
var DataTableCell_svelte_svelte_type_style_lang = "";
const themeColors = ["primary", "secondary", "success", "info", "warning", "error"];
function formatClass(klass) {
  return klass.split(" ").map((i) => {
    if (themeColors.includes(i))
      return `${i}-color`;
    return i;
  });
}
function setBackgroundColor(node, text2) {
  if (/^(#|rgb|hsl|currentColor)/.test(text2)) {
    node.style.backgroundColor = text2;
    return false;
  }
  if (text2.startsWith("--")) {
    node.style.backgroundColor = `var(${text2})`;
    return false;
  }
  const klass = formatClass(text2);
  node.classList.add(...klass);
  return klass;
}
var BackgroundColor = (node, text2) => {
  let klass;
  if (typeof text2 === "string") {
    klass = setBackgroundColor(node, text2);
  }
  return {
    update(newText) {
      if (klass) {
        node.classList.remove(...klass);
      } else {
        node.style.backgroundColor = null;
      }
      if (typeof newText === "string") {
        klass = setBackgroundColor(node, newText);
      }
    }
  };
};
var Overlay_svelte_svelte_type_style_lang = "";
function create_if_block$3(ctx) {
  let div2;
  let div0;
  let BackgroundColor_action;
  let t;
  let div1;
  let div2_class_value;
  let div2_style_value;
  let div2_intro;
  let div2_outro;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[11].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[10], null);
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t = space();
      div1 = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true, style: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      children(div0).forEach(detach);
      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      if (default_slot)
        default_slot.l(div1_nodes);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "s-overlay__scrim svelte-huzcg0");
      set_style(div0, "opacity", ctx[5]);
      attr(div1, "class", "s-overlay__content svelte-huzcg0");
      attr(div2, "class", div2_class_value = "s-overlay " + ctx[0] + " svelte-huzcg0");
      attr(div2, "style", div2_style_value = "z-index:" + ctx[7] + ";" + ctx[9]);
      toggle_class(div2, "absolute", ctx[8]);
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div2, t);
      append_hydration(div2, div1);
      if (default_slot) {
        default_slot.m(div1, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, ctx[6])),
          listen(div2, "click", ctx[12])
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (!current || dirty & 32) {
        set_style(div0, "opacity", ctx[5]);
      }
      if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & 64)
        BackgroundColor_action.update.call(null, ctx[6]);
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 1024)) {
          update_slot_base(default_slot, default_slot_template, ctx, ctx[10], !current ? get_all_dirty_from_scope(ctx[10]) : get_slot_changes(default_slot_template, ctx[10], dirty, null), null);
        }
      }
      if (!current || dirty & 1 && div2_class_value !== (div2_class_value = "s-overlay " + ctx[0] + " svelte-huzcg0")) {
        attr(div2, "class", div2_class_value);
      }
      if (!current || dirty & 640 && div2_style_value !== (div2_style_value = "z-index:" + ctx[7] + ";" + ctx[9])) {
        attr(div2, "style", div2_style_value);
      }
      if (dirty & 257) {
        toggle_class(div2, "absolute", ctx[8]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (div2_outro)
          div2_outro.end(1);
        div2_intro = create_in_transition(div2, ctx[1], ctx[2]);
        div2_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      if (div2_intro)
        div2_intro.invalidate();
      div2_outro = create_out_transition(div2, ctx[1], ctx[3]);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (default_slot)
        default_slot.d(detaching);
      if (detaching && div2_outro)
        div2_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$5(ctx) {
  let if_block_anchor;
  let current;
  let if_block = ctx[4] && create_if_block$3(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[4]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 16) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { transition = fade } = $$props;
  let { inOpts = { duration: 250 } } = $$props;
  let { outOpts = { duration: 250 } } = $$props;
  let { active: active2 = true } = $$props;
  let { opacity = 0.46 } = $$props;
  let { color = "rgb(33, 33, 33)" } = $$props;
  let { index = 5 } = $$props;
  let { absolute = false } = $$props;
  let { style = "" } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("transition" in $$props2)
      $$invalidate(1, transition = $$props2.transition);
    if ("inOpts" in $$props2)
      $$invalidate(2, inOpts = $$props2.inOpts);
    if ("outOpts" in $$props2)
      $$invalidate(3, outOpts = $$props2.outOpts);
    if ("active" in $$props2)
      $$invalidate(4, active2 = $$props2.active);
    if ("opacity" in $$props2)
      $$invalidate(5, opacity = $$props2.opacity);
    if ("color" in $$props2)
      $$invalidate(6, color = $$props2.color);
    if ("index" in $$props2)
      $$invalidate(7, index = $$props2.index);
    if ("absolute" in $$props2)
      $$invalidate(8, absolute = $$props2.absolute);
    if ("style" in $$props2)
      $$invalidate(9, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(10, $$scope = $$props2.$$scope);
  };
  return [
    klass,
    transition,
    inOpts,
    outOpts,
    active2,
    opacity,
    color,
    index,
    absolute,
    style,
    $$scope,
    slots,
    click_handler
  ];
}
class Overlay extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      class: 0,
      transition: 1,
      inOpts: 2,
      outOpts: 3,
      active: 4,
      opacity: 5,
      color: 6,
      index: 7,
      absolute: 8,
      style: 9
    });
  }
}
var Dialog_svelte_svelte_type_style_lang = "";
var Divider_svelte_svelte_type_style_lang = "";
var ExpansionPanels_svelte_svelte_type_style_lang = "";
var ExpansionPanel_svelte_svelte_type_style_lang = "";
var Avatar_svelte_svelte_type_style_lang = "";
var Badge_svelte_svelte_type_style_lang = "";
var AppBar_svelte_svelte_type_style_lang = "";
const get_extension_slot_changes = (dirty) => ({});
const get_extension_slot_context = (ctx) => ({});
const get_title_slot_changes = (dirty) => ({});
const get_title_slot_context = (ctx) => ({});
const get_icon_slot_changes = (dirty) => ({});
const get_icon_slot_context = (ctx) => ({});
function create_if_block$2(ctx) {
  let div;
  let current;
  const title_slot_template = ctx[11].title;
  const title_slot = create_slot(title_slot_template, ctx, ctx[10], get_title_slot_context);
  return {
    c() {
      div = element("div");
      if (title_slot)
        title_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (title_slot)
        title_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "s-app-bar__title");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (title_slot) {
        title_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (title_slot) {
        if (title_slot.p && (!current || dirty & 1024)) {
          update_slot_base(title_slot, title_slot_template, ctx2, ctx2[10], !current ? get_all_dirty_from_scope(ctx2[10]) : get_slot_changes(title_slot_template, ctx2[10], dirty, get_title_slot_changes), get_title_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(title_slot, local);
      current = true;
    },
    o(local) {
      transition_out(title_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (title_slot)
        title_slot.d(detaching);
    }
  };
}
function create_fragment$4(ctx) {
  let header;
  let div;
  let t0;
  let t1;
  let t2;
  let header_class_value;
  let Style_action;
  let current;
  let mounted;
  let dispose;
  const icon_slot_template = ctx[11].icon;
  const icon_slot = create_slot(icon_slot_template, ctx, ctx[10], get_icon_slot_context);
  let if_block = !ctx[8] && create_if_block$2(ctx);
  const default_slot_template = ctx[11].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[10], null);
  const extension_slot_template = ctx[11].extension;
  const extension_slot = create_slot(extension_slot_template, ctx, ctx[10], get_extension_slot_context);
  return {
    c() {
      header = element("header");
      div = element("div");
      if (icon_slot)
        icon_slot.c();
      t0 = space();
      if (if_block)
        if_block.c();
      t1 = space();
      if (default_slot)
        default_slot.c();
      t2 = space();
      if (extension_slot)
        extension_slot.c();
      this.h();
    },
    l(nodes) {
      header = claim_element(nodes, "HEADER", { class: true, style: true });
      var header_nodes = children(header);
      div = claim_element(header_nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (icon_slot)
        icon_slot.l(div_nodes);
      t0 = claim_space(div_nodes);
      if (if_block)
        if_block.l(div_nodes);
      t1 = claim_space(div_nodes);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      t2 = claim_space(header_nodes);
      if (extension_slot)
        extension_slot.l(header_nodes);
      header_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "s-app-bar__wrapper");
      attr(header, "class", header_class_value = "s-app-bar " + ctx[0]);
      attr(header, "style", ctx[9]);
      toggle_class(header, "tile", ctx[2]);
      toggle_class(header, "flat", ctx[3]);
      toggle_class(header, "dense", ctx[4]);
      toggle_class(header, "prominent", ctx[5]);
      toggle_class(header, "fixed", ctx[6]);
      toggle_class(header, "absolute", ctx[7]);
      toggle_class(header, "collapsed", ctx[8]);
    },
    m(target, anchor) {
      insert_hydration(target, header, anchor);
      append_hydration(header, div);
      if (icon_slot) {
        icon_slot.m(div, null);
      }
      append_hydration(div, t0);
      if (if_block)
        if_block.m(div, null);
      append_hydration(div, t1);
      if (default_slot) {
        default_slot.m(div, null);
      }
      append_hydration(header, t2);
      if (extension_slot) {
        extension_slot.m(header, null);
      }
      current = true;
      if (!mounted) {
        dispose = action_destroyer(Style_action = Style.call(null, header, { "app-bar-height": ctx[1] }));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (icon_slot) {
        if (icon_slot.p && (!current || dirty & 1024)) {
          update_slot_base(icon_slot, icon_slot_template, ctx2, ctx2[10], !current ? get_all_dirty_from_scope(ctx2[10]) : get_slot_changes(icon_slot_template, ctx2[10], dirty, get_icon_slot_changes), get_icon_slot_context);
        }
      }
      if (!ctx2[8]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 256) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, t1);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 1024)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[10], !current ? get_all_dirty_from_scope(ctx2[10]) : get_slot_changes(default_slot_template, ctx2[10], dirty, null), null);
        }
      }
      if (extension_slot) {
        if (extension_slot.p && (!current || dirty & 1024)) {
          update_slot_base(extension_slot, extension_slot_template, ctx2, ctx2[10], !current ? get_all_dirty_from_scope(ctx2[10]) : get_slot_changes(extension_slot_template, ctx2[10], dirty, get_extension_slot_changes), get_extension_slot_context);
        }
      }
      if (!current || dirty & 1 && header_class_value !== (header_class_value = "s-app-bar " + ctx2[0])) {
        attr(header, "class", header_class_value);
      }
      if (!current || dirty & 512) {
        attr(header, "style", ctx2[9]);
      }
      if (Style_action && is_function(Style_action.update) && dirty & 2)
        Style_action.update.call(null, { "app-bar-height": ctx2[1] });
      if (dirty & 5) {
        toggle_class(header, "tile", ctx2[2]);
      }
      if (dirty & 9) {
        toggle_class(header, "flat", ctx2[3]);
      }
      if (dirty & 17) {
        toggle_class(header, "dense", ctx2[4]);
      }
      if (dirty & 33) {
        toggle_class(header, "prominent", ctx2[5]);
      }
      if (dirty & 65) {
        toggle_class(header, "fixed", ctx2[6]);
      }
      if (dirty & 129) {
        toggle_class(header, "absolute", ctx2[7]);
      }
      if (dirty & 257) {
        toggle_class(header, "collapsed", ctx2[8]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(icon_slot, local);
      transition_in(if_block);
      transition_in(default_slot, local);
      transition_in(extension_slot, local);
      current = true;
    },
    o(local) {
      transition_out(icon_slot, local);
      transition_out(if_block);
      transition_out(default_slot, local);
      transition_out(extension_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(header);
      if (icon_slot)
        icon_slot.d(detaching);
      if (if_block)
        if_block.d();
      if (default_slot)
        default_slot.d(detaching);
      if (extension_slot)
        extension_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { height = "56px" } = $$props;
  let { tile = false } = $$props;
  let { flat = false } = $$props;
  let { dense = false } = $$props;
  let { prominent = false } = $$props;
  let { fixed = false } = $$props;
  let { absolute = false } = $$props;
  let { collapsed = false } = $$props;
  let { style = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("height" in $$props2)
      $$invalidate(1, height = $$props2.height);
    if ("tile" in $$props2)
      $$invalidate(2, tile = $$props2.tile);
    if ("flat" in $$props2)
      $$invalidate(3, flat = $$props2.flat);
    if ("dense" in $$props2)
      $$invalidate(4, dense = $$props2.dense);
    if ("prominent" in $$props2)
      $$invalidate(5, prominent = $$props2.prominent);
    if ("fixed" in $$props2)
      $$invalidate(6, fixed = $$props2.fixed);
    if ("absolute" in $$props2)
      $$invalidate(7, absolute = $$props2.absolute);
    if ("collapsed" in $$props2)
      $$invalidate(8, collapsed = $$props2.collapsed);
    if ("style" in $$props2)
      $$invalidate(9, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(10, $$scope = $$props2.$$scope);
  };
  return [
    klass,
    height,
    tile,
    flat,
    dense,
    prominent,
    fixed,
    absolute,
    collapsed,
    style,
    $$scope,
    slots
  ];
}
class AppBar extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {
      class: 0,
      height: 1,
      tile: 2,
      flat: 3,
      dense: 4,
      prominent: 5,
      fixed: 6,
      absolute: 7,
      collapsed: 8,
      style: 9
    });
  }
}
var Breadcrumbs_svelte_svelte_type_style_lang = "";
var ProgressLinear_svelte_svelte_type_style_lang = "";
function create_else_block(ctx) {
  let div;
  let BackgroundColor_action;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "determinate svelte-3c8p7x");
      set_style(div, "width", ctx[1] + "%");
      toggle_class(div, "striped", ctx[12]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (!mounted) {
        dispose = action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div, ctx[7]));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        set_style(div, "width", ctx2[1] + "%");
      }
      if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & 128)
        BackgroundColor_action.update.call(null, ctx2[7]);
      if (dirty & 4096) {
        toggle_class(div, "striped", ctx2[12]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1(ctx) {
  let div2;
  let div0;
  let t;
  let div1;
  let BackgroundColor_action;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t = space();
      div1 = element("div");
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", {});
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      children(div0).forEach(detach);
      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      children(div1).forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "indeterminate long svelte-3c8p7x");
      attr(div1, "class", "indeterminate short svelte-3c8p7x");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div2, t);
      append_hydration(div2, div1);
      if (!mounted) {
        dispose = action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div2, ctx[7]));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & 128)
        BackgroundColor_action.update.call(null, ctx2[7]);
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block$1(ctx) {
  let div;
  let div_class_value;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "stream " + ctx[7] + " svelte-3c8p7x");
      set_style(div, "width", 100 - ctx[8] + "%");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 128 && div_class_value !== (div_class_value = "stream " + ctx2[7] + " svelte-3c8p7x")) {
        attr(div, "class", div_class_value);
      }
      if (dirty & 256) {
        set_style(div, "width", 100 - ctx2[8] + "%");
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$3(ctx) {
  let div2;
  let div0;
  let div0_style_value;
  let BackgroundColor_action;
  let t0;
  let t1;
  let div1;
  let t2;
  let div2_class_value;
  let div2_style_value;
  let current;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (ctx2[3])
      return create_if_block_1;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  const default_slot_template = ctx[15].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[14], null);
  let if_block1 = ctx[10] && create_if_block$1(ctx);
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      if_block0.c();
      t1 = space();
      div1 = element("div");
      if (default_slot)
        default_slot.c();
      t2 = space();
      if (if_block1)
        if_block1.c();
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", {
        role: true,
        "aria-valuemin": true,
        "aria-valuemax": true,
        "aria-valuenow": true,
        class: true,
        style: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      children(div0).forEach(detach);
      t0 = claim_space(div2_nodes);
      if_block0.l(div2_nodes);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      if (default_slot)
        default_slot.l(div1_nodes);
      div1_nodes.forEach(detach);
      t2 = claim_space(div2_nodes);
      if (if_block1)
        if_block1.l(div2_nodes);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "background svelte-3c8p7x");
      attr(div0, "style", div0_style_value = "opacity:" + ctx[6] + ";" + (ctx[9] ? "right" : "left") + ":" + ctx[1] + "%;width:" + (ctx[8] - ctx[1]) + "%");
      attr(div1, "class", "s-progress-linear__content svelte-3c8p7x");
      attr(div2, "role", "progressbar");
      attr(div2, "aria-valuemin", "0");
      attr(div2, "aria-valuemax", "100");
      attr(div2, "aria-valuenow", ctx[1]);
      attr(div2, "class", div2_class_value = "s-progress-linear " + ctx[0] + " svelte-3c8p7x");
      attr(div2, "style", div2_style_value = "height:" + ctx[4] + ";" + ctx[13]);
      toggle_class(div2, "inactive", !ctx[2]);
      toggle_class(div2, "reversed", ctx[9]);
      toggle_class(div2, "rounded", ctx[11]);
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div2, t0);
      if_block0.m(div2, null);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      if (default_slot) {
        default_slot.m(div1, null);
      }
      append_hydration(div2, t2);
      if (if_block1)
        if_block1.m(div2, null);
      current = true;
      if (!mounted) {
        dispose = action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, ctx[5]));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & 834 && div0_style_value !== (div0_style_value = "opacity:" + ctx2[6] + ";" + (ctx2[9] ? "right" : "left") + ":" + ctx2[1] + "%;width:" + (ctx2[8] - ctx2[1]) + "%")) {
        attr(div0, "style", div0_style_value);
      }
      if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & 32)
        BackgroundColor_action.update.call(null, ctx2[5]);
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div2, t1);
        }
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16384)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[14], !current ? get_all_dirty_from_scope(ctx2[14]) : get_slot_changes(default_slot_template, ctx2[14], dirty, null), null);
        }
      }
      if (ctx2[10]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block$1(ctx2);
          if_block1.c();
          if_block1.m(div2, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (!current || dirty & 2) {
        attr(div2, "aria-valuenow", ctx2[1]);
      }
      if (!current || dirty & 1 && div2_class_value !== (div2_class_value = "s-progress-linear " + ctx2[0] + " svelte-3c8p7x")) {
        attr(div2, "class", div2_class_value);
      }
      if (!current || dirty & 8208 && div2_style_value !== (div2_style_value = "height:" + ctx2[4] + ";" + ctx2[13])) {
        attr(div2, "style", div2_style_value);
      }
      if (dirty & 5) {
        toggle_class(div2, "inactive", !ctx2[2]);
      }
      if (dirty & 513) {
        toggle_class(div2, "reversed", ctx2[9]);
      }
      if (dirty & 2049) {
        toggle_class(div2, "rounded", ctx2[11]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if_block0.d();
      if (default_slot)
        default_slot.d(detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      dispose();
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { value = 0 } = $$props;
  let { active: active2 = true } = $$props;
  let { indeterminate = false } = $$props;
  let { height = "4px" } = $$props;
  let { backgroundColor = "primary" } = $$props;
  let { backgroundOpacity = 0.3 } = $$props;
  let { color = backgroundColor } = $$props;
  let { buffer = 100 } = $$props;
  let { reversed = false } = $$props;
  let { stream = false } = $$props;
  let { rounded = false } = $$props;
  let { striped = false } = $$props;
  let { style = "" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("value" in $$props2)
      $$invalidate(1, value = $$props2.value);
    if ("active" in $$props2)
      $$invalidate(2, active2 = $$props2.active);
    if ("indeterminate" in $$props2)
      $$invalidate(3, indeterminate = $$props2.indeterminate);
    if ("height" in $$props2)
      $$invalidate(4, height = $$props2.height);
    if ("backgroundColor" in $$props2)
      $$invalidate(5, backgroundColor = $$props2.backgroundColor);
    if ("backgroundOpacity" in $$props2)
      $$invalidate(6, backgroundOpacity = $$props2.backgroundOpacity);
    if ("color" in $$props2)
      $$invalidate(7, color = $$props2.color);
    if ("buffer" in $$props2)
      $$invalidate(8, buffer = $$props2.buffer);
    if ("reversed" in $$props2)
      $$invalidate(9, reversed = $$props2.reversed);
    if ("stream" in $$props2)
      $$invalidate(10, stream = $$props2.stream);
    if ("rounded" in $$props2)
      $$invalidate(11, rounded = $$props2.rounded);
    if ("striped" in $$props2)
      $$invalidate(12, striped = $$props2.striped);
    if ("style" in $$props2)
      $$invalidate(13, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(14, $$scope = $$props2.$$scope);
  };
  return [
    klass,
    value,
    active2,
    indeterminate,
    height,
    backgroundColor,
    backgroundOpacity,
    color,
    buffer,
    reversed,
    stream,
    rounded,
    striped,
    style,
    $$scope,
    slots
  ];
}
class ProgressLinear extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      class: 0,
      value: 1,
      active: 2,
      indeterminate: 3,
      height: 4,
      backgroundColor: 5,
      backgroundOpacity: 6,
      color: 7,
      buffer: 8,
      reversed: 9,
      stream: 10,
      rounded: 11,
      striped: 12,
      style: 13
    });
  }
}
var ProgressCircular_svelte_svelte_type_style_lang = "";
var Snackbar_svelte_svelte_type_style_lang = "";
var Card_svelte_svelte_type_style_lang = "";
const get_progress_slot_changes = (dirty) => ({});
const get_progress_slot_context = (ctx) => ({});
function create_if_block(ctx) {
  let current;
  const progress_slot_template = ctx[12].progress;
  const progress_slot = create_slot(progress_slot_template, ctx, ctx[11], get_progress_slot_context);
  const progress_slot_or_fallback = progress_slot || fallback_block();
  return {
    c() {
      if (progress_slot_or_fallback)
        progress_slot_or_fallback.c();
    },
    l(nodes) {
      if (progress_slot_or_fallback)
        progress_slot_or_fallback.l(nodes);
    },
    m(target, anchor) {
      if (progress_slot_or_fallback) {
        progress_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (progress_slot) {
        if (progress_slot.p && (!current || dirty & 2048)) {
          update_slot_base(progress_slot, progress_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(progress_slot_template, ctx2[11], dirty, get_progress_slot_changes), get_progress_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(progress_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(progress_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (progress_slot_or_fallback)
        progress_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block(ctx) {
  let progresslinear;
  let current;
  progresslinear = new ProgressLinear({ props: { indeterminate: true } });
  return {
    c() {
      create_component(progresslinear.$$.fragment);
    },
    l(nodes) {
      claim_component(progresslinear.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(progresslinear, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(progresslinear.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(progresslinear.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(progresslinear, detaching);
    }
  };
}
function create_fragment$2(ctx) {
  let div;
  let t;
  let div_class_value;
  let current;
  let if_block = ctx[8] && create_if_block(ctx);
  const default_slot_template = ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      t = space();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      if (if_block)
        if_block.l(div_nodes);
      t = claim_space(div_nodes);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-card " + ctx[0]);
      attr(div, "style", ctx[10]);
      toggle_class(div, "flat", ctx[1]);
      toggle_class(div, "tile", ctx[2]);
      toggle_class(div, "outlined", ctx[3]);
      toggle_class(div, "raised", ctx[4]);
      toggle_class(div, "shaped", ctx[5]);
      toggle_class(div, "hover", ctx[6]);
      toggle_class(div, "link", ctx[7]);
      toggle_class(div, "disabled", ctx[9]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
      append_hydration(div, t);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[8]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 256) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, t);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
      if (!current || dirty & 1 && div_class_value !== (div_class_value = "s-card " + ctx2[0])) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & 1024) {
        attr(div, "style", ctx2[10]);
      }
      if (dirty & 3) {
        toggle_class(div, "flat", ctx2[1]);
      }
      if (dirty & 5) {
        toggle_class(div, "tile", ctx2[2]);
      }
      if (dirty & 9) {
        toggle_class(div, "outlined", ctx2[3]);
      }
      if (dirty & 17) {
        toggle_class(div, "raised", ctx2[4]);
      }
      if (dirty & 33) {
        toggle_class(div, "shaped", ctx2[5]);
      }
      if (dirty & 65) {
        toggle_class(div, "hover", ctx2[6]);
      }
      if (dirty & 129) {
        toggle_class(div, "link", ctx2[7]);
      }
      if (dirty & 513) {
        toggle_class(div, "disabled", ctx2[9]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { flat = false } = $$props;
  let { tile = false } = $$props;
  let { outlined = false } = $$props;
  let { raised = false } = $$props;
  let { shaped = false } = $$props;
  let { hover = false } = $$props;
  let { link = false } = $$props;
  let { loading = false } = $$props;
  let { disabled = false } = $$props;
  let { style = null } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("flat" in $$props2)
      $$invalidate(1, flat = $$props2.flat);
    if ("tile" in $$props2)
      $$invalidate(2, tile = $$props2.tile);
    if ("outlined" in $$props2)
      $$invalidate(3, outlined = $$props2.outlined);
    if ("raised" in $$props2)
      $$invalidate(4, raised = $$props2.raised);
    if ("shaped" in $$props2)
      $$invalidate(5, shaped = $$props2.shaped);
    if ("hover" in $$props2)
      $$invalidate(6, hover = $$props2.hover);
    if ("link" in $$props2)
      $$invalidate(7, link = $$props2.link);
    if ("loading" in $$props2)
      $$invalidate(8, loading = $$props2.loading);
    if ("disabled" in $$props2)
      $$invalidate(9, disabled = $$props2.disabled);
    if ("style" in $$props2)
      $$invalidate(10, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(11, $$scope = $$props2.$$scope);
  };
  return [
    klass,
    flat,
    tile,
    outlined,
    raised,
    shaped,
    hover,
    link,
    loading,
    disabled,
    style,
    $$scope,
    slots
  ];
}
class Card extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {
      class: 0,
      flat: 1,
      tile: 2,
      outlined: 3,
      raised: 4,
      shaped: 5,
      hover: 6,
      link: 7,
      loading: 8,
      disabled: 9,
      style: 10
    });
  }
}
var CardActions_svelte_svelte_type_style_lang = "";
function create_fragment$1(ctx) {
  let div;
  let div_class_value;
  let current;
  const default_slot_template = ctx[3].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-card-actions " + ctx[0]);
      attr(div, "style", ctx[1]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[2], !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null), null);
        }
      }
      if (!current || dirty & 1 && div_class_value !== (div_class_value = "s-card-actions " + ctx2[0])) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & 2) {
        attr(div, "style", ctx2[1]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { style = null } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("style" in $$props2)
      $$invalidate(1, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [klass, style, $$scope, slots];
}
class CardActions extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { class: 0, style: 1 });
  }
}
var CardSubtitle_svelte_svelte_type_style_lang = "";
var CardText_svelte_svelte_type_style_lang = "";
function create_fragment(ctx) {
  let div;
  let div_class_value;
  let current;
  const default_slot_template = ctx[3].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = "s-card-text " + ctx[0]);
      attr(div, "style", ctx[1]);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[2], !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null), null);
        }
      }
      if (!current || dirty & 1 && div_class_value !== (div_class_value = "s-card-text " + ctx2[0])) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty & 2) {
        attr(div, "style", ctx2[1]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { class: klass = "" } = $$props;
  let { style = null } = $$props;
  $$self.$$set = ($$props2) => {
    if ("class" in $$props2)
      $$invalidate(0, klass = $$props2.class);
    if ("style" in $$props2)
      $$invalidate(1, style = $$props2.style);
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [klass, style, $$scope, slots];
}
class CardText extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { class: 0, style: 1 });
  }
}
var CardTitle_svelte_svelte_type_style_lang = "";
var NavigationDrawer_svelte_svelte_type_style_lang = "";
var Subheader_svelte_svelte_type_style_lang = "";
var Container_svelte_svelte_type_style_lang = "";
var Row_svelte_svelte_type_style_lang = "";
var Col_svelte_svelte_type_style_lang = "";
var Table_svelte_svelte_type_style_lang = "";
var SlideGroup_svelte_svelte_type_style_lang = "";
var SlideItem_svelte_svelte_type_style_lang = "";
var Window_svelte_svelte_type_style_lang = "";
var WindowItem_svelte_svelte_type_style_lang = "";
var Tabs_svelte_svelte_type_style_lang = "";
var Tab_svelte_svelte_type_style_lang = "";
var Footer_svelte_svelte_type_style_lang = "";
var Tooltip_svelte_svelte_type_style_lang = "";
var mdiDotsVertical = "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";
var mdiMagnify = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z";
var mdiMenu = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z";
export { listen as $, get_spread_object as A, destroy_component as B, assign as C, writable as D, tick as E, create_slot as F, update_slot_base as G, get_all_dirty_from_scope as H, get_slot_changes as I, append_hydration as J, noop as K, AppBar as L, MaterialApp as M, Button as N, Overlay as O, Menu as P, Icon as Q, mdiMagnify as R, SvelteComponent as S, destroy_each as T, mdiMenu as U, ListItem as V, mdiDotsVertical as W, add_render_callback as X, create_out_transition as Y, create_in_transition as Z, fade as _, children as a, Card as a0, fly as a1, CardText as a2, CardActions as a3, prevent_default as a4, add_flush_callback as a5, ButtonGroup as a6, binding_callbacks as a7, bind as a8, ButtonGroupItem as a9, is_function as aa, attr as b, claim_element as c, detach as d, element as e, set_style as f, insert_hydration as g, claim_text as h, init as i, set_data as j, space as k, empty as l, claim_space as m, group_outros as n, transition_out as o, check_outros as p, transition_in as q, setContext as r, safe_not_equal as s, text as t, afterUpdate as u, onMount as v, create_component as w, claim_component as x, mount_component as y, get_spread_update as z };

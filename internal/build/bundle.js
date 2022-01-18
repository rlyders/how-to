
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
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
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
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
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
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
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
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
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
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
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
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
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
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
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
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
                }
                else {
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
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
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
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
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
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
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
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.45.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* eslint-disable no-param-reassign */

    /**
     * Options for customizing ripples
     */
    const defaults = {
      color: 'currentColor',
      class: '',
      opacity: 0.1,
      centered: false,
      spreadingDuration: '.4s',
      spreadingDelay: '0s',
      spreadingTimingFunction: 'linear',
      clearingDuration: '1s',
      clearingDelay: '0s',
      clearingTimingFunction: 'ease-in-out',
    };

    /**
     * Creates a ripple element but does not destroy it (use RippleStop for that)
     *
     * @param {Event} e
     * @param {*} options
     * @returns Ripple element
     */
    function RippleStart(e, options = {}) {
      e.stopImmediatePropagation();
      const opts = { ...defaults, ...options };

      const isTouchEvent = e.touches ? !!e.touches[0] : false;
      // Parent element
      const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;

      // Create ripple
      const ripple = document.createElement('div');
      const rippleStyle = ripple.style;

      // Adding default stuff
      ripple.className = `material-ripple ${opts.class}`;
      rippleStyle.position = 'absolute';
      rippleStyle.color = 'inherit';
      rippleStyle.borderRadius = '50%';
      rippleStyle.pointerEvents = 'none';
      rippleStyle.width = '100px';
      rippleStyle.height = '100px';
      rippleStyle.marginTop = '-50px';
      rippleStyle.marginLeft = '-50px';
      target.appendChild(ripple);
      rippleStyle.opacity = opts.opacity;
      rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
      rippleStyle.transform = 'scale(0) translate(0,0)';
      rippleStyle.background = opts.color;

      // Positioning ripple
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

      // Enlarge ripple
      rippleStyle.transform = `scale(${
    Math.max(targetRect.width, targetRect.height) * 0.02
  }) translate(0,0)`;
      return ripple;
    }

    /**
     * Destroys the ripple, slowly fading it out.
     *
     * @param {Element} ripple
     */
    function RippleStop(ripple) {
      if (ripple) {
        ripple.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') ripple.remove();
        });
        ripple.style.opacity = 0;
      }
    }

    /**
     * @param node {Element}
     */
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
          ripple = RippleStart(e, { ...options, centered: true });
          keyboardActive = true;
        }
      };
      const handleKeyboardStop = () => {
        keyboardActive = false;
        handleStop();
      };

      function setup() {
        node.classList.add('s-ripple-container');
        node.addEventListener('pointerdown', handleStart);
        node.addEventListener('pointerup', handleStop);
        node.addEventListener('pointerleave', handleStop);
        node.addEventListener('keydown', handleKeyboardStart);
        node.addEventListener('keyup', handleKeyboardStop);
        destroyed = false;
      }

      function destroy() {
        node.classList.remove('s-ripple-container');
        node.removeEventListener('pointerdown', handleStart);
        node.removeEventListener('pointerup', handleStop);
        node.removeEventListener('pointerleave', handleStop);
        node.removeEventListener('keydown', handleKeyboardStart);
        node.removeEventListener('keyup', handleKeyboardStop);
        destroyed = true;
      }

      if (options) setup();

      return {
        update(newOptions) {
          options = newOptions;
          if (options && destroyed) setup();
          else if (!(options || destroyed)) destroy();
        },
        destroy,
      };
    };

    /**
     * Click Outside
     * @param {Node} node
     */
    var ClickOutside = (node, _options = {}) => {
      const options = { include: [], ..._options };

      function detect({ target }) {
        if (!node.contains(target) || options.include.some((i) => target.isSameNode(i))) {
          node.dispatchEvent(new CustomEvent('clickOutside'));
        }
      }
      document.addEventListener('click', detect, { passive: true, capture: true });
      return {
        destroy() {
          document.removeEventListener('click', detect);
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\MaterialApp\MaterialApp.svelte generated by Svelte v3.45.0 */

    const file$f = "node_modules\\svelte-materialify\\dist\\components\\MaterialApp\\MaterialApp.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-app theme--" + /*theme*/ ctx[0]);
    			add_location(div, file$f, 13088, 0, 248639);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*theme*/ 1 && div_class_value !== (div_class_value = "s-app theme--" + /*theme*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MaterialApp', slots, ['default']);
    	let { theme = 'light' } = $$props;
    	const writable_props = ['theme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MaterialApp> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ theme });

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, $$scope, slots];
    }

    class MaterialApp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { theme: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MaterialApp",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get theme() {
    		throw new Error("<MaterialApp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<MaterialApp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function format$1(input) {
      if (typeof input === 'number') return `${input}px`;
      return input;
    }

    /**
     * @param node {Element}
     * @param styles {Object}
     */
    var Style = (node, _styles) => {
      let styles = _styles;
      Object.entries(styles).forEach(([key, value]) => {
        if (value) node.style.setProperty(`--s-${key}`, format$1(value));
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
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Icon\Icon.svelte generated by Svelte v3.45.0 */
    const file$e = "node_modules\\svelte-materialify\\dist\\components\\Icon\\Icon.svelte";

    // (73:2) {#if path}
    function create_if_block$7(ctx) {
    	let svg;
    	let path_1;
    	let svg_viewBox_value;
    	let if_block = /*label*/ ctx[10] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			if (if_block) if_block.c();
    			attr_dev(path_1, "d", /*path*/ ctx[9]);
    			add_location(path_1, file$e, 78, 6, 1726);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*viewWidth*/ ctx[4] + " " + /*viewHeight*/ ctx[5]);
    			add_location(svg, file$e, 73, 4, 1594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path_1);
    			if (if_block) if_block.m(path_1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*label*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(path_1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*path*/ 512) {
    				attr_dev(path_1, "d", /*path*/ ctx[9]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewWidth, viewHeight*/ 48 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*viewWidth*/ ctx[4] + " " + /*viewHeight*/ ctx[5])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(73:2) {#if path}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {#if label}
    function create_if_block_1$2(ctx) {
    	let title;
    	let t;

    	const block = {
    		c: function create() {
    			title = svg_element("title");
    			t = text(/*label*/ ctx[10]);
    			add_location(title, file$e, 80, 10, 1774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			append_dev(title, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 1024) set_data_dev(t, /*label*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(80:8) {#if label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let i;
    	let t;
    	let i_class_value;
    	let Style_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*path*/ ctx[9] && create_if_block$7(ctx);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(i, "aria-hidden", "true");
    			attr_dev(i, "class", i_class_value = "s-icon " + /*klass*/ ctx[2]);
    			attr_dev(i, "aria-label", /*label*/ ctx[10]);
    			attr_dev(i, "aria-disabled", /*disabled*/ ctx[8]);
    			attr_dev(i, "style", /*style*/ ctx[11]);
    			toggle_class(i, "spin", /*spin*/ ctx[7]);
    			toggle_class(i, "disabled", /*disabled*/ ctx[8]);
    			add_location(i, file$e, 63, 0, 1362);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			if (if_block) if_block.m(i, null);
    			append_dev(i, t);

    			if (default_slot) {
    				default_slot.m(i, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(Style_action = Style.call(null, i, {
    					'icon-size': /*size*/ ctx[3],
    					'icon-rotate': `${/*rotate*/ ctx[6]}deg`
    				}));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*path*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(i, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 4 && i_class_value !== (i_class_value = "s-icon " + /*klass*/ ctx[2])) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (!current || dirty & /*label*/ 1024) {
    				attr_dev(i, "aria-label", /*label*/ ctx[10]);
    			}

    			if (!current || dirty & /*disabled*/ 256) {
    				attr_dev(i, "aria-disabled", /*disabled*/ ctx[8]);
    			}

    			if (!current || dirty & /*style*/ 2048) {
    				attr_dev(i, "style", /*style*/ ctx[11]);
    			}

    			if (Style_action && is_function(Style_action.update) && dirty & /*size, rotate*/ 72) Style_action.update.call(null, {
    				'icon-size': /*size*/ ctx[3],
    				'icon-rotate': `${/*rotate*/ ctx[6]}deg`
    			});

    			if (dirty & /*klass, spin*/ 132) {
    				toggle_class(i, "spin", /*spin*/ ctx[7]);
    			}

    			if (dirty & /*klass, disabled*/ 260) {
    				toggle_class(i, "disabled", /*disabled*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { size = '24px' } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { viewWidth = '24' } = $$props;
    	let { viewHeight = '24' } = $$props;
    	let { rotate = 0 } = $$props;
    	let { spin = false } = $$props;
    	let { disabled = false } = $$props;
    	let { path = null } = $$props;
    	let { label = null } = $$props;
    	let { style = null } = $$props;

    	const writable_props = [
    		'class',
    		'size',
    		'width',
    		'height',
    		'viewWidth',
    		'viewHeight',
    		'rotate',
    		'spin',
    		'disabled',
    		'path',
    		'label',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(2, klass = $$props.class);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('viewWidth' in $$props) $$invalidate(4, viewWidth = $$props.viewWidth);
    		if ('viewHeight' in $$props) $$invalidate(5, viewHeight = $$props.viewHeight);
    		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
    		if ('spin' in $$props) $$invalidate(7, spin = $$props.spin);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$props.disabled);
    		if ('path' in $$props) $$invalidate(9, path = $$props.path);
    		if ('label' in $$props) $$invalidate(10, label = $$props.label);
    		if ('style' in $$props) $$invalidate(11, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Style,
    		klass,
    		size,
    		width,
    		height,
    		viewWidth,
    		viewHeight,
    		rotate,
    		spin,
    		disabled,
    		path,
    		label,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(2, klass = $$props.klass);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('viewWidth' in $$props) $$invalidate(4, viewWidth = $$props.viewWidth);
    		if ('viewHeight' in $$props) $$invalidate(5, viewHeight = $$props.viewHeight);
    		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
    		if ('spin' in $$props) $$invalidate(7, spin = $$props.spin);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$props.disabled);
    		if ('path' in $$props) $$invalidate(9, path = $$props.path);
    		if ('label' in $$props) $$invalidate(10, label = $$props.label);
    		if ('style' in $$props) $$invalidate(11, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size*/ 8) {
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

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewWidth() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewWidth(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewHeight() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewHeight(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotate() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotate(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const filter = (classes) => classes.filter((x) => !!x);
    const format = (classes) => classes.split(' ').filter((x) => !!x);

    /**
     * @param node {Element}
     * @param classes {Array<string>}
     */
    var Class = (node, _classes) => {
      let classes = _classes;
      node.classList.add(...format(filter(classes).join(' ')));
      return {
        update(_newClasses) {
          const newClasses = _newClasses;
          newClasses.forEach((klass, i) => {
            if (klass) node.classList.add(...format(klass));
            else if (classes[i]) node.classList.remove(...format(classes[i]));
          });
          classes = newClasses;
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Button\Button.svelte generated by Svelte v3.45.0 */
    const file$d = "node_modules\\svelte-materialify\\dist\\components\\Button\\Button.svelte";

    function create_fragment$e(ctx) {
    	let button_1;
    	let span;
    	let button_1_class_value;
    	let Class_action;
    	let Ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	let button_1_levels = [
    		{
    			class: button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1]
    		},
    		{ type: /*type*/ ctx[14] },
    		{ style: /*style*/ ctx[16] },
    		{ disabled: /*disabled*/ ctx[11] },
    		{ "aria-disabled": /*disabled*/ ctx[11] },
    		/*$$restProps*/ ctx[17]
    	];

    	let button_1_data = {};

    	for (let i = 0; i < button_1_levels.length; i += 1) {
    		button_1_data = assign(button_1_data, button_1_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button_1 = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "s-btn__content");
    			add_location(span, file$d, 272, 2, 5902);
    			set_attributes(button_1, button_1_data);
    			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
    			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
    			toggle_class(button_1, "block", /*block*/ ctx[4]);
    			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
    			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
    			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
    			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
    			add_location(button_1, file$d, 252, 0, 5452);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button_1, anchor);
    			append_dev(button_1, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			if (button_1.autofocus) button_1.focus();
    			/*button_1_binding*/ ctx[21](button_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Class_action = Class.call(null, button_1, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]])),
    					action_destroyer(Ripple_action = Ripple.call(null, button_1, /*ripple*/ ctx[15])),
    					listen_dev(button_1, "click", /*click_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button_1, button_1_data = get_spread_update(button_1_levels, [
    				(!current || dirty & /*size, klass*/ 34 && button_1_class_value !== (button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1])) && { class: button_1_class_value },
    				(!current || dirty & /*type*/ 16384) && { type: /*type*/ ctx[14] },
    				(!current || dirty & /*style*/ 65536) && { style: /*style*/ ctx[16] },
    				(!current || dirty & /*disabled*/ 2048) && { disabled: /*disabled*/ ctx[11] },
    				(!current || dirty & /*disabled*/ 2048) && { "aria-disabled": /*disabled*/ ctx[11] },
    				dirty & /*$$restProps*/ 131072 && /*$$restProps*/ ctx[17]
    			]));

    			if (Class_action && is_function(Class_action.update) && dirty & /*active, activeClass*/ 12288) Class_action.update.call(null, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]]);
    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 32768) Ripple_action.update.call(null, /*ripple*/ ctx[15]);
    			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
    			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
    			toggle_class(button_1, "block", /*block*/ ctx[4]);
    			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
    			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
    			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
    			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button_1);
    			if (default_slot) default_slot.d(detaching);
    			/*button_1_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","fab","icon","block","size","tile","text","depressed","outlined","rounded","disabled","active","activeClass","type","ripple","style","button"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { fab = false } = $$props;
    	let { icon = false } = $$props;
    	let { block = false } = $$props;
    	let { size = 'default' } = $$props;
    	let { tile = false } = $$props;
    	let { text = false } = $$props;
    	let { depressed = false } = $$props;
    	let { outlined = false } = $$props;
    	let { rounded = false } = $$props;
    	let { disabled = null } = $$props;
    	let { active = false } = $$props;
    	let { activeClass = 'active' } = $$props;
    	let { type = 'button' } = $$props;
    	let { ripple = {} } = $$props;
    	let { style = null } = $$props;
    	let { button = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(0, button);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, klass = $$new_props.class);
    		if ('fab' in $$new_props) $$invalidate(2, fab = $$new_props.fab);
    		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ('block' in $$new_props) $$invalidate(4, block = $$new_props.block);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('tile' in $$new_props) $$invalidate(6, tile = $$new_props.tile);
    		if ('text' in $$new_props) $$invalidate(7, text = $$new_props.text);
    		if ('depressed' in $$new_props) $$invalidate(8, depressed = $$new_props.depressed);
    		if ('outlined' in $$new_props) $$invalidate(9, outlined = $$new_props.outlined);
    		if ('rounded' in $$new_props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('disabled' in $$new_props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('active' in $$new_props) $$invalidate(12, active = $$new_props.active);
    		if ('activeClass' in $$new_props) $$invalidate(13, activeClass = $$new_props.activeClass);
    		if ('type' in $$new_props) $$invalidate(14, type = $$new_props.type);
    		if ('ripple' in $$new_props) $$invalidate(15, ripple = $$new_props.ripple);
    		if ('style' in $$new_props) $$invalidate(16, style = $$new_props.style);
    		if ('button' in $$new_props) $$invalidate(0, button = $$new_props.button);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Ripple,
    		Class,
    		klass,
    		fab,
    		icon,
    		block,
    		size,
    		tile,
    		text,
    		depressed,
    		outlined,
    		rounded,
    		disabled,
    		active,
    		activeClass,
    		type,
    		ripple,
    		style,
    		button
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$new_props.klass);
    		if ('fab' in $$props) $$invalidate(2, fab = $$new_props.fab);
    		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ('block' in $$props) $$invalidate(4, block = $$new_props.block);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('tile' in $$props) $$invalidate(6, tile = $$new_props.tile);
    		if ('text' in $$props) $$invalidate(7, text = $$new_props.text);
    		if ('depressed' in $$props) $$invalidate(8, depressed = $$new_props.depressed);
    		if ('outlined' in $$props) $$invalidate(9, outlined = $$new_props.outlined);
    		if ('rounded' in $$props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('disabled' in $$props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('active' in $$props) $$invalidate(12, active = $$new_props.active);
    		if ('activeClass' in $$props) $$invalidate(13, activeClass = $$new_props.activeClass);
    		if ('type' in $$props) $$invalidate(14, type = $$new_props.type);
    		if ('ripple' in $$props) $$invalidate(15, ripple = $$new_props.ripple);
    		if ('style' in $$props) $$invalidate(16, style = $$new_props.style);
    		if ('button' in $$props) $$invalidate(0, button = $$new_props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		button,
    		klass,
    		fab,
    		icon,
    		block,
    		size,
    		tile,
    		text,
    		depressed,
    		outlined,
    		rounded,
    		disabled,
    		active,
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

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get depressed() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depressed(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get button() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set button(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
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
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* node_modules\svelte-materialify\dist\components\ItemGroup\ItemGroup.svelte generated by Svelte v3.45.0 */
    const file$c = "node_modules\\svelte-materialify\\dist\\components\\ItemGroup\\ItemGroup.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-item-group " + /*klass*/ ctx[0]);
    			attr_dev(div, "role", /*role*/ ctx[1]);
    			attr_dev(div, "style", /*style*/ ctx[2]);
    			add_location(div, file$c, 58, 0, 1536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-item-group " + /*klass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*role*/ 2) {
    				attr_dev(div, "role", /*role*/ ctx[1]);
    			}

    			if (!current || dirty & /*style*/ 4) {
    				attr_dev(div, "style", /*style*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ITEM_GROUP = {};

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemGroup', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { activeClass = '' } = $$props;
    	let { value = [] } = $$props;
    	let { multiple = false } = $$props;
    	let { mandatory = false } = $$props;
    	let { max = Infinity } = $$props;
    	let { role = null } = $$props;
    	let { style = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const valueStore = writable(value);
    	let startIndex = -1;

    	setContext(ITEM_GROUP, {
    		select: val => {
    			if (multiple) {
    				if (value.includes(val)) {
    					if (!mandatory || value.length > 1) {
    						value.splice(value.indexOf(val), 1);
    						$$invalidate(3, value);
    					}
    				} else if (value.length < max) $$invalidate(3, value = [...value, val]);
    			} else if (value === val) {
    				if (!mandatory) $$invalidate(3, value = null);
    			} else $$invalidate(3, value = val);
    		},
    		register: setValue => {
    			const u = valueStore.subscribe(val => {
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

    	const writable_props = [
    		'class',
    		'activeClass',
    		'value',
    		'multiple',
    		'mandatory',
    		'max',
    		'role',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('activeClass' in $$props) $$invalidate(4, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('multiple' in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ('mandatory' in $$props) $$invalidate(6, mandatory = $$props.mandatory);
    		if ('max' in $$props) $$invalidate(7, max = $$props.max);
    		if ('role' in $$props) $$invalidate(1, role = $$props.role);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ITEM_GROUP,
    		setContext,
    		createEventDispatcher,
    		onDestroy,
    		writable,
    		klass,
    		activeClass,
    		value,
    		multiple,
    		mandatory,
    		max,
    		role,
    		style,
    		dispatch,
    		valueStore,
    		startIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('activeClass' in $$props) $$invalidate(4, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('multiple' in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ('mandatory' in $$props) $$invalidate(6, mandatory = $$props.mandatory);
    		if ('max' in $$props) $$invalidate(7, max = $$props.max);
    		if ('role' in $$props) $$invalidate(1, role = $$props.role);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('startIndex' in $$props) startIndex = $$props.startIndex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 8) {
    			valueStore.set(value);
    		}

    		if ($$self.$$.dirty & /*value*/ 8) {
    			dispatch('change', value);
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

    class ItemGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			class: 0,
    			activeClass: 4,
    			value: 3,
    			multiple: 5,
    			mandatory: 6,
    			max: 7,
    			role: 1,
    			style: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemGroup",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mandatory() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mandatory(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\ButtonGroup\ButtonGroup.svelte generated by Svelte v3.45.0 */
    const file$b = "node_modules\\svelte-materialify\\dist\\components\\ButtonGroup\\ButtonGroup.svelte";

    // (64:0) <ItemGroup on:change bind:value {activeClass} {multiple} {mandatory} {max}>
    function create_default_slot$3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-btn-group " + /*klass*/ ctx[1]);
    			attr_dev(div, "style", /*style*/ ctx[10]);
    			toggle_class(div, "elevated", /*elevated*/ ctx[2]);
    			toggle_class(div, "borderless", /*borderless*/ ctx[3]);
    			toggle_class(div, "tile", /*tile*/ ctx[4]);
    			toggle_class(div, "rounded", /*rounded*/ ctx[5]);
    			add_location(div, file$b, 64, 2, 1505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 2 && div_class_value !== (div_class_value = "s-btn-group " + /*klass*/ ctx[1])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 1024) {
    				attr_dev(div, "style", /*style*/ ctx[10]);
    			}

    			if (dirty & /*klass, elevated*/ 6) {
    				toggle_class(div, "elevated", /*elevated*/ ctx[2]);
    			}

    			if (dirty & /*klass, borderless*/ 10) {
    				toggle_class(div, "borderless", /*borderless*/ ctx[3]);
    			}

    			if (dirty & /*klass, tile*/ 18) {
    				toggle_class(div, "tile", /*tile*/ ctx[4]);
    			}

    			if (dirty & /*klass, rounded*/ 34) {
    				toggle_class(div, "rounded", /*rounded*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(64:0) <ItemGroup on:change bind:value {activeClass} {multiple} {mandatory} {max}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let itemgroup;
    	let updating_value;
    	let current;

    	function itemgroup_value_binding(value) {
    		/*itemgroup_value_binding*/ ctx[12](value);
    	}

    	let itemgroup_props = {
    		activeClass: /*activeClass*/ ctx[6],
    		multiple: /*multiple*/ ctx[8],
    		mandatory: /*mandatory*/ ctx[7],
    		max: /*max*/ ctx[9],
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		itemgroup_props.value = /*value*/ ctx[0];
    	}

    	itemgroup = new ItemGroup({ props: itemgroup_props, $$inline: true });
    	binding_callbacks.push(() => bind(itemgroup, 'value', itemgroup_value_binding));
    	itemgroup.$on("change", /*change_handler*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(itemgroup.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const itemgroup_changes = {};
    			if (dirty & /*activeClass*/ 64) itemgroup_changes.activeClass = /*activeClass*/ ctx[6];
    			if (dirty & /*multiple*/ 256) itemgroup_changes.multiple = /*multiple*/ ctx[8];
    			if (dirty & /*mandatory*/ 128) itemgroup_changes.mandatory = /*mandatory*/ ctx[7];
    			if (dirty & /*max*/ 512) itemgroup_changes.max = /*max*/ ctx[9];

    			if (dirty & /*$$scope, klass, style, elevated, borderless, tile, rounded*/ 17470) {
    				itemgroup_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				itemgroup_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			itemgroup.$set(itemgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonGroup', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { elevated = false } = $$props;
    	let { borderless = false } = $$props;
    	let { tile = false } = $$props;
    	let { rounded = false } = $$props;
    	let { activeClass = 'active' } = $$props;
    	let { value = [] } = $$props;
    	let { mandatory = false } = $$props;
    	let { multiple = false } = $$props;
    	let { max = Infinity } = $$props;
    	let { style = null } = $$props;

    	const writable_props = [
    		'class',
    		'elevated',
    		'borderless',
    		'tile',
    		'rounded',
    		'activeClass',
    		'value',
    		'mandatory',
    		'multiple',
    		'max',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonGroup> was created with unknown prop '${key}'`);
    	});

    	function itemgroup_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('elevated' in $$props) $$invalidate(2, elevated = $$props.elevated);
    		if ('borderless' in $$props) $$invalidate(3, borderless = $$props.borderless);
    		if ('tile' in $$props) $$invalidate(4, tile = $$props.tile);
    		if ('rounded' in $$props) $$invalidate(5, rounded = $$props.rounded);
    		if ('activeClass' in $$props) $$invalidate(6, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('mandatory' in $$props) $$invalidate(7, mandatory = $$props.mandatory);
    		if ('multiple' in $$props) $$invalidate(8, multiple = $$props.multiple);
    		if ('max' in $$props) $$invalidate(9, max = $$props.max);
    		if ('style' in $$props) $$invalidate(10, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ItemGroup,
    		klass,
    		elevated,
    		borderless,
    		tile,
    		rounded,
    		activeClass,
    		value,
    		mandatory,
    		multiple,
    		max,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('elevated' in $$props) $$invalidate(2, elevated = $$props.elevated);
    		if ('borderless' in $$props) $$invalidate(3, borderless = $$props.borderless);
    		if ('tile' in $$props) $$invalidate(4, tile = $$props.tile);
    		if ('rounded' in $$props) $$invalidate(5, rounded = $$props.rounded);
    		if ('activeClass' in $$props) $$invalidate(6, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('mandatory' in $$props) $$invalidate(7, mandatory = $$props.mandatory);
    		if ('multiple' in $$props) $$invalidate(8, multiple = $$props.multiple);
    		if ('max' in $$props) $$invalidate(9, max = $$props.max);
    		if ('style' in $$props) $$invalidate(10, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    class ButtonGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonGroup",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get elevated() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elevated(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mandatory() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mandatory(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\ButtonGroup\ButtonGroupItem.svelte generated by Svelte v3.45.0 */

    // (47:0) <Button   class="s-btn-group-item {klass}"   {activeClass}   {active}   {disabled}   on:click={click}   on:click>
    function create_default_slot$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(47:0) <Button   class=\\\"s-btn-group-item {klass}\\\"   {activeClass}   {active}   {disabled}   on:click={click}   on:click>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				class: "s-btn-group-item " + /*klass*/ ctx[0],
    				activeClass: /*activeClass*/ ctx[1],
    				active: /*active*/ ctx[3],
    				disabled: /*disabled*/ ctx[2],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click*/ ctx[4]);
    	button.$on("click", /*click_handler*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};
    			if (dirty & /*klass*/ 1) button_changes.class = "s-btn-group-item " + /*klass*/ ctx[0];
    			if (dirty & /*activeClass*/ 2) button_changes.activeClass = /*activeClass*/ ctx[1];
    			if (dirty & /*active*/ 8) button_changes.active = /*active*/ ctx[3];
    			if (dirty & /*disabled*/ 4) button_changes.disabled = /*disabled*/ ctx[2];

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonGroupItem', slots, ['default']);
    	const ITEM = getContext(ITEM_GROUP);
    	let active;
    	let { class: klass = '' } = $$props;
    	let { value = ITEM.index() } = $$props;
    	let { activeClass = ITEM.activeClass } = $$props;
    	let { disabled = null } = $$props;

    	ITEM.register(values => {
    		$$invalidate(3, active = values.includes(value));
    	});

    	function click() {
    		if (!disabled) ITEM.select(value);
    	}

    	const writable_props = ['class', 'value', 'activeClass', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonGroupItem> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('activeClass' in $$props) $$invalidate(1, activeClass = $$props.activeClass);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Button,
    		ITEM_GROUP,
    		ITEM,
    		active,
    		klass,
    		value,
    		activeClass,
    		disabled,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('activeClass' in $$props) $$invalidate(1, activeClass = $$props.activeClass);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		activeClass,
    		disabled,
    		active,
    		click,
    		value,
    		slots,
    		click_handler,
    		$$scope
    	];
    }

    class ButtonGroupItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			class: 0,
    			value: 5,
    			activeClass: 1,
    			disabled: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonGroupItem",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<ButtonGroupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ButtonGroupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ButtonGroupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ButtonGroupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ButtonGroupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ButtonGroupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ButtonGroupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ButtonGroupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable */
    // Shamefully ripped from https://github.com/lukeed/uid
    let IDX = 36;
    let HEX = '';
    while (IDX--) HEX += IDX.toString(36);

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules\svelte-materialify\dist\components\Menu\Menu.svelte generated by Svelte v3.45.0 */
    const file$a = "node_modules\\svelte-materialify\\dist\\components\\Menu\\Menu.svelte";
    const get_activator_slot_changes = dirty => ({});
    const get_activator_slot_context = ctx => ({});

    // (145:2) {#if active}
    function create_if_block$6(ctx) {
    	let div;
    	let div_class_value;
    	let div_style_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-menu " + /*klass*/ ctx[1]);
    			attr_dev(div, "role", "menu");
    			attr_dev(div, "style", div_style_value = "" + (/*position*/ ctx[9] + ";transform-origin:" + /*origin*/ ctx[8] + ";z-index:" + /*index*/ ctx[6] + ";" + /*style*/ ctx[7]));
    			toggle_class(div, "tile", /*tile*/ ctx[5]);
    			add_location(div, file$a, 145, 4, 3668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*menuClick*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*klass*/ 2 && div_class_value !== (div_class_value = "s-menu " + /*klass*/ ctx[1])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*position, origin, index, style*/ 960 && div_style_value !== (div_style_value = "" + (/*position*/ ctx[9] + ";transform-origin:" + /*origin*/ ctx[8] + ";z-index:" + /*index*/ ctx[6] + ";" + /*style*/ ctx[7]))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty[0] & /*klass, tile*/ 34) {
    				toggle_class(div, "tile", /*tile*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*transition*/ ctx[2], /*inOpts*/ ctx[3]);
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*transition*/ ctx[2], /*outOpts*/ ctx[4]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(145:2) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const activator_slot_template = /*#slots*/ ctx[26].activator;
    	const activator_slot = create_slot(activator_slot_template, ctx, /*$$scope*/ ctx[25], get_activator_slot_context);
    	let if_block = /*active*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (activator_slot) activator_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "s-menu__wrapper");
    			add_location(div, file$a, 136, 0, 3467);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (activator_slot) {
    				activator_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[27](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(ClickOutside.call(null, div)),
    					listen_dev(div, "clickOutside", /*clickOutsideMenu*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (activator_slot) {
    				if (activator_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						activator_slot,
    						activator_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(activator_slot_template, /*$$scope*/ ctx[25], dirty, get_activator_slot_changes),
    						get_activator_slot_context
    					);
    				}
    			}

    			if (/*active*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*active*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activator_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activator_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (activator_slot) activator_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, ['activator','default']);
    	let { class: klass = '' } = $$props;
    	let { active = false } = $$props;
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
    	let { style = '' } = $$props;
    	let origin = 'top left';
    	let position;
    	let wrapper;
    	const dispatch = createEventDispatcher();

    	const align = {
    		x: right ? 'right' : 'left',
    		y: bottom ? 'bottom' : 'top'
    	};

    	setContext('S_ListItemRole', 'menuitem');
    	setContext('S_ListItemRipple', true);

    	// For opening the menu
    	function open(posX = 0, posY = 0) {
    		$$invalidate(0, active = true);
    		const rect = wrapper.getBoundingClientRect();
    		let x = nudgeX;
    		let y = nudgeY;

    		if (absolute) {
    			x += posX;
    			y += posY;
    		} else {
    			if (offsetX) x += rect.width;
    			if (offsetY) y += rect.height;
    		}

    		$$invalidate(9, position = `${align.y}:${y}px;${align.x}:${x}px`);
    		$$invalidate(8, origin = `${align.y} ${align.x}`);

    		/**
     * Event when menu is opened.
     * @returns Nothing
     */
    		dispatch('open');
    	}

    	// For closing the menu.
    	function close() {
    		$$invalidate(0, active = false);

    		/**
     * Event when menu is closed.
     * @returns Nothing
     */
    		dispatch('close');
    	}

    	// When the activator slot is clicked.
    	function triggerClick(e) {
    		if (!disabled) {
    			if (active) {
    				close();
    			} else if (openOnClick) {
    				open(e.offsetX, e.offsetY);
    			}
    		}
    	}

    	// When the menu itself is clicked.
    	function menuClick() {
    		if (active && closeOnClick) close();
    	}

    	// When user clicked somewhere outside the menu.
    	function clickOutsideMenu() {
    		if (active && closeOnClickOutside) close();
    	}

    	onMount(() => {
    		const trigger = wrapper.querySelector("[slot='activator']");

    		// Opening the menu if active is set to true.
    		if (active) open();

    		trigger.addEventListener('click', triggerClick, { passive: true });

    		if (hover) {
    			wrapper.addEventListener('mouseenter', open, { passive: true });
    			wrapper.addEventListener('mouseleave', close, { passive: true });
    		}

    		return () => {
    			trigger.removeEventListener('click', triggerClick);

    			if (hover) {
    				wrapper.removeEventListener('mouseenter', open);
    				wrapper.removeEventListener('mouseleave', close);
    			}
    		};
    	});

    	const writable_props = [
    		'class',
    		'active',
    		'absolute',
    		'transition',
    		'inOpts',
    		'outOpts',
    		'offsetX',
    		'offsetY',
    		'nudgeX',
    		'nudgeY',
    		'openOnClick',
    		'hover',
    		'closeOnClickOutside',
    		'closeOnClick',
    		'bottom',
    		'right',
    		'tile',
    		'disabled',
    		'index',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(10, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('absolute' in $$props) $$invalidate(13, absolute = $$props.absolute);
    		if ('transition' in $$props) $$invalidate(2, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(3, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(4, outOpts = $$props.outOpts);
    		if ('offsetX' in $$props) $$invalidate(14, offsetX = $$props.offsetX);
    		if ('offsetY' in $$props) $$invalidate(15, offsetY = $$props.offsetY);
    		if ('nudgeX' in $$props) $$invalidate(16, nudgeX = $$props.nudgeX);
    		if ('nudgeY' in $$props) $$invalidate(17, nudgeY = $$props.nudgeY);
    		if ('openOnClick' in $$props) $$invalidate(18, openOnClick = $$props.openOnClick);
    		if ('hover' in $$props) $$invalidate(19, hover = $$props.hover);
    		if ('closeOnClickOutside' in $$props) $$invalidate(20, closeOnClickOutside = $$props.closeOnClickOutside);
    		if ('closeOnClick' in $$props) $$invalidate(21, closeOnClick = $$props.closeOnClick);
    		if ('bottom' in $$props) $$invalidate(22, bottom = $$props.bottom);
    		if ('right' in $$props) $$invalidate(23, right = $$props.right);
    		if ('tile' in $$props) $$invalidate(5, tile = $$props.tile);
    		if ('disabled' in $$props) $$invalidate(24, disabled = $$props.disabled);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(25, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ClickOutside,
    		onMount,
    		setContext,
    		createEventDispatcher,
    		fade,
    		klass,
    		active,
    		absolute,
    		transition,
    		inOpts,
    		outOpts,
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
    		tile,
    		disabled,
    		index,
    		style,
    		origin,
    		position,
    		wrapper,
    		dispatch,
    		align,
    		open,
    		close,
    		triggerClick,
    		menuClick,
    		clickOutsideMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('absolute' in $$props) $$invalidate(13, absolute = $$props.absolute);
    		if ('transition' in $$props) $$invalidate(2, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(3, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(4, outOpts = $$props.outOpts);
    		if ('offsetX' in $$props) $$invalidate(14, offsetX = $$props.offsetX);
    		if ('offsetY' in $$props) $$invalidate(15, offsetY = $$props.offsetY);
    		if ('nudgeX' in $$props) $$invalidate(16, nudgeX = $$props.nudgeX);
    		if ('nudgeY' in $$props) $$invalidate(17, nudgeY = $$props.nudgeY);
    		if ('openOnClick' in $$props) $$invalidate(18, openOnClick = $$props.openOnClick);
    		if ('hover' in $$props) $$invalidate(19, hover = $$props.hover);
    		if ('closeOnClickOutside' in $$props) $$invalidate(20, closeOnClickOutside = $$props.closeOnClickOutside);
    		if ('closeOnClick' in $$props) $$invalidate(21, closeOnClick = $$props.closeOnClick);
    		if ('bottom' in $$props) $$invalidate(22, bottom = $$props.bottom);
    		if ('right' in $$props) $$invalidate(23, right = $$props.right);
    		if ('tile' in $$props) $$invalidate(5, tile = $$props.tile);
    		if ('disabled' in $$props) $$invalidate(24, disabled = $$props.disabled);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    		if ('origin' in $$props) $$invalidate(8, origin = $$props.origin);
    		if ('position' in $$props) $$invalidate(9, position = $$props.position);
    		if ('wrapper' in $$props) $$invalidate(10, wrapper = $$props.wrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
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

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
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
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inOpts() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inOpts(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOpts() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOpts(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offsetX() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offsetX(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offsetY() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offsetY(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nudgeX() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nudgeX(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nudgeY() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nudgeY(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openOnClick() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set openOnClick(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnClickOutside() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnClickOutside(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnClick() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnClick(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\List\ListItem.svelte generated by Svelte v3.45.0 */
    const file$9 = "node_modules\\svelte-materialify\\dist\\components\\List\\ListItem.svelte";
    const get_append_slot_changes$1 = dirty => ({});
    const get_append_slot_context$1 = ctx => ({});
    const get_subtitle_slot_changes = dirty => ({});
    const get_subtitle_slot_context = ctx => ({});
    const get_prepend_slot_changes$1 = dirty => ({});
    const get_prepend_slot_context$1 = ctx => ({});

    function create_fragment$9(ctx) {
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
    	const prepend_slot_template = /*#slots*/ ctx[14].prepend;
    	const prepend_slot = create_slot(prepend_slot_template, ctx, /*$$scope*/ ctx[13], get_prepend_slot_context$1);
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	const subtitle_slot_template = /*#slots*/ ctx[14].subtitle;
    	const subtitle_slot = create_slot(subtitle_slot_template, ctx, /*$$scope*/ ctx[13], get_subtitle_slot_context);
    	const append_slot_template = /*#slots*/ ctx[14].append;
    	const append_slot = create_slot(append_slot_template, ctx, /*$$scope*/ ctx[13], get_append_slot_context$1);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (prepend_slot) prepend_slot.c();
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (subtitle_slot) subtitle_slot.c();
    			t2 = space();
    			if (append_slot) append_slot.c();
    			attr_dev(div0, "class", "s-list-item__title");
    			add_location(div0, file$9, 213, 4, 5437);
    			attr_dev(div1, "class", "s-list-item__subtitle");
    			add_location(div1, file$9, 216, 4, 5503);
    			attr_dev(div2, "class", "s-list-item__content");
    			add_location(div2, file$9, 212, 2, 5397);
    			attr_dev(div3, "class", div3_class_value = "s-list-item " + /*klass*/ ctx[1]);
    			attr_dev(div3, "role", /*role*/ ctx[10]);
    			attr_dev(div3, "tabindex", div3_tabindex_value = /*link*/ ctx[6] ? 0 : -1);
    			attr_dev(div3, "aria-selected", div3_aria_selected_value = /*role*/ ctx[10] === 'option' ? /*active*/ ctx[0] : null);
    			attr_dev(div3, "style", /*style*/ ctx[9]);
    			toggle_class(div3, "dense", /*dense*/ ctx[3]);
    			toggle_class(div3, "disabled", /*disabled*/ ctx[4]);
    			toggle_class(div3, "multiline", /*multiline*/ ctx[5]);
    			toggle_class(div3, "link", /*link*/ ctx[6]);
    			toggle_class(div3, "selectable", /*selectable*/ ctx[7]);
    			add_location(div3, file$9, 195, 0, 5033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);

    			if (prepend_slot) {
    				prepend_slot.m(div3, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (subtitle_slot) {
    				subtitle_slot.m(div1, null);
    			}

    			append_dev(div3, t2);

    			if (append_slot) {
    				append_slot.m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Class_action = Class.call(null, div3, [/*active*/ ctx[0] && /*activeClass*/ ctx[2]])),
    					action_destroyer(Ripple_action = Ripple.call(null, div3, /*ripple*/ ctx[8])),
    					listen_dev(div3, "click", /*click*/ ctx[11], false, false, false),
    					listen_dev(div3, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(div3, "dblclick", /*dblclick_handler*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (prepend_slot) {
    				if (prepend_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						prepend_slot,
    						prepend_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(prepend_slot_template, /*$$scope*/ ctx[13], dirty, get_prepend_slot_changes$1),
    						get_prepend_slot_context$1
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (subtitle_slot) {
    				if (subtitle_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						subtitle_slot,
    						subtitle_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(subtitle_slot_template, /*$$scope*/ ctx[13], dirty, get_subtitle_slot_changes),
    						get_subtitle_slot_context
    					);
    				}
    			}

    			if (append_slot) {
    				if (append_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						append_slot,
    						append_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(append_slot_template, /*$$scope*/ ctx[13], dirty, get_append_slot_changes$1),
    						get_append_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 2 && div3_class_value !== (div3_class_value = "s-list-item " + /*klass*/ ctx[1])) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty & /*link*/ 64 && div3_tabindex_value !== (div3_tabindex_value = /*link*/ ctx[6] ? 0 : -1)) {
    				attr_dev(div3, "tabindex", div3_tabindex_value);
    			}

    			if (!current || dirty & /*active*/ 1 && div3_aria_selected_value !== (div3_aria_selected_value = /*role*/ ctx[10] === 'option' ? /*active*/ ctx[0] : null)) {
    				attr_dev(div3, "aria-selected", div3_aria_selected_value);
    			}

    			if (!current || dirty & /*style*/ 512) {
    				attr_dev(div3, "style", /*style*/ ctx[9]);
    			}

    			if (Class_action && is_function(Class_action.update) && dirty & /*active, activeClass*/ 5) Class_action.update.call(null, [/*active*/ ctx[0] && /*activeClass*/ ctx[2]]);
    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 256) Ripple_action.update.call(null, /*ripple*/ ctx[8]);

    			if (dirty & /*klass, dense*/ 10) {
    				toggle_class(div3, "dense", /*dense*/ ctx[3]);
    			}

    			if (dirty & /*klass, disabled*/ 18) {
    				toggle_class(div3, "disabled", /*disabled*/ ctx[4]);
    			}

    			if (dirty & /*klass, multiline*/ 34) {
    				toggle_class(div3, "multiline", /*multiline*/ ctx[5]);
    			}

    			if (dirty & /*klass, link*/ 66) {
    				toggle_class(div3, "link", /*link*/ ctx[6]);
    			}

    			if (dirty & /*klass, selectable*/ 130) {
    				toggle_class(div3, "selectable", /*selectable*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_slot, local);
    			transition_in(default_slot, local);
    			transition_in(subtitle_slot, local);
    			transition_in(append_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_slot, local);
    			transition_out(default_slot, local);
    			transition_out(subtitle_slot, local);
    			transition_out(append_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (prepend_slot) prepend_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (subtitle_slot) subtitle_slot.d(detaching);
    			if (append_slot) append_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItem', slots, ['prepend','default','subtitle','append']);
    	const role = getContext('S_ListItemRole');
    	const ITEM_GROUP = getContext('S_ListItemGroup');

    	const DEFAULTS = {
    		select: () => null,
    		register: () => null,
    		index: () => null,
    		activeClass: 'active'
    	};

    	const ITEM = ITEM_GROUP ? getContext(ITEM_GROUP) : DEFAULTS;
    	let { class: klass = '' } = $$props;
    	let { activeClass = ITEM.activeClass } = $$props;
    	let { value = ITEM.index() } = $$props;
    	let { active = false } = $$props;
    	let { dense = false } = $$props;
    	let { disabled = null } = $$props;
    	let { multiline = false } = $$props;
    	let { link = role } = $$props;
    	let { selectable = !link } = $$props;
    	let { ripple = getContext('S_ListItemRipple') || role || false } = $$props;
    	let { style = null } = $$props;

    	ITEM.register(values => {
    		$$invalidate(0, active = values.includes(value));
    	});

    	function click() {
    		if (!disabled) ITEM.select(value);
    	}

    	const writable_props = [
    		'class',
    		'activeClass',
    		'value',
    		'active',
    		'dense',
    		'disabled',
    		'multiline',
    		'link',
    		'selectable',
    		'ripple',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListItem> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dblclick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('activeClass' in $$props) $$invalidate(2, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(12, value = $$props.value);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('dense' in $$props) $$invalidate(3, dense = $$props.dense);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('multiline' in $$props) $$invalidate(5, multiline = $$props.multiline);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('selectable' in $$props) $$invalidate(7, selectable = $$props.selectable);
    		if ('ripple' in $$props) $$invalidate(8, ripple = $$props.ripple);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Ripple,
    		Class,
    		role,
    		ITEM_GROUP,
    		DEFAULTS,
    		ITEM,
    		klass,
    		activeClass,
    		value,
    		active,
    		dense,
    		disabled,
    		multiline,
    		link,
    		selectable,
    		ripple,
    		style,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('activeClass' in $$props) $$invalidate(2, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(12, value = $$props.value);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('dense' in $$props) $$invalidate(3, dense = $$props.dense);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('multiline' in $$props) $$invalidate(5, multiline = $$props.multiline);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('selectable' in $$props) $$invalidate(7, selectable = $$props.selectable);
    		if ('ripple' in $$props) $$invalidate(8, ripple = $$props.ripple);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
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

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiline() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiline(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectable() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectable(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable no-param-reassign */

    const themeColors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];

    /**
     * @param {string} klass
     */
    function formatClass(klass) {
      return klass.split(' ').map((i) => {
        if (themeColors.includes(i)) return `${i}-color`;
        return i;
      });
    }

    function setBackgroundColor(node, text) {
      if (/^(#|rgb|hsl|currentColor)/.test(text)) {
        // This is a CSS hex.
        node.style.backgroundColor = text;
        return false;
      }

      if (text.startsWith('--')) {
        // This is a CSS variable.
        node.style.backgroundColor = `var(${text})`;
        return false;
      }

      const klass = formatClass(text);
      node.classList.add(...klass);
      return klass;
    }

    /**
     * @param node {Element}
     * @param text {string|boolean}
     */
    var BackgroundColor = (node, text) => {
      let klass;
      if (typeof text === 'string') {
        klass = setBackgroundColor(node, text);
      }

      return {
        update(newText) {
          if (klass) {
            node.classList.remove(...klass);
          } else {
            node.style.backgroundColor = null;
          }

          if (typeof newText === 'string') {
            klass = setBackgroundColor(node, newText);
          }
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Overlay\Overlay.svelte generated by Svelte v3.45.0 */
    const file$8 = "node_modules\\svelte-materialify\\dist\\components\\Overlay\\Overlay.svelte";

    // (52:0) {#if active}
    function create_if_block$5(ctx) {
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
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "s-overlay__scrim svelte-x5kbih");
    			set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			add_location(div0, file$8, 59, 4, 1182);
    			attr_dev(div1, "class", "s-overlay__content svelte-x5kbih");
    			add_location(div1, file$8, 60, 4, 1273);
    			attr_dev(div2, "class", div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-x5kbih");
    			attr_dev(div2, "style", div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9]);
    			toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			add_location(div2, file$8, 52, 2, 1018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, /*color*/ ctx[6])),
    					listen_dev(div2, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*opacity*/ 32) {
    				set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			}

    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*color*/ 64) BackgroundColor_action.update.call(null, /*color*/ ctx[6]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div2_class_value !== (div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-x5kbih")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*index, style*/ 640 && div2_style_value !== (div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9])) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*klass, absolute*/ 257) {
    				toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, /*transition*/ ctx[1], /*inOpts*/ ctx[2]);
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, /*transition*/ ctx[1], /*outOpts*/ ctx[3]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(52:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[4] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overlay', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { transition = fade } = $$props;
    	let { inOpts = { duration: 250 } } = $$props;
    	let { outOpts = { duration: 250 } } = $$props;
    	let { active = true } = $$props;
    	let { opacity = 0.46 } = $$props;
    	let { color = 'rgb(33, 33, 33)' } = $$props;
    	let { index = 5 } = $$props;
    	let { absolute = false } = $$props;
    	let { style = '' } = $$props;

    	const writable_props = [
    		'class',
    		'transition',
    		'inOpts',
    		'outOpts',
    		'active',
    		'opacity',
    		'color',
    		'index',
    		'absolute',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overlay> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		BackgroundColor,
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
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

    class Overlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overlay",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\AppBar\AppBar.svelte generated by Svelte v3.45.0 */
    const file$7 = "node_modules\\svelte-materialify\\dist\\components\\AppBar\\AppBar.svelte";
    const get_extension_slot_changes = dirty => ({});
    const get_extension_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (107:4) {#if !collapsed}
    function create_if_block$4(ctx) {
    	let div;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[11].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[10], get_title_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (title_slot) title_slot.c();
    			attr_dev(div, "class", "s-app-bar__title");
    			add_location(div, file$7, 107, 6, 2257);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (title_slot) {
    				title_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[10], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (title_slot) title_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(107:4) {#if !collapsed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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
    	const icon_slot_template = /*#slots*/ ctx[11].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[10], get_icon_slot_context);
    	let if_block = !/*collapsed*/ ctx[8] && create_if_block$4(ctx);
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const extension_slot_template = /*#slots*/ ctx[11].extension;
    	const extension_slot = create_slot(extension_slot_template, ctx, /*$$scope*/ ctx[10], get_extension_slot_context);

    	const block = {
    		c: function create() {
    			header = element("header");
    			div = element("div");
    			if (icon_slot) icon_slot.c();
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (extension_slot) extension_slot.c();
    			attr_dev(div, "class", "s-app-bar__wrapper");
    			add_location(div, file$7, 104, 2, 2172);
    			attr_dev(header, "class", header_class_value = "s-app-bar " + /*klass*/ ctx[0]);
    			attr_dev(header, "style", /*style*/ ctx[9]);
    			toggle_class(header, "tile", /*tile*/ ctx[2]);
    			toggle_class(header, "flat", /*flat*/ ctx[3]);
    			toggle_class(header, "dense", /*dense*/ ctx[4]);
    			toggle_class(header, "prominent", /*prominent*/ ctx[5]);
    			toggle_class(header, "fixed", /*fixed*/ ctx[6]);
    			toggle_class(header, "absolute", /*absolute*/ ctx[7]);
    			toggle_class(header, "collapsed", /*collapsed*/ ctx[8]);
    			add_location(header, file$7, 93, 0, 1973);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div);

    			if (icon_slot) {
    				icon_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(header, t2);

    			if (extension_slot) {
    				extension_slot.m(header, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(Style_action = Style.call(null, header, { 'app-bar-height': /*height*/ ctx[1] }));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[10], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}

    			if (!/*collapsed*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*collapsed*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (extension_slot) {
    				if (extension_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						extension_slot,
    						extension_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(extension_slot_template, /*$$scope*/ ctx[10], dirty, get_extension_slot_changes),
    						get_extension_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && header_class_value !== (header_class_value = "s-app-bar " + /*klass*/ ctx[0])) {
    				attr_dev(header, "class", header_class_value);
    			}

    			if (!current || dirty & /*style*/ 512) {
    				attr_dev(header, "style", /*style*/ ctx[9]);
    			}

    			if (Style_action && is_function(Style_action.update) && dirty & /*height*/ 2) Style_action.update.call(null, { 'app-bar-height': /*height*/ ctx[1] });

    			if (dirty & /*klass, tile*/ 5) {
    				toggle_class(header, "tile", /*tile*/ ctx[2]);
    			}

    			if (dirty & /*klass, flat*/ 9) {
    				toggle_class(header, "flat", /*flat*/ ctx[3]);
    			}

    			if (dirty & /*klass, dense*/ 17) {
    				toggle_class(header, "dense", /*dense*/ ctx[4]);
    			}

    			if (dirty & /*klass, prominent*/ 33) {
    				toggle_class(header, "prominent", /*prominent*/ ctx[5]);
    			}

    			if (dirty & /*klass, fixed*/ 65) {
    				toggle_class(header, "fixed", /*fixed*/ ctx[6]);
    			}

    			if (dirty & /*klass, absolute*/ 129) {
    				toggle_class(header, "absolute", /*absolute*/ ctx[7]);
    			}

    			if (dirty & /*klass, collapsed*/ 257) {
    				toggle_class(header, "collapsed", /*collapsed*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			transition_in(extension_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			transition_out(extension_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (icon_slot) icon_slot.d(detaching);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (extension_slot) extension_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppBar', slots, ['icon','title','default','extension']);
    	let { class: klass = '' } = $$props;
    	let { height = '56px' } = $$props;
    	let { tile = false } = $$props;
    	let { flat = false } = $$props;
    	let { dense = false } = $$props;
    	let { prominent = false } = $$props;
    	let { fixed = false } = $$props;
    	let { absolute = false } = $$props;
    	let { collapsed = false } = $$props;
    	let { style = '' } = $$props;

    	const writable_props = [
    		'class',
    		'height',
    		'tile',
    		'flat',
    		'dense',
    		'prominent',
    		'fixed',
    		'absolute',
    		'collapsed',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
    		if ('flat' in $$props) $$invalidate(3, flat = $$props.flat);
    		if ('dense' in $$props) $$invalidate(4, dense = $$props.dense);
    		if ('prominent' in $$props) $$invalidate(5, prominent = $$props.prominent);
    		if ('fixed' in $$props) $$invalidate(6, fixed = $$props.fixed);
    		if ('absolute' in $$props) $$invalidate(7, absolute = $$props.absolute);
    		if ('collapsed' in $$props) $$invalidate(8, collapsed = $$props.collapsed);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Style,
    		klass,
    		height,
    		tile,
    		flat,
    		dense,
    		prominent,
    		fixed,
    		absolute,
    		collapsed,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
    		if ('flat' in $$props) $$invalidate(3, flat = $$props.flat);
    		if ('dense' in $$props) $$invalidate(4, dense = $$props.dense);
    		if ('prominent' in $$props) $$invalidate(5, prominent = $$props.prominent);
    		if ('fixed' in $$props) $$invalidate(6, fixed = $$props.fixed);
    		if ('absolute' in $$props) $$invalidate(7, absolute = $$props.absolute);
    		if ('collapsed' in $$props) $$invalidate(8, collapsed = $$props.collapsed);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    class AppBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppBar",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prominent() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prominent(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collapsed() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collapsed(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\ProgressLinear\ProgressLinear.svelte generated by Svelte v3.45.0 */
    const file$6 = "node_modules\\svelte-materialify\\dist\\components\\ProgressLinear\\ProgressLinear.svelte";

    // (169:2) {:else}
    function create_else_block(ctx) {
    	let div;
    	let BackgroundColor_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "determinate svelte-116424u");
    			set_style(div, "width", /*value*/ ctx[1] + "%");
    			toggle_class(div, "striped", /*striped*/ ctx[12]);
    			add_location(div, file$6, 169, 4, 3710);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div, /*color*/ ctx[7]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 2) {
    				set_style(div, "width", /*value*/ ctx[1] + "%");
    			}

    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*color*/ 128) BackgroundColor_action.update.call(null, /*color*/ ctx[7]);

    			if (dirty & /*striped*/ 4096) {
    				toggle_class(div, "striped", /*striped*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(169:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (164:2) {#if indeterminate}
    function create_if_block_1$1(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let BackgroundColor_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "indeterminate long svelte-116424u");
    			add_location(div0, file$6, 165, 6, 3608);
    			attr_dev(div1, "class", "indeterminate short svelte-116424u");
    			add_location(div1, file$6, 166, 6, 3649);
    			add_location(div2, file$6, 164, 4, 3568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (!mounted) {
    				dispose = action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div2, /*color*/ ctx[7]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*color*/ 128) BackgroundColor_action.update.call(null, /*color*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(164:2) {#if indeterminate}",
    		ctx
    	});

    	return block;
    }

    // (181:2) {#if stream}
    function create_if_block$3(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "stream " + /*color*/ ctx[7] + " svelte-116424u");
    			set_style(div, "width", 100 - /*buffer*/ ctx[8] + "%");
    			add_location(div, file$6, 181, 4, 3921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*color*/ 128 && div_class_value !== (div_class_value = "stream " + /*color*/ ctx[7] + " svelte-116424u")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*buffer*/ 256) {
    				set_style(div, "width", 100 - /*buffer*/ ctx[8] + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(181:2) {#if stream}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
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

    	function select_block_type(ctx, dirty) {
    		if (/*indeterminate*/ ctx[3]) return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);
    	let if_block1 = /*stream*/ ctx[10] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "background svelte-116424u");
    			attr_dev(div0, "style", div0_style_value = "opacity:" + /*backgroundOpacity*/ ctx[6] + ";" + (/*reversed*/ ctx[9] ? 'right' : 'left') + ":" + /*value*/ ctx[1] + "%;width:" + (/*buffer*/ ctx[8] - /*value*/ ctx[1]) + "%");
    			add_location(div0, file$6, 158, 2, 3365);
    			attr_dev(div1, "class", "s-progress-linear__content svelte-116424u");
    			add_location(div1, file$6, 176, 2, 3838);
    			attr_dev(div2, "role", "progressbar");
    			attr_dev(div2, "aria-valuemin", "0");
    			attr_dev(div2, "aria-valuemax", "100");
    			attr_dev(div2, "aria-valuenow", /*value*/ ctx[1]);
    			attr_dev(div2, "class", div2_class_value = "s-progress-linear " + /*klass*/ ctx[0] + " svelte-116424u");
    			attr_dev(div2, "style", div2_style_value = "height:" + /*height*/ ctx[4] + ";" + /*style*/ ctx[13]);
    			toggle_class(div2, "inactive", !/*active*/ ctx[2]);
    			toggle_class(div2, "reversed", /*reversed*/ ctx[9]);
    			toggle_class(div2, "rounded", /*rounded*/ ctx[11]);
    			add_location(div2, file$6, 148, 0, 3140);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			if_block0.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, /*backgroundColor*/ ctx[5]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*backgroundOpacity, reversed, value, buffer*/ 834 && div0_style_value !== (div0_style_value = "opacity:" + /*backgroundOpacity*/ ctx[6] + ";" + (/*reversed*/ ctx[9] ? 'right' : 'left') + ":" + /*value*/ ctx[1] + "%;width:" + (/*buffer*/ ctx[8] - /*value*/ ctx[1]) + "%")) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*backgroundColor*/ 32) BackgroundColor_action.update.call(null, /*backgroundColor*/ ctx[5]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, t1);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*stream*/ ctx[10]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*value*/ 2) {
    				attr_dev(div2, "aria-valuenow", /*value*/ ctx[1]);
    			}

    			if (!current || dirty & /*klass*/ 1 && div2_class_value !== (div2_class_value = "s-progress-linear " + /*klass*/ ctx[0] + " svelte-116424u")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*height, style*/ 8208 && div2_style_value !== (div2_style_value = "height:" + /*height*/ ctx[4] + ";" + /*style*/ ctx[13])) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*klass, active*/ 5) {
    				toggle_class(div2, "inactive", !/*active*/ ctx[2]);
    			}

    			if (dirty & /*klass, reversed*/ 513) {
    				toggle_class(div2, "reversed", /*reversed*/ ctx[9]);
    			}

    			if (dirty & /*klass, rounded*/ 2049) {
    				toggle_class(div2, "rounded", /*rounded*/ ctx[11]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressLinear', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { value = 0 } = $$props;
    	let { active = true } = $$props;
    	let { indeterminate = false } = $$props;
    	let { height = '4px' } = $$props;
    	let { backgroundColor = 'primary' } = $$props;
    	let { backgroundOpacity = 0.3 } = $$props;
    	let { color = backgroundColor } = $$props;
    	let { buffer = 100 } = $$props;
    	let { reversed = false } = $$props;
    	let { stream = false } = $$props;
    	let { rounded = false } = $$props;
    	let { striped = false } = $$props;
    	let { style = '' } = $$props;

    	const writable_props = [
    		'class',
    		'value',
    		'active',
    		'indeterminate',
    		'height',
    		'backgroundColor',
    		'backgroundOpacity',
    		'color',
    		'buffer',
    		'reversed',
    		'stream',
    		'rounded',
    		'striped',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProgressLinear> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('indeterminate' in $$props) $$invalidate(3, indeterminate = $$props.indeterminate);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('backgroundColor' in $$props) $$invalidate(5, backgroundColor = $$props.backgroundColor);
    		if ('backgroundOpacity' in $$props) $$invalidate(6, backgroundOpacity = $$props.backgroundOpacity);
    		if ('color' in $$props) $$invalidate(7, color = $$props.color);
    		if ('buffer' in $$props) $$invalidate(8, buffer = $$props.buffer);
    		if ('reversed' in $$props) $$invalidate(9, reversed = $$props.reversed);
    		if ('stream' in $$props) $$invalidate(10, stream = $$props.stream);
    		if ('rounded' in $$props) $$invalidate(11, rounded = $$props.rounded);
    		if ('striped' in $$props) $$invalidate(12, striped = $$props.striped);
    		if ('style' in $$props) $$invalidate(13, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		BackgroundColor,
    		klass,
    		value,
    		active,
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
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('indeterminate' in $$props) $$invalidate(3, indeterminate = $$props.indeterminate);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('backgroundColor' in $$props) $$invalidate(5, backgroundColor = $$props.backgroundColor);
    		if ('backgroundOpacity' in $$props) $$invalidate(6, backgroundOpacity = $$props.backgroundOpacity);
    		if ('color' in $$props) $$invalidate(7, color = $$props.color);
    		if ('buffer' in $$props) $$invalidate(8, buffer = $$props.buffer);
    		if ('reversed' in $$props) $$invalidate(9, reversed = $$props.reversed);
    		if ('stream' in $$props) $$invalidate(10, stream = $$props.stream);
    		if ('rounded' in $$props) $$invalidate(11, rounded = $$props.rounded);
    		if ('striped' in $$props) $$invalidate(12, striped = $$props.striped);
    		if ('style' in $$props) $$invalidate(13, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		value,
    		active,
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

    class ProgressLinear extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressLinear",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundOpacity() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundOpacity(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buffer() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buffer(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reversed() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reversed(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stream() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stream(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ProgressLinear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ProgressLinear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\Card\Card.svelte generated by Svelte v3.45.0 */
    const file$5 = "node_modules\\svelte-materialify\\dist\\components\\Card\\Card.svelte";
    const get_progress_slot_changes = dirty => ({});
    const get_progress_slot_context = ctx => ({});

    // (113:2) {#if loading}
    function create_if_block$2(ctx) {
    	let current;
    	const progress_slot_template = /*#slots*/ ctx[12].progress;
    	const progress_slot = create_slot(progress_slot_template, ctx, /*$$scope*/ ctx[11], get_progress_slot_context);
    	const progress_slot_or_fallback = progress_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (progress_slot_or_fallback) progress_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (progress_slot_or_fallback) {
    				progress_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (progress_slot) {
    				if (progress_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						progress_slot,
    						progress_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(progress_slot_template, /*$$scope*/ ctx[11], dirty, get_progress_slot_changes),
    						get_progress_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (progress_slot_or_fallback) progress_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(113:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (114:26)        
    function fallback_block(ctx) {
    	let progresslinear;
    	let current;

    	progresslinear = new ProgressLinear({
    			props: { indeterminate: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(progresslinear.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progresslinear, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progresslinear.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progresslinear.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progresslinear, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(114:26)        ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	let if_block = /*loading*/ ctx[8] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-card " + /*klass*/ ctx[0]);
    			attr_dev(div, "style", /*style*/ ctx[10]);
    			toggle_class(div, "flat", /*flat*/ ctx[1]);
    			toggle_class(div, "tile", /*tile*/ ctx[2]);
    			toggle_class(div, "outlined", /*outlined*/ ctx[3]);
    			toggle_class(div, "raised", /*raised*/ ctx[4]);
    			toggle_class(div, "shaped", /*shaped*/ ctx[5]);
    			toggle_class(div, "hover", /*hover*/ ctx[6]);
    			toggle_class(div, "link", /*link*/ ctx[7]);
    			toggle_class(div, "disabled", /*disabled*/ ctx[9]);
    			add_location(div, file$5, 101, 0, 2536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*loading*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*loading*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-card " + /*klass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 1024) {
    				attr_dev(div, "style", /*style*/ ctx[10]);
    			}

    			if (dirty & /*klass, flat*/ 3) {
    				toggle_class(div, "flat", /*flat*/ ctx[1]);
    			}

    			if (dirty & /*klass, tile*/ 5) {
    				toggle_class(div, "tile", /*tile*/ ctx[2]);
    			}

    			if (dirty & /*klass, outlined*/ 9) {
    				toggle_class(div, "outlined", /*outlined*/ ctx[3]);
    			}

    			if (dirty & /*klass, raised*/ 17) {
    				toggle_class(div, "raised", /*raised*/ ctx[4]);
    			}

    			if (dirty & /*klass, shaped*/ 33) {
    				toggle_class(div, "shaped", /*shaped*/ ctx[5]);
    			}

    			if (dirty & /*klass, hover*/ 65) {
    				toggle_class(div, "hover", /*hover*/ ctx[6]);
    			}

    			if (dirty & /*klass, link*/ 129) {
    				toggle_class(div, "link", /*link*/ ctx[7]);
    			}

    			if (dirty & /*klass, disabled*/ 513) {
    				toggle_class(div, "disabled", /*disabled*/ ctx[9]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['progress','default']);
    	let { class: klass = '' } = $$props;
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

    	const writable_props = [
    		'class',
    		'flat',
    		'tile',
    		'outlined',
    		'raised',
    		'shaped',
    		'hover',
    		'link',
    		'loading',
    		'disabled',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
    		if ('outlined' in $$props) $$invalidate(3, outlined = $$props.outlined);
    		if ('raised' in $$props) $$invalidate(4, raised = $$props.raised);
    		if ('shaped' in $$props) $$invalidate(5, shaped = $$props.shaped);
    		if ('hover' in $$props) $$invalidate(6, hover = $$props.hover);
    		if ('link' in $$props) $$invalidate(7, link = $$props.link);
    		if ('loading' in $$props) $$invalidate(8, loading = $$props.loading);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ('style' in $$props) $$invalidate(10, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ProgressLinear,
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
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('tile' in $$props) $$invalidate(2, tile = $$props.tile);
    		if ('outlined' in $$props) $$invalidate(3, outlined = $$props.outlined);
    		if ('raised' in $$props) $$invalidate(4, raised = $$props.raised);
    		if ('shaped' in $$props) $$invalidate(5, shaped = $$props.shaped);
    		if ('hover' in $$props) $$invalidate(6, hover = $$props.hover);
    		if ('link' in $$props) $$invalidate(7, link = $$props.link);
    		if ('loading' in $$props) $$invalidate(8, loading = $$props.loading);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$props.disabled);
    		if ('style' in $$props) $$invalidate(10, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
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

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raised() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raised(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shaped() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shaped(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\Card\CardActions.svelte generated by Svelte v3.45.0 */

    const file$4 = "node_modules\\svelte-materialify\\dist\\components\\Card\\CardActions.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-card-actions " + /*klass*/ ctx[0]);
    			attr_dev(div, "style", /*style*/ ctx[1]);
    			add_location(div, file$4, 12, 0, 239);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-card-actions " + /*klass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 2) {
    				attr_dev(div, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardActions', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { style = null } = $$props;
    	const writable_props = ['class', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardActions> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ klass, style });

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [klass, style, $$scope, slots];
    }

    class CardActions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { class: 0, style: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardActions",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get class() {
    		throw new Error("<CardActions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardActions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CardActions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CardActions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\Card\CardText.svelte generated by Svelte v3.45.0 */

    const file$3 = "node_modules\\svelte-materialify\\dist\\components\\Card\\CardText.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-card-text " + /*klass*/ ctx[0]);
    			attr_dev(div, "style", /*style*/ ctx[1]);
    			add_location(div, file$3, 16, 0, 349);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-card-text " + /*klass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 2) {
    				attr_dev(div, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardText', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { style = null } = $$props;
    	const writable_props = ['class', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardText> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ klass, style });

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [klass, style, $$scope, slots];
    }

    class CardText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { class: 0, style: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardText",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<CardText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CardText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CardText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-materialify\dist\components\NavigationDrawer\NavigationDrawer.svelte generated by Svelte v3.45.0 */
    const file$2 = "node_modules\\svelte-materialify\\dist\\components\\NavigationDrawer\\NavigationDrawer.svelte";
    const get_append_slot_changes = dirty => ({});
    const get_append_slot_context = ctx => ({});
    const get_prepend_slot_changes = dirty => ({});
    const get_prepend_slot_context = ctx => ({});

    // (131:2) {#if !borderless}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "s-navigation-drawer__border");
    			add_location(div, file$2, 131, 4, 2953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(131:2) {#if !borderless}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let aside;
    	let t0;
    	let div;
    	let t1;
    	let t2;
    	let aside_class_value;
    	let aside_style_value;
    	let Style_action;
    	let aside_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const prepend_slot_template = /*#slots*/ ctx[16].prepend;
    	const prepend_slot = create_slot(prepend_slot_template, ctx, /*$$scope*/ ctx[15], get_prepend_slot_context);
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const append_slot_template = /*#slots*/ ctx[16].append;
    	const append_slot = create_slot(append_slot_template, ctx, /*$$scope*/ ctx[15], get_append_slot_context);
    	let if_block = !/*borderless*/ ctx[8] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			if (prepend_slot) prepend_slot.c();
    			t0 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (append_slot) append_slot.c();
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "s-navigation-drawer__content");
    			add_location(div, file$2, 126, 2, 2834);
    			attr_dev(aside, "class", aside_class_value = "s-navigation-drawer " + /*klass*/ ctx[0]);
    			attr_dev(aside, "style", aside_style_value = "z-index:" + /*index*/ ctx[13] + ";" + /*style*/ ctx[14]);
    			toggle_class(aside, "active", /*active*/ ctx[2]);
    			toggle_class(aside, "fixed", /*fixed*/ ctx[3]);
    			toggle_class(aside, "absolute", /*absolute*/ ctx[4]);
    			toggle_class(aside, "right", /*right*/ ctx[5]);
    			toggle_class(aside, "mini", /*mini*/ ctx[6]);
    			toggle_class(aside, "clipped", /*clipped*/ ctx[7]);
    			add_location(aside, file$2, 105, 0, 2387);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);

    			if (prepend_slot) {
    				prepend_slot.m(aside, null);
    			}

    			append_dev(aside, t0);
    			append_dev(aside, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(aside, t1);

    			if (append_slot) {
    				append_slot.m(aside, null);
    			}

    			append_dev(aside, t2);
    			if (if_block) if_block.m(aside, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(aside, "introstart", /*introstart_handler*/ ctx[17], false, false, false),
    					listen_dev(aside, "outrostart", /*outrostart_handler*/ ctx[18], false, false, false),
    					listen_dev(aside, "introend", /*introend_handler*/ ctx[19], false, false, false),
    					listen_dev(aside, "outroend", /*outroend_handler*/ ctx[20], false, false, false),
    					listen_dev(aside, "hover", /*hover_handler*/ ctx[21], false, false, false),
    					action_destroyer(Style_action = Style.call(null, aside, {
    						'nav-width': /*width*/ ctx[1],
    						'nav-min-width': /*miniWidth*/ ctx[9],
    						'nav-clipped-height': /*clippedHeight*/ ctx[10]
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (prepend_slot) {
    				if (prepend_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						prepend_slot,
    						prepend_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(prepend_slot_template, /*$$scope*/ ctx[15], dirty, get_prepend_slot_changes),
    						get_prepend_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			if (append_slot) {
    				if (append_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						append_slot,
    						append_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(append_slot_template, /*$$scope*/ ctx[15], dirty, get_append_slot_changes),
    						get_append_slot_context
    					);
    				}
    			}

    			if (!/*borderless*/ ctx[8]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(aside, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*klass*/ 1 && aside_class_value !== (aside_class_value = "s-navigation-drawer " + /*klass*/ ctx[0])) {
    				attr_dev(aside, "class", aside_class_value);
    			}

    			if (!current || dirty & /*index, style*/ 24576 && aside_style_value !== (aside_style_value = "z-index:" + /*index*/ ctx[13] + ";" + /*style*/ ctx[14])) {
    				attr_dev(aside, "style", aside_style_value);
    			}

    			if (Style_action && is_function(Style_action.update) && dirty & /*width, miniWidth, clippedHeight*/ 1538) Style_action.update.call(null, {
    				'nav-width': /*width*/ ctx[1],
    				'nav-min-width': /*miniWidth*/ ctx[9],
    				'nav-clipped-height': /*clippedHeight*/ ctx[10]
    			});

    			if (dirty & /*klass, active*/ 5) {
    				toggle_class(aside, "active", /*active*/ ctx[2]);
    			}

    			if (dirty & /*klass, fixed*/ 9) {
    				toggle_class(aside, "fixed", /*fixed*/ ctx[3]);
    			}

    			if (dirty & /*klass, absolute*/ 17) {
    				toggle_class(aside, "absolute", /*absolute*/ ctx[4]);
    			}

    			if (dirty & /*klass, right*/ 33) {
    				toggle_class(aside, "right", /*right*/ ctx[5]);
    			}

    			if (dirty & /*klass, mini*/ 65) {
    				toggle_class(aside, "mini", /*mini*/ ctx[6]);
    			}

    			if (dirty & /*klass, clipped*/ 129) {
    				toggle_class(aside, "clipped", /*clipped*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_slot, local);
    			transition_in(default_slot, local);
    			transition_in(append_slot, local);

    			add_render_callback(() => {
    				if (!aside_transition) aside_transition = create_bidirectional_transition(aside, /*transition*/ ctx[11], /*transitionOpts*/ ctx[12], true);
    				aside_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_slot, local);
    			transition_out(default_slot, local);
    			transition_out(append_slot, local);
    			if (!aside_transition) aside_transition = create_bidirectional_transition(aside, /*transition*/ ctx[11], /*transitionOpts*/ ctx[12], false);
    			aside_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if (prepend_slot) prepend_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (append_slot) append_slot.d(detaching);
    			if (if_block) if_block.d();
    			if (detaching && aside_transition) aside_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavigationDrawer', slots, ['prepend','default','append']);
    	let { class: klass = '' } = $$props;
    	let { width = '256px' } = $$props;
    	let { active = true } = $$props;
    	let { fixed = false } = $$props;
    	let { absolute = false } = $$props;
    	let { right = false } = $$props;
    	let { mini = false } = $$props;
    	let { clipped = false } = $$props;
    	let { borderless = false } = $$props;
    	let { miniWidth = '56px' } = $$props;
    	let { clippedHeight = '56px' } = $$props;
    	let { transition = fade } = $$props;
    	let { transitionOpts = {} } = $$props;
    	let { index = 4 } = $$props;
    	let { style = null } = $$props;

    	const writable_props = [
    		'class',
    		'width',
    		'active',
    		'fixed',
    		'absolute',
    		'right',
    		'mini',
    		'clipped',
    		'borderless',
    		'miniWidth',
    		'clippedHeight',
    		'transition',
    		'transitionOpts',
    		'index',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavigationDrawer> was created with unknown prop '${key}'`);
    	});

    	function introstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outrostart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function introend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outroend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function hover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('fixed' in $$props) $$invalidate(3, fixed = $$props.fixed);
    		if ('absolute' in $$props) $$invalidate(4, absolute = $$props.absolute);
    		if ('right' in $$props) $$invalidate(5, right = $$props.right);
    		if ('mini' in $$props) $$invalidate(6, mini = $$props.mini);
    		if ('clipped' in $$props) $$invalidate(7, clipped = $$props.clipped);
    		if ('borderless' in $$props) $$invalidate(8, borderless = $$props.borderless);
    		if ('miniWidth' in $$props) $$invalidate(9, miniWidth = $$props.miniWidth);
    		if ('clippedHeight' in $$props) $$invalidate(10, clippedHeight = $$props.clippedHeight);
    		if ('transition' in $$props) $$invalidate(11, transition = $$props.transition);
    		if ('transitionOpts' in $$props) $$invalidate(12, transitionOpts = $$props.transitionOpts);
    		if ('index' in $$props) $$invalidate(13, index = $$props.index);
    		if ('style' in $$props) $$invalidate(14, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		Style,
    		klass,
    		width,
    		active,
    		fixed,
    		absolute,
    		right,
    		mini,
    		clipped,
    		borderless,
    		miniWidth,
    		clippedHeight,
    		transition,
    		transitionOpts,
    		index,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('fixed' in $$props) $$invalidate(3, fixed = $$props.fixed);
    		if ('absolute' in $$props) $$invalidate(4, absolute = $$props.absolute);
    		if ('right' in $$props) $$invalidate(5, right = $$props.right);
    		if ('mini' in $$props) $$invalidate(6, mini = $$props.mini);
    		if ('clipped' in $$props) $$invalidate(7, clipped = $$props.clipped);
    		if ('borderless' in $$props) $$invalidate(8, borderless = $$props.borderless);
    		if ('miniWidth' in $$props) $$invalidate(9, miniWidth = $$props.miniWidth);
    		if ('clippedHeight' in $$props) $$invalidate(10, clippedHeight = $$props.clippedHeight);
    		if ('transition' in $$props) $$invalidate(11, transition = $$props.transition);
    		if ('transitionOpts' in $$props) $$invalidate(12, transitionOpts = $$props.transitionOpts);
    		if ('index' in $$props) $$invalidate(13, index = $$props.index);
    		if ('style' in $$props) $$invalidate(14, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		width,
    		active,
    		fixed,
    		absolute,
    		right,
    		mini,
    		clipped,
    		borderless,
    		miniWidth,
    		clippedHeight,
    		transition,
    		transitionOpts,
    		index,
    		style,
    		$$scope,
    		slots,
    		introstart_handler,
    		outrostart_handler,
    		introend_handler,
    		outroend_handler,
    		hover_handler
    	];
    }

    class NavigationDrawer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			class: 0,
    			width: 1,
    			active: 2,
    			fixed: 3,
    			absolute: 4,
    			right: 5,
    			mini: 6,
    			clipped: 7,
    			borderless: 8,
    			miniWidth: 9,
    			clippedHeight: 10,
    			transition: 11,
    			transitionOpts: 12,
    			index: 13,
    			style: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavigationDrawer",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mini() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mini(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clipped() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clipped(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get miniWidth() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set miniWidth(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clippedHeight() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clippedHeight(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOpts() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOpts(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Material Design Icons v6.5.95
    var mdiDotsVertical = "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";
    var mdiMagnify = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z";
    var mdiMenu = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z";

    /* src\HowTo.svelte generated by Svelte v3.45.0 */

    const { Object: Object_1 } = globals;

    const file$1 = "src\\HowTo.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[10] = list;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[13] = list;
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (32:12) <CardText>
    function create_default_slot_5$1(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;

    	let t2_value = (/*stepData*/ ctx[9].question
    	? /*stepData*/ ctx[9].question
    	: /*stepData*/ ctx[9]) + "";

    	let t2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Guide:";
    			t1 = space();
    			div1 = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    			t2 = text(t2_value);
    			set_style(div0, "margin", "0px");
    			set_style(div0, "padding", "10px 0px");
    			set_style(div0, "color", "#888");
    			set_style(div0, "width", "50px");
    			add_location(div0, file$1, 33, 20, 1179);
    			attr_dev(div1, "xmlns", "http://www.w3.org/1999/xhtml");
    			set_style(div1, "flex-grow", "1");
    			set_style(div1, "font-size", "24px");
    			set_style(div1, "background-color", "#F3F5F6");
    			set_style(div1, "margin", "10px");
    			set_style(div1, "padding", "25px 20px");
    			add_location(div1, file$1, 36, 20, 1331);
    			attr_dev(div2, "class", "container");
    			set_style(div2, "display", "flex");
    			add_location(div2, file$1, 32, 16, 1111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*displayedSteps*/ 2 && t2_value !== (t2_value = (/*stepData*/ ctx[9].question
    			? /*stepData*/ ctx[9].question
    			: /*stepData*/ ctx[9]) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(32:12) <CardText>",
    		ctx
    	});

    	return block;
    }

    // (42:12) {#if stepData.learnMore}
    function create_if_block_1(ctx) {
    	let cardactions;
    	let current;

    	cardactions = new CardActions({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardactions.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardactions, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardactions_changes = {};

    			if (dirty & /*$$scope, displayedSteps*/ 32770) {
    				cardactions_changes.$$scope = { dirty, ctx };
    			}

    			cardactions.$set(cardactions_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardactions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardactions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardactions, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(42:12) {#if stepData.learnMore}",
    		ctx
    	});

    	return block;
    }

    // (44:20) <Button text class="primary-text" href={stepData.learnMore} target="_blank">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Learn More");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(44:20) <Button text class=\\\"primary-text\\\" href={stepData.learnMore} target=\\\"_blank\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:16) <CardActions>
    function create_default_slot_3$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				text: true,
    				class: "primary-text",
    				href: /*stepData*/ ctx[9].learnMore,
    				target: "_blank",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*displayedSteps*/ 2) button_changes.href = /*stepData*/ ctx[9].learnMore;

    			if (dirty & /*$$scope*/ 32768) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(43:16) <CardActions>",
    		ctx
    	});

    	return block;
    }

    // (47:12) {#if stepData.choices}
    function create_if_block(ctx) {
    	let div;
    	let buttongroup;
    	let updating_value;
    	let current;

    	function buttongroup_value_binding(value) {
    		/*buttongroup_value_binding*/ ctx[6](value, /*stepData*/ ctx[9]);
    	}

    	let buttongroup_props = {
    		mandatory: true,
    		activeClass: "selected-choice white-text",
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	if (/*stepData*/ ctx[9].selectedChoice !== void 0) {
    		buttongroup_props.value = /*stepData*/ ctx[9].selectedChoice;
    	}

    	buttongroup = new ButtonGroup({ props: buttongroup_props, $$inline: true });
    	binding_callbacks.push(() => bind(buttongroup, 'value', buttongroup_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(buttongroup.$$.fragment);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$1, 47, 16, 1923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(buttongroup, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const buttongroup_changes = {};

    			if (dirty & /*$$scope, displayedSteps, choiceElements*/ 32771) {
    				buttongroup_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*displayedSteps*/ 2) {
    				updating_value = true;
    				buttongroup_changes.value = /*stepData*/ ctx[9].selectedChoice;
    				add_flush_callback(() => updating_value = false);
    			}

    			buttongroup.$set(buttongroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(buttongroup);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(47:12) {#if stepData.choices}",
    		ctx
    	});

    	return block;
    }

    // (51:28) <ButtonGroupItem style="font-size: 24px; background-color: #F3F5F6; margin: 100px; padding: 25px 50px; height: 50px;" bind:this={choiceElements[choiceIdx]} on:click={handleClickChoice(stepData, choiceIdx)} value={choice}>
    function create_default_slot_2$1(ctx) {
    	let t0_value = Object.keys(/*choice*/ ctx[12])[0] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*displayedSteps*/ 2 && t0_value !== (t0_value = Object.keys(/*choice*/ ctx[12])[0] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(51:28) <ButtonGroupItem style=\\\"font-size: 24px; background-color: #F3F5F6; margin: 100px; padding: 25px 50px; height: 50px;\\\" bind:this={choiceElements[choiceIdx]} on:click={handleClickChoice(stepData, choiceIdx)} value={choice}>",
    		ctx
    	});

    	return block;
    }

    // (50:24) {#each stepData.choices as choice,choiceIdx}
    function create_each_block_1(ctx) {
    	let buttongroupitem;
    	let choiceIdx = /*choiceIdx*/ ctx[14];
    	let current;
    	const assign_buttongroupitem = () => /*buttongroupitem_binding*/ ctx[5](buttongroupitem, choiceIdx);
    	const unassign_buttongroupitem = () => /*buttongroupitem_binding*/ ctx[5](null, choiceIdx);

    	let buttongroupitem_props = {
    		style: "font-size: 24px; background-color: #F3F5F6; margin: 100px; padding: 25px 50px; height: 50px;",
    		value: /*choice*/ ctx[12],
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	};

    	buttongroupitem = new ButtonGroupItem({
    			props: buttongroupitem_props,
    			$$inline: true
    		});

    	assign_buttongroupitem();

    	buttongroupitem.$on("click", function () {
    		if (is_function(/*handleClickChoice*/ ctx[2](/*stepData*/ ctx[9], /*choiceIdx*/ ctx[14]))) /*handleClickChoice*/ ctx[2](/*stepData*/ ctx[9], /*choiceIdx*/ ctx[14]).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(buttongroupitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttongroupitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (choiceIdx !== /*choiceIdx*/ ctx[14]) {
    				unassign_buttongroupitem();
    				choiceIdx = /*choiceIdx*/ ctx[14];
    				assign_buttongroupitem();
    			}

    			const buttongroupitem_changes = {};
    			if (dirty & /*displayedSteps*/ 2) buttongroupitem_changes.value = /*choice*/ ctx[12];

    			if (dirty & /*$$scope, displayedSteps*/ 32770) {
    				buttongroupitem_changes.$$scope = { dirty, ctx };
    			}

    			buttongroupitem.$set(buttongroupitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttongroupitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttongroupitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			unassign_buttongroupitem();
    			destroy_component(buttongroupitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(50:24) {#each stepData.choices as choice,choiceIdx}",
    		ctx
    	});

    	return block;
    }

    // (49:20) <ButtonGroup mandatory activeClass="selected-choice white-text" bind:value={stepData.selectedChoice}>
    function create_default_slot_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*stepData*/ ctx[9].choices;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*displayedSteps, choiceElements, handleClickChoice, Object*/ 7) {
    				each_value_1 = /*stepData*/ ctx[9].choices;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(49:20) <ButtonGroup mandatory activeClass=\\\"selected-choice white-text\\\" bind:value={stepData.selectedChoice}>",
    		ctx
    	});

    	return block;
    }

    // (31:8) <Card padded>
    function create_default_slot$1(ctx) {
    	let cardtext;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;

    	cardtext = new CardText({
    			props: {
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*stepData*/ ctx[9].learnMore && create_if_block_1(ctx);
    	let if_block1 = /*stepData*/ ctx[9].choices && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component(cardtext.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtext_changes = {};

    			if (dirty & /*$$scope, displayedSteps*/ 32770) {
    				cardtext_changes.$$scope = { dirty, ctx };
    			}

    			cardtext.$set(cardtext_changes);

    			if (/*stepData*/ ctx[9].learnMore) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*displayedSteps*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*stepData*/ ctx[9].choices) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*displayedSteps*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtext.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtext.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtext, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(31:8) <Card padded>",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#each displayedSteps as stepData,stepIdx}
    function create_each_block$1(ctx) {
    	let div;
    	let card;
    	let t;
    	let current;

    	card = new Card({
    			props: {
    				padded: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "card-container");
    			add_location(div, file$1, 29, 4, 1018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, displayedSteps, choiceElements*/ 32771) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(29:0) {#each displayedSteps as stepData,stepIdx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*displayedSteps*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*displayedSteps, choiceElements, handleClickChoice, Object*/ 7) {
    				each_value = /*displayedSteps*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HowTo', slots, []);
    	let { howToData } = $$props;
    	let { startingStepKey } = $$props;
    	const values = [];
    	let choiceElements = [{}, {}];
    	let displayedSteps = [];

    	const handleClickChoice = (stepData, choiceIdx) => {
    		stepData.selectedChoice = stepData.choices[choiceIdx];
    		buildDisplayedQuestionList();
    	};

    	const buildDisplayedQuestionList = () => {
    		let nextStepKey = startingStepKey;
    		$$invalidate(1, displayedSteps = []);

    		do {
    			let nextStepData;

    			if (howToData.hasOwnProperty(nextStepKey)) {
    				nextStepData = howToData[nextStepKey];
    			} else {
    				nextStepData = nextStepKey;
    			}

    			displayedSteps.push(nextStepData);

    			nextStepKey = nextStepData.selectedChoice
    			? Object.values(nextStepData.selectedChoice)[0]
    			: undefined;
    		} while (nextStepKey);
    	};

    	buildDisplayedQuestionList();
    	const writable_props = ['howToData', 'startingStepKey'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HowTo> was created with unknown prop '${key}'`);
    	});

    	function buttongroupitem_binding($$value, choiceIdx) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			choiceElements[choiceIdx] = $$value;
    			$$invalidate(0, choiceElements);
    		});
    	}

    	function buttongroup_value_binding(value, stepData) {
    		if ($$self.$$.not_equal(stepData.selectedChoice, value)) {
    			stepData.selectedChoice = value;
    			$$invalidate(1, displayedSteps);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('howToData' in $$props) $$invalidate(3, howToData = $$props.howToData);
    		if ('startingStepKey' in $$props) $$invalidate(4, startingStepKey = $$props.startingStepKey);
    	};

    	$$self.$capture_state = () => ({
    		ButtonGroup,
    		ButtonGroupItem,
    		Card,
    		CardText,
    		CardActions,
    		Button,
    		howToData,
    		startingStepKey,
    		values,
    		choiceElements,
    		displayedSteps,
    		handleClickChoice,
    		buildDisplayedQuestionList
    	});

    	$$self.$inject_state = $$props => {
    		if ('howToData' in $$props) $$invalidate(3, howToData = $$props.howToData);
    		if ('startingStepKey' in $$props) $$invalidate(4, startingStepKey = $$props.startingStepKey);
    		if ('choiceElements' in $$props) $$invalidate(0, choiceElements = $$props.choiceElements);
    		if ('displayedSteps' in $$props) $$invalidate(1, displayedSteps = $$props.displayedSteps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		choiceElements,
    		displayedSteps,
    		handleClickChoice,
    		howToData,
    		startingStepKey,
    		buttongroupitem_binding,
    		buttongroup_value_binding
    	];
    }

    class HowTo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { howToData: 3, startingStepKey: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HowTo",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*howToData*/ ctx[3] === undefined && !('howToData' in props)) {
    			console.warn("<HowTo> was created without expected prop 'howToData'");
    		}

    		if (/*startingStepKey*/ ctx[4] === undefined && !('startingStepKey' in props)) {
    			console.warn("<HowTo> was created without expected prop 'startingStepKey'");
    		}
    	}

    	get howToData() {
    		throw new Error("<HowTo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set howToData(value) {
    		throw new Error("<HowTo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startingStepKey() {
    		throw new Error("<HowTo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startingStepKey(value) {
    		throw new Error("<HowTo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.45.0 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (28:3) <Button>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Help");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(28:3) <Button>",
    		ctx
    	});

    	return block;
    }

    // (29:3) <Button fab depressed>
    function create_default_slot_6(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { path: mdiMagnify },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(29:3) <Button fab depressed>",
    		ctx
    	});

    	return block;
    }

    // (39:5) <ListItem>
    function create_default_slot_5(ctx) {
    	let t_value = /*howTo*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*howTos*/ 2 && t_value !== (t_value = /*howTo*/ ctx[6].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(39:5) <ListItem>",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#each howTos as howTo,i}
    function create_each_block(ctx) {
    	let listitem;
    	let current;

    	listitem = new ListItem({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(listitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listitem_changes = {};

    			if (dirty & /*$$scope, howTos*/ 514) {
    				listitem_changes.$$scope = { dirty, ctx };
    			}

    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(38:4) {#each howTos as howTo,i}",
    		ctx
    	});

    	return block;
    }

    // (32:3) <Menu right>
    function create_default_slot_4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*howTos*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*howTos*/ 2) {
    				each_value = /*howTos*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(32:3) <Menu right>",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Button fab depressed>
    function create_default_slot_3(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { path: mdiDotsVertical },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(34:6) <Button fab depressed>",
    		ctx
    	});

    	return block;
    }

    // (33:4) 
    function create_activator_slot(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				fab: true,
    				depressed: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "slot", "activator");
    			add_location(div, file, 32, 4, 949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_activator_slot.name,
    		type: "slot",
    		source: "(33:4) ",
    		ctx
    	});

    	return block;
    }

    // (20:2) <AppBar dense>
    function create_default_slot_2(ctx) {
    	let div;
    	let t0;
    	let button0;
    	let t1;
    	let button1;
    	let t2;
    	let menu;
    	let current;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				fab: true,
    				depressed: true,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menu = new Menu({
    			props: {
    				right: true,
    				$$slots: {
    					activator: [create_activator_slot],
    					default: [create_default_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			create_component(button0.$$.fragment);
    			t1 = space();
    			create_component(button1.$$.fragment);
    			t2 = space();
    			create_component(menu.$$.fragment);
    			set_style(div, "flex-grow", "1");
    			add_location(div, file, 26, 3, 807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(button0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const menu_changes = {};

    			if (dirty & /*$$scope, howTos*/ 514) {
    				menu_changes.$$scope = { dirty, ctx };
    			}

    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(20:2) <AppBar dense>",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Button fab depressed on:click={toggleNavigation}>
    function create_default_slot_1(ctx) {
    	let icon;
    	let current;
    	icon = new Icon({ props: { path: mdiMenu }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(22:4) <Button fab depressed on:click={toggleNavigation}>",
    		ctx
    	});

    	return block;
    }

    // (21:3) 
    function create_icon_slot(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				fab: true,
    				depressed: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggleNavigation*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			add_location(div, file, 20, 3, 622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(21:3) ",
    		ctx
    	});

    	return block;
    }

    // (26:3) 
    function create_title_slot(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let t2_value = /*howTos*/ ctx[1][0].title + "";
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			attr_dev(span, "slot", "title");
    			add_location(span, file, 25, 3, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*howTos*/ 2 && t2_value !== (t2_value = /*howTos*/ ctx[1][0].title + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(26:3) ",
    		ctx
    	});

    	return block;
    }

    // (18:0) <MaterialApp>
    function create_default_slot(ctx) {
    	let div;
    	let appbar;
    	let t0;
    	let howto;
    	let t1;
    	let navigationdrawer;
    	let t2;
    	let overlay;
    	let current;

    	appbar = new AppBar({
    			props: {
    				dense: true,
    				$$slots: {
    					title: [create_title_slot],
    					icon: [create_icon_slot],
    					default: [create_default_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	howto = new HowTo({
    			props: {
    				howToData: /*howTos*/ ctx[1][0],
    				startingStepKey: /*startingStepKey*/ ctx[4]
    			},
    			$$inline: true
    		});

    	navigationdrawer = new NavigationDrawer({
    			props: {
    				style: "position: relative",
    				active: /*active*/ ctx[2]
    			},
    			$$inline: true
    		});

    	overlay = new Overlay({
    			props: {
    				active: /*active*/ ctx[2],
    				absolute: true,
    				index: 1
    			},
    			$$inline: true
    		});

    	overlay.$on("click", /*toggleNavigation*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(appbar.$$.fragment);
    			t0 = space();
    			create_component(howto.$$.fragment);
    			t1 = space();
    			create_component(navigationdrawer.$$.fragment);
    			t2 = space();
    			create_component(overlay.$$.fragment);
    			set_style(div, "position", "relative");
    			set_style(div, "height", "250px");
    			add_location(div, file, 18, 1, 557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(appbar, div, null);
    			append_dev(div, t0);
    			mount_component(howto, div, null);
    			append_dev(div, t1);
    			mount_component(navigationdrawer, div, null);
    			append_dev(div, t2);
    			mount_component(overlay, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const appbar_changes = {};

    			if (dirty & /*$$scope, howTos, title*/ 515) {
    				appbar_changes.$$scope = { dirty, ctx };
    			}

    			appbar.$set(appbar_changes);
    			const howto_changes = {};
    			if (dirty & /*howTos*/ 2) howto_changes.howToData = /*howTos*/ ctx[1][0];
    			howto.$set(howto_changes);
    			const navigationdrawer_changes = {};
    			if (dirty & /*active*/ 4) navigationdrawer_changes.active = /*active*/ ctx[2];
    			navigationdrawer.$set(navigationdrawer_changes);
    			const overlay_changes = {};
    			if (dirty & /*active*/ 4) overlay_changes.active = /*active*/ ctx[2];
    			overlay.$set(overlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(appbar.$$.fragment, local);
    			transition_in(howto.$$.fragment, local);
    			transition_in(navigationdrawer.$$.fragment, local);
    			transition_in(overlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(appbar.$$.fragment, local);
    			transition_out(howto.$$.fragment, local);
    			transition_out(navigationdrawer.$$.fragment, local);
    			transition_out(overlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(appbar);
    			destroy_component(howto);
    			destroy_component(navigationdrawer);
    			destroy_component(overlay);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:0) <MaterialApp>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let materialapp;
    	let current;

    	materialapp = new MaterialApp({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(materialapp.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(materialapp, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const materialapp_changes = {};

    			if (dirty & /*$$scope, active, howTos, title*/ 519) {
    				materialapp_changes.$$scope = { dirty, ctx };
    			}

    			materialapp.$set(materialapp_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(materialapp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(materialapp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(materialapp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const items = [
    		{ text: 'Who', href: '/question/1' },
    		{ text: 'How', href: '/question/2' },
    		{ text: 'Details', disabled: true }
    	];

    	let active = false;

    	function toggleNavigation() {
    		$$invalidate(2, active = !active);
    	}

    	let { title } = $$props;
    	let { howTos } = $$props;
    	let startingStepKey = 'q1';
    	const writable_props = ['title', 'howTos'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('howTos' in $$props) $$invalidate(1, howTos = $$props.howTos);
    	};

    	$$self.$capture_state = () => ({
    		MaterialApp,
    		AppBar,
    		Button,
    		Icon,
    		NavigationDrawer,
    		Overlay,
    		Menu,
    		ListItem,
    		mdiMenu,
    		mdiMagnify,
    		mdiDotsVertical,
    		HowTo,
    		items,
    		active,
    		toggleNavigation,
    		title,
    		howTos,
    		startingStepKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('howTos' in $$props) $$invalidate(1, howTos = $$props.howTos);
    		if ('startingStepKey' in $$props) $$invalidate(4, startingStepKey = $$props.startingStepKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, howTos, active, toggleNavigation, startingStepKey];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 0, howTos: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<App> was created without expected prop 'title'");
    		}

    		if (/*howTos*/ ctx[1] === undefined && !('howTos' in props)) {
    			console.warn("<App> was created without expected prop 'howTos'");
    		}
    	}

    	get title() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get howTos() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set howTos(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var data$1 = { title:"Customer feedback",
      q1:{ question:"Do you want to report this internallly with us, the Better Business Bureau, or Santa Claus?",
        choices:[ { Us:"q2" },
          { BBB:"bbbDetails" },
          { "Santa Claus":"santaClausDetails" } ],
        learnMore:"http://wiki.abco.com/customer-complaint-learn-more" },
      q2:{ question:"Do you want to use your mobile phone or your computer?",
        choices:[ { "Mobile phone":"q3" },
          { Computer:"webBrowserHowTo" } ] },
      q3:{ question:"Are you using the mobile app or the web browser on the mobile phone?",
        choices:[ { "Mobile App":"mobileAppHowTo" },
          { "Mobile Web Browser":"webBrowserHowTo" },
          { Other:"http://wiki.abco.com/OtherInfoWikiPage" } ],
        learnMore:"http://wiki.abco.com/Q3LearnMore" },
      mobileAppHowTo:"### Heading\n* Bullets\n* Points\n",
      bbbDetails:"http://wiki.abco.com/bbb+details",
      santaClausDetails:"http://wiki.abco.com/santa-clause-details",
      webBrowserHowTo:"cmsKey://WebBrowserHowToCmsKey" };
    data$1.title;
    data$1.q1;
    data$1.q2;
    data$1.q3;
    data$1.mobileAppHowTo;
    data$1.bbbDetails;
    data$1.santaClausDetails;
    data$1.webBrowserHowTo;

    var data = { title:"Turn on lights",
      q1:{ question:"Which lights do you want to turn on?",
        choices:[ { kitchen:"q2" },
          { pantry:"pantryLights" },
          { backyard:"backyardLights" } ] },
      q2:{ question:"Are you inside or outside of the room?",
        choices:[ { inside:"flickSwitch" },
          { outside:"q3" },
          { "too dark to be sure":"http://wiki.abco.com/too-dark-guide" } ],
        learnMore:"http://wiki.abco.com/too-dark-tips" },
      q3:{ question:"Is the door to the room open or closed?",
        choices:[ { open:"enterDoor" },
          { closed:"openDoor" },
          { "I can't see":"cantSee" } ] },
      webBrowserHowTo:"cmsKey://WebBrowserHowToCmsKey",
      backyardLights:"http://wiki.abco.com/backyard-lights",
      pantryLights:"http://wiki.abco.com/pantry-lights",
      flickSwitch:"http://wiki.abco.com/flick-switch",
      enterDoor:"http://wiki.abco.com/enter-door",
      openDoor:"http://wiki.abco.com/open-door",
      cantSee:"http://wiki.abco.com/cant-see" };
    data.title;
    data.q1;
    data.q2;
    data.q3;
    data.webBrowserHowTo;
    data.backyardLights;
    data.pantryLights;
    data.flickSwitch;
    data.enterDoor;
    data.openDoor;
    data.cantSee;

    let howTos = [data$1, data];
    const app = new App({
        target: document.body,
        props: {
            title: 'How-To',
            howTos: howTos
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

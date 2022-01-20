import { S as SvelteComponent, i as init, s as safe_not_equal, l as empty, g as insert_hydration, q as transition_in, e as element, k as space, c as claim_element, a as children, m as claim_space, d as detach, b as attr, J as append_hydration, X as add_render_callback, Y as create_out_transition, o as transition_out, p as check_outros, w as create_component, x as claim_component, y as mount_component, B as destroy_component, T as destroy_each, Z as create_in_transition, _ as fade, t as text, h as claim_text, j as set_data, $ as listen, n as group_outros, a0 as Card, a1 as fly, a2 as CardText, a3 as CardActions, a4 as prevent_default, f as set_style, a5 as add_flush_callback, N as Button, a6 as ButtonGroup, a7 as binding_callbacks, a8 as bind, a9 as ButtonGroupItem, aa as is_function } from "../chunks/vendor-968b8cf9.js";
class UserChoice {
  constructor(init2) {
    Object.assign(this, init2);
  }
}
var HowTo_svelte_svelte_type_style_lang = "";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[17] = list[i];
  child_ctx[19] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[22] = i;
  return child_ctx;
}
function create_if_block_4(ctx) {
  let li;
  let t;
  let li_intro;
  let li_outro;
  let current;
  function select_block_type(ctx2, dirty) {
    if (ctx2[22] < ctx2[1])
      return create_if_block_5;
    if (ctx2[22] == ctx2[1])
      return create_if_block_6;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      li = element("li");
      if (if_block)
        if_block.c();
      t = space();
      this.h();
    },
    l(nodes) {
      li = claim_element(nodes, "LI", { class: true });
      var li_nodes = children(li);
      if (if_block)
        if_block.l(li_nodes);
      t = claim_space(li_nodes);
      li_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(li, "class", "svelte-vct3j4");
    },
    m(target, anchor) {
      insert_hydration(target, li, anchor);
      if (if_block)
        if_block.m(li, null);
      append_hydration(li, t);
      current = true;
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(li, t);
        }
      }
    },
    i(local) {
      if (current)
        return;
      add_render_callback(() => {
        if (li_outro)
          li_outro.end(1);
        li_intro = create_in_transition(li, fly, { y: 200, duration: 750 });
        li_intro.start();
      });
      current = true;
    },
    o(local) {
      if (li_intro)
        li_intro.invalidate();
      li_outro = create_out_transition(li, fade, {});
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(li);
      if (if_block) {
        if_block.d();
      }
      if (detaching && li_outro)
        li_outro.end();
    }
  };
}
function create_if_block_6(ctx) {
  let span;
  let t_value = (ctx[20].selectedChoiceKey ? ctx[20].selectedChoiceKey : ctx[20].stepKey) + "";
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
    },
    l(nodes) {
      span = claim_element(nodes, "SPAN", {});
      var span_nodes = children(span);
      t = claim_text(span_nodes, t_value);
      span_nodes.forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, span, anchor);
      append_hydration(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = (ctx2[20].selectedChoiceKey ? ctx2[20].selectedChoiceKey : ctx2[20].stepKey) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(span);
    }
  };
}
function create_if_block_5(ctx) {
  let a;
  let t_value = ctx[20].selectedChoiceKey + "";
  let t;
  let a_href_value;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[10](ctx[22]);
  }
  return {
    c() {
      a = element("a");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      a = claim_element(nodes, "A", { href: true, class: true });
      var a_nodes = children(a);
      t = claim_text(a_nodes, t_value);
      a_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a, "href", a_href_value = ctx[20].path);
      attr(a, "class", "svelte-vct3j4");
    },
    m(target, anchor) {
      insert_hydration(target, a, anchor);
      append_hydration(a, t);
      if (!mounted) {
        dispose = listen(a, "click", prevent_default(click_handler));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t_value !== (t_value = ctx[20].selectedChoiceKey + ""))
        set_data(t, t_value);
      if (dirty & 1 && a_href_value !== (a_href_value = ctx[20].path)) {
        attr(a, "href", a_href_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(a);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block_1(ctx) {
  let if_block_anchor;
  let current;
  let if_block = ctx[22] <= ctx[1] && create_if_block_4(ctx);
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
    p(ctx2, dirty) {
      if (ctx2[22] <= ctx2[1]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_4(ctx2);
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
function create_if_block(ctx) {
  let div;
  let card;
  let div_intro;
  let div_outro;
  let current;
  card = new Card({
    props: {
      padded: true,
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(card.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(card.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "card-container");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(card, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 8388644) {
        card_changes.$$scope = { dirty, ctx };
      }
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      add_render_callback(() => {
        if (div_outro)
          div_outro.end(1);
        div_intro = create_in_transition(div, fly, {
          x: 200 * ctx[4],
          duration: 750
        });
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      if (div_intro)
        div_intro.invalidate();
      div_outro = create_out_transition(div, fade, {});
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(card);
      if (detaching && div_outro)
        div_outro.end();
    }
  };
}
function create_else_block(ctx) {
  let t_value = (ctx[5].question ? ctx[5].question : ctx[5]) + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    l(nodes) {
      t = claim_text(nodes, t_value);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t_value !== (t_value = (ctx2[5].question ? ctx2[5].question : ctx2[5]) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_if_block_3(ctx) {
  let a;
  let t;
  return {
    c() {
      a = element("a");
      t = text(ctx[5]);
      this.h();
    },
    l(nodes) {
      a = claim_element(nodes, "A", { href: true, target: true });
      var a_nodes = children(a);
      t = claim_text(a_nodes, ctx[5]);
      a_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a, "href", ctx[5]);
      attr(a, "target", "_tab");
    },
    m(target, anchor) {
      insert_hydration(target, a, anchor);
      append_hydration(a, t);
    },
    p(ctx2, dirty) {
      if (dirty & 32)
        set_data(t, ctx2[5]);
      if (dirty & 32) {
        attr(a, "href", ctx2[5]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(a);
    }
  };
}
function create_default_slot_5(ctx) {
  let div2;
  let div0;
  let t0;
  let t1;
  let div1;
  let show_if;
  function select_block_type_1(ctx2, dirty) {
    if (dirty & 32)
      show_if = null;
    if (show_if == null)
      show_if = !!((typeof ctx2[5] == "string" || ctx2[5] instanceof String) && isValidHttpUrl(ctx2[5]));
    if (show_if)
      return create_if_block_3;
    return create_else_block;
  }
  let current_block_type = select_block_type_1(ctx, -1);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = text("Guide:");
      t1 = space();
      div1 = element("div");
      if_block.c();
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true, style: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { style: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, "Guide:");
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { style: true });
      var div1_nodes = children(div1);
      if_block.l(div1_nodes);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_style(div0, "margin", "0px");
      set_style(div0, "padding", "10px 0px");
      set_style(div0, "color", "#888");
      set_style(div0, "width", "50px");
      set_style(div1, "flex-grow", "1");
      set_style(div1, "font-size", "24px");
      set_style(div1, "background-color", "#F3F5F6");
      set_style(div1, "margin", "10px");
      set_style(div1, "padding", "25px 20px");
      attr(div2, "class", "container");
      set_style(div2, "display", "flex");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, t0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      if_block.m(div1, null);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div1, null);
        }
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if_block.d();
    }
  };
}
function create_if_block_2(ctx) {
  let button;
  let current;
  button = new Button({
    props: {
      text: true,
      class: "primary-text",
      $$slots: { default: [create_default_slot_4] },
      $$scope: { ctx }
    }
  });
  button.$on("click", ctx[11]);
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
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & 8388608) {
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
function create_default_slot_4(ctx) {
  let t;
  return {
    c() {
      t = text("Learn More");
    },
    l(nodes) {
      t = claim_text(nodes, "Learn More");
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  let buttongroup;
  let updating_value;
  let current;
  function buttongroup_value_binding(value) {
    ctx[12](value);
  }
  let buttongroup_props = {
    mandatory: true,
    activeClass: "selected-choice white-text",
    $$slots: { default: [create_default_slot_2] },
    $$scope: { ctx }
  };
  if (ctx[5].selectedChoiceKey !== void 0) {
    buttongroup_props.value = ctx[5].selectedChoiceKey;
  }
  buttongroup = new ButtonGroup({ props: buttongroup_props });
  binding_callbacks.push(() => bind(buttongroup, "value", buttongroup_value_binding));
  return {
    c() {
      div = element("div");
      create_component(buttongroup.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      claim_component(buttongroup.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "text-center");
      set_style(div, "flex", "20");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(buttongroup, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const buttongroup_changes = {};
      if (dirty & 8388644) {
        buttongroup_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_value && dirty & 32) {
        updating_value = true;
        buttongroup_changes.value = ctx2[5].selectedChoiceKey;
        add_flush_callback(() => updating_value = false);
      }
      buttongroup.$set(buttongroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(buttongroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(buttongroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(buttongroup);
    }
  };
}
function create_default_slot_3(ctx) {
  let t0_value = ctx[17] + "";
  let t0;
  let t1;
  return {
    c() {
      t0 = text(t0_value);
      t1 = space();
    },
    l(nodes) {
      t0 = claim_text(nodes, t0_value);
      t1 = claim_space(nodes);
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t0_value !== (t0_value = ctx2[17] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
    }
  };
}
function create_each_block(ctx) {
  let buttongroupitem;
  let current;
  buttongroupitem = new ButtonGroupItem({
    props: {
      value: ctx[17],
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  buttongroupitem.$on("click", function() {
    if (is_function(ctx[6](ctx[2], ctx[17])))
      ctx[6](ctx[2], ctx[17]).apply(this, arguments);
  });
  return {
    c() {
      create_component(buttongroupitem.$$.fragment);
    },
    l(nodes) {
      claim_component(buttongroupitem.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(buttongroupitem, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const buttongroupitem_changes = {};
      if (dirty & 32)
        buttongroupitem_changes.value = ctx[17];
      if (dirty & 8388640) {
        buttongroupitem_changes.$$scope = { dirty, ctx };
      }
      buttongroupitem.$set(buttongroupitem_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(buttongroupitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(buttongroupitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(buttongroupitem, detaching);
    }
  };
}
function create_default_slot_2(ctx) {
  let each_1_anchor;
  let current;
  let each_value = Object.keys(ctx[5].choices);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    l(nodes) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(nodes);
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert_hydration(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 100) {
        each_value = Object.keys(ctx2[5].choices);
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
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
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function create_default_slot_1(ctx) {
  let div;
  let t;
  let if_block1_anchor;
  let current;
  let if_block0 = ctx[5].learnMore && create_if_block_2(ctx);
  let if_block1 = ctx[5].choices && create_if_block_1(ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { style: true });
      var div_nodes = children(div);
      if (if_block0)
        if_block0.l(div_nodes);
      div_nodes.forEach(detach);
      t = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      if_block1_anchor = empty();
      this.h();
    },
    h() {
      set_style(div, "flex", "1");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      insert_hydration(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (ctx2[5].learnMore) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & 32) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, null);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (ctx2[5].choices) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 32) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block0)
        if_block0.d();
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
function create_default_slot(ctx) {
  let cardtext;
  let t;
  let cardactions;
  let current;
  cardtext = new CardText({
    props: {
      $$slots: { default: [create_default_slot_5] },
      $$scope: { ctx }
    }
  });
  cardactions = new CardActions({
    props: {
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(cardtext.$$.fragment);
      t = space();
      create_component(cardactions.$$.fragment);
    },
    l(nodes) {
      claim_component(cardtext.$$.fragment, nodes);
      t = claim_space(nodes);
      claim_component(cardactions.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(cardtext, target, anchor);
      insert_hydration(target, t, anchor);
      mount_component(cardactions, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const cardtext_changes = {};
      if (dirty & 8388640) {
        cardtext_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cardtext.$set(cardtext_changes);
      const cardactions_changes = {};
      if (dirty & 8388644) {
        cardactions_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cardactions.$set(cardactions_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(cardtext.$$.fragment, local);
      transition_in(cardactions.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cardtext.$$.fragment, local);
      transition_out(cardactions.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(cardtext, detaching);
      if (detaching)
        detach(t);
      destroy_component(cardactions, detaching);
    }
  };
}
function create_fragment(ctx) {
  let ul;
  let t;
  let if_block_anchor;
  let current;
  let each_value_1 = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  let if_block = ctx[3] && create_if_block(ctx);
  return {
    c() {
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      this.h();
    },
    l(nodes) {
      ul = claim_element(nodes, "UL", { class: true });
      var ul_nodes = children(ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(ul_nodes);
      }
      ul_nodes.forEach(detach);
      t = claim_space(nodes);
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
      this.h();
    },
    h() {
      attr(ul, "class", "breadcrumb svelte-vct3j4");
    },
    m(target, anchor) {
      insert_hydration(target, ul, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }
      insert_hydration(target, t, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 131) {
        each_value_1 = ctx2[0];
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block_1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(ul, null);
          }
        }
        group_outros();
        for (i = each_value_1.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (ctx2[3]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
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
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(if_block);
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(ul);
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(t);
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function isValidHttpUrl(possibleUrlStr) {
  let url;
  try {
    url = new URL(possibleUrlStr);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
function instance($$self, $$props, $$invalidate) {
  let currentHowToStep;
  let { howToData } = $$props;
  let { startingStepKey } = $$props;
  let startingUserChoice = new UserChoice({
    path: `/${startingStepKey}`,
    stepKey: startingStepKey
  });
  let userChoices = [startingUserChoice];
  let currentUserChoiceIdx = 0;
  let currentUserChoice;
  let visibleCard = true;
  let transitionMultiplier = 1;
  const handleClickChoice = (userChoice, choiceKey) => {
    if (choiceKey !== userChoice.selectedChoiceKey) {
      $$invalidate(0, userChoices.length = currentUserChoiceIdx + 1, userChoices);
      userChoice.selectedChoiceKey = choiceKey;
      userChoice.selectedChoiceValue = howToData[userChoice.stepKey].choices[choiceKey];
      if (currentUserChoiceIdx + 1 >= userChoices.length) {
        let newUserChoice;
        if (howToData.hasOwnProperty(userChoice.selectedChoiceValue)) {
          newUserChoice = new UserChoice({
            path: `${currentUserChoice.path}/${userChoice.selectedChoiceValue}`,
            stepKey: userChoice.selectedChoiceValue
          });
        } else {
          newUserChoice = new UserChoice({ url: userChoice.selectedChoiceValue });
        }
        $$invalidate(0, userChoices = [...userChoices, newUserChoice]);
      } else {
        $$invalidate(0, userChoices);
      }
    }
    transactionCard(false, () => {
      $$invalidate(1, currentUserChoiceIdx++, currentUserChoiceIdx);
    });
  };
  function transactionCard(toRight, callback) {
    $$invalidate(4, transitionMultiplier = toRight ? -1 : 1);
    $$invalidate(3, visibleCard = false);
    setTimeout(() => {
      callback();
      $$invalidate(3, visibleCard = true);
    }, 250);
  }
  const handleClickBreadcrumb = (userChoiceIdx) => {
    transactionCard(true, () => {
      $$invalidate(1, currentUserChoiceIdx = userChoiceIdx);
    });
  };
  const click_handler = (userChoiceIdx) => handleClickBreadcrumb(userChoiceIdx);
  const click_handler_1 = () => {
    window.open(currentHowToStep.learnMore, "_tab");
  };
  function buttongroup_value_binding(value) {
    if ($$self.$$.not_equal(currentHowToStep.selectedChoiceKey, value)) {
      currentHowToStep.selectedChoiceKey = value;
      $$invalidate(5, currentHowToStep), $$invalidate(8, howToData), $$invalidate(2, currentUserChoice), $$invalidate(0, userChoices), $$invalidate(1, currentUserChoiceIdx);
    }
  }
  $$self.$$set = ($$props2) => {
    if ("howToData" in $$props2)
      $$invalidate(8, howToData = $$props2.howToData);
    if ("startingStepKey" in $$props2)
      $$invalidate(9, startingStepKey = $$props2.startingStepKey);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 3) {
      $$invalidate(2, currentUserChoice = userChoices[currentUserChoiceIdx]);
    }
    if ($$self.$$.dirty & 260) {
      $$invalidate(5, currentHowToStep = howToData[currentUserChoice.stepKey]);
    }
  };
  return [
    userChoices,
    currentUserChoiceIdx,
    currentUserChoice,
    visibleCard,
    transitionMultiplier,
    currentHowToStep,
    handleClickChoice,
    handleClickBreadcrumb,
    howToData,
    startingStepKey,
    click_handler,
    click_handler_1,
    buttongroup_value_binding
  ];
}
class HowTo extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { howToData: 8, startingStepKey: 9 });
  }
}
export { HowTo as default };

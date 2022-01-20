import { S as SvelteComponent, i as init, s as safe_not_equal, M as MaterialApp, w as create_component, x as claim_component, y as mount_component, q as transition_in, o as transition_out, B as destroy_component, L as AppBar, O as Overlay, e as element, k as space, c as claim_element, a as children, m as claim_space, d as detach, f as set_style, g as insert_hydration, J as append_hydration, N as Button, P as Menu, b as attr, t as text, h as claim_text, K as noop, Q as Icon, R as mdiMagnify, l as empty, n as group_outros, p as check_outros, T as destroy_each, U as mdiMenu, V as ListItem, W as mdiDotsVertical } from "../chunks/vendor-968b8cf9.js";
import HowTo from "./HowTo.svelte-dc191d1a.js";
var data$1 = {
  title: "Customer feedback",
  who: {
    question: "Do you want to report this with us (internally), the Better Business Bureau, or Santa Claus?",
    choices: {
      Us: "how",
      BBB: "bbb-info",
      "Santa Claus": "santa-info"
    },
    learnMore: "https://www.google.com/search?q=customer+complaint"
  },
  how: {
    question: "Do you want to use your mobile phone or your computer?",
    choices: {
      "Mobile phone": "mobile-phone",
      Computer: "browser-how-to"
    }
  },
  "mobile-phone": {
    question: "Are you using the mobile app or the web browser on the mobile phone?",
    choices: {
      "Mobile App": "mobile-app-how-to",
      "Mobile Web Browser": "browser-how-to",
      Other: "other-info"
    },
    learnMore: "https://www.google.com/search?q=app+learn+more"
  },
  "mobile-app-how-to": "### Heading\n* Bullets\n* Points\n",
  "bbb-info": "https://www.bbb.org/file-a-complaint",
  "santa-info": "https://www.google.com/search?q=santa+info",
  "browser-how-to": "https://www.google.com/search?q=browser+how+to",
  "other-info": "https://www.google.com/search?q=other+info"
};
data$1.title;
data$1.who;
data$1.how;
var data = {
  title: "Turn on lights",
  q1: {
    question: "Which lights do you want to turn on?",
    choices: {
      kitchen: "q2",
      pantry: "pantryLights",
      backyard: "backyardLights"
    }
  },
  q2: {
    question: "Are you inside or outside of the room?",
    choices: {
      inside: "flickSwitch",
      outside: "q3",
      "too dark to be sure": "http://wiki.abco.com/too-dark-guide"
    },
    learnMore: "http://wiki.abco.com/too-dark-tips"
  },
  q3: {
    question: "Is the door to the room open or closed?",
    choices: {
      open: "enterDoor",
      closed: "openDoor",
      "I can't see": "cantSee"
    }
  },
  webBrowserHowTo: "cmsKey://WebBrowserHowToCmsKey",
  backyardLights: "http://wiki.abco.com/backyard-lights",
  pantryLights: "http://wiki.abco.com/pantry-lights",
  flickSwitch: "http://wiki.abco.com/flick-switch",
  enterDoor: "http://wiki.abco.com/enter-door",
  openDoor: "http://wiki.abco.com/open-door",
  cantSee: "http://wiki.abco.com/cant-see"
};
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
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  child_ctx[5] = i;
  return child_ctx;
}
function create_default_slot_7(ctx) {
  let t;
  return {
    c() {
      t = text("Help");
    },
    l(nodes) {
      t = claim_text(nodes, "Help");
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
function create_default_slot_6(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: mdiMagnify } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_5(ctx) {
  let t_value = ctx[3].title + "";
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
    p: noop,
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_each_block(ctx) {
  let listitem;
  let current;
  listitem = new ListItem({
    props: {
      $$slots: { default: [create_default_slot_5] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(listitem.$$.fragment);
    },
    l(nodes) {
      claim_component(listitem.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(listitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const listitem_changes = {};
      if (dirty & 64) {
        listitem_changes.$$scope = { dirty, ctx: ctx2 };
      }
      listitem.$set(listitem_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(listitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(listitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(listitem, detaching);
    }
  };
}
function create_default_slot_4(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ctx[1];
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
      if (dirty & 2) {
        each_value = ctx2[1];
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
function create_default_slot_3(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: mdiDotsVertical } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
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
    }
  });
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { slot: true });
      var div_nodes = children(div);
      claim_component(button.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "slot", "activator");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & 64) {
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
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_default_slot_2(ctx) {
  let div0;
  let t0;
  let div1;
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
    }
  });
  button1 = new Button({
    props: {
      fab: true,
      depressed: true,
      $$slots: { default: [create_default_slot_6] },
      $$scope: { ctx }
    }
  });
  menu = new Menu({
    props: {
      right: true,
      $$slots: {
        activator: [create_activator_slot],
        default: [create_default_slot_4]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      create_component(button0.$$.fragment);
      t1 = space();
      create_component(button1.$$.fragment);
      t2 = space();
      create_component(menu.$$.fragment);
      this.h();
    },
    l(nodes) {
      div0 = claim_element(nodes, "DIV", { style: true });
      children(div0).forEach(detach);
      t0 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {});
      var div1_nodes = children(div1);
      claim_component(button0.$$.fragment, div1_nodes);
      t1 = claim_space(div1_nodes);
      claim_component(button1.$$.fragment, div1_nodes);
      t2 = claim_space(div1_nodes);
      claim_component(menu.$$.fragment, div1_nodes);
      div1_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_style(div0, "flex-grow", "1");
    },
    m(target, anchor) {
      insert_hydration(target, div0, anchor);
      insert_hydration(target, t0, anchor);
      insert_hydration(target, div1, anchor);
      mount_component(button0, div1, null);
      append_hydration(div1, t1);
      mount_component(button1, div1, null);
      append_hydration(div1, t2);
      mount_component(menu, div1, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & 64) {
        button0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & 64) {
        button1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      button1.$set(button1_changes);
      const menu_changes = {};
      if (dirty & 64) {
        menu_changes.$$scope = { dirty, ctx: ctx2 };
      }
      menu.$set(menu_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      transition_in(menu.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      transition_out(menu.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div0);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(div1);
      destroy_component(button0);
      destroy_component(button1);
      destroy_component(menu);
    }
  };
}
function create_default_slot_1(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: mdiMenu } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
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
    }
  });
  button.$on("click", ctx[2]);
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { slot: true });
      var div_nodes = children(div);
      claim_component(button.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "slot", "icon");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const button_changes = {};
      if (dirty & 64) {
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
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_title_slot(ctx) {
  let span;
  let t0;
  let t1;
  let t2_value = ctx[1][0].title + "";
  let t2;
  return {
    c() {
      span = element("span");
      t0 = text(title);
      t1 = text(": ");
      t2 = text(t2_value);
      this.h();
    },
    l(nodes) {
      span = claim_element(nodes, "SPAN", { slot: true });
      var span_nodes = children(span);
      t0 = claim_text(span_nodes, title);
      t1 = claim_text(span_nodes, ": ");
      t2 = claim_text(span_nodes, t2_value);
      span_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(span, "slot", "title");
    },
    m(target, anchor) {
      insert_hydration(target, span, anchor);
      append_hydration(span, t0);
      append_hydration(span, t1);
      append_hydration(span, t2);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(span);
    }
  };
}
function create_default_slot(ctx) {
  let div;
  let appbar;
  let t0;
  let howto;
  let t1;
  let overlay;
  let current;
  appbar = new AppBar({
    props: {
      position: "static",
      $$slots: {
        title: [create_title_slot],
        icon: [create_icon_slot],
        default: [create_default_slot_2]
      },
      $$scope: { ctx }
    }
  });
  howto = new HowTo({
    props: {
      howToData: ctx[1][0],
      startingStepKey
    }
  });
  overlay = new Overlay({
    props: {
      active: ctx[0],
      absolute: true,
      index: 1
    }
  });
  overlay.$on("click", ctx[2]);
  return {
    c() {
      div = element("div");
      create_component(appbar.$$.fragment);
      t0 = space();
      create_component(howto.$$.fragment);
      t1 = space();
      create_component(overlay.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { style: true });
      var div_nodes = children(div);
      claim_component(appbar.$$.fragment, div_nodes);
      t0 = claim_space(div_nodes);
      claim_component(howto.$$.fragment, div_nodes);
      t1 = claim_space(div_nodes);
      claim_component(overlay.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_style(div, "position", "relative");
      set_style(div, "height", "250px");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(appbar, div, null);
      append_hydration(div, t0);
      mount_component(howto, div, null);
      append_hydration(div, t1);
      mount_component(overlay, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const appbar_changes = {};
      if (dirty & 64) {
        appbar_changes.$$scope = { dirty, ctx: ctx2 };
      }
      appbar.$set(appbar_changes);
      const overlay_changes = {};
      if (dirty & 1)
        overlay_changes.active = ctx2[0];
      overlay.$set(overlay_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(appbar.$$.fragment, local);
      transition_in(howto.$$.fragment, local);
      transition_in(overlay.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(appbar.$$.fragment, local);
      transition_out(howto.$$.fragment, local);
      transition_out(overlay.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(appbar);
      destroy_component(howto);
      destroy_component(overlay);
    }
  };
}
function create_fragment(ctx) {
  let materialapp;
  let current;
  materialapp = new MaterialApp({
    props: {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(materialapp.$$.fragment);
    },
    l(nodes) {
      claim_component(materialapp.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(materialapp, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const materialapp_changes = {};
      if (dirty & 65) {
        materialapp_changes.$$scope = { dirty, ctx: ctx2 };
      }
      materialapp.$set(materialapp_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(materialapp.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(materialapp.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(materialapp, detaching);
    }
  };
}
let title = "How-To";
let startingStepKey = "who";
function instance($$self, $$props, $$invalidate) {
  let howTos = [data$1, data];
  let active = false;
  function toggleNavigation() {
    $$invalidate(0, active = !active);
  }
  return [active, howTos, toggleNavigation];
}
class Routes extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export { Routes as default };

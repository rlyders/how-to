import{S as j,i as z,s as J,T as Q,w as h,x as g,y as w,q as u,o as m,B as b,e as q,c as I,a as L,d as p,g as _,L as X,M as Y,k as B,m as T,b as O,J as y,p as K,R as Z,N as F,O as G,P as x,Q as ee,n as V,U as te,V as A,t as S,h as D,W as oe,X as M,Y as ne,Z as se,f as re,j as ae,_ as le,l as E,$ as ie,a0 as fe,a1 as ce,K as $e}from"../chunks/vendor-1bdd7840.js";import ue from"./HowTo.svelte-20ffd1ca.js";var C={title:"Customer feedback",who:{question:"Do you want to report this with us (internally), the Better Business Bureau, or Santa Claus?",choices:{Us:"how",BBB:"bbb-info","Santa Claus":"santa-info"},learnMore:"https://www.google.com/search?q=customer+complaint"},how:{question:"Do you want to use your mobile phone or your computer?",choices:{"Mobile phone":"mobile-phone",Computer:"browser-how-to"}},"mobile-phone":{question:"Are you using the mobile app or the web browser on the mobile phone?",choices:{"Mobile App":"mobile-app-how-to","Mobile Web Browser":"browser-how-to",Other:"other-info"},learnMore:"https://www.google.com/search?q=app+learn+more"},"mobile-app-how-to":`### Heading
* Bullets
* Points
`,"bbb-info":"https://www.bbb.org/file-a-complaint","santa-info":"https://www.google.com/search?q=santa+info","browser-how-to":"https://www.google.com/search?q=browser+how+to","other-info":"https://www.google.com/search?q=other+info"};C.title;C.who;C.how;var k={title:"Turn on lights",which:{question:"Which lights do you want to turn on?",choices:{kitchen:"inOut",pantry:"pantryLights",backyard:"backyardLights"}},inOut:{question:"Are you inside or outside of the room?",choices:{inside:"flickSwitch",outside:"openClosed","too dark to be sure":"tooDark"},learnMore:"http://wiki.abco.com/too-dark-tips"},openClosed:{question:"Is the door to the room open or closed?",choices:{open:"enterDoor",closed:"openDoor","I can't see":"cantSee"}},webBrowserHowTo:"cmsKey://WebBrowserHowToCmsKey",backyardLights:"http://wiki.abco.com/backyard-lights",pantryLights:"http://wiki.abco.com/pantry-lights",flickSwitch:"http://wiki.abco.com/flick-switch",enterDoor:"http://wiki.abco.com/enter-door",openDoor:"http://wiki.abco.com/open-door",cantSee:"http://wiki.abco.com/cant-see",tooDark:"http://wiki.abco.com/too-dark"};k.title;k.which;k.inOut;k.openClosed;k.webBrowserHowTo;k.backyardLights;k.pantryLights;k.flickSwitch;k.enterDoor;k.openDoor;k.cantSee;k.tooDark;function U(i,e,o){const t=i.slice();return t[10]=e[o],t[12]=o,t}function pe(i){let e;return{c(){e=S("menu")},l(o){e=D(o,"menu")},m(o,t){_(o,e,t)},d(o){o&&p(e)}}}function me(i){let e=i[10].title+"",o;return{c(){o=S(e)},l(t){o=D(t,e)},m(t,n){_(t,o,n)},p:$e,d(t){t&&p(o)}}}function _e(i){let e,o,t;return e=new ce({props:{$$slots:{default:[me]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment),o=B()},l(n){g(e.$$.fragment,n),o=T(n)},m(n,r){w(e,n,r),_(n,o,r),t=!0},p(n,r){const a={};r&8192&&(a.$$scope={dirty:r,ctx:n}),e.$set(a)},i(n){t||(u(e.$$.fragment,n),t=!0)},o(n){m(e.$$.fragment,n),t=!1},d(n){b(e,n),n&&p(o)}}}function P(i){let e,o;function t(){return i[7](i[10])}return e=new fe({props:{$$slots:{default:[_e]},$$scope:{ctx:i}}}),e.$on("SMUI:action",t),{c(){h(e.$$.fragment)},l(n){g(e.$$.fragment,n)},m(n,r){w(e,n,r),o=!0},p(n,r){i=n;const a={};r&8192&&(a.$$scope={dirty:r,ctx:i}),e.$set(a)},i(n){o||(u(e.$$.fragment,n),o=!0)},o(n){m(e.$$.fragment,n),o=!1},d(n){b(e,n)}}}function he(i){let e,o,t=i[4],n=[];for(let a=0;a<t.length;a+=1)n[a]=P(U(i,t,a));const r=a=>m(n[a],1,1,()=>{n[a]=null});return{c(){for(let a=0;a<n.length;a+=1)n[a].c();e=E()},l(a){for(let l=0;l<n.length;l+=1)n[l].l(a);e=E()},m(a,l){for(let s=0;s<n.length;s+=1)n[s].m(a,l);_(a,e,l),o=!0},p(a,l){if(l&48){t=a[4];let s;for(s=0;s<t.length;s+=1){const f=U(a,t,s);n[s]?(n[s].p(f,l),u(n[s],1)):(n[s]=P(f),n[s].c(),u(n[s],1),n[s].m(e.parentNode,e))}for(V(),s=t.length;s<n.length;s+=1)r(s);K()}},i(a){if(!o){for(let l=0;l<t.length;l+=1)u(n[l]);o=!0}},o(a){n=n.filter(Boolean);for(let l=0;l<n.length;l+=1)m(n[l]);o=!1},d(a){ie(n,a),a&&p(e)}}}function ge(i){let e,o;return e=new le({props:{$$slots:{default:[he]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment)},l(t){g(e.$$.fragment,t)},m(t,n){w(e,t,n),o=!0},p(t,n){const r={};n&8192&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){o||(u(e.$$.fragment,t),o=!0)},o(t){m(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function we(i){let e,o,t,n,r={}.npm_package_version+"",a,l,s=i[4][i[1]].title+"",f;return{c(){e=S(R),o=B(),t=q("span"),n=S("v"),a=S(r),l=S(": "),f=S(s),this.h()},l(c){e=D(c,R),o=T(c),t=I(c,"SPAN",{style:!0});var $=L(t);n=D($,"v"),a=D($,r),$.forEach(p),l=D(c,": "),f=D(c,s),this.h()},h(){re(t,"font-size","80%")},m(c,$){_(c,e,$),_(c,o,$),_(c,t,$),y(t,n),y(t,a),_(c,l,$),_(c,f,$)},p(c,$){$&2&&s!==(s=c[4][c[1]].title+"")&&ae(f,s)},d(c){c&&p(e),c&&p(o),c&&p(t),c&&p(l),c&&p(f)}}}function be(i){let e,o,t,n,r,a;e=new M({props:{class:"material-icons",$$slots:{default:[pe]},$$scope:{ctx:i}}}),e.$on("click",i[6]);let l={$$slots:{default:[ge]},$$scope:{ctx:i}};return t=new ne({props:l}),i[8](t),r=new se({props:{$$slots:{default:[we]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment),o=B(),h(t.$$.fragment),n=B(),h(r.$$.fragment)},l(s){g(e.$$.fragment,s),o=T(s),g(t.$$.fragment,s),n=T(s),g(r.$$.fragment,s)},m(s,f){w(e,s,f),_(s,o,f),w(t,s,f),_(s,n,f),w(r,s,f),a=!0},p(s,f){const c={};f&8192&&(c.$$scope={dirty:f,ctx:s}),e.$set(c);const $={};f&8192&&($.$$scope={dirty:f,ctx:s}),t.$set($);const v={};f&8194&&(v.$$scope={dirty:f,ctx:s}),r.$set(v)},i(s){a||(u(e.$$.fragment,s),u(t.$$.fragment,s),u(r.$$.fragment,s),a=!0)},o(s){m(e.$$.fragment,s),m(t.$$.fragment,s),m(r.$$.fragment,s),a=!1},d(s){b(e,s),s&&p(o),i[8](null),b(t,s),s&&p(n),b(r,s)}}}function de(i){let e;return{c(){e=S("file_download")},l(o){e=D(o,"file_download")},m(o,t){_(o,e,t)},d(o){o&&p(e)}}}function ke(i){let e;return{c(){e=S("print")},l(o){e=D(o,"print")},m(o,t){_(o,e,t)},d(o){o&&p(e)}}}function ve(i){let e;return{c(){e=S("bookmark")},l(o){e=D(o,"bookmark")},m(o,t){_(o,e,t)},d(o){o&&p(e)}}}function Se(i){let e,o,t,n,r,a;return e=new M({props:{class:"material-icons","aria-label":"Download",$$slots:{default:[de]},$$scope:{ctx:i}}}),t=new M({props:{class:"material-icons","aria-label":"Print this page",$$slots:{default:[ke]},$$scope:{ctx:i}}}),r=new M({props:{class:"material-icons","aria-label":"Bookmark this page",$$slots:{default:[ve]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment),o=B(),h(t.$$.fragment),n=B(),h(r.$$.fragment)},l(l){g(e.$$.fragment,l),o=T(l),g(t.$$.fragment,l),n=T(l),g(r.$$.fragment,l)},m(l,s){w(e,l,s),_(l,o,s),w(t,l,s),_(l,n,s),w(r,l,s),a=!0},p(l,s){const f={};s&8192&&(f.$$scope={dirty:s,ctx:l}),e.$set(f);const c={};s&8192&&(c.$$scope={dirty:s,ctx:l}),t.$set(c);const $={};s&8192&&($.$$scope={dirty:s,ctx:l}),r.$set($)},i(l){a||(u(e.$$.fragment,l),u(t.$$.fragment,l),u(r.$$.fragment,l),a=!0)},o(l){m(e.$$.fragment,l),m(t.$$.fragment,l),m(r.$$.fragment,l),a=!1},d(l){b(e,l),l&&p(o),b(t,l),l&&p(n),b(r,l)}}}function De(i){let e,o,t,n;return e=new A({props:{$$slots:{default:[be]},$$scope:{ctx:i}}}),t=new A({props:{align:"end",toolbar:!0,$$slots:{default:[Se]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment),o=B(),h(t.$$.fragment)},l(r){g(e.$$.fragment,r),o=T(r),g(t.$$.fragment,r)},m(r,a){w(e,r,a),_(r,o,a),w(t,r,a),n=!0},p(r,a){const l={};a&8195&&(l.$$scope={dirty:a,ctx:r}),e.$set(l);const s={};a&8192&&(s.$$scope={dirty:a,ctx:r}),t.$set(s)},i(r){n||(u(e.$$.fragment,r),u(t.$$.fragment,r),n=!0)},o(r){m(e.$$.fragment,r),m(t.$$.fragment,r),n=!1},d(r){b(e,r),r&&p(o),b(t,r)}}}function Be(i){let e,o;return e=new Z({props:{$$slots:{default:[De]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment)},l(t){g(e.$$.fragment,t)},m(t,n){w(e,t,n),o=!0},p(t,n){const r={};n&8195&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){o||(u(e.$$.fragment,t),o=!0)},o(t){m(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function W(i){let e,o;return e=new F({props:{open:!0,fixed:!0,mobileStacked:!0,content$style:"max-width: max-content;",$$slots:{label:[ye]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment)},l(t){g(e.$$.fragment,t)},m(t,n){w(e,t,n),o=!0},i(t){o||(u(e.$$.fragment,t),o=!0)},o(t){m(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function Te(i){let e;return{c(){e=S("Loading...")},l(o){e=D(o,"Loading...")},m(o,t){_(o,e,t)},d(o){o&&p(e)}}}function ye(i){let e,o;return e=new G({props:{slot:"label",$$slots:{default:[Te]},$$scope:{ctx:i}}}),{c(){h(e.$$.fragment)},l(t){g(e.$$.fragment,t)},m(t,n){w(e,t,n),o=!0},p(t,n){const r={};n&8192&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){o||(u(e.$$.fragment,t),o=!0)},o(t){m(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function N(i){let e,o,t,n,r;return o=new ue({props:{howToData:i[4][i[1]],startingStepKey:i[2]}}),{c(){e=q("div"),h(o.$$.fragment)},l(a){e=I(a,"DIV",{});var l=L(e);g(o.$$.fragment,l),l.forEach(p)},m(a,l){_(a,e,l),w(o,e,null),r=!0},p(a,l){const s={};l&2&&(s.howToData=a[4][a[1]]),l&4&&(s.startingStepKey=a[2]),o.$set(s)},i(a){r||(u(o.$$.fragment,a),X(()=>{n&&n.end(1),t=x(e,oe,{y:200,duration:750}),t.start()}),r=!0)},o(a){m(o.$$.fragment,a),t&&t.invalidate(),n=Y(e,ee,{}),r=!1},d(a){a&&p(e),b(o),a&&n&&n.end()}}}function qe(i){let e,o,t,n,r,a,l;t=new Q({props:{variant:"static",prominent:Ie,dense:Le,color:"primary",$$slots:{default:[Be]},$$scope:{ctx:i}}});let s=!i[3]&&W(i),f=i[3]&&N(i);return{c(){e=q("div"),o=q("div"),h(t.$$.fragment),n=B(),r=q("div"),s&&s.c(),a=B(),f&&f.c(),this.h()},l(c){e=I(c,"DIV",{class:!0});var $=L(e);o=I($,"DIV",{class:!0});var v=L(o);g(t.$$.fragment,v),n=T(v),r=I(v,"DIV",{class:!0});var d=L(r);s&&s.l(d),a=T(d),f&&f.l(d),d.forEach(p),v.forEach(p),$.forEach(p),this.h()},h(){O(r,"class","flexor-content svelte-18frgr5"),O(o,"class","top-app-bar-container flexor svelte-18frgr5"),O(e,"class","flexy svelte-18frgr5")},m(c,$){_(c,e,$),y(e,o),w(t,o,null),y(o,n),y(o,r),s&&s.m(r,null),y(r,a),f&&f.m(r,null),l=!0},p(c,[$]){const v={};$&8195&&(v.$$scope={dirty:$,ctx:c}),t.$set(v),c[3]?s&&(V(),m(s,1,1,()=>{s=null}),K()):s?$&8&&u(s,1):(s=W(c),s.c(),u(s,1),s.m(r,a)),c[3]?f?(f.p(c,$),$&8&&u(f,1)):(f=N(c),f.c(),u(f,1),f.m(r,null)):f&&(V(),m(f,1,1,()=>{f=null}),K())},i(c){l||(u(t.$$.fragment,c),u(s),u(f),l=!0)},o(c){m(t.$$.fragment,c),m(s),m(f),l=!1},d(c){c&&p(e),b(t),s&&s.d(),f&&f.d()}}}let R="How-To",Ie=!1,Le=!1;function Me(i,e,o){let t=[C,k],n,r=0,a="which",l=!0;function s(d){o(1,r=t.findIndex(H=>H.title===d)),o(2,a=Object.keys(t[r]).find(H=>H!=="title"))}const f=d=>{o(3,l=!1),setTimeout(()=>{s(d),o(3,l=!0)},500)};s(t[r].title);const c=()=>n.setOpen(!0),$=d=>f(d.title);function v(d){te[d?"unshift":"push"](()=>{n=d,o(0,n)})}return[n,r,a,l,t,f,c,$,v]}class Oe extends j{constructor(e){super();z(this,e,Me,qe,J,{})}}export{Oe as default};

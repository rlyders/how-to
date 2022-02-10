import{S as z,i as J,s as Q,T as X,w as h,x as w,y as g,q as $,o as p,B as b,e as q,c as I,a as L,d as u,g as m,L as Y,M as Z,k as B,m as T,b as O,J as y,p as V,R as F,N as G,O as x,P as ee,Q as te,n as K,U as oe,V as A,t as S,h as D,W as ne,X as M,Y as se,Z as re,f as ae,j as le,_ as ie,l as E,$ as fe,a0 as ce,a1 as $e,K as ue}from"../chunks/vendor-1bdd7840.js";import pe from"./HowTo.svelte-20ffd1ca.js";var C={title:"Customer feedback",who:{question:"Do you want to report this with us (internally), the Better Business Bureau, or Santa Claus?",choices:{Us:"how",BBB:"bbb-info","Santa Claus":"santa-info"},learnMore:"https://www.google.com/search?q=customer+complaint"},how:{question:"Do you want to use your mobile phone or your computer?",choices:{"Mobile phone":"mobile-phone",Computer:"browser-how-to"}},"mobile-phone":{question:"Are you using the mobile app or the web browser on the mobile phone?",choices:{"Mobile App":"mobile-app-how-to","Mobile Web Browser":"browser-how-to",Other:"other-info"},learnMore:"https://www.google.com/search?q=app+learn+more"},"mobile-app-how-to":`### Heading
* Bullets
* Points
`,"bbb-info":"https://www.bbb.org/file-a-complaint","santa-info":"https://www.google.com/search?q=santa+info","browser-how-to":"https://www.google.com/search?q=browser+how+to","other-info":"https://www.google.com/search?q=other+info"};C.title;C.who;C.how;var k={title:"Turn on lights",which:{question:"Which lights do you want to turn on?",choices:{kitchen:"inOut",pantry:"pantryLights",backyard:"backyardLights"}},inOut:{question:"Are you inside or outside of the room?",choices:{inside:"flickSwitch",outside:"openClosed","too dark to be sure":"tooDark"},learnMore:"http://wiki.abco.com/too-dark-tips"},openClosed:{question:"Is the door to the room open or closed?",choices:{open:"enterDoor",closed:"openDoor","I can't see":"cantSee"}},webBrowserHowTo:"cmsKey://WebBrowserHowToCmsKey",backyardLights:"http://wiki.abco.com/backyard-lights",pantryLights:"http://wiki.abco.com/pantry-lights",flickSwitch:"http://wiki.abco.com/flick-switch",enterDoor:"http://wiki.abco.com/enter-door",openDoor:"http://wiki.abco.com/open-door",cantSee:"http://wiki.abco.com/cant-see",tooDark:"http://wiki.abco.com/too-dark"};k.title;k.which;k.inOut;k.openClosed;k.webBrowserHowTo;k.backyardLights;k.pantryLights;k.flickSwitch;k.enterDoor;k.openDoor;k.cantSee;k.tooDark;function U(f,e,o){const t=f.slice();return t[10]=e[o],t[12]=o,t}function me(f){let e;return{c(){e=S("menu")},l(o){e=D(o,"menu")},m(o,t){m(o,e,t)},d(o){o&&u(e)}}}function _e(f){let e=f[10].title+"",o;return{c(){o=S(e)},l(t){o=D(t,e)},m(t,n){m(t,o,n)},p:ue,d(t){t&&u(o)}}}function he(f){let e,o,t;return e=new $e({props:{$$slots:{default:[_e]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment),o=B()},l(n){w(e.$$.fragment,n),o=T(n)},m(n,r){g(e,n,r),m(n,o,r),t=!0},p(n,r){const a={};r&8192&&(a.$$scope={dirty:r,ctx:n}),e.$set(a)},i(n){t||($(e.$$.fragment,n),t=!0)},o(n){p(e.$$.fragment,n),t=!1},d(n){b(e,n),n&&u(o)}}}function P(f){let e,o;function t(){return f[7](f[10])}return e=new ce({props:{$$slots:{default:[he]},$$scope:{ctx:f}}}),e.$on("SMUI:action",t),{c(){h(e.$$.fragment)},l(n){w(e.$$.fragment,n)},m(n,r){g(e,n,r),o=!0},p(n,r){f=n;const a={};r&8192&&(a.$$scope={dirty:r,ctx:f}),e.$set(a)},i(n){o||($(e.$$.fragment,n),o=!0)},o(n){p(e.$$.fragment,n),o=!1},d(n){b(e,n)}}}function we(f){let e,o,t=f[4],n=[];for(let a=0;a<t.length;a+=1)n[a]=P(U(f,t,a));const r=a=>p(n[a],1,1,()=>{n[a]=null});return{c(){for(let a=0;a<n.length;a+=1)n[a].c();e=E()},l(a){for(let l=0;l<n.length;l+=1)n[l].l(a);e=E()},m(a,l){for(let s=0;s<n.length;s+=1)n[s].m(a,l);m(a,e,l),o=!0},p(a,l){if(l&48){t=a[4];let s;for(s=0;s<t.length;s+=1){const i=U(a,t,s);n[s]?(n[s].p(i,l),$(n[s],1)):(n[s]=P(i),n[s].c(),$(n[s],1),n[s].m(e.parentNode,e))}for(K(),s=t.length;s<n.length;s+=1)r(s);V()}},i(a){if(!o){for(let l=0;l<t.length;l+=1)$(n[l]);o=!0}},o(a){n=n.filter(Boolean);for(let l=0;l<n.length;l+=1)p(n[l]);o=!1},d(a){fe(n,a),a&&u(e)}}}function ge(f){let e,o;return e=new ie({props:{$$slots:{default:[we]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment)},l(t){w(e.$$.fragment,t)},m(t,n){g(e,t,n),o=!0},p(t,n){const r={};n&8192&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){o||($(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function be(f){let e,o,t,n,r,a,l=f[4][f[1]].title+"",s;return{c(){e=S(R),o=B(),t=q("span"),n=S("v"),r=S(j),a=S(": "),s=S(l),this.h()},l(i){e=D(i,R),o=T(i),t=I(i,"SPAN",{style:!0});var c=L(t);n=D(c,"v"),r=D(c,j),c.forEach(u),a=D(i,": "),s=D(i,l),this.h()},h(){ae(t,"font-size","80%")},m(i,c){m(i,e,c),m(i,o,c),m(i,t,c),y(t,n),y(t,r),m(i,a,c),m(i,s,c)},p(i,c){c&2&&l!==(l=i[4][i[1]].title+"")&&le(s,l)},d(i){i&&u(e),i&&u(o),i&&u(t),i&&u(a),i&&u(s)}}}function de(f){let e,o,t,n,r,a;e=new M({props:{class:"material-icons",$$slots:{default:[me]},$$scope:{ctx:f}}}),e.$on("click",f[6]);let l={$$slots:{default:[ge]},$$scope:{ctx:f}};return t=new se({props:l}),f[8](t),r=new re({props:{$$slots:{default:[be]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment),o=B(),h(t.$$.fragment),n=B(),h(r.$$.fragment)},l(s){w(e.$$.fragment,s),o=T(s),w(t.$$.fragment,s),n=T(s),w(r.$$.fragment,s)},m(s,i){g(e,s,i),m(s,o,i),g(t,s,i),m(s,n,i),g(r,s,i),a=!0},p(s,i){const c={};i&8192&&(c.$$scope={dirty:i,ctx:s}),e.$set(c);const _={};i&8192&&(_.$$scope={dirty:i,ctx:s}),t.$set(_);const v={};i&8194&&(v.$$scope={dirty:i,ctx:s}),r.$set(v)},i(s){a||($(e.$$.fragment,s),$(t.$$.fragment,s),$(r.$$.fragment,s),a=!0)},o(s){p(e.$$.fragment,s),p(t.$$.fragment,s),p(r.$$.fragment,s),a=!1},d(s){b(e,s),s&&u(o),f[8](null),b(t,s),s&&u(n),b(r,s)}}}function ke(f){let e;return{c(){e=S("file_download")},l(o){e=D(o,"file_download")},m(o,t){m(o,e,t)},d(o){o&&u(e)}}}function ve(f){let e;return{c(){e=S("print")},l(o){e=D(o,"print")},m(o,t){m(o,e,t)},d(o){o&&u(e)}}}function Se(f){let e;return{c(){e=S("bookmark")},l(o){e=D(o,"bookmark")},m(o,t){m(o,e,t)},d(o){o&&u(e)}}}function De(f){let e,o,t,n,r,a;return e=new M({props:{class:"material-icons","aria-label":"Download",$$slots:{default:[ke]},$$scope:{ctx:f}}}),t=new M({props:{class:"material-icons","aria-label":"Print this page",$$slots:{default:[ve]},$$scope:{ctx:f}}}),r=new M({props:{class:"material-icons","aria-label":"Bookmark this page",$$slots:{default:[Se]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment),o=B(),h(t.$$.fragment),n=B(),h(r.$$.fragment)},l(l){w(e.$$.fragment,l),o=T(l),w(t.$$.fragment,l),n=T(l),w(r.$$.fragment,l)},m(l,s){g(e,l,s),m(l,o,s),g(t,l,s),m(l,n,s),g(r,l,s),a=!0},p(l,s){const i={};s&8192&&(i.$$scope={dirty:s,ctx:l}),e.$set(i);const c={};s&8192&&(c.$$scope={dirty:s,ctx:l}),t.$set(c);const _={};s&8192&&(_.$$scope={dirty:s,ctx:l}),r.$set(_)},i(l){a||($(e.$$.fragment,l),$(t.$$.fragment,l),$(r.$$.fragment,l),a=!0)},o(l){p(e.$$.fragment,l),p(t.$$.fragment,l),p(r.$$.fragment,l),a=!1},d(l){b(e,l),l&&u(o),b(t,l),l&&u(n),b(r,l)}}}function Be(f){let e,o,t,n;return e=new A({props:{$$slots:{default:[de]},$$scope:{ctx:f}}}),t=new A({props:{align:"end",toolbar:!0,$$slots:{default:[De]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment),o=B(),h(t.$$.fragment)},l(r){w(e.$$.fragment,r),o=T(r),w(t.$$.fragment,r)},m(r,a){g(e,r,a),m(r,o,a),g(t,r,a),n=!0},p(r,a){const l={};a&8195&&(l.$$scope={dirty:a,ctx:r}),e.$set(l);const s={};a&8192&&(s.$$scope={dirty:a,ctx:r}),t.$set(s)},i(r){n||($(e.$$.fragment,r),$(t.$$.fragment,r),n=!0)},o(r){p(e.$$.fragment,r),p(t.$$.fragment,r),n=!1},d(r){b(e,r),r&&u(o),b(t,r)}}}function Te(f){let e,o;return e=new F({props:{$$slots:{default:[Be]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment)},l(t){w(e.$$.fragment,t)},m(t,n){g(e,t,n),o=!0},p(t,n){const r={};n&8195&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){o||($(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function W(f){let e,o;return e=new G({props:{open:!0,fixed:!0,mobileStacked:!0,content$style:"max-width: max-content;",$$slots:{label:[qe]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment)},l(t){w(e.$$.fragment,t)},m(t,n){g(e,t,n),o=!0},i(t){o||($(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function ye(f){let e;return{c(){e=S("Loading...")},l(o){e=D(o,"Loading...")},m(o,t){m(o,e,t)},d(o){o&&u(e)}}}function qe(f){let e,o;return e=new x({props:{slot:"label",$$slots:{default:[ye]},$$scope:{ctx:f}}}),{c(){h(e.$$.fragment)},l(t){w(e.$$.fragment,t)},m(t,n){g(e,t,n),o=!0},p(t,n){const r={};n&8192&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){o||($(e.$$.fragment,t),o=!0)},o(t){p(e.$$.fragment,t),o=!1},d(t){b(e,t)}}}function N(f){let e,o,t,n,r;return o=new pe({props:{howToData:f[4][f[1]],startingStepKey:f[2]}}),{c(){e=q("div"),h(o.$$.fragment)},l(a){e=I(a,"DIV",{});var l=L(e);w(o.$$.fragment,l),l.forEach(u)},m(a,l){m(a,e,l),g(o,e,null),r=!0},p(a,l){const s={};l&2&&(s.howToData=a[4][a[1]]),l&4&&(s.startingStepKey=a[2]),o.$set(s)},i(a){r||($(o.$$.fragment,a),Y(()=>{n&&n.end(1),t=ee(e,ne,{y:200,duration:750}),t.start()}),r=!0)},o(a){p(o.$$.fragment,a),t&&t.invalidate(),n=Z(e,te,{}),r=!1},d(a){a&&u(e),b(o),a&&n&&n.end()}}}function Ie(f){let e,o,t,n,r,a,l;t=new X({props:{variant:"static",prominent:Le,dense:Me,color:"primary",$$slots:{default:[Te]},$$scope:{ctx:f}}});let s=!f[3]&&W(f),i=f[3]&&N(f);return{c(){e=q("div"),o=q("div"),h(t.$$.fragment),n=B(),r=q("div"),s&&s.c(),a=B(),i&&i.c(),this.h()},l(c){e=I(c,"DIV",{class:!0});var _=L(e);o=I(_,"DIV",{class:!0});var v=L(o);w(t.$$.fragment,v),n=T(v),r=I(v,"DIV",{class:!0});var d=L(r);s&&s.l(d),a=T(d),i&&i.l(d),d.forEach(u),v.forEach(u),_.forEach(u),this.h()},h(){O(r,"class","flexor-content svelte-18frgr5"),O(o,"class","top-app-bar-container flexor svelte-18frgr5"),O(e,"class","flexy svelte-18frgr5")},m(c,_){m(c,e,_),y(e,o),g(t,o,null),y(o,n),y(o,r),s&&s.m(r,null),y(r,a),i&&i.m(r,null),l=!0},p(c,[_]){const v={};_&8195&&(v.$$scope={dirty:_,ctx:c}),t.$set(v),c[3]?s&&(K(),p(s,1,1,()=>{s=null}),V()):s?_&8&&$(s,1):(s=W(c),s.c(),$(s,1),s.m(r,a)),c[3]?i?(i.p(c,_),_&8&&$(i,1)):(i=N(c),i.c(),$(i,1),i.m(r,null)):i&&(K(),p(i,1,1,()=>{i=null}),V())},i(c){l||($(t.$$.fragment,c),$(s),$(i),l=!0)},o(c){p(t.$$.fragment,c),p(s),p(i),l=!1},d(c){c&&u(e),b(t),s&&s.d(),i&&i.d()}}}let R="How-To",j="1.2",Le=!1,Me=!1;function Ce(f,e,o){let t=[C,k],n,r=0,a="which",l=!0;function s(d){o(1,r=t.findIndex(H=>H.title===d)),o(2,a=Object.keys(t[r]).find(H=>H!=="title"))}const i=d=>{o(3,l=!1),setTimeout(()=>{s(d),o(3,l=!0)},500)};s(t[r].title);const c=()=>n.setOpen(!0),_=d=>i(d.title);function v(d){oe[d?"unshift":"push"](()=>{n=d,o(0,n)})}return[n,r,a,l,t,i,c,_,v]}class Ve extends z{constructor(e){super();J(this,e,Ce,Ie,Q,{})}}export{Ve as default};

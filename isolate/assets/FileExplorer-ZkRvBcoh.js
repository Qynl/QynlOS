import{a as o,r,j as e,F as f,c as y}from"./index-BbITEj2M.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=o("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=o("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=o("File",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=o("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]),v=[{name:"home",type:"dir",children:[{name:"qynl",type:"dir",children:[{name:"Documents",type:"dir",children:[{name:"readme.md",type:"file",content:`# QynlOS

The OS of the future. Built for everyone.`},{name:"notes.txt",type:"file",content:`TODO:
- Build the OS
- Add local AI
- Change the world`}]},{name:"Downloads",type:"dir",children:[]},{name:"Projects",type:"dir",children:[{name:"qynlos",type:"dir",children:[{name:"README.md",type:"file",content:`# QynlOS
Free and open-source OS`}]}]},{name:"Pictures",type:"dir",children:[]},{name:"hello.txt",type:"file",content:`Welcome to QynlOS!
Your free, open-source operating system.`}]}]}];function x(h,s){if(s.length===0)return null;const a=s[0],t=h.find(l=>l.name===a);return t?s.length===1?t:t.children?x(t.children,s.slice(1)):null:null}function k({windowId:h}){const[s,a]=r.useState(["home","qynl"]),[t,l]=r.useState(null),c=x(v,s),d=(c==null?void 0:c.children)||[],p=r.useCallback(n=>{n.type==="dir"?(a(i=>[...i,n.name]),l(null)):l(n)},[]),u=r.useCallback(()=>{s.length>1&&(a(n=>n.slice(0,-1)),l(null))},[s]),w=r.useCallback(()=>{a(["home","qynl"]),l(null)},[]);return e.jsxs("div",{className:"h-full flex flex-col text-sm",children:[e.jsxs("div",{className:"flex items-center gap-1 px-2 py-1.5 bg-white/[0.03] border-b border-white/5",children:[e.jsx("button",{onClick:u,disabled:s.length<=1,className:"p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed",children:e.jsx(b,{className:"w-4 h-4 text-white/60"})}),e.jsx("button",{onClick:w,className:"p-1 rounded hover:bg-white/10",children:e.jsx(j,{className:"w-4 h-4 text-white/60"})}),e.jsx("div",{className:"flex items-center gap-1 ml-2 text-xs text-white/50",children:s.map((n,i)=>e.jsxs("span",{className:"flex items-center gap-1",children:[i>0&&e.jsx(g,{className:"w-3 h-3"}),e.jsx("span",{className:"text-white/70",children:n})]},i))})]}),e.jsxs("div",{className:"flex-1 flex",children:[e.jsxs("div",{className:"flex-1 overflow-y-auto p-2",children:[d.length===0&&e.jsx("div",{className:"text-white/30 text-xs text-center mt-8",children:"This folder is empty"}),d.map(n=>e.jsxs("button",{onClick:()=>p(n),className:y("flex items-center gap-2 w-full px-2 py-1.5 rounded-lg transition-colors text-left",(t==null?void 0:t.name)===n.name&&(t==null?void 0:t.type)===n.type?"bg-white/15":"hover:bg-white/10"),children:[n.type==="dir"?e.jsx(f,{className:"w-4 h-4 text-blue-400"}):e.jsx(m,{className:"w-4 h-4 text-white/40"}),e.jsx("span",{className:"text-white/80 text-sm",children:n.name})]},n.name))]}),t&&e.jsxs("div",{className:"w-64 border-l border-white/5 bg-white/[0.02] p-3 overflow-y-auto",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(m,{className:"w-4 h-4 text-white/40"}),e.jsx("span",{className:"text-sm text-white/80 font-medium",children:t.name})]}),e.jsx("pre",{className:"text-xs text-white/60 whitespace-pre-wrap",children:t.content||"(binary file)"})]})]}),e.jsxs("div",{className:"px-3 py-1 bg-white/[0.02] border-t border-white/5 text-[10px] text-white/30",children:[d.length," items"]})]})}export{k as default};

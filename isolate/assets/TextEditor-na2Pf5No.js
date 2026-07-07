import{r as s,j as e}from"./index-BbITEj2M.js";function b({windowId:p}){var o;const[n,r]=s.useState(`// Welcome to QynlOS Editor
// Start typing your code below

function greet(name: string) {
  return \`Hello, \${name}! Welcome to QynlOS.\`;
}

console.log(greet("User"));

// QynlOS - The OS of the future
// Free, open-source, AI-powered
`),[i,c]=s.useState("hello.ts"),[x,a]=s.useState(!0),d=s.useCallback(t=>{r(t.target.value),a(!1)},[]),l=s.useCallback(()=>{a(!0)},[]),h=s.useCallback(t=>{(t.metaKey||t.ctrlKey)&&t.key==="s"&&(t.preventDefault(),l())},[l]);return e.jsxs("div",{className:"h-full flex flex-col",children:[e.jsxs("div",{className:"flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border-b border-white/5",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"text-xs text-white/50",children:"File:"}),e.jsx("input",{type:"text",value:i,onChange:t=>c(t.target.value),className:"bg-white/10 px-2 py-0.5 rounded text-xs text-white/80 outline-none border border-white/5 focus:border-white/20 w-32"})]}),e.jsx("div",{className:"flex-1"}),e.jsx("span",{className:"text-[10px] text-white/30",children:x?"Saved":"Unsaved"}),e.jsx("button",{onClick:l,className:"px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-xs text-white/70 transition-colors",children:"Save"})]}),e.jsx("textarea",{value:n,onChange:d,onKeyDown:h,className:"flex-1 bg-black/30 text-sm text-white/80 font-mono p-4 outline-none resize-none border-none",style:{scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent",lineHeight:"1.6",tabSize:2},spellCheck:!1,autoFocus:!0}),e.jsxs("div",{className:"px-3 py-1 bg-white/[0.02] border-t border-white/5 text-[10px] text-white/30 flex items-center gap-4",children:[e.jsx("span",{children:"UTF-8"}),e.jsx("span",{children:"TypeScript"}),e.jsxs("span",{children:["Ln ",n.split(`
`).length,", Col ",((o=n.split(`
`).pop())==null?void 0:o.length)||0]})]})]})}export{b as default};

import{r as l,j as y,c as _}from"./index-Tf6x5Kb9.js";const f={"/":{type:"dir"},"/home":{type:"dir"},"/home/qynl":{type:"dir"},"/home/qynl/Documents":{type:"dir"},"/home/qynl/Downloads":{type:"dir"},"/home/qynl/Projects":{type:"dir"},"/home/qynl/Pictures":{type:"dir"},"/home/qynl/hello.txt":{type:"file",content:`Welcome to QynlOS!
Your free, open-source operating system.`},"/home/qynl/Documents/readme.md":{type:"file",content:`# QynlOS

The OS of the future. Built for everyone.`},"/home/qynl/Documents/notes.txt":{type:"file",content:`TODO:
- Build the OS
- Add local AI
- Change the world`}};function Q(p){const s=p==="/"?"":p,c=new Set;for(const o of Object.keys(f))if(o!==p&&o.startsWith(s+"/")){const r=o.slice(s.length+1).split("/")[0];r&&c.add(r)}return Array.from(c).sort()}function x(p,s){if(s.startsWith("/"))return s;const c=[...p.split("/").filter(Boolean),...s.split("/")],o=[];for(const a of c)a==="."||a===""||(a===".."?o.pop():o.push(a));return"/"+o.join("/")}function N({windowId:p}){const[s,c]=l.useState([{text:"QynlOS Terminal v0.1",type:"system"},{text:"Type 'help' for available commands.",type:"system"},{text:"",type:"output"}]),[o,a]=l.useState(""),[r,v]=l.useState("/home/qynl"),w=l.useRef(null),m=l.useRef(null);l.useEffect(()=>{m.current&&(m.current.scrollTop=m.current.scrollHeight)},[s]);const b=l.useCallback(t=>{var O;const h=t.trim(),e=[...s,{text:`qynl@QynlOS:${r}$ ${h}`,type:"input"}];if(!h){c(e);return}const S=h.split(/\s+/),k=S[0],i=S.slice(1);switch(k){case"help":e.push({text:`Available commands:
  help      - Show this help message
  ls        - List directory contents
  cd <dir>  - Change directory
  pwd       - Print working directory
  echo <t>  - Print text
  cat <f>   - Show file contents
  mkdir <d> - Create directory
  whoami    - Show current user
  neofetch  - Show system info
  clear     - Clear the terminal
  date      - Show current date/time
  uname     - Print system information`,type:"output"});break;case"ls":{const u=i[0]||r,n=x(r,u),C=Q(n).map(d=>{var g;const j=n==="/"?`/${d}`:`${n}/${d}`;return((g=f[j])==null?void 0:g.type)==="dir"?`${d}/`:d});e.push({text:C.join("  ")||"(empty)",type:"output"});break}case"cd":{const u=i[0]||"/home/qynl",n=x(r,u);((O=f[n])==null?void 0:O.type)==="dir"||n==="/"?v(n):e.push({text:`cd: ${u}: No such directory`,type:"error"});break}case"pwd":e.push({text:r,type:"output"});break;case"echo":e.push({text:i.join(" ")||"",type:"output"});break;case"cat":{if(!i[0]){e.push({text:"cat: missing operand",type:"error"});break}const u=x(r,i[0]),n=f[u];(n==null?void 0:n.type)==="file"?e.push({text:n.content||"",type:"output"}):e.push({text:`cat: ${i[0]}: No such file`,type:"error"});break}case"mkdir":e.push({text:`mkdir: created directory '${i[0]}'`,type:"output"});break;case"whoami":e.push({text:"qynl",type:"output"});break;case"date":e.push({text:new Date().toString(),type:"output"});break;case"uname":e.push({text:"QynlOS 0.1 x86_64",type:"output"});break;case"neofetch":e.push({text:`       .---.        qynl@QynlOS
      /     \\       --------
     |  O O  |      OS: QynlOS v0.1
      \\  v  /       Host: Quantum Core
       '---'        Kernel: Qynl 6.8.0
      /     \\       Uptime: forever
     /       \\      Shell: QynlSH 1.0
    /  O   O  \\     AI: Ollama Ready
   /___________\\    Memory: 1337/8192 MB`,type:"output"});break;case"clear":c([{text:"QynlOS Terminal v0.1",type:"system"},{text:"Type 'help' for available commands.",type:"system"},{text:"",type:"output"}]);return;default:e.push({text:`bash: ${k}: command not found`,type:"error"})}c(e)},[s,r]),q=l.useCallback(t=>{t.key==="Enter"&&(b(o),a(""))},[o,b]);return y.jsx("div",{className:"h-full bg-black/70 text-sm font-mono flex flex-col",onClick:()=>{var t;return(t=w.current)==null?void 0:t.focus()},children:y.jsxs("div",{ref:m,className:"flex-1 overflow-y-auto p-3 space-y-0.5",style:{scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent"},children:[s.map((t,h)=>y.jsx("div",{className:_("whitespace-pre-wrap",t.type==="input"&&"text-green-400/90",t.type==="output"&&"text-white/80",t.type==="error"&&"text-red-400",t.type==="system"&&"text-blue-400/60 text-xs"),children:t.text},h)),y.jsxs("div",{className:"flex items-center mt-1",children:[y.jsxs("span",{className:"text-green-400/90",children:["qynl@QynlOS:",r,"$"]}),y.jsx("input",{ref:w,type:"text",value:o,onChange:t=>a(t.target.value),onKeyDown:q,className:"flex-1 bg-transparent outline-none border-none ml-2 text-white/90 caret-white/70",autoFocus:!0})]})]})})}export{N as default};

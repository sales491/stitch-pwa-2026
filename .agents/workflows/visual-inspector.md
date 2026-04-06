---
description: Start the visual element inspector for click-to-select editing
---

## Visual Inspector Startup

When the user says **"start all"**, do the following steps in order:

// turbo
1. Start the Next.js dev server:
```powershell
cd C:\Users\mspen\OneDrive\Desktop\stitch\next-app; npm run dev
```

// turbo
2. Launch Chrome with remote debugging on port 9222:
```powershell
Start-Process "chrome.exe" -ArgumentList "--remote-debugging-port=9222","--user-data-dir=C:\chrome-dev-profile","http://localhost:3000"
```

3. Wait 3 seconds for Chrome to open, then inject the element inspector into the page using the chrome-devtools MCP tools (`new_page` to connect, then `evaluate_script` to inject the inspector).

4. Confirm to the user that everything is running and they can start clicking elements.

## Inspector Script

Inject this script via `evaluate_script` to enable click-to-select:

```javascript
(function(){
  ['__ag_hl__','__ag_badge__'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()});
  window.__ag_selected__=null;
  const hl=document.createElement('div');
  hl.id='__ag_hl__';
  hl.style.cssText='position:fixed;pointer-events:none;z-index:99998;outline:2px solid #3b82f6;background:rgba(59,130,246,0.08);border-radius:3px;display:none';
  document.body.appendChild(hl);
  const badge=document.createElement('div');
  badge.id='__ag_badge__';
  badge.style.cssText='position:fixed;bottom:12px;right:12px;z-index:99999;font:11px monospace;padding:4px 8px;border-radius:6px;cursor:pointer;user-select:none;background:#374151;color:#9ca3af;border:1px solid #4b5563;transition:all 0.15s';
  badge.textContent='🔍 OFF';
  document.body.appendChild(badge);
  let active=false,locked=false;
  function setActive(on){active=on;locked=false;window.__ag_selected__=null;hl.style.display='none';if(on){badge.style.background='#14532d';badge.style.color='#4ade80';badge.style.borderColor='#16a34a';badge.textContent='🔍 ON';}else{badge.style.background='#374151';badge.style.color='#9ca3af';badge.style.borderColor='#4b5563';badge.textContent='🔍 OFF';}}
  badge.addEventListener('click',()=>setActive(!active));
  document.addEventListener('keydown',e=>{if(e.key==='`'&&!e.target.matches('input,textarea'))setActive(!active);if(e.key==='Escape'&&active){locked=false;window.__ag_selected__=null;hl.style.outline='2px solid #3b82f6';hl.style.background='rgba(59,130,246,0.08)';}});
  document.addEventListener('mousemove',e=>{if(!active||locked||e.target===badge)return;const r=e.target.getBoundingClientRect();hl.style.cssText=`position:fixed;pointer-events:none;z-index:99998;outline:2px solid #3b82f6;background:rgba(59,130,246,0.08);border-radius:3px;top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px`;},true);
  document.addEventListener('click',e=>{if(!active||e.target===badge)return;e.preventDefault();e.stopPropagation();locked=true;hl.style.outline='2px solid #22c55e';hl.style.background='rgba(34,197,94,0.08)';const fKey=Object.keys(e.target).find(k=>k.startsWith('__reactFiber$'));let compName='Unknown';if(fKey){let f=e.target[fKey];while(f){if(f.type&&typeof f.type==='function'&&f.type.name){compName=f.type.name;break;}f=f.return;}}window.__ag_selected__={tag:e.target.tagName,componentName:compName,id:e.target.id||null,classes:typeof e.target.className==='string'?e.target.className:null,text:(e.target.innerText||'').slice(0,100),html:e.target.outerHTML.slice(0,300)};console.log('Selected Element:', window.__ag_selected__);},true);
})();
```

## Using the Inspector

- **`🔍 OFF` badge** (bottom-right) — click it or press `` ` `` to toggle ON/OFF
- **Inspector OFF** — everything works normally
- **Inspector ON** — hover highlights blue, click any element to select it (turns green)
- **Escape** — clears current selection
- **"inject inspector"** — re-enables after page navigation
- **"disable inspector"** — removes the overlay

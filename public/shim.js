// Lets the portal talk to this server. Same interface the page was built against: claude.use('sample'|'user'|'db').
(function(){
let T=localStorage.getItem('xtoken'),ME=null;try{ME=JSON.parse(localStorage.getItem('xme'))}catch(e){}
const logout=()=>{localStorage.removeItem('xtoken');localStorage.removeItem('xme');localStorage.removeItem('xp');location.reload()};window.logout=logout;
async function api(p,o={}){const r=await fetch(p,{...o,headers:{'Content-Type':'application/json',Authorization:'Bearer '+T,...(o.headers||{})}});
 if(r.status==401&&T){logout();throw new Error('Session expired')}const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'HTTP '+r.status);return j}
let done;const gate=new Promise(r=>done=r);
function ready(){window.AUTO={role:ME.role,name:ME.name};done()}
function showGate(){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#0f1b2d;display:grid;place-items:center;z-index:99;font:15px system-ui,sans-serif';
 d.innerHTML=`<div style="background:#fff;color:#0f1b2d;padding:26px;border-radius:14px;width:min(380px,92vw)"><div style="font-weight:800;color:#2457d6">Exam Prep Portal</div><h2 style="margin:.3em 0 .8em">Sign in</h2>
 <label>Role</label><select id="gr" style="width:100%;padding:8px;margin:4px 0 10px"><option value="student">Student</option><option value="teacher">Teacher</option></select>
 <div id="gn"><label>Your name</label><input id="gname" style="width:100%;padding:8px;margin:4px 0 10px"></div>
 <label id="gl">Student code</label><input id="gc" type="password" style="width:100%;padding:8px;margin:4px 0 10px"><div id="ge" style="color:#b3261e;min-height:20px"></div>
 <button id="gb" style="width:100%;padding:10px;background:#2457d6;color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer">Enter</button></div>`;
 document.body.appendChild(d);const $=s=>d.querySelector(s);
 $('#gr').onchange=()=>{const t=$('#gr').value=='teacher';$('#gn').style.display=t?'none':'block';$('#gl').textContent=t?'Teacher password':'Student code'};
 const go=async()=>{$('#ge').textContent='';try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:$('#gr').value,name:$('#gname').value,code:$('#gc').value})});const j=await r.json();if(!r.ok)throw new Error(j.error);
  T=j.token;ME={uid:j.uid,role:j.role,name:j.name};localStorage.setItem('xtoken',T);localStorage.setItem('xme',JSON.stringify(ME));d.remove();ready()}catch(e){$('#ge').textContent=e.message}};
 $('#gb').onclick=go;$('#gc').onkeydown=e=>{if(e.key=='Enter')go()}}
if(T&&ME)ready();else document.addEventListener('DOMContentLoaded',showGate);
window.claude={async use(n){await gate;
 if(n=='sample')return{json:async p=>(await api('/api/ai',{method:'POST',body:JSON.stringify({prompt:p})})).data};
 if(n=='user')return{id:async()=>ME.uid,canEdit:async()=>ME.role=='teacher'};
 if(n=='db')return{doc:p=>({get:async()=>{const r=await api('/api/doc?path='+encodeURIComponent(p));return{exists:r.exists,data:()=>r.data}},set:d=>api('/api/doc',{method:'PUT',body:JSON.stringify({path:p,data:d})})}),
  collection:pre=>({get:async()=>({docs:(await api('/api/docs?prefix='+encodeURIComponent(pre+'/'))).docs.map(x=>({id:x.path,data:()=>x.data}))}),
   onSnapshot:cb=>{let last=null;const t=setInterval(async()=>{try{const s=(await api('/api/stamp?prefix='+encodeURIComponent(pre+'/'))).stamp;if(last!==null&&s!==last)cb();last=s}catch(e){}},6000);return()=>clearInterval(t)}})};
 throw new Error('Unknown capability '+n)}};
})();

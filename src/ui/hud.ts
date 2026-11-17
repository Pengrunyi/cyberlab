import {views,type createCamera} from '../player/camera';
export function createHUD(host:HTMLElement){
 host.insertAdjacentHTML('beforeend',`
 <header class="hud-header"><a class="wordmark" href="/" aria-label="CyberLab 首页"><span class="brand-symbol">C<span>∕</span></span><span>CYBER<span class="brand-light">LAB</span><small>IMMERSIVE RESEARCH ENVIRONMENT</small></span></a><div class="telemetry"><span class="online"><i></i>系统在线</span><span><b id="fps">—</b> FPS</span><time id="clock">00:00:00</time></div></header>
 <div class="location"><span class="location-dot"></span><span id="floor-name">夜城 · 132F</span><span class="location-line"></span><span id="view-name">观景窗 · 高层 132F</span></div>
 <aside class="intro" id="intro"><div class="section-label">NIGHTFALL / MEGACITY 2077</div><h1>窗外，一座<br/><span>不眠的未来。</span></h1><p>132 层之上，暴雨穿过城市峡谷。<br/>进入实验室，亲自走向这片夜色。</p><button class="enter-button" id="enter">Click to Enter <span>↗</span></button><div class="stage-note">第一人称探索 <span> / </span> CYBERLAB V2</div><p id="lock-message" role="status"></p></aside>
 <button id="resume" class="resume" hidden>Click to Enter <span>继续探索 · 锁定鼠标</span></button>
 <div class="crosshair" aria-hidden="true"><span></span></div>
 <div class="scene-caption"><span class="live-dot"></span> LIVE ENVIRONMENT <span class="caption-separator">/</span> 全程序化 3D 场景</div>
 <button id="settings-toggle" class="settings-toggle" aria-expanded="false" aria-controls="settings" title="环境设置（Tab）"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 17h16M8 4v6M16 14v6"/></svg><span>环境设置</span><kbd>TAB</kbd></button>
 <section class="settings" id="settings" aria-label="环境设置" hidden><div class="panel-heading"><h2>环境控制</h2><button id="close-settings" aria-label="关闭环境设置">×</button></div><label class="toggle-row">实验室主灯<input id="lights" type="checkbox" checked/></label><label class="range-label" for="brightness">灯光亮度 <output id="brightness-value">100%</output></label><input id="brightness" type="range" min="10" max="160" value="100"/><span class="range-label">氛围颜色</span><div class="swatches"><button class="selected" data-color="#4dffe3" aria-label="青色" aria-pressed="true" style="--swatch:#4dffe3">青色</button><button data-color="#638dff" aria-label="蓝色" aria-pressed="false" style="--swatch:#638dff">蓝色</button><button data-color="#b28aff" aria-label="紫色" aria-pressed="false" style="--swatch:#b28aff">紫色</button></div><label class="toggle-row">Bloom 泛光<input id="bloom" type="checkbox" checked/></label><label class="toggle-row">室外雨丝<input id="rain" type="checkbox" checked/></label><label class="toggle-row">画质<select id="quality"><option value="high">精细</option><option value="low">流畅</option></select></label><p class="panel-note">WASD 移动 · Mouse Look 环视<br/>ESC Unlock · Tab 环境设置<br/>Shift 快走 · 支持室内家具碰撞</p></section>
 <footer class="bottom-hud"><div class="view-controls"><span class="view-label">快速前往</span><nav aria-label="场景视角">${views.map((v,i)=>`<button class="view-button ${i===4?'active':''}" data-view="${i}" aria-pressed="${i===4}"><span class="view-index">0${i+1}</span>${v.name}</button>`).join('')}</nav></div><div class="help"><span>WASD Move</span><span>Mouse Look</span><span>ESC Unlock</span><button id="reset" title="回到室内安全出生点">↺ <span>重置</span></button></div></footer>
 <div id="error" role="alert" hidden></div>`);
 const get=<T extends HTMLElement>(id:string)=>host.querySelector<T>('#'+id)!;
 const settings=get('settings');const toggle=get<HTMLButtonElement>('settings-toggle');
 let release=()=>{},suspend=()=>{};
 const setPanel=(open:boolean)=>{if(open){suspend();release();}settings.hidden=!open;document.body.classList.toggle('panel-open',open);toggle.setAttribute('aria-expanded',String(open));if(open)get('close-settings').focus();else toggle.focus();};
 settings.append(host.querySelector('.view-controls')!,get('reset'));
 host.querySelector('.stage-note')!.textContent='E 键设备交互 / CYBERLAB V3';
 host.querySelector('.help')!.insertAdjacentHTML('afterbegin','<span>E 设备交互</span>');
 toggle.onclick=()=>setPanel(settings.hidden);get('close-settings').onclick=()=>setPanel(false);
 document.addEventListener('keydown',e=>{if(e.code==='Tab'&&(document.pointerLockElement||e.target===document.body||e.target===toggle||e.target===get('resume'))){e.preventDefault();setPanel(settings.hidden);}if(e.code==='Escape'&&!settings.hidden)setPanel(false);});
 const clock=get('clock'),fps=get('fps');let lastSecond=-1;
 return {get,closeSettings(){setPanel(false);},onSettingsOpen(fn:()=>void){suspend=fn;},bindPlayer(player:ReturnType<typeof createCamera>){
  release=()=>player.unlock();
  const enter=()=>{setPanel(false);player.lock();};get('enter').onclick=enter;get('resume').onclick=enter;
  player.controls.addEventListener('lock',()=>{get('intro').classList.add('dismissed');get('resume').hidden=true;document.body.classList.add('walking');(document.activeElement as HTMLElement)?.blur();});
  player.controls.addEventListener('unlock',()=>{get('resume').hidden=false;document.body.classList.remove('walking');});
  player.controls.domElement?.addEventListener('click',()=>{if(settings.hidden&&!document.body.classList.contains('device-open')&&!player.controls.isLocked)enter();});
  document.addEventListener('pointerlockerror',()=>{get('lock-message').textContent='鼠标锁定未成功，请再次点击进入，或退出浏览器的自动化限制后重试。';});
 },update(time:number,frames:number){const second=Math.floor(time);if(second!==lastSecond){lastSecond=second;clock.textContent=new Date().toLocaleTimeString('zh-CN',{hour12:false});fps.textContent=String(Math.round(frames));}},bindView(callback:(i:number)=>void){const select=(index:number)=>{callback(index);get('view-name').textContent=views[index].label;host.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});};host.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>select(Number(b.dataset.view)));get('reset').onclick=()=>select(0);}};
}

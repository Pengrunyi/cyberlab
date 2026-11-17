import * as THREE from 'three';
import type {DeviceId} from '../interaction/system';
import type {createLiving} from '../objects/living';
import type {createCamera} from '../player/camera';
import type {createHUD} from './hud';

export function createLivingPanels(host:HTMLElement,living:ReturnType<typeof createLiving>,player:ReturnType<typeof createCamera>,hud:ReturnType<typeof createHUD>){
 const layer=document.createElement('div');layer.className='device-backdrop living-backdrop';layer.hidden=true;
 layer.innerHTML=`<section class="device-dialog" role="dialog" aria-modal="true" aria-labelledby="living-title"><header class="device-titlebar"><span class="window-icon">▣</span><h2 id="living-title"></h2><button id="living-close" aria-label="关闭生活设备">×</button></header><div class="device-toolbar"><span>133F / HABITAT</span><span>CONNECTED</span></div><div class="device-content">
 <section data-living="bed"><div class="device-glyph">REST / RECHARGE</div><h3>私人休息舱</h3><p>躺下后切换至枕边视角。起身或关闭面板时回到床边。</p><button id="bed-rest" class="primary-action">躺下休息</button><button id="bed-wake">起身</button></section>
 <section data-living="faucet"><div class="device-glyph">WATER / RECYCLE</div><h3>循环供水</h3><p>控制水龙头出水。关闭面板后保留开关状态。</p><button id="tap-toggle" class="primary-action">开启水龙头</button></section>
 <section data-living="treadmill"><div class="device-glyph">STRIDE / WELLNESS</div><h3>运动控制台</h3><p>跑带与机身屏幕同步运行。关闭面板后设备继续工作。</p><label class="joint-label" for="stride-speed">目标速度<output id="stride-value">6.0 km/h</output></label><input id="stride-speed" type="range" min="1" max="12" step="0.5" value="6"/><div class="device-actions horizontal"><button id="stride-start" class="primary-action">启动</button><button id="stride-stop">停止</button></div></section>
 <div class="status-box" id="living-status" role="status"></div></div><footer class="device-footer"><span>ESC 关闭 · 点击继续探索</span><span>HABITAT / LOCAL</span></footer></section>`;
 host.append(layer);const get=<T extends HTMLElement>(id:string)=>layer.querySelector<T>('#'+id)!;
 let active:DeviceId|undefined,closeHandler=()=>{};
 const savedPosition=new THREE.Vector3(),savedRotation=new THREE.Quaternion();
 function wake(){if(!living.state.resting)return;living.setRest(false);player.camera.position.copy(savedPosition);player.camera.quaternion.copy(savedRotation);player.setTravel(false);}
 get('living-close').onclick=()=>closeHandler();
 get('bed-rest').onclick=()=>{if(living.state.resting)return;savedPosition.copy(player.camera.position);savedRotation.copy(player.camera.quaternion);player.setTravel(true);living.setRest(true);player.camera.position.set(-4.65,6.08,-4.12);player.camera.lookAt(-4.65,7.3,-1.1);update();};
 get('bed-wake').onclick=()=>{wake();update();};
 get('tap-toggle').onclick=()=>{living.setWater(!living.state.waterOn);update();};
 get<HTMLInputElement>('stride-speed').oninput=e=>{living.setSpeed(Number((e.target as HTMLInputElement).value));update();};
 get('stride-start').onclick=()=>{living.setRunning(true);update();};get('stride-stop').onclick=()=>{living.setRunning(false);update();};
 layer.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const controls=[...layer.querySelectorAll<HTMLElement>('button:not(:disabled),input')].filter(el=>el.getClientRects().length);if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0]?.focus();}});
 function update(){if(!active)return;const s=living.state;
  get<HTMLButtonElement>('bed-rest').disabled=s.resting;get<HTMLButtonElement>('bed-wake').disabled=!s.resting;
  get('tap-toggle').textContent=s.waterOn?'关闭水龙头':'开启水龙头';get('tap-toggle').setAttribute('aria-pressed',String(s.waterOn));
  get('stride-value').textContent=s.speed.toFixed(1)+' km/h';get<HTMLInputElement>('stride-speed').value=String(s.speed);
  get<HTMLButtonElement>('stride-start').disabled=s.running;get<HTMLButtonElement>('stride-stop').disabled=!s.running;
  get('living-status').textContent=active==='bed'?`${s.resting?'正在休息':'待机'} / 累计休息 ${Math.floor(s.restSeconds)} 秒`:active==='faucet'?`${s.waterOn?'供水中 / 4.8 L/min':'阀门已关闭'}\n累计用水 ${s.litres.toFixed(2)} L`:`${s.running?'运行中':'已停止'} / ${s.running?s.speed.toFixed(1):'0.0'} km/h\n累计里程 ${s.distance.toFixed(1)} m`;
 }
 return {get active(){return active;},onClose(fn:()=>void){closeHandler=fn;},open(id:DeviceId){active=id;hud.closeSettings();layer.hidden=false;layer.dataset.device=id;get('living-title').textContent=id==='bed'?'REST / 休息舱':id==='faucet'?'WATER / 水龙头':'STRIDE / 跑步机';layer.querySelectorAll<HTMLElement>('[data-living]').forEach(el=>el.hidden=el.dataset.living!==id);update();get('living-close').focus();},close(){if(!active)return;wake();active=undefined;layer.hidden=true;hud.get('resume').hidden=false;hud.get('resume').focus();},update};
}

import * as THREE from 'three';
import './style.css';
import {createRoom} from './scene/room';
import {createLighting} from './scene/lighting';
import {createCity} from './scene/city';
import {createWorkstation} from './objects/workstation';
import {createRobot} from './objects/robot';
import {createHologram} from './objects/hologram';
import {createEquipment} from './objects/equipment';
import {createRenderer} from './effects/renderer';
import {createCamera} from './player/camera';
import {createHUD} from './ui/hud';
import {createLounge} from './objects/lounge';
import {createWeather} from './effects/weather';
import {createAudio} from './effects/audio';
import {createInteraction} from './interaction/system';
import {createTerminal} from './interaction/terminal';
import {createDevicePanels} from './ui/devicePanels';
import {createLiving} from './objects/living';
import {createElevator} from './objects/elevator';
import './ui/devices.css';
import {createLivingPanels} from './ui/livingPanels';
import {createResearch} from './objects/research';
import {createResearchPanels} from './ui/researchPanels';

const host=document.querySelector<HTMLElement>('#app')!;
const hud=createHUD(host);
try {
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x10182c);scene.fog=new THREE.FogExp2(0x263e43,.0036);
 const placeholderCamera=new THREE.PerspectiveCamera();
 // The renderer creates the canvas used by the camera controls.
 const graphics=createRenderer(scene,placeholderCamera,host);
 const player=createCamera(graphics.renderer.domElement);
 graphics.setCamera(player.camera);
 const room=createRoom(scene),lights=createLighting(scene),workstation=createWorkstation(scene),robot=createRobot(scene),equipment=createEquipment(scene),lounge=createLounge(scene),hologram=createHologram(scene),city=createCity(scene),weather=createWeather(scene),audio=createAudio();
 const living=createLiving(scene),elevator=createElevator(scene,player,host);
 city.update(0);
 host.addEventListener('pointerdown',()=>audio.start(),{once:true});
 const terminal=createTerminal(mode=>{workstation.setScreen(mode);audio.play('success');});
 const panels=createDevicePanels(host,{robot,hologram,weather,audio,hud,terminal});
 const livingPanels=createLivingPanels(host,living,player,hud);
 const research=createResearch(scene);
 const researchPanels=createResearchPanels(host,research,city,scene,player,hud,audio);
 const windowTarget=new THREE.Mesh(new THREE.PlaneGeometry(11.6,4.3),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));windowTarget.rotation.y=-Math.PI/2;windowTarget.position.set(6.73,2.5,0);windowTarget.name='Window weather interaction';scene.add(windowTarget);
 const interaction=createInteraction(scene,player,[room,workstation.root,robot.root,equipment.root,lounge.root,hologram.root,living.root,elevator.root,research.root,windowTarget],[{id:'terminal',label:'操作电脑工作台',root:workstation.root},{id:'robot',label:'控制机械臂',root:robot.root},{id:'hologram',label:'查看全息核心',root:hologram.root},{id:'lab',label:'实验室控制台',root:equipment.control},{id:'weather',label:'切换窗外天气',root:windowTarget},{id:'bed',label:'休息 / 起身',root:living.bed},{id:'faucet',label:'控制水龙头',root:living.faucet},{id:'treadmill',label:'控制跑步机',root:living.treadmill},...research.devices],id=>{if(id.startsWith('part-')||['assembly','citymap','telescope','inventory'].includes(id)){researchPanels.open(id);return;}if(['bed','faucet','treadmill'].includes(id))livingPanels.open(id);else panels.open(id);},()=>{panels.close();livingPanels.close();researchPanels.close();});
 researchPanels.onClose(()=>interaction.close());researchPanels.onNavigate(id=>interaction.open(id));
 const kit=document.createElement('button');kit.className='field-kit-toggle';kit.id='field-kit-toggle';kit.textContent='I / 零件包';kit.onclick=()=>{if(!player.travelLocked){hud.closeSettings();interaction.open('inventory');}};host.append(kit);
 document.addEventListener('keydown',e=>{if(e.code==='KeyI'&&!e.repeat&&player.controls.isLocked&&!player.travelLocked){e.preventDefault();interaction.open('inventory');}});
 livingPanels.onClose(()=>interaction.close());panels.onClose(()=>interaction.close());hud.onSettingsOpen(()=>interaction.close());
 const link=(panel:string,id:string,label:string,device:'citymap'|'telescope')=>{const button=document.createElement('button');button.id=id;button.textContent=label;button.className='primary-action';button.style.marginTop='18px';button.onclick=()=>interaction.open(device);host.querySelector(`[data-device-panel="${panel}"]`)!.append(button);};
 link('hologram','open-citymap','打开全息城市沙盘','citymap');
 link('weather','open-telescope','使用窗边望远镜','telescope');
 hud.bindPlayer(player);
 hud.bindView(index=>player.setView(index));
 let color='#4dffe3';const brightness=hud.get<HTMLInputElement>('brightness');const power=hud.get<HTMLInputElement>('lights');
 const updateLighting=()=>{hud.get('brightness-value').textContent=brightness.value+'%';lights.set(color,Number(brightness.value)/100,power.checked);};
 brightness.oninput=updateLighting;power.onchange=updateLighting;
 host.querySelectorAll<HTMLButtonElement>('[data-color]').forEach(button=>button.onclick=()=>{color=button.dataset.color!;host.querySelectorAll('[data-color]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});updateLighting();});
 hud.get<HTMLInputElement>('bloom').onchange=e=>graphics.quality((e.target as HTMLInputElement).checked);
 hud.get<HTMLSelectElement>('quality').onchange=e=>{const high=(e.target as HTMLSelectElement).value==='high';graphics.quality(high);weather.quality(high);hud.get<HTMLInputElement>('bloom').checked=high;};
 hud.get<HTMLInputElement>('rain').onchange=e=>weather.setRain((e.target as HTMLInputElement).checked);
 const resize=()=>{player.resize();graphics.resize();};window.addEventListener('resize',resize);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let previous=performance.now(),elapsed=0,fps=60,shadowPose=-1,lastFloor=0;
 document.addEventListener('visibilitychange',()=>previous=performance.now());
 graphics.renderer.setAnimationLoop(now=>{
  if(document.hidden)return;const rawDt=(now-previous)/1000;const dt=Math.min(rawDt,.05);previous=now;elapsed+=dt;fps=THREE.MathUtils.lerp(fps,1/Math.max(rawDt,.001),.04);
  elevator.update(dt);player.update(dt);living.update(elapsed,dt,!reduced.matches);livingPanels.update();robot.update(dt);terminal.update(dt);if(!reduced.matches){hologram.update(elapsed);city.update(elapsed);}weather.update(elapsed,dt,!reduced.matches);audio.rain(weather.state.rain);panels.update(dt,elapsed);equipment.setDiagnostic(panels.diagnosticStep);research.update(dt,elapsed);researchPanels.update(elapsed);interaction.update();hud.update(elapsed,fps);
  if(lastFloor!==player.floorHeight){lastFloor=player.floorHeight;hud.get('floor-name').textContent=lastFloor>2.5?'夜城 · 133F':'夜城 · 132F';hud.get('view-name').textContent=lastFloor>2.5?'私人生活区 · 寝居 / 健身':'研究基地 · 自由探索';}
  if(shadowPose!==robot.root.userData.poseRevision||elevator.root.userData.moving){graphics.renderer.shadowMap.needsUpdate=true;shadowPose=robot.root.userData.poseRevision;}
  graphics.render();
 });
 graphics.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();hud.get('error').hidden=false;hud.get('error').textContent='图形上下文已丢失，请刷新页面重新进入实验室。';});
 if(import.meta.env.DEV)Object.assign(window,{__cyberlab:{player,renderer:graphics.renderer,cityStats:city.stats,cityLayout:city.layout,scene,interaction,panels,robot,hologram,weather,terminal,audio,elevator,living,livingPanels,research,researchPanels}});
} catch(error){console.error(error);hud.get('error').hidden=false;hud.get('error').textContent='实验室加载失败。请使用支持 WebGL 2 的桌面 Chrome，开启硬件加速后刷新。';}

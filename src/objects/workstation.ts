import * as THREE from 'three';
import {box,cylinder,screen,metal,dark,silver,neon,label} from './primitives';
export function createWorkstation(scene:THREE.Scene){
 const g=new THREE.Group();g.position.set(-3.7,0,-4.4);scene.add(g);g.name='Computer workstation';const displays:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>[]=[];
 box(g,[4.7,.16,1.5],[0,1.05,0]);box(g,[4.5,.025,.035],[0,1.1,.76],neon());
 for(const x of [-1.95,1.95]){box(g,[.18,1,.9],[x,.5,0]);box(g,[.55,.08,1.2],[x,.05,0],dark);}
 for(let i=-1;i<=1;i++){
  const monitor=new THREE.Group();monitor.position.set(i*1.43,0,-.28);monitor.rotation.y=-i*.15;g.add(monitor);
  box(monitor,[.08,.4,.07],[0,1.35,0],silver);box(monitor,[.5,.04,.3],[0,1.16,0]);displays.push(screen(monitor,['TERMINAL','NETWORK','TELEMETRY'][i+1],[1.3,.83],[0,1.94,0],i+1));
 }
 box(g,[1.25,.055,.43],[0,1.17,.3],dark);for(let x=0;x<15;x++)for(let z=0;z<5;z++)box(g,[.065,.015,.055],[-.55+x*.077,1.205,.15+z*.065],x%4?metal:neon(0x66d9cc,.5));
 const mouse=cylinder(g,.09,.05,[.93,1.18,.35],silver);mouse.scale.z=1.5;
 box(g,[.6,.95,.8],[1.75,.52,0],dark);box(g,[.025,.8,.67],[2.06,.53,0],new THREE.MeshStandardMaterial({color:0x28475b,transparent:true,opacity:.5,metalness:.7,roughness:.2}));
 for(const y of [.3,.7]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.16,.018,8,32),neon(0x8862ff));ring.position.set(1.75,y,.415);g.add(ring);}
 // Task chair: seat, back, stem and five-star base.
 box(g,[.8,.16,.75],[0,.63,1.5],dark);box(g,[.75,.85,.14],[0,1.11,1.86],dark);box(g,[.05,.55,.04],[-.3,1.2,1.77],neon(0x28b9b2,.5));
 cylinder(g,.065,.5,[0,.3,1.5],silver);for(let i=0;i<5;i++){const foot=box(g,[.65,.06,.08],[Math.cos(i*1.257)*.2,.12,1.5+Math.sin(i*1.257)*.2],metal);foot.rotation.y=-i*1.257;}
 label(g,'01 / WORKSTATION',1.4,[-2, .78,.78],'#6db8c3');
 return {root:g,setScreen(mode:number){displays.forEach((display,i)=>{const canvas=document.createElement('canvas');canvas.width=768;canvas.height=448;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#061723';ctx.fillRect(0,0,768,448);ctx.fillStyle='#88ffe1';ctx.font='25px monospace';ctx.fillText(['NETWORK SCAN','DEVICE DIAGNOSTICS','SYSTEM READY'][mode%3],30,55);ctx.font='20px monospace';['CYBERLAB OS / V3','LOCAL SIMULATION',`DISPLAY ${i+1} / ONLINE`,mode===0?'08 NODES CONNECTED':mode===1?'ALL DEVICES NOMINAL':'STANDBY / READY','> process complete_'].forEach((t,j)=>ctx.fillText(t,30,120+j*48));const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;display.material.map?.dispose();display.material.map=texture;display.material.needsUpdate=true;});}};
}

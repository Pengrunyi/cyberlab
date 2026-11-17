import * as THREE from 'three';

export const metal = new THREE.MeshStandardMaterial({ color: 0x182630, metalness: .75, roughness: .36 });
export const dark = new THREE.MeshStandardMaterial({ color: 0x080e17, metalness: .5, roughness: .5 });
export const silver = new THREE.MeshStandardMaterial({ color: 0x647883, metalness: .8, roughness: .28 });
export const neon = (color = 0x40ffe0, intensity = 3) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: .3 });
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
export function box(parent: THREE.Object3D, size: number[], position: number[], material: THREE.Material = metal) {
  const mesh = new THREE.Mesh(boxGeo, material); mesh.scale.set(size[0], size[1], size[2]); mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
export function cylinder(parent: THREE.Object3D, radius: number, height: number, position: number[], material: THREE.Material = metal, top = radius) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, radius, height, 32), material); mesh.position.set(position[0],position[1],position[2]); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
export function label(parent: THREE.Object3D, text: string, width: number, position: number[], color = '#79ffdf') {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
  const ctx = canvas.getContext('2d')!; ctx.fillStyle = color; ctx.font = '600 92px monospace'; ctx.textBaseline = 'middle'; ctx.fillText(text, 18, 128);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })); mesh.position.set(position[0],position[1],position[2]); parent.add(mesh); return mesh;
}
export function screenTexture(title: string, variant = 0) {
  const c = document.createElement('canvas'); c.width = 768; c.height = 448; const g = c.getContext('2d')!;
  g.fillStyle = '#04151f'; g.fillRect(0,0,768,448); g.fillStyle = '#74ffe0'; g.font = '22px monospace'; g.fillText('CYBERLAB / '+title, 30, 45);
  g.strokeStyle = '#163943'; g.lineWidth = 1; for(let y=80;y<430;y+=35){g.beginPath();g.moveTo(25,y);g.lineTo(740,y);g.stroke();}
  if (variant === 1) {
    for(let i=0;i<9;i++){g.fillStyle=i%3?'#46dbca':'#aa84ff';g.fillRect(40+i*78,360-(i*47%220),40,50+(i*47%220));}
    g.font='16px monospace';g.fillText('NEURAL ACTIVITY / SIMULATION',30,410);
  } else if(variant === 2) {
    const nodes=Array.from({length:18},(_,i)=>({x:100+((i*137)%560),y:100+((i*89)%270)}));
    g.strokeStyle='#24687a';for(let i=1;i<nodes.length;i++){g.beginPath();g.moveTo(nodes[i-1].x,nodes[i-1].y);g.lineTo(nodes[i].x,nodes[i].y);g.stroke();}
    nodes.forEach(n=>{g.fillStyle='#68ffe4';g.beginPath();g.arc(n.x,n.y,5,0,Math.PI*2);g.fill();});
  } else {
    g.font='18px monospace';['> boot sequence complete','> virtual network initialized','> arm controller ........ ONLINE','> holographic core ...... ONLINE','> environment sensors ... ONLINE','', 'SYSTEM READY_'].forEach((t,i)=>{g.fillStyle=i===6?'#b09aff':'#54b3bd';g.fillText(t,32,100+i*39);});
  }
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function screen(parent: THREE.Object3D, title: string, size: number[], pos: number[], variant=0) {
  box(parent,[size[0]+.12,size[1]+.12,.12],pos,dark);
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(size[0],size[1]),new THREE.MeshBasicMaterial({map:screenTexture(title,variant)}));mesh.position.set(pos[0],pos[1],pos[2]+.065);parent.add(mesh);return mesh;
}

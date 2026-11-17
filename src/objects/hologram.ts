import * as THREE from 'three';
import {cylinder,neon,metal,label} from './primitives';
export function createHologram(scene:THREE.Scene){
 const g=new THREE.Group();g.position.set(.45,0,.05);scene.add(g);g.name='Holographic network table';
 cylinder(g,1.2,.17,[0,.82,0],metal);cylinder(g,.7,.72,[0,.39,0]);cylinder(g,1,.08,[0,.07,0]);cylinder(g,1.07,.035,[0,.92,0],neon(0x33eecb,1.2));cylinder(g,1.02,.04,[0,.95,0],metal);
 const globe=new THREE.Group();globe.position.y=2.05;g.add(globe);
 globe.add(new THREE.Mesh(new THREE.SphereGeometry(.77,32,20),new THREE.MeshBasicMaterial({color:0x1b9f9f,transparent:true,opacity:.09,depthWrite:false})));
 globe.add(new THREE.Mesh(new THREE.SphereGeometry(.8,24,14),new THREE.MeshBasicMaterial({color:0x41dfcd,wireframe:true,transparent:true,opacity:.23})));
 const points:THREE.Vector3[]=[];
 for(let i=0;i<80;i++){const y=1-(i/79)*2,r=Math.sqrt(1-y*y),a=i*2.39996;const v=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r).multiplyScalar(.81);points.push(v);}
 const geometry=new THREE.BufferGeometry().setFromPoints(points);globe.add(new THREE.Points(geometry,new THREE.PointsMaterial({color:0xa2ffe7,size:.035})));
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#062d46';ctx.fillRect(0,0,1024,512);ctx.strokeStyle='#11667d';ctx.lineWidth=1;for(let x=0;x<1024;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,512);ctx.stroke();}for(let y=0;y<512;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1024,y);ctx.stroke();}
 const continents=[[[75,100],[180,65],[290,95],[300,150],[230,215],[180,200],[150,150]],[[275,230],[350,250],[360,310],[320,425],[290,360]],[[455,110],[520,85],[570,150],[630,175],[600,220],[560,215],[530,300],[490,340],[470,270],[450,195]],[[550,95],[700,70],[860,100],[920,160],[830,200],[760,180],[710,245],[650,180]],[[820,310],[910,300],[945,365],[860,390],[810,350]]];
 ctx.fillStyle='#65d7bd';continents.forEach(poly=>{ctx.beginPath();poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();});
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const earth=new THREE.Mesh(new THREE.SphereGeometry(.79,48,32),new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.85}));earth.visible=false;globe.add(earth);
 const marker=new THREE.Mesh(new THREE.SphereGeometry(.065,12,8),new THREE.MeshBasicMaterial({color:0xffca9b}));marker.visible=false;globe.add(marker);
 for(let i=0;i<18;i++){const a=points[i*3],b=points[(i*7+11)%80];const mid=a.clone().add(b).normalize().multiplyScalar(1.05);const curve=new THREE.QuadraticBezierCurve3(a,mid,b);globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)),new THREE.LineBasicMaterial({color:0x63ffda,transparent:true,opacity:.6})));}
 for(const radius of [.85,1.04]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.009,6,96),neon(0x41d8ca,1.5));ring.rotation.x=Math.PI/2;ring.position.y=1.03;g.add(ring);}
 const beam=new THREE.Mesh(new THREE.ConeGeometry(.83,1.1,48,1,true),new THREE.MeshBasicMaterial({color:0x4fffdc,transparent:true,opacity:.035,side:THREE.DoubleSide,depthWrite:false}));beam.position.y=1.5;beam.rotation.z=Math.PI;g.add(beam);
 const light=new THREE.PointLight(0x52ffd7,14,5,1.5);light.position.y=1.6;g.add(light);
 label(g,'GLOBAL NETWORK',1.6,[-.8,.64,1.12]);
 let mode:'network'|'earth'='network';
 return {root:g,globe,points,get mode(){return mode;},setMode(value:'network'|'earth'){mode=value;earth.visible=value==='earth';},selectNode(index:number){marker.position.copy(points[index%points.length]);marker.visible=true;},update(time:number){globe.rotation.y=time*.12;globe.position.y=2.04+Math.sin(time*.8)*.035;}};
}

import * as THREE from 'three';
import {createFacadeMaterial,createSky} from './cityMaterials';
import {buildBatch,type Part} from './cityBatch';
import {createTraffic} from './traffic';
import {createAdvertisements} from './citySigns';
import {box,cylinder,label,neon} from '../objects/primitives';
import {railClear,footprintsOverlap,type BuildingFootprint} from './worldLayout';

export function createCity(scene:THREE.Scene){
 const city=new THREE.Group();city.name='132F / layered megacity';scene.add(city);createSky(scene);
 let seed=2077;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 const bodies:Part[]=[],details:Part[]=[],neons:Part[]=[];
 const palette=[0x369fae,0x5c6bb0,0xa05597,0xce7550];
 let buildings=0;
 const footprints:BuildingFootprint[]=[];
 function tower(x:number,z:number,w:number,d:number,height:number,detail:number,type:number){
  const bottom=-112;const top=bottom+height;
  const footprint={x,z,minX:x-w*.5,maxX:x+w*(type===2?.825:.5),minZ:z-d*.5,maxZ:z+d*.5,top};
  if(!railClear(footprint.minX,footprint.maxX,footprint.minZ,footprint.maxZ)||footprints.some(b=>footprintsOverlap(b,footprint)))return;
  footprints.push(footprint);buildings++;
  const color=palette[Math.floor(random()*palette.length)];
  bodies.push({position:[x,bottom+height/2,z],size:[w,height,d]});
  if(type===1||type===3){
   for(let k=0;k<3;k++)bodies.push({position:[x+(type===3?w*.18:0),top+3+k*7,z],size:[w*(.78-k*.18),6.9,d*(.8-k*.17)]});
  }else if(type===2){
   bodies.push({position:[x-w*.2,top+height*.11,z],size:[w*.4,height*.23,d*.6]});
   bodies.push({position:[x+w*.55,top-height*.23,z+d*.1],size:[w*.55,height*.17,d*.85]});
  }
  if(detail===0)return;
  details.push({position:[x,top+.5,z],size:[w+1,.8,d+1]});
  details.push({position:[x,top+4,z],size:[.23,8,.23]});
  neons.push({position:[x,top+8.1,z],size:[.35,.4,.35],color:0xd66c75});
  for(const side of [-1,1]){
   details.push({position:[x-w*.5-.15,bottom+height/2,z+side*d*.44],size:[.42,height,.42]});
   neons.push({position:[x-w*.5-.4,top-4,z+side*d*.42],size:[.12,detail===2?height*.28:2,.15],color});
  }
  neons.push({position:[x-w*.5-.22,top-1,z],size:[.12,.12,d*.88],color});
  if(detail===1)return;
  // Layered plant rooms, cantilevers, service spines and deep facade fins.
  for(let y=bottom+14;y<top-8;y+=17){
   details.push({position:[x-w/2-.7,y,z],size:[1.25,.65,d+1.8]});
   details.push({position:[x,y,z+d/2+.7],size:[w+1.8,.65,1.25]});
  }
  for(let i=0;i<5;i++){
   const zz=z-d*.4+i*d*.2;
   details.push({position:[x-w/2-.5,bottom+height/2,zz],size:[.8,height,.35]});
   details.push({position:[x-w/2-1,top-5-i*9,zz],size:[1.5,2.5,1.4]});
  }
  for(let i=0;i<4;i++)details.push({position:[x-w*.3+i*w*.2,top+1.6,z+d*.18],size:[w*.13,2,d*.32]});
  // Exoskeleton braces on two hero towers.
  if(type===3)for(const side of [-1,1]){
   const braceHeight=height*.6,offset=d*.35;
   details.push({position:[x-w/2-1.2,top-height*.35,z+side*offset],size:[1.1,braceHeight,1.1],rotation:side*.14});
  }
 }
 // Hero towers frame an open canyon; nothing fills the view with a single flat facade.
 tower(48,-60,15,18,139,2,3);tower(54,62,19,22,121,2,2);
 tower(84,-26,22,24,153,2,1);tower(94,35,19,19,161,2,3);
 tower(105,-14,15,18,122,2,2);tower(128,21,19,20,130,2,1);
 tower(35,68,13,20,146,2,0);tower(40,-73,19,18,157,2,1);
 // Southern blocks are authored independently, in the same world as the east canyon.
 tower(-38,62,24,24,164,2,1);
 tower(-68,148,32,30,137,2,2);
 tower(48,145,28,28,151,2,0);
 tower(-48,235,38,42,146,2,0);
 tower(42,245,27,32,186,2,1);
 tower(-113,48,28,30,130,2,3);
 tower(-118,200,29,32,181,2,1);
 for(let row=0;row<11;row++)for(let col=-8;col<=2;col++){
  const x=col*32+(row%2)*7+(random()-.5)*4,z=46+row*34+(random()-.5)*4;
  if(Math.abs(x)<23)continue; // A continuous ground-level avenue, not a second axial landmark.
  if(x>-133&&x<-15&&z>75&&z<125)continue; // Station footprint and approach.
  tower(x,z,17+random()*7,18+random()*7,86+random()*80,row<4?1:0,Math.floor(random()*3));
 }
 for(let row=0;row<11;row++)for(let col=-17;col<=2;col++){
  tower(col*34+random()*5,440+row*35,16+random()*9,17+random()*9,85+random()*124,0,Math.floor(random()*3));
 }
 // Staggered, non-overlapping urban blocks, with a narrow axial street canyon.
 for(let row=0;row<12;row++)for(let col=-7;col<=7;col++){
  const x=112+row*29+(random()-.5)*6;
  const z=col*28+(row%2)*11+(random()-.5)*5;
  if(row<5&&Math.abs(z)<19)continue;
  if(Math.abs(x-330)<37&&z>-35&&z<24)continue; // Reserve the one central tower site.
  if(Math.abs(x-790)<40&&Math.abs(z-150)<34)continue;
  const w=13+random()*9,d=13+random()*9;
  const h=78+random()*74+row*3+(random()>.92?30:0);
  tower(x,z,w,d,h,row<4?1:0,Math.floor(random()*4));
 }
 // Far skyline continues for another half kilometre, with simplified silhouettes.
 for(let row=0;row<13;row++)for(let col=-15;col<=15;col++){
  const x=470+row*34+random()*10,z=col*34+(random()-.5)*12;
  if(Math.abs(x-790)<45&&Math.abs(z-150)<38)continue;
  tower(x,z,14+random()*12,15+random()*12,70+random()*170,0,random()>.7?1:0);
 }
 tower(790,150,42,35,370,0,2);
 // A single recognisable, stepped arcology crown terminates the central vista.
 tower(330,-7,32,30,238,2,3);
 for(let k=0;k<5;k++){
  bodies.push({position:[330,129+k*7,-7],size:[28-k*4,7,26-k*3.5]});
  for(const side of [-1,1])neons.push({position:[313+k*2,119+k*8,-7+side*(13-k*1.5)],size:[.22,18,.22],color:0x69cde2});
 }
 for(const side of [-1,1]){
  details.push({position:[330,138,-7+side*21],size:[2,61,2],rotation:side*.11});
  neons.push({position:[328,161,-7+side*23],size:[1,1,7],color:0x8be0e1});
 }
 const crown=new THREE.Mesh(new THREE.TorusGeometry(19,.45,8,80),new THREE.MeshBasicMaterial({color:new THREE.Color(.9,1.8,1.9),fog:false}));
 crown.name='Single east arcology crown';
 crown.position.set(330,164,-7);crown.rotation.x=Math.PI/2;city.add(crown);
 const orbit=crown.clone();orbit.rotation.x=.4;orbit.scale.setScalar(.72);orbit.position.y+=1;city.add(orbit);
 const beamMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;void main(){float a=pow(1.-abs(vUv.x-.5)*2.,3.)*.075*sin(vUv.y*3.14159);gl_FragColor=vec4(.22,.64,.8,a);}`});
 for(const z of [-18,-7,4]){const beam=new THREE.Mesh(new THREE.PlaneGeometry(10,125),beamMaterial);beam.rotation.y=-Math.PI/2;beam.position.set(326,99,z);city.add(beam);}
 // Service bridges occupy different heights and depths.
 for(const [x,z,length,y] of [[68,-25,44,-31],[97,28,48,-48],[175,-25,70,-19],[228,45,84,-38]]){
  details.push({position:[x,y,z],size:[4,2.3,length]});
  neons.push({position:[x-2.1,y+.3,z],size:[.09,.18,length],color:0x4b91a5});
  for(let n=-length/2+2;n<length/2;n+=4)details.push({position:[x-2.05,y+1,z+n],size:[.15,3,.15]});
 }
 // Lower decks hint at inhabited streets far below the laboratory.
 for(const y of [-76,-100]){
  details.push({position:[190,y,-2],size:[370,2,12]});
  neons.push({position:[190,y+1.1,-7.5],size:[370,.08,.12],color:0x326994});
 }
 // Rooftop service stacks and advertising brackets break the clean box silhouettes.
 for(const [x,z,y,w] of [[48,-60,27,15],[54,62,9,19],[84,-26,41,22],[94,35,49,19],[105,-14,10,15],[128,21,18,19]]){
  for(let i=0;i<4;i++){
   details.push({position:[x-w*.3+i*w*.2,y+1.7,z],size:[1.2,3.2,3]});
   details.push({position:[x-w/2-.7,y-8-i*6,z+4],size:[1.2,2,3.2]});
  }
  for(let i=0;i<3;i++)details.push({position:[x-w/2-.7,y-15-i*11,z],size:[1.6,1.3,15]});
 }
 const facade=createFacadeMaterial();
 buildBatch(city,'Near / middle / far tower facades',bodies,facade);
 buildBatch(city,'Instanced structural ribs, roof plant and bridges',details,new THREE.MeshStandardMaterial({color:0x243044,metalness:.62,roughness:.48}));
 buildBatch(city,'Instanced neon and aviation markers',neons,new THREE.MeshBasicMaterial({color:new THREE.Color(2.8,2.8,2.8)}));
 const vents:Part[]=[],spires:Part[]=[];
 for(const [x,z,y] of [[40.1,-64,22],[44.1,66,4],[72.3,-36,34],[83.8,43,43]]){
  for(let k=0;k<7;k++)vents.push({position:[x,y-k*8,z],size:[.65,.35,.65],rotation:Math.PI/2});
 }
 for(const [x,z,y,height] of [[84,-26,74,25],[40,-73,77,22],[330,-7,179,30]])spires.push({position:[x,y,z],size:[3,height,3]});
 const plantMaterial=new THREE.MeshStandardMaterial({color:0x354256,metalness:.75,roughness:.42});
 buildBatch(city,'Facade turbine housings',vents,plantMaterial,new THREE.CylinderGeometry(1,1,1,16));
 buildBatch(city,'Tapered landmark spires',spires,plantMaterial,new THREE.CylinderGeometry(.03,1,1,6));
 // Southern power works: three supported stacks, reservoir drums and a horizontal gantry.
 const plant=new THREE.Group();plant.name='South thermal works';city.add(plant);
 const amber=neon(0xe7ac69,.7),teal=neon(0x73c8bd,.65);
 for(const x of [-59,-48,-37]){
  cylinder(plant,3,52,[x,60,240],plantMaterial,2.2);
  cylinder(plant,3.05,1,[x,84,240],amber);
  for(const y of [38,52,66,78])cylinder(plant,3.12,.45,[x,y,240],plantMaterial);
 }
 box(plant,[39,2.5,8],[-48,50,240],plantMaterial);
 for(const x of [-61,-35])box(plant,[1.3,16,5],[x,42,240],plantMaterial);
 for(const x of [-58,-44]){cylinder(plant,5,12,[x,39,222],plantMaterial);cylinder(plant,5.1,.5,[x,45,222],teal);}
 label(plant,'HELIOS / ENERGY GRID',27,[-61,26,213.7],'#d5ad7e').rotation.y=Math.PI;
 // Station has platforms, columns and a roof, all outside the swept track volume.
 const station=new THREE.Group();station.name='South interchange station';city.add(station);
 for(const z of [94.1,105.9]){
  box(station,[78,1.1,5],[-80,-18.7,z],plantMaterial);
  // Platform loads reach the same city ground as the railway piers.
  for(const x of [-114,-81,-48])box(station,[1.4,93.75,1.4],[x,-66.125,z],plantMaterial);
  box(station,[78,.08,.13],[-80,-18.1,z+(z<100?2.35:-2.35)],teal);
  for(let x=-114;x<=-48;x+=11)box(station,[.45,8,.45],[x,-14.2,z+(z<100?-1.8:1.8)],plantMaterial);
 }
 for(const z of [92.5,107.5])box(station,[82,.7,8],[-80,-10.1,z],plantMaterial);
 for(let x=-112;x<=-48;x+=8)box(station,[.35,.12,20],[x,-10,100],teal);
 label(station,'SOUTH / INTERCHANGE',32,[-96,-10.4,88.25],'#84d1d2').rotation.y=Math.PI;
 // City ground and intersecting avenues share one elevation and junction.
 box(city,[1600,2,1600],[150,-114,150],new THREE.MeshStandardMaterial({color:0x0b1e25,metalness:.35,roughness:.28}));
 const wetRoad=new THREE.MeshStandardMaterial({color:0x132b32,roughness:.22,metalness:.6});
 box(city,[850,.2,13],[430,-112.8,0],wetRoad);
 box(city,[16,.2,850],[0,-112.8,420],wetRoad);
 box(city,[32,.2,26],[8,-112.8,6],wetRoad);
 for(let z=20;z<820;z+=14)box(city,[.16,.015,5],[0,-112.68,z],amber);
 for(let x=30;x<840;x+=14)box(city,[5,.015,.16],[x,-112.68,0],teal);
 const animateSigns=createAdvertisements(city);
 const animateTraffic=createTraffic(city);
 return {layout:{footprints},stats:{buildings,facadeSections:bodies.length,structuralParts:details.length},update(time:number){facade.uniforms.uTime.value=time;animateSigns(time);animateTraffic(time);}};
}

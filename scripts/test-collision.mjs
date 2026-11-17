import assert from 'node:assert/strict';
import {isWalkable,moveWithCollision,obstacles,upperObstacles,liftAccess,PLAYER_RADIUS} from '../src/player/collision.ts';

// Exercise tunneling and circle-vs-corner contact, rather than copying the implementation.
for(const b of obstacles){
 const z=(b.minZ+b.maxZ)/2;
 const p={x:b.maxX+PLAYER_RADIUS+.2,z};
 assert.ok(isWalkable(p.x,p.z),`${b.name}: approach must be clear`);
 moveWithCollision(p,-30,0);
 assert.ok(p.x>=b.maxX+PLAYER_RADIUS-.001,`${b.name}: cannot tunnel through furniture`);
}
const wall={x:5,z:0};moveWithCollision(wall,500,0);assert.ok(wall.x<=6.35&&wall.x>6.25);
moveWithCollision(wall,20,2);assert.ok(wall.z>1.9,'blocked player slides along the glass');
const back={x:3,z:4};moveWithCollision(back,0,300);assert.ok(back.z<=5.51);
const points=[[3.2,3.6],[-2,-2.4],[4.95,-1.9],[2.4,1.9],[4.35,1.2],[-4.5,.5],[-.1,4.5]];
points.forEach(([x,z])=>assert.ok(isWalkable(x,z),`safe destination ${x},${z}`));
// Flood-fill the actual walkable floor to prove these destinations are connected.
const step=.1,visited=new Set(),queue=[[44,12]];visited.add('44,12');
for(let head=0;head<queue.length;head++){
 const [x,z]=queue[head];
 for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const a=x+dx,b=z+dz,key=`${a},${b}`;
  if(!visited.has(key)&&isWalkable(a*step,b*step)){visited.add(key);queue.push([a,b]);}
 }
}
for(const [x,z] of points)assert.ok(visited.has(`${Math.round(x/step)},${Math.round(z/step)}`),`reachable destination ${x},${z}`);
console.log(`PASS: ${obstacles.length} furniture obstacles, wall tunneling, sliding and ${points.length} connected destinations (${visited.size} floor cells).`);

// Upstairs furniture must block upstairs movement without blocking the lab below.
for(const b of upperObstacles)assert.equal(isWalkable((b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2,5),false,b.name);
assert.ok(isWalkable(0,0,5),'upstairs does not inherit the downstairs hologram collision');
const upperTargets=[[.5,1],[5.2,2.1],[-4.4,-.6],[-4.7,1.2],[1,-3],[4.8,-2],[.7,3.7]];
const upperVisited=new Set(['5,10']),upperQueue=[[5,10]];
for(let head=0;head<upperQueue.length;head++){
 const [x,z]=upperQueue[head];
 for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
  const a=x+dx,b=z+dz,key=`${a},${b}`;
  if(!upperVisited.has(key)&&isWalkable(a*.1,b*.1,5)){upperVisited.add(key);upperQueue.push([a,b]);}
 }
}
for(const [x,z]of upperTargets)assert.ok(upperVisited.has(`${Math.round(x*10)},${Math.round(z*10)}`),`upper route ${x},${z}`);
liftAccess.floor=5;
assert.equal(isWalkable(5.2,3.2,0),false,'empty lower shaft is closed');
assert.equal(isWalkable(5.2,3.2,5),true,'occupied upper landing is accessible');
liftAccess.moving=true;
assert.equal(isWalkable(5.2,3.2,5),false,'upper door blocks entry during travel');
const side={x:3.5,z:4.4};moveWithCollision(side,5,0,5);assert.ok(side.x<3.7,'cannot enter shaft through its glass side');
liftAccess.moving=false;liftAccess.floor=0;
console.log(`PASS: ${upperObstacles.length} upper obstacles, ${upperTargets.length} connected upper destinations and elevator shaft interlocks.`);

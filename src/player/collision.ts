export interface Obstacle { name: string; minX: number; maxX: number; minZ: number; maxZ: number }
export const PLAYER_RADIUS = .27;
export const EYE_HEIGHT = 1.68;
export const UPPER_FLOOR = 5;
export const upperObstacles:Obstacle[]=[
 {name:'bed',minX:-5.9,maxX:-3.35,minZ:-4.9,maxZ:-1.35},
 {name:'wardrobe',minX:-6.5,maxX:-5.75,minZ:-.4,maxZ:1.8},
 {name:'kitchen',minX:-3.25,maxX:.65,minZ:-5.55,maxZ:-4.58},
 {name:'bedside left',minX:-6.53,maxX:-5.97,minZ:-4.65,maxZ:-3.95},
 {name:'bedside right',minX:-3.33,maxX:-2.77,minZ:-4.65,maxZ:-3.95},
 {name:'air purifier',minX:1,maxX:1.5,minZ:-5.5,maxZ:-4.94},
 {name:'weights station',minX:4.9,maxX:5.6,minZ:-4.1,maxZ:-2.9},
 {name:'planter',minX:-6.1,maxX:-5.5,minZ:4.3,maxZ:4.9},
 {name:'fitness treadmill',minX:2.3,maxX:3.4,minZ:-4.1,maxZ:-1.7},
 {name:'living sofa',minX:-3.6,maxX:-.8,minZ:3.95,maxZ:5.15},
 {name:'living table',minX:-3.1,maxX:-1.3,minZ:2.55,maxZ:3.25},
];
export const liftWalls:Obstacle[]=[
 {name:'lift left wall',minX:3.92,maxX:4.08,minZ:3.25,maxZ:5.7},
 {name:'lift right wall',minX:6.4,maxX:6.6,minZ:3.25,maxZ:5.7},
 {name:'lift rear wall',minX:4,maxX:6.5,minZ:5.55,maxZ:5.75},
];
// The controller updates landing access as the physical cabin travels.
export const liftAccess={floor:0,moving:false};
export const obstacles: Obstacle[] = [
  {name:'workstation',minX:-6.15,maxX:-1.25,minZ:-5.2,maxZ:-3.62},
  {name:'task chair',minX:-4.18,maxX:-3.22,minZ:-3.38,maxZ:-2.35},
  {name:'robotics bench',minX:1.75,maxX:4.45,minZ:-4.7,maxZ:-2.7},
  {name:'hologram table',minX:-.77,maxX:1.67,minZ:-1.17,maxZ:1.27},
  {name:'experiment bench',minX:-6.26,maxX:-4.94,minZ:-1.36,maxZ:2.36},
  {name:'server racks',minX:-1.05,maxX:1.55,minZ:-5.65,maxZ:-4.72},
  {name:'lounge sofa',minX:-3.9,maxX:-.6,minZ:3.77,maxZ:5.36},
  {name:'lounge table',minX:-3.05,maxX:-1.45,minZ:2.25,maxZ:3.15},
];
export function isWalkable(x: number, z: number, floorHeight=0) {
  const r=PLAYER_RADIUS;
  if(x < -6.66+r || x > 6.62-r || z < -5.65+r || z > 5.78-r) return false;
  const upper=floorHeight>2.5;
  if(x>3.82-r&&x<6.6+r&&z>3.15-r&&z<3.35+r&&(liftAccess.moving||Math.abs(liftAccess.floor-floorHeight)>1))return false;
  return ![...(upper?upperObstacles:obstacles),...liftWalls].some(b=>{
    const dx=x-Math.max(b.minX,Math.min(x,b.maxX));
    const dz=z-Math.max(b.minZ,Math.min(z,b.maxZ));
    return dx*dx+dz*dz < r*r;
  });
}
/** Substeps prevent tunneling; axis separation lets the player slide along furniture. */
export function moveWithCollision(position: {x:number;z:number}, dx:number, dz:number,floorHeight=0) {
  const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.08));
  const sx=dx/steps,sz=dz/steps;
  for(let i=0;i<steps;i++){
    if(isWalkable(position.x+sx,position.z,floorHeight))position.x+=sx;
    if(isWalkable(position.x,position.z+sz,floorHeight))position.z+=sz;
  }
}

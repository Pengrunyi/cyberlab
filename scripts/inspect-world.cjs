const path=require('node:path');
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd(),path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')]}));
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__cyberlab);
  const topology=await page.evaluate(()=>{
   const scene=window.__cyberlab.scene,crowns=[];
   scene.updateMatrixWorld(true);
   scene.traverse(o=>{if(o.geometry?.type==='TorusGeometry'&&o.geometry.parameters.radius===19&&o.geometry.parameters.tube===.45&&o.scale.x===1)crowns.push([o.matrixWorld.elements[12],o.matrixWorld.elements[13],o.matrixWorld.elements[14]]);});
   return {crowns,rotatedCity:!!scene.getObjectByName('Rear panorama / south city district')};
  });
  console.log(JSON.stringify(topology));
  assert.equal(topology.crowns.length,1,'The unique central tower must not be copied into a second compass direction');
  assert.equal(topology.rotatedCity,false,'A rear window must view the shared world, not a rotated city clone');
  const geometry=await page.evaluate(async()=>{
   const {railPath,railLength,railClear,footprintsOverlap}=await import('/src/scene/worldLayout.ts');
   const {footprints}=window.__cyberlab.cityLayout;
   const collisions=footprints.filter(b=>!railClear(b.minX,b.maxX,b.minZ,b.maxZ)).length;
   let overlaps=0;
   for(let i=0;i<footprints.length;i++)for(let j=i+1;j<footprints.length;j++)if(footprintsOverlap(footprints[i],footprints[j]))overlaps++;
   const scene=window.__cyberlab.scene,railway=scene.getObjectByName('Shared east–south railway');
   const cars=railway.children.filter(o=>o.name.startsWith('Shared railway / car'));
   // Move the whole world to a time that puts all carriages on the quarter-circle.
   const {createTraffic}=await import('/src/scene/traffic.ts');
   const sandbox=scene.clone(false),update=createTraffic(sandbox);
   update((510-35)/14);
   const turningCars=sandbox.getObjectByName('Shared east–south railway').children.filter(o=>o.name.startsWith('Shared railway / car'));
   const carErrors=turningCars.map((car,i)=>{
    const d=510-i*8,p=railPath.getPointAt(d/railLength),t=railPath.getTangentAt(d/railLength);
    car.updateMatrix();const e=car.matrix.elements;
    const facing=car.position.clone().set(e[8],e[9],e[10]);
    return {position:car.position.distanceTo(p),alignment:facing.dot(t),visible:car.visible};
   });
   // Release temporary GPU assets from this structural check.
   sandbox.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});
   return {buildings:footprints.length,collisions,overlaps,cars:cars.length,carErrors};
  });
  assert.ok(geometry.buildings>500);assert.equal(geometry.collisions,0,'Buildings must respect the full railway corridor');
  assert.equal(geometry.overlaps,0,'City building footprints must not overlap');assert.equal(geometry.cars,4);
  geometry.carErrors.forEach(c=>{assert.ok(c.visible);assert.ok(c.position<.00001);assert.ok(c.alignment>.9999);});
  console.log(JSON.stringify(geometry));
  await page.bringToFront();await page.locator('#enter').click();await page.waitForFunction(()=>document.pointerLockElement);await page.waitForTimeout(650);
  for(const [view,name]of [[4,'east'],[6,'south'],[9,'upper-south']]){
   await page.evaluate(i=>window.__cyberlab.player.setView(i),view);await page.waitForTimeout(250);
   await page.screenshot({path:`artifacts/world-${name}.png`});
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})();

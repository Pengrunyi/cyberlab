const path=require('node:path');
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd(),path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')]}));
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__cyberlab);
 await page.bringToFront();await page.locator('#enter').click();await page.waitForFunction(()=>document.pointerLockElement);
 await page.waitForTimeout(700);
 for(const [index,name]of [[6,'rear'],[5,'living'],[8,'fitness'],[9,'upper-panorama'],[7,'lift']]){
  await page.evaluate(i=>window.__cyberlab.player.setView(i),index);await page.waitForTimeout(350);await page.screenshot({path:`artifacts/duplex-${name}.png`});
 }
 // Enter the actual cabin by walking, then use the real E key to travel.
 await page.keyboard.down('KeyW');await page.waitForTimeout(1150);await page.keyboard.up('KeyW');
 const inside=await page.evaluate(()=>window.__cyberlab.player.camera.position.toArray());assert.ok(inside[2]>3.6&&inside[2]<5.3,JSON.stringify(inside));
 await page.keyboard.press('KeyE');await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='moving');
 await page.waitForTimeout(1500);await page.screenshot({path:'artifacts/duplex-lift-travel.png'});
 await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='idle'&&window.__cyberlab.elevator.state.height===5);
 assert.equal(await page.evaluate(()=>window.__cyberlab.player.floorHeight),5);
 assert.equal(await page.evaluate(()=>window.__cyberlab.player.camera.position.y),6.68);
 // Exit and check that ordinary walking preserves the upstairs eye height.
 await page.keyboard.down('KeyS');await page.waitForTimeout(1050);await page.keyboard.up('KeyS');
 const upstairs=await page.evaluate(()=>window.__cyberlab.player.camera.position.toArray());assert.ok(upstairs[2]<3.1);assert.equal(upstairs[1],6.68);
 // Call the cabin to the other floor while standing safely outside the shaft.
 await page.keyboard.press('Escape');await page.evaluate(()=>window.__cyberlab.player.setView(7));await page.locator('#resume').click();
 await page.waitForFunction(()=>document.pointerLockElement);await page.keyboard.press('KeyE');
 await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='idle'&&window.__cyberlab.elevator.state.height===0);
 assert.equal(await page.evaluate(()=>window.__cyberlab.player.camera.position.y),1.68);
 await page.keyboard.down('KeyW');await page.waitForTimeout(1150);await page.keyboard.up('KeyW');
 await page.keyboard.press('KeyE');await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='moving');
 await page.waitForTimeout(700);await page.keyboard.press('Escape');
 await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='idle');
 assert.equal(await page.evaluate(()=>window.__cyberlab.player.camera.position.y),6.68);
 assert.equal(await page.evaluate(()=>window.__cyberlab.player.travelLocked),false);
 await page.locator('#resume').click();await page.waitForFunction(()=>document.pointerLockElement);
 await page.keyboard.press('KeyE');await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='moving');
 await page.waitForFunction(()=>window.__cyberlab.elevator.state.phase==='idle'&&window.__cyberlab.elevator.state.height===0);
 assert.equal(await page.evaluate(()=>window.__cyberlab.player.camera.position.y),1.68);
 const stats=await page.evaluate(()=>({state:window.__cyberlab.elevator.state,render:window.__cyberlab.renderer.info.render,contextLost:window.__cyberlab.renderer.getContext().isContextLost()}));
 assert.equal(stats.contextLost,false);assert.ok(stats.render.calls>0);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({inside,upstairs,stats,errors}));
 }finally{await browser.close();}
})();

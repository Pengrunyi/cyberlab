const path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd(),path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')]}));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.__cyberlab?.livingPanels);
  await page.bringToFront();await page.locator('#enter').click();await page.waitForFunction(()=>document.pointerLockElement);
  async function target(id,position,look){
   await page.evaluate(({position,look})=>{const p=window.__cyberlab.player;p.setView(5);p.camera.position.set(...position);p.camera.lookAt(...look);},{position,look});
   await page.waitForFunction(id=>window.__cyberlab.interaction.state.target===id,id);
   await page.keyboard.press('KeyE');await page.waitForFunction(id=>window.__cyberlab.livingPanels.active===id,id);
   assert.equal(await page.evaluate(()=>!!document.pointerLockElement),false);
  }
  async function resume(){await page.locator('#resume').click();await page.waitForFunction(()=>document.pointerLockElement);}
  await target('bed',[-2.8,6.68,-2.7],[-4.65,5.7,-3.1]);
  const before=await page.evaluate(()=>window.__cyberlab.player.camera.position.toArray());
  await page.locator('#bed-rest').click();await page.waitForFunction(()=>window.__cyberlab.living.state.restSeconds>.2);
  assert.equal(await page.evaluate(()=>window.__cyberlab.player.travelLocked),true);
  await page.screenshot({path:'artifacts/living-bed-rest.png'});
  await page.locator('#bed-wake').click();assert.deepEqual(await page.evaluate(()=>window.__cyberlab.player.camera.position.toArray()),before);
  await page.locator('#bed-rest').click();await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>window.__cyberlab.living.state.resting||window.__cyberlab.player.travelLocked),false);
  assert.deepEqual(await page.evaluate(()=>window.__cyberlab.player.camera.position.toArray()),before);await resume();
  await target('faucet',[-.65,6.68,-3.7],[-.65,6.2,-5.25]);
  await page.locator('#tap-toggle').click();await page.waitForFunction(()=>window.__cyberlab.living.state.litres>.02);
  assert.equal(await page.evaluate(()=>window.__cyberlab.scene.getObjectByName('Running tap water').visible),true);
  await page.screenshot({path:'artifacts/living-water.png'});await page.keyboard.press('Escape');await resume();
  await target('faucet',[-.65,6.68,-3.7],[-.65,6.2,-5.25]);
  assert.equal(await page.evaluate(()=>window.__cyberlab.living.state.waterOn),true);await page.locator('#tap-toggle').click();
  const litres=await page.evaluate(()=>window.__cyberlab.living.state.litres);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.__cyberlab.living.state.litres),litres);
  await page.keyboard.press('Escape');await resume();
  await target('treadmill',[2.85,6.68,-.85],[2.85,6.4,-3.7]);
  await page.locator('#stride-speed').fill('9.5');await page.locator('#stride-start').click();await page.waitForFunction(()=>window.__cyberlab.living.state.distance>.5);
  assert.equal(await page.evaluate(()=>window.__cyberlab.living.state.speed),9.5);
  await page.screenshot({path:'artifacts/living-treadmill.png'});await page.keyboard.press('Escape');await resume();
  await target('treadmill',[2.85,6.68,-.85],[2.85,6.4,-3.7]);assert.equal(await page.evaluate(()=>window.__cyberlab.living.state.running),true);
  await page.locator('#stride-stop').click();const distance=await page.evaluate(()=>window.__cyberlab.living.state.distance);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.__cyberlab.living.state.distance),distance);
  await page.keyboard.press('Escape');await resume();await page.keyboard.down('KeyS');await page.waitForTimeout(250);await page.keyboard.up('KeyS');
  assert.equal(await page.evaluate(()=>window.__cyberlab.player.camera.position.y),6.68);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({state:await page.evaluate(()=>window.__cyberlab.living.state),errors}));
 }finally{await browser.close();}
})();

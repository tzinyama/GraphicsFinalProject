//Computer Graphics final project
//Alex Rosenthal, Bryan Vaihinger, Tino Zinyama
//Climbing the Hill

"use strict";

var scene, camera, renderer;
var canvas;

// var levelElements;

var animating = false;  // This is set to true when an animation is running.

var collidableMeshList = [];

var dirVectors = [new THREE.Vector3(0,1,0), new THREE.Vector3(1,0,0),
    new THREE.Vector3(0,-1,0), new THREE.Vector3(-1,0,0)];

var clock = 0;

var cloud;

var heldKeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
}

var debugMode = false;
var testArrows = [];

//--------------------------- level support -----------------------------------

function createLevel(level){
  let layout = levelLayouts[level];
  collidableMeshList = [];

  level = new Level(layout);
  game.levelElements = level.create();
  var n = game.levelElements.length;
  for(var i = 0; i < n; i++){
    scene.add(game.levelElements[i].model);
    scene.add(game.levelElements[i].collidableMesh);

    collidableMeshList.push(game.levelElements[i].collidableMesh);
  }
}

function resetLevel(level){
  createScene();
  scene.add(camera);

  showStartMenuText(false);


  createLights();
  createLevel(level);
  game.level = level;
  game.tokensSinceLevel = game.tokens;
  render();
}

//--------------------------- level gui support -----------------------------------

function createGUI(){
  var gui = new dat.GUI();

  var parameters =
  {
    a: function() { game.goToLevel(0) },
    b: function() { game.goToLevel(1) },
    c: function() { game.goToLevel(2) },
    d: function() { game.goToLevel(3) },
    e: function() { game.goToLevel(4) },
    f: function() { game.goToLevel(5) },
    g: function() { game.goToLevel(6) },
    h: function() { game.goToLevel(7) },
    i: function() { game.goToLevel(8) }
  };
  // gui.add( parameters )
  gui.add( parameters, 'a' ).name('Level 0');
  gui.add( parameters, 'b' ).name('Level 1');
  gui.add( parameters, 'c' ).name('Level 2');
  gui.add( parameters, 'd' ).name('Level 3');
  gui.add( parameters, 'e' ).name('Level 4');
  gui.add( parameters, 'f' ).name('Level 5');
  gui.add( parameters, 'g' ).name('Level 6');
  gui.add( parameters, 'h' ).name('Level 7');
  gui.add( parameters, 'i' ).name('End Screen');

  gui.close();

}

//---------------------------debug mode---------------------------------

function toggleDebugMode(){
  if (debugMode){
      debugMode = false;
      for(var i = 0; i < game.levelElements.length; i++){
        scene.remove(game.levelElements[i].bBoxH);
      }
      scene.remove(hero.bBoxH);
      scene.remove(testArrows[0], testArrows[1], testArrows[2], testArrows[3],
        testArrows[4], testArrows[5], testArrows[6], testArrows[7]);
  }
  else {
    debugMode = true;
    for(var i = 0; i < game.levelElements.length; i++){
      scene.add(game.levelElements[i].bBoxH);
    }
    scene.add(hero.bBoxH);
  }
}

//--------------------------- scenes -----------------------------------
function startGame(){
  game.started = true;
  resetLevel(0);
}

function showStartMenuText(show){
  document.getElementById("title").innerHTML = show ? "Climbing The Hill" : "";
  document.getElementById("move_info").innerHTML = show ? "Use Arrow Keys to Move" : "";
  document.getElementById("pause_info").innerHTML = show ? "Press Esc to Pause" : "";
  document.getElementById("start").innerHTML = show ? "Click to Start" : "";

  if(show){
    document.addEventListener("click", startGame, false);
  }
  else{
    document.removeEventListener("click", startGame, false);
  }
}
function showEndScreenText(show){
  document.getElementById("You_win").innerHTML = show ? "You win!" : "";
  document.getElementById("thanks").innerHTML = show ? "Thanks for playing" : "";
  document.getElementById("madeBy").innerHTML = show ? "Made by Alex Rosenthal, Bryan Vaihinger, and Tino Zinyama" : "";
  var tokentext = "You got " + game.tokens + "/8 tokens";
  document.getElementById("finalTokens").innerHTML = show ?  tokentext : "";

  if(!show){
    document.removeEventListener("click", startGame, false);
  }
}

function createStartMenu(){
  game.started = false;

  // Set background color.
  renderer.setClearColor( 0xACE4FC );
  scene = new THREE.Scene();

  // camera = new THREE.OrthographicCamera(-12, 12, 9, -9, -10, 50);
  camera = new THREE.OrthographicCamera(-80, 80, 60, -60, -10, 50);
  camera.zoom = 7.5;
  camera.updateProjectionMatrix();

  camera.position.z = 15;
  camera.position.x = WIDTH / 2;
  camera.position.y = (HEIGHT/ 2) + 5;
  camera.lookAt(WIDTH/2, HEIGHT/2, 0);

  showStartMenuText(true);

  // hero
  var startHero = hero.model.clone();
  startHero.position.x = 3;
  startHero.position.y = 4;
  startHero.scale.set(.4, .4, .4);
  startHero.rotation.set(0,.7,0);
  startHero.children[1].rotation.x = -.25;
  scene.add(startHero);

  var startPlatform = createStonePlatformModel(0,0,true);
  startPlatform.scale.set(1,1,1);
  startPlatform.position.x = 2.75;
  startPlatform.position.y = 1.75;
  scene.add(startPlatform.clone());

  // goose model
  var goose = createGooseModel()
  goose.position.set(17, 6, 0);
  goose.scale.set(.8,.8,.8);
  goose.rotation.set(0, -.7, 0);
  scene.add(goose);

  startPlatform.position.x = 17;
  startPlatform.position.y = 2;
  scene.add(startPlatform);
}

function createScene() {
  // Set background color.
  renderer.setClearColor( 0xACE4FC );
  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(-80, 80, 60, -60, -10, 50);
  camera.zoom = 7.5;
  camera.updateProjectionMatrix();

  camera.position.z = 15;
  camera.position.x = WIDTH / 2;
  camera.position.y = (HEIGHT/ 2) + 5;
  camera.lookAt(WIDTH/2, HEIGHT/2, 0);

  // hero
  hero.model.position.x = CELL_WIDTH * 2;
  hero.model.position.y = HEIGHT;
  scene.add(hero.model);
  hero.bBoxH = new THREE.BoxHelper(hero.model.invisibleBox, 0xff00ff);

  // cloud effect
  cloud = createCloud();
  cloud.init(-100);
  scene.add(cloud.model);
}

function createLights(){
  // dim light shining from above
  scene.add( new THREE.DirectionalLight( 0xffffff, 0.4 ) );
  // a light to shine in the direction the camera faces
  var viewpointLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
  viewpointLight.position.set(0,0,1);  // shines down the z-axis
  scene.add(viewpointLight);

  var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  scene.add(hemisphereLight);

  var ambientLight = new THREE.AmbientLight(0x9999dc, .5);
  scene.add(ambientLight);
}

//--------------------------- animation support -----------------------------------

function render() {
    renderer.render(scene, camera);
}

function updateForFrame() {
  if(game.started && !game.paused){
    clock = (clock + 1)%1000000;

    if(!cloud.done) cloud.update();
    hero.update();

    var n =  game.levelElements.length;
    for(var i = 0; i < n; i++){
      game.levelElements[i].update();
    }

    if(game.levelSwitching){
      game.goToLevel(game.targetLevel);
    }
  }
}

function doFrame() {
   if (animating) {
        updateForFrame();
        render();
        requestAnimationFrame(doFrame);
  }
}

//----------------------------- keyboard support ----------------------------------

function doKey(event) {
  var code = event.code;
  var rotated = true;
  switch( code ) {
      case "ArrowLeft": heldKeys.left = true; hero.facingRight = false;  break;    // left arrow
      case "ArrowRight":  heldKeys.right = true; hero.facingRight = true; break;    // right arrow
      case "ArrowUp":  heldKeys.up = true;  break;    // up arrow
      case "Space":  heldKeys.space = true;  break;
      case "ArrowDown":  heldKeys.down = true;  break;    // down arrow
      case "Escape":  game.pause();  break;    // down arrow
      case "Enter": toggleDebugMode(); break;
  }
  if (rotated) {
    event.preventDefault();  // Prevent keys from scrolling the page.
    if (!animating) { // (if an animation is running, no need for an extra render)
      render();
    }
  }
}

function doKeyUp(event) {
  var code = event.code;
  switch( code ) {
      case "ArrowLeft": heldKeys.left = false;  break;    // left arrow
      case "ArrowRight":  heldKeys.right = false;  break;    // right arrow
      case "ArrowUp":  heldKeys.up = false; jumpRelease(); break;    // up arrow
      case "Space":  heldKeys.space = false; jumpRelease(); break;
      case "ArrowDown":  heldKeys.down = false;  break;    // down arrow
  }
}

//-------------------------------------initialization ----------------------------------

function init() {
  try {
    canvas = document.getElementById("glcanvas");
    renderer = new THREE.WebGLRenderer( {
        canvas: canvas,
        antialias: true
    } );
  }
  catch (e) {
    document.getElementById("canvas-holder").innerHTML =
             "<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
    return;
  }

  document.addEventListener("keydown", doKey, false);
  document.addEventListener("keyup", doKeyUp, false);

  createStartMenu();
  createLights();

  createGUI();
  render();
  animating = true;
  doFrame();
}

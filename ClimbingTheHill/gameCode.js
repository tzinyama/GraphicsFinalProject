//Computer Graphics final project
//Alex Rosenthal, Bryan Vaihinger, Tino Zinyama
//Climbing the Hill

"use strict";

var scene, camera, renderer;
var canvas;

var levelElements;

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
  levelElements = level.create();
  var n = levelElements.length;
  for(var i = 0; i < n; i++){
    // console.log(levelElements[i]);
    scene.add(levelElements[i].model);
    scene.add(levelElements[i].collidableMesh);

    collidableMeshList.push(levelElements[i].collidableMesh);
  }
}

function resetLevel(level){
  createScene();
  scene.add(camera);

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
    a: function() { resetLevel(0) },
    b: function() { resetLevel(1) },
    c: function() { resetLevel(2) },
    d: function() { resetLevel(3) },
    e: function() { resetLevel(4) },
    f: function() { resetLevel(5) },
    g: function() { resetLevel(6) },
    h: function() { resetLevel(7) }
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

  gui.open();

}

//---------------------------debug mode---------------------------------

function toggleDebugMode(){
  if (debugMode){
      debugMode = false;
      for(var i = 0; i < levelElements.length; i++){
        scene.remove(levelElements[i].bBoxH);
      }
      scene.remove(hero.bBoxH);
      //toggleArrows();
      console.log("disable debug");
  }
  else {
    debugMode = true;
    for(var i = 0; i < levelElements.length; i++){
      scene.add(levelElements[i].bBoxH);
    }
    scene.add(hero.bBoxH);
    //toggleArrows();
    console.log("enable debug");
  }
}

//--------------------------- scenes -----------------------------------

function createScene() {
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

  // hero
  hero.model.position.x = CELL_WIDTH * 2;
  hero.model.position.y = HEIGHT;
  scene.add(hero.model);
  hero.bBoxH = new THREE.BoxHelper(hero.model, 0xff00ff);

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
  if(!game.paused){
    clock = (clock + 1)%1000000;

    if(!cloud.done) cloud.update();
    hero.update();

    var n =  levelElements.length;
    for(var i = 0; i < n; i++){
      levelElements[i].update();
    }

    if(game.levelSwitching){
      game.nextLevel();
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

function doAnimateCheckbox() {
   var anim = document.getElementById("animate").checked;
   if (anim != animating) {
      animating = anim;
      if (animating) {
         doFrame();
      }
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
      case "Escape":  game.pause();  break;
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
  document.getElementById("animate").checked = true;
  document.getElementById("animate").onchange = doAnimateCheckbox;

  createScene();
  createLights();
  createLevel(0);

  createGUI();
  render();
  doAnimateCheckbox();
}

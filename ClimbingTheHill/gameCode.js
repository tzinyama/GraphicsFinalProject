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

<<<<<<< HEAD
var snowPlatforms = [];
var geese = [];
var tokens = [];
=======
>>>>>>> intergration
var cloud;

var heldKeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
}

//--------------------------- level support -----------------------------------

function createLevel(level){
  let layout = levelLayouts[level];
  collidableMeshList = [];

  level = new Level(layout);
  levelElements = level.create();
  var n = levelElements.length;
  for(var i = 0; i < n; i++){
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
    f: function() { resetLevel(5) }
  };
  // gui.add( parameters )
  gui.add( parameters, 'a' ).name('Test Level');
  gui.add( parameters, 'b' ).name('Level 1');
  gui.add( parameters, 'c' ).name('Level 2');
  gui.add( parameters, 'd' ).name('Level 3');
  gui.add( parameters, 'e' ).name('Level 4');
  gui.add( parameters, 'f' ).name('Level 5');

  gui.open();

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

<<<<<<< HEAD
function createWorld() {
   // Create the game world

   var worldModel = new THREE.Object3D();

   var platform = new THREE.Mesh(
            new THREE.BoxGeometry(20,1,1.5),
            new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
          );
   collidableMeshList[0] = platform;


   var platform2 = new THREE.Mesh(
               new THREE.BoxGeometry(5,1,1.5),
               new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
             );
             platform2.position.x += 4;
             platform2.position.y += 3;
    collidableMeshList[1] = platform2;



    var platform3 = new THREE.Mesh(
                new THREE.BoxGeometry(1.5,3,1.5),
                new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
              );
              platform3.position.x -= 6;
              platform3.position.y += 1;
     collidableMeshList[2] = platform3;

     testPlat = new THREE.Mesh(
                new THREE.BoxGeometry(.8,2,.1),
                new THREE.MeshLambertMaterial( { color: 0xff00ff } )
              );
              testPlat.position.y -=1;
              testPlat.position.z+=1;

      var deathPlat = new THREE.Mesh(
                  new THREE.BoxGeometry(2,1,1),
                  new THREE.MeshLambertMaterial( { color: 0xff0033 } )
                );
                deathPlat.position.x += 10;
                deathPlat.position.y += .5;



   platform.position.y = -0.5; // Puts top of cylinder just below the xz-plane.
   platform.solid = true;
   platform2.solid = true;
   platform3.solid = true;
   worldModel.add(platform);   //0 child
   worldModel.add(platform2);
   worldModel.add(platform3);
   //worldModel.add(deathPlat);
   //worldModel.add(testPlat);

   hero.model.position.y += hero.hHeight/2;
   worldModel.add(hero.model);
   var goose1 = createGoose(1.5,3,1.5,6.5,false);
   worldModel.add(goose1.model);
   collidableMeshList.push(goose1.model.torso.base);
   geese[0] = goose1;
   var goose2 = createGoose(-5,5,-10,-5,true);
   worldModel.add(goose2.model);
   collidableMeshList.push(goose2.model.torso.base);
   geese[1] = goose2;

   var snowPlatform1 = createSnowPlatform(-9,5,3);
   worldModel.add(snowPlatform1.model);
   collidableMeshList.push(snowPlatform1.model.base);
   snowPlatforms[0] = snowPlatform1;

   var snowPlatform1 = createSnowPlatform(9,7,3,1);
   worldModel.add(snowPlatform1.model);
   collidableMeshList.push(snowPlatform1.model.base);
   snowPlatforms[1] = snowPlatform1;

   var stonePlatform1 = createStonePlatform(-2.2,8);
   worldModel.add(stonePlatform1.model);
   collidableMeshList.push(stonePlatform1.model.base);
   stonePlatform1 = createStonePlatform(-1,8);
   worldModel.add(stonePlatform1.model);
   collidableMeshList.push(stonePlatform1.model.base);
   stonePlatform1 = createStonePlatform(.2,8);
   worldModel.add(stonePlatform1.model);
   collidableMeshList.push(stonePlatform1.model.base);

   var token1 = createToken(-1,9);
   worldModel.add(token1.model);
   collidableMeshList.push(token1.model.base);
   tokens.push(token1);
   token1 = createToken(6,0);
   worldModel.add(token1.model);
   collidableMeshList.push(token1.model.base);
   tokens.push(token1);
   token1 = createToken(9,7);
   worldModel.add(token1.model);
   collidableMeshList.push(token1.model.base);
   tokens.push(token1);
   token1 = createToken(-9,5);
   worldModel.add(token1.model);
   collidableMeshList.push(token1.model.base);
   tokens.push(token1);

   cloud = createCloud();
   cloud.init(-100,0);
   worldModel.add(cloud.model);

   var tempBox = new THREE.Box3().setFromObject(goose.model);
   //collidableMeshList[4] = goose.model;
   return worldModel;

}
=======
//--------------------------- animation support -----------------------------------
>>>>>>> intergration

function render() {
    renderer.render(scene, camera);
}

function updateForFrame() {
<<<<<<< HEAD

  if(!game.paused){
    if (currentModel == WORLD) {
      clock = (clock + 1)%1000000;
      hero.update();
      game.update();
      for(var i = 0; i < snowPlatforms.length; i++){
        snowPlatforms[i].update();
      }
      for(var i = 0; i < tokens.length; i++){
        tokens[i].update();
      }
      for(var i = 0; i < geese.length; i++){
        geese[i].update();
      }
      if(!cloud.done) cloud.update();
=======
  if(!game.paused){
    clock = (clock + 1)%1000000;

    if(!cloud.done) cloud.update();
    hero.update();

    var n =  levelElements.length;
    for(var i = 0; i < n; i++){
      levelElements[i].update();
>>>>>>> intergration
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

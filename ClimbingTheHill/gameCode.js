//Computer Graphics final project
//Alex Rosenthal, Bryan Vaihinger, Tino Zinyama
//Climbing the Hill

"use strict";

var scene, camera, renderer;  // Three.js rendering basics.

var canvas;  // The canvas on which the image is rendered.

var STARTER = 0;
var PINE = 1;
var AXLE = 2;
var CAR = 3;
var WORLD = 4;

// Contains the visible objects in the scene, but not the lights or camera.
// The current model can be rotated using the keyboard.
var models = [];

// Index of the current visible objects in the scene: one of the many models
// defined by the above constant
var currentModel = WORLD;


// Nodes in the scene graphs that are modified as part of the animation:
var sphereRotator;  // The sphere is a child of this object; rotating
                    // this object about the y-axis rotates the sphere.

var animating = false;  // This is set to true when an animation is running.

var collidableMeshList = [];

var dirVectors = [new THREE.Vector3(0,1,0), new THREE.Vector3(1,0,0),
    new THREE.Vector3(0,-1,0), new THREE.Vector3(-1,0,0)];

var testPlat;

var clock = 0;

var heldKeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
}

/*  Create the scene graph.  This function is called once, as soon as the page loads.
 *  The renderer has already been created before this function is called.
 */
function createScene() {
  // Set background color.
  renderer.setClearColor( 0xACF3FC );
  scene = new THREE.Scene();

  // create a camera, sitting on the positive z-axis.  The camera is not part of the scene.
  // camera = new THREE.PerspectiveCamera(45, canvas.width/canvas.height, 1, 30);
  camera = new THREE.OrthographicCamera(-12, 12, 9, -9, 1, 30);
  camera.position.z = 15;
  camera.position.y = 4;
  camera.lookAt(new THREE.Vector3(0,0,0));

  // create some lights and add them to the scene.

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
  // //create the model
  // var model = createTree();
  //
  // models[STARTER] = model;

  var world = createWorld();
  models[WORLD] = world;
  models[currentModel].rotation.set(0,0,0);
  models[currentModel].position.y -= 2
  scene.add(models[WORLD]);
}

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
       collidableMeshList[3] = goose.model.torso.tail;


   platform.position.y = -0.5; // Puts top of cylinder just below the xz-plane.
   worldModel.add(platform);   //0 child
   worldModel.add(platform2);
   worldModel.add(platform3);
   //worldModel.add(deathPlat);
   //worldModel.add(testPlat);

   hero.model.position.y += hero.hHeight/2;
   worldModel.add(hero.model);
   initGoose(1.5,3,1.5,6.5,false);
   worldModel.add(goose.model);
   worldModel.add(snowPlatform.model);
   collidableMeshList[4] = snowPlatform.model.base;
   var tempBox = new THREE.Box3().setFromObject(goose.model);
   //collidableMeshList[4] = goose.model;
   return worldModel;

}

//Sets a goose at position (x,y), which walks back and forth between xmin and xmax
function initGoose(x,y,xmin,xmax,flying){
  var scale = .25;
  if(flying){
    goose.flyingModel();
    goose.flying = true;
  }
  goose.model.scale.set(scale,scale,scale);
  goose.x = x;
  goose.y = y;
  goose.y += scale* 4.2;
  goose.xmin = xmin;
  goose.xmax = xmax;

}


/*  Render the scene.  This is called for each frame of the animation.
 */
function render() {
    renderer.render(scene, camera);
}


/*  When an animation is in progress, this function is called just before rendering each
 *  frame of the animation, to make any changes necessary in the scene graph to prepare
 *  for that frame.
 */
function updateForFrame() {

  if (currentModel == WORLD) {
    clock = (clock + 1)%1000000;
    hero.update();
    goose.update();
  }
}



//--------------------------- animation support -----------------------------------

/* This function runs the animation by calling updateForFrame() then calling render().
 * Finally, it arranges for itself to be called again to do the next frame.  When the
 * value of animating is set to false, this function does not schedule the next frame,
 * so the animation stops.
 */
function doFrame() {
   if (animating) {
        updateForFrame();
        render();
        requestAnimationFrame(doFrame);
  }
}


/* Responds when the setting of the "Animate" checkbox is changed.
 * This function will start or stop the animation, depending on its setting.
 */
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

/*  Responds to user's key press.  Here, it is used to rotate the model.
 */
function doKey(event) {
  var code = event.code;
  var rotated = true;
  switch( code ) {
      case "ArrowLeft": heldKeys.left = true; hero.facingRight = false;  break;    // left arrow
      case "ArrowRight":  heldKeys.right = true; hero.facingRight = true; break;    // right arrow
      case "ArrowUp":  heldKeys.up = true;  break;    // up arrow
      case "Space":  heldKeys.space = true;  break;
      case "ArrowDown":  heldKeys.down = true;  break;    // down arrow
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


//------------------ handle the radio buttons that select the model-------------------------

/*  Changes the model that is displayed, when the user changes the setting of
 *  radio buttons that are used to select the model.  The model is reset to
 *  its initial rotation.
 */

function doChangeModel() {
   // var axle = document.getElementById("axle").checked;
   // var car = document.getElementById("car").checked;
   var diskworld = document.getElementById("diskworld").checked;

   // var newModel = axle ? AXLE : car ? CAR : diskworld ? WORLD : STARTER;
   var newModel = WORLD;

   if (newModel != currentModel) {
      scene.remove(models[currentModel]);
      currentModel = newModel;
      models[currentModel].rotation.set(0.2,0,0);
      scene.add( models[currentModel]);
      if (!animating) {
         render();
      }
   }
}

/**
 *  This init() function is called when by the onload event when the document has loaded.
 */
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
  document.getElementById("diskworld").checked = true;
  //
  // document.getElementById("axle").onchange = doChangeModel;
  // document.getElementById("car").onchange = doChangeModel;
  document.getElementById("diskworld").onchange = doChangeModel;
  // document.getElementById("starter").onchange = doChangeModel;

  createScene();
  render();
  doAnimateCheckbox();
}

"use strict";

var scene, camera, renderer;  // Three.js rendering basics.
var canvas;
var level, levelElements;
var levelLayouts = [];

var animating = true;

//--------------------------- level definitions -----------------------------------

var level = `
................|...
.........<->..#####.
....................
.oo...........o.|.o.
.##..<->......######
....................
...oo...........o...
..######.......###..
.........|..oo..|.o.
###########....#####
`;
levelLayouts.push(level);

var level = `
.............oo.....
...oo......#####....
.######.............
..oo......|.........
....<->...#####.|.o.
................####
....oo..........o...
..######.....|.####.
.o.|.oo......|.oo.|.
####....<->..#######
`;
levelLayouts.push(level);

var level = `
.............oo.....
.##........#####....
.....<->............
..oo....####........
.####........##.|.o.
.......<->......####
....oo..............
..######...<->......
..ooo.|........|.o..
#######....##..#####
`;
levelLayouts.push(level);

var level = `
.............oo.....
....o......#####....
...<->..............
..oo................
.####.....####...oo.
................####
.........oo.........
......<->...........
...##...|..|....##..
##......|..|..##....
`;
levelLayouts.push(level);

var level = `
....oo..........o...
..######.......###..
....|..........|oo..
#######....#########
.............oo.....
...oo......#####....
.######.....|......#
..oo........|.......
.####.....#####...o.
.................###
`;
levelLayouts.push(level);

//--------------------------- level definitions -----------------------------------


function createLevel(level){
  let layout = levelLayouts[level];

  level = new Level(layout);
  levelElements = level.create();
  var n = levelElements.length;

  for(var i = 0; i < n; i++){
    scene.add(levelElements[i].model);
  }
}

function resetLevel(level){
  createScene();
  scene.add(camera);

  createLights();
  createLevel(level);
  render();
}

function createGUI(){
  var gui = new dat.GUI();

  var parameters =
  {
    a: function() { resetLevel(0) },
    b: function() { resetLevel(1) },
    c: function() { resetLevel(2) },
    d: function() { resetLevel(3) },
    e: function() { resetLevel(4) }

  };
  // gui.add( parameters )
  gui.add( parameters, 'a' ).name('Level 1');
  gui.add( parameters, 'b' ).name('Level 2');
  gui.add( parameters, 'c' ).name('Level 3');
  gui.add( parameters, 'd' ).name('Level 4');
  gui.add( parameters, 'e' ).name('Level 5');

  gui.open();

}

//--------------------------- scene creation -----------------------------------

function createScene() {
  // background
  renderer.setClearColor( 0xBBBBBB );
  scene = new THREE.Scene();

  // camera
  camera = new THREE.OrthographicCamera(-500, 500, 250, -250, 1, 30);

  // TODO: investigate these values further
  camera.position.z = 15;
  camera.position.x = WIDTH / 2;
  camera.position.y = HEIGHT/ 2;
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
  // do something
}

function doFrame() {
   if (animating) {
        updateForFrame();
        render();
        requestAnimationFrame(doFrame);
  }
}

//--------------------------- initialize game -----------------------------------

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

  createScene();
  createLights();
  createGUI();
  createLevel(0);

  render();
  doFrame();
}

"use strict";

var scene, camera, renderer;  // Three.js rendering basics.
var canvas;

var animating = true;

//--------------------------- level editing -----------------------------------

var WIDTH = 1000;
var HEIGHT = 500;

var NUM_GRID_ROWS = 10;
var NUM_GRID_COLS = 20;

var CELL_WIDTH = WIDTH / NUM_GRID_COLS;
var CELL_HEIGHT = HEIGHT / NUM_GRID_ROWS;

var PLATFORM = "#";
var WALL = '|';
var COIN = "o";

var level1 = `
................|...
....####....#####...
....................
..oo.......ooo.|....
.####.....######..##
....................
...oo...........o...
..######.......###..
.........|..oo..|.o.
###########....#####
`;

var level2 = `
.............oo.....
...oo......#####....
.######.............
..oo......|.........
.####.....#####.|.o.
................####
....oo..........o...
..######.....|.####.
....o.|......|.oo.|.
#######....#########
`;

var level3 = `
.............oo.....
.##........#####....
.....##.............
..oo....####........
.####........##.|.o.
........##......####
....oo..............
..######..##...##...
..ooo.|........|.o..
#######....##..#####
`;

var level4 = `
.............oo.....
...oo......#####....
.######.............
..oo................
.####.....####...oo.
................####
.........oo.........
......##....##......
...##...|..|....##..
##......|..|..##....
`;

var level5 = `
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

function createGameElement(item, row, col){
	// row 0 is the last line of the level string
  var material;
  var geometry;

  if(item === PLATFORM){
		material = new THREE.MeshLambertMaterial( { color: 0x00CC55 } );
    geometry = new THREE.BoxGeometry(CELL_WIDTH, CELL_HEIGHT/2, 0);
  }
  else if(item === WALL){
    material = new THREE.MeshLambertMaterial( { color: 0x00CC55 } );
    geometry = new THREE.BoxGeometry(CELL_WIDTH/2 + CELL_WIDTH/4, CELL_HEIGHT + CELL_HEIGHT/2, 0);
  }
  else if(item === COIN){
		material = new THREE.MeshLambertMaterial( { color: 0xFFFF00 } );
    geometry = new THREE.SphereGeometry(CELL_WIDTH/4,20,20);
  }

  var gameElement = new THREE.Mesh(geometry, material);

  var x = (col * CELL_WIDTH) + CELL_WIDTH / 2 ;
  var y = (row * CELL_HEIGHT) + CELL_HEIGHT / 2;

  gameElement.position.x = x;
  gameElement.position.y = y;

  return gameElement;
}

function createLevel(layout){
  let grid = layout.trim().split("\n").map(l => [...l]);
  let numRows = grid.length;
  let numCols = grid[0].length;

  var char;
  for(var row = 0; row < numRows; row++){
    for(var col = 0; col < numCols; col++){
      char = grid[row][col];

      if(char !== "."){
				// numRows-1-col: createGameElement considers row 0 to be last line of level string
        scene.add(createGameElement(char, numRows-1-row, col));
      }
    }
  }
}

function resetLevel(level){
  alert("Switching Levels");
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
    a: function() { resetLevel(level1) },
    b: function() { resetLevel(level2) },
    c: function() { resetLevel(level3) },
    d: function() { resetLevel(level4) },
    e: function() { resetLevel(level5) }

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
  camera = new THREE.OrthographicCamera(-500, 500, 250, -250, 1, 1000);

  // TODO: investigate these values further
  camera.position.z = 50;
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
  createLevel(level1);

  render();
  doFrame();
}

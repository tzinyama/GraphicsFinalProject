"use strict";

var scene, camera, renderer;  // Three.js rendering basics.
var canvas;

var animating = true;

//--------------------------- level editing -----------------------------------

var WIDTH = 1000;
var HEIGHT = 1000;

var NUM_GRID_ROWS = 20;
var NUM_GRID_COLS = 10;

var CELL_WIDTH = WIDTH / NUM_GRID_COLS;
var CELL_HEIGHT = HEIGHT / NUM_GRID_COLS;

var PLATFORM = "#";
var COIN = "o";

var level1 = `
....................
....####....#####...
....................
..oo.......ooo......
.####.....######..##
....................
...oo...........o...
..######.......###..
............oo......
####################
`;

var level2 = `
.............oo.....
...oo......#####....
.######.............
..oo................
.####.....#####...o.
.................###
....oo..........o...
..######.......###..
...............oo...
#######....#########
`;


function createGameElement(item, row, col){
	// row 0 is the last line of the level string
  var material;
  var geometry;

  if(item === PLATFORM){
		material = new THREE.MeshLambertMaterial( { color: 0x00CC55 } );
    geometry = new THREE.BoxGeometry(CELL_WIDTH,CELL_HEIGHT/2,0);
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

//--------------------------- scene creation -----------------------------------

function createScene() {
  // background
  renderer.setClearColor( 0xBBBBBB );
  scene = new THREE.Scene();

  // camera
  camera = new THREE.OrthographicCamera(-1000, 1000, 500, -500, 1, 1000);

  // TODO: investigate these values further
  camera.position.z = 100;
  camera.position.x = WIDTH;
  camera.position.y = HEIGHT / 2;

  // lights
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
  createLevel(level1);
  render();
  doFrame();
}

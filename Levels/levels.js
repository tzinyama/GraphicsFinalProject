var WIDTH = 800;
var HEIGHT = 600;

var NUM_GRID_ROWS = 15;
var NUM_GRID_COLS = 20;

var CELL_WIDTH = WIDTH / NUM_GRID_COLS;
var CELL_HEIGHT = HEIGHT / NUM_GRID_ROWS;

var NOTHING = '.';
var PLATFORM = "#";
var WALL = '|';
var COIN = "o";

// always define a live platform as <->; Live platforms have standardized length
var LIVE_PLATFORM = "-";
var LIVE_PLATFORM_START = '<';
var LIVE_PLATFORM_END = '>';

//------------------------------Functions to create ----------------------------//

function createStonePlatform(){
  var model = new THREE.Object3D();

  var geomBase = new THREE.BoxGeometry(4,4.3,4);
  var matBase = new THREE.MeshPhongMaterial(
                          {color:0x888888, shading:THREE.FlatShading });
  model.base = new THREE.Mesh(geomBase,matBase);
  model.add(model.base);

  var matStone1 = new THREE.MeshPhongMaterial(
                          {color:0x506065, shading:THREE.FlatShading });
  var matStone2 = new THREE.MeshPhongMaterial(
                          {color:0x888888, shading:THREE.FlatShading });

  var geomBrick1 = new THREE.BoxGeometry(2,1.2,1.5);
  var brick1 = new THREE.Mesh(geomBrick1, matStone1);
  brick1.position.z = 1.5;
  brick1.position.x = -.75;
  brick1.position.y = 1.5;
  model.add(brick1.clone());
  brick1.scale.set(.5,1,1);
  brick1.position.x += 2;
  model.add(brick1.clone());
  brick1.scale.set(1.3,1.2,1);
  brick1.position.y -= 1.5;
  brick1.position.x -= .5;
  model.add(brick1.clone());
  brick1.scale.set(.4,1.2,1);
  brick1.position.x -= 2;
  model.add(brick1.clone());
  brick1.scale.set(1.5,.75,1);
  brick1.position.y-=1.4;
  brick1.position.x += .75;
  model.add(brick1.clone());
  brick1.scale.set(.3,.75,1);
  brick1.position.x += 2;
  model.add(brick1.clone());
  brick1.scale.set(1.3,1,1);
  brick1.position.y = 1.5;
  brick1.position.z = -.5;
  brick1.position.x -= .85;
  model.add(brick1.clone());
  brick1.scale.set(.5,1,1);
  brick1.position.x -= 2;
  model.add(brick1.clone());


  model.position.y = 5;
  model.position.x = -8;


  model.scale.set(10,10,10);
  return model;
}

//------------------------------Pre-made game objects ----------------------------//

var platform = createStonePlatform();
// var platform = new THREE.Mesh(
//   new THREE.BoxGeometry(CELL_WIDTH, CELL_HEIGHT/2, 0),
//   new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
// );

var livePlatform = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH * 3, CELL_HEIGHT/2, CELL_WIDTH/2),
  new THREE.MeshLambertMaterial( { color: 0xAA0000 } )
);

var wall = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH/2 + CELL_WIDTH/4, CELL_HEIGHT + CELL_HEIGHT/2, CELL_WIDTH/2),
  new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
);

var coin = new THREE.Mesh(
  new THREE.SphereGeometry(CELL_WIDTH/4,20,20),
  new THREE.MeshLambertMaterial( { color: 0xFFFF00 } )
);

//------------------------------object class definitions ----------------------------//

class Platform{
  constructor(x, y, isLive){
    this.x = x;
    this.y = y;
    this.isLive = isLive;

    this.model = isLive ? livePlatform.clone() : platform.clone();
    this.model.position.set(x, y, 0);
  }

  update(){
    if(this.isLive){
      // do something

    }
  }

  onCollide(){
    // do something
  }
}

class Wall{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.isLive = false;

    this.model = wall.clone();
    this.model.position.set(x, y, 0);
  }

  onCollide(){
    // do something
  }
}

class Coin{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.isLive = true;

    this.model = coin.clone();
    this.model.position.set(x, y, 0);
  }

  update(){
    this.model.rotation.y += 0.5;
  }

  onCollide(){
    // do something
  }
}

//------------------------------level class definitions ----------------------------//

class Level{
  // layout is a string
  constructor(layout){
    this.layout = layout;
    this.levelItems = [];
  }

  create(){
    let grid = this.layout.trim().split("\n").map(l => [...l]);
    let numRows = grid.length;
    let numCols = grid[0].length;

    var char;
    for(var row = 0; row < numRows; row++){
      for(var col = 0; col < numCols; col++){
        char = grid[row][col];

        if(!(char === NOTHING || char == LIVE_PLATFORM_START || char === LIVE_PLATFORM_END)){
  				// numRows-1-col: createGameElement considers row 0 to be last line of level string
          this.levelItems.push(this.createGameElement(char, numRows-1-row, col));
        }
      }
    }
    return this.levelItems;
  }

  createGameElement(item, row, col){
    var x = (col * CELL_WIDTH) + CELL_WIDTH / 2 ;
    var y = (row * CELL_HEIGHT) + CELL_HEIGHT / 2;

    var element;
    if(item === PLATFORM){
      element = new Platform(x, y, false);
    }
    else if(item === LIVE_PLATFORM){
      element = new Platform(x, y, true); // true for isLive
    }
    else if(item === WALL){
      element = new Wall(x, y);
    }
    else if(item === COIN){
  	  element = new Coin(x, y);
    }
    return element;
  }
}

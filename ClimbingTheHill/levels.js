var WIDTH = 20;
var HEIGHT = 16;

var NUM_GRID_ROWS = 15;
var NUM_GRID_COLS = 20;

var CELL_WIDTH = WIDTH / NUM_GRID_COLS;
var CELL_HEIGHT = HEIGHT / NUM_GRID_ROWS;

var NOTHING = '.';
var PLATFORM = "#";
var WALL = '|';
var COIN = "o";
var GOOSE = "G";
var FLYING_GOOSE = "F";

// always define a live platform as <->; Live platforms have standardized length
var LIVE_PLATFORM = "-";
var LIVE_PLATFORM_START = '<';
var LIVE_PLATFORM_END = '>';

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
  	  element = new Token(x, y);
    }
    return element;
  }
}
var WIDTH = 20;
var HEIGHT = 16;

var NUM_GRID_ROWS = 15;
var NUM_GRID_COLS = 20;

var CELL_WIDTH = WIDTH / NUM_GRID_COLS;
var CELL_HEIGHT = HEIGHT / NUM_GRID_ROWS;

var PLAYER_SPAWN = '@';
var GOAL = '$';

var NOTHING = '.';
var PLATFORM = "#";
var PLATFORMNOSNOW = "="
var WALL = '|';
var COIN = "o";
var GOOSE = "G";
var FLYING_GOOSE = "F";

// always define a live platform as <->; Live platforms have standardized length
var LIVE_PLATFORM = "-";
var LIVE_PLATFORM_START = '<';
var LIVE_PLATFORM_END = '>';

//------------------------------level layouts ----------------------------//

var levelLayouts = [];

var level1 = `
....................
..$o..............o.
..##.............###
..............G.....
.....<->....#####...
....................
.ooo............o...
#####....F....######
....................
................ooo.
.................G..
..F.....ooo....#####
........<->........=
@....#.......#..ooo=
#####=.......=#####=
`;
levelLayouts.push(level1);


var level2 = `
................$...
................#...
.........<->..##=##.
....................
....................
.oo...........o.#.o.
.##..<->......##=###
....................
....................
...oo..@........o...
..######.......###..
....................
....................
.........#..oo..#.o.
#########=#....#=###
`;
levelLayouts.push(level2);

var level3 = `
.............G......
...oo......#####....
....................
.######.............
....................
..oo......#.........
....<->...=####.#.o.
..................@.
................####
....................
....G..........o....
..#####.....#.####..
.............#......
.o.#.oo......=.oo.#.
###=....<->..=####=#
`;
levelLayouts.push(level3);

var level4 = `
.............oo.....
.##........#####....
....................
.....<->............
....................
..oo....####........
....................
.####........##.#.o.
.......<->......=###
....................
....oo..............
..######...<->......
....................
@.ooo.#........#.o..
######=....##..=####
`;
levelLayouts.push(level4);

var level5 = `
.............oo.....
....o......#####....
....................
...<->..............
....................
..oo................
.####.....####...oo.
....................
................####
.........oo.........
......<->...........
..................@.
...##...#..#......##
##......=..=..##....
..................##
`;
levelLayouts.push(level5);

var level6 = `
....................
..@.oo..........o...
..######.......###..
....=..........=....
....=..........=oo..
####=##....####=####
....................
.............oo.....
...oo......#####....
.######.....=......#
............=.......
..oo........=.......
.####.....##=##...o.
....................
.................###
`;
levelLayouts.push(level6);

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

        if(!(char === NOTHING || char == LIVE_PLATFORM_START || char === LIVE_PLATFORM_END || char === PLAYER_SPAWN)){
  				// numRows-1-col: createGameElement considers row 0 to be last line of level string
          this.levelItems.push(this.createGameElement(char, numRows-1-row, col));
        } else if(char == PLAYER_SPAWN){
          hero.x = (col * CELL_WIDTH) + CELL_WIDTH / 2;
          hero.y = (numRows-1-row * CELL_HEIGHT) + CELL_HEIGHT / 2;
          hero.spawnX = hero.x;
          hero.spawnY = hero.y;
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
      element = new Platform(x, y, false,true);
    } else if(item === PLATFORMNOSNOW){
      element = new Platform(x, y, false,false);
    }
    else if(item === GOAL){
      element = new Sign(x, y);
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
    else if(item === GOOSE){
      element = new Goose(x, y, x-CELL_WIDTH*2, x+CELL_WIDTH*2, false);
    }
    else if(item === FLYING_GOOSE){
      element = new Goose(x, y, x-CELL_WIDTH*2, x+CELL_WIDTH*2, true);
    }

    return element;
  }
}

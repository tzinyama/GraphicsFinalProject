"use strict";

function createWallModel(x,y, snowy){

  return new THREE.Mesh(
    new THREE.BoxGeometry(CELL_WIDTH/2 + CELL_WIDTH/2, CELL_HEIGHT + CELL_HEIGHT/2, CELL_WIDTH/2),
    new THREE.MeshLambertMaterial( { color: 0x00BB00 } )
  );
}

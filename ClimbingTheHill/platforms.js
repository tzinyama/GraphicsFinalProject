"use strict";

var stonePlatform = {
  x: 0,
  y: 0,
  model: createStonePlatform(),
  update: function(){
    // this.model.rotation.x += .005;

  }

}


//Stony Platform/////////////////////////////////////////////
function createStonePlatform(){
  var model = new THREE.Object3D();

  var geomBase = new THREE.BoxGeometry(4,4,4);
  var matBase = new THREE.MeshPhongMaterial(
                          {color:0x888888, shading:THREE.FlatShading});
  model.base = new THREE.Mesh(geomBase,matBase);
  model.add(model.base);

  var matStone1 = new THREE.MeshPhongMaterial(
                          {color:0x506065, shading:THREE.FlatShading});
  var matStone2 = new THREE.MeshPhongMaterial(
                          {color:0x888888, shading:THREE.FlatShading});

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


  console.log(model);
  model.position.y = 5;
  model.position.x = -8;
  model.scale.set(.3,.3,.3);
  return model;
}

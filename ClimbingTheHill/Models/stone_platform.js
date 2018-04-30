"use strict";

function createStonePlatformModel(x,y,snowy){
  var model = new THREE.Object3D();

  var geomBase = new THREE.BoxGeometry(4,4.3,4);
  var matBase = new THREE.MeshPhongMaterial(
                          {color:0x888888});
  model.base = new THREE.Mesh(geomBase,matBase);
  model.base.solid = true;
  model.add(model.base);

  var matStone1 = new THREE.MeshPhongMaterial(
                          {color:0x506065});
  var matSnow = new THREE.MeshPhongMaterial(
                          {color:0xCCCCCC});

  var geomBrick1 = new THREE.BoxGeometry(2,1,1.5);
  var brick1 = new THREE.Mesh(geomBrick1, matStone1);
  brick1.position.z = 1.5;
  brick1.position.x = -.75;
  brick1.position.y = 1.4;
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
  if(snowy){
    var geomSnow = new THREE.BoxGeometry(4.5,.6,4.7);
    var snow = new THREE.Mesh(geomSnow, matSnow);
    snow.position.y = 2;
    model.snow = snow;
    model.add(model.snow);
  }

  model.position.x = x;
  model.position.y = y;
  model.scale.set(.25,.25,.25);
  return model;
}

function createStonePlatformCollidable(){
  var geomBase = new THREE.BoxGeometry(4,4,4);
  var matBase = new THREE.MeshPhongMaterial(
                          {color:0x888888});
  var base = new THREE.Mesh(geomBase,matBase);
  base.scale.set(.25,.25,.25);
  return base;
}

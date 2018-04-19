"use strict";

var stonePlatform = {
  x: 0,
  y: 0,
  model: createStonePlatform(),
  update: function(){
    this.model.rotation.x += .005;

  }

}


//Stony Platform/////////////////////////////////////////////
function createStonePlatform(){
  var model = new THREE.Object3D();

  var geomBase = new THREE.BoxGeometry(4,4.3,4);
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


  //console.log(model);
  model.position.y = 5;
  model.position.x = -8;
  model.scale.set(.3,.3,.3);
  return model;
}

var snowPlatform = {
  x: -1,
  y: 3,
  w: 5,
  model: createSnowPlatform(3,-9,5,0),
  update: function(){
    //this.model.rotation.x += .005;

  }

}

function createSnowPlatform( wid, x, y, seed ){

  var model = new THREE.Object3D();

  var matSnow = new THREE.MeshPhongMaterial(
                          {color:0xCCCCCC, shading:THREE.FlatShading});
  var geomBase = new THREE.BoxGeometry(wid, 1, 5);
  model.base = new THREE.Mesh(geomBase,matSnow);
  model.base.position.y-=.5;
  model.add(model.base);

// Icicles
  var geomPyramid = new THREE.Geometry();

  geomPyramid.vertices = [
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 1, 0 ),
      new THREE.Vector3( 1, 1, 0 ),
      new THREE.Vector3( 1, 0, 0 ),
      new THREE.Vector3( 0.5, 0.5, 1),
  ];

  geomPyramid.faces = [
      new THREE.Face3( 0, 1, 2 ),
      new THREE.Face3( 0, 2, 3 ),
      new THREE.Face3( 1, 0, 4 ),
      new THREE.Face3( 2, 1, 4 ),
      new THREE.Face3( 3, 2, 4 ),
      new THREE.Face3( 0, 3, 4 )
  ];
  var pyramid = new THREE.Mesh(geomPyramid, matSnow);

  pyramid.scale.set(.5,.5,1.5);
  pyramid.rotation.z = (Math.PI/4);
  pyramid.rotation.x = (Math.PI/2);
  pyramid.position.y = -.5;

  var icicle = new THREE.Object3D();
  icicle.add(pyramid);

  if(seed == 0 || seed == undefined){
    icicle.scale.set(.5,1.5,.5);
    icicle.position.y = -.5;
    icicle.position.x = -(wid/2)+wid/5;
    model.add(icicle.clone());

    icicle.position.y = .5;
    icicle.position.x = -(wid/2)+wid/12;
    model.add(icicle.clone());

    icicle.position.x = (wid/2)-wid/12;
    model.add(icicle.clone());
  }else if(seed == 1){
    icicle.scale.set(.5,1.5,.5);
    icicle.position.y = 0;
    icicle.position.x = (wid/2)-wid/6;
    model.add(icicle.clone());

    icicle.position.y = 1;
    icicle.position.x = -(wid/2)+wid/5;
    model.add(icicle.clone());

    icicle.position.y = 0;
    icicle.position.x = wid/5;
    model.add(icicle.clone());
  }

  model.scale.set(1,.3,.3);
  model.position.x = x;
  model.position.y = y;

  return model;
}

"use strict";

function createStonePlatform(x,y,snowy){
  var stonePlatform = {
    x: 0,
    y: 0,
    model: undefined,
    snowy: false,
    update: function(){
      this.model.rotation.x += .005;

    },
    init: function(x,y,snowy){
      this.x = x;
      this.y = y;
      if(snowy == undefined) snowy = true;
      this.snowy = snowy;
      this.model = createStonePlatformModel(x,y,snowy);
    }
  }
  stonePlatform.init(x,y,snowy);
  return stonePlatform;
}

function createStonePlatformModel(x,y,snowy){
  var model = new THREE.Object3D();

  var geomBase = new THREE.BoxGeometry(4,4,4);
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
    var geomSnow = new THREE.BoxGeometry(4.5,.5,4.7);
    var snow = new THREE.Mesh(geomSnow, matSnow);
    snow.position.y = 1.76;
    model.snow = snow;
    model.add(model.snow);
  }

  model.position.x = x;
  model.position.y = y;
  model.scale.set(.3,.3,.3);
  return model;
}



function createSnowPlatform(x,y,w,seed){
  var snowPlatform = {
    x: 0,
    y: 0,
    w: 0,
    yVel: 0,
    broken: false,
    animClock: 0,
    model:undefined,
    update: function(){
      if(this.broken){
        this.animClock++;
        if(this.animClock<30){
          this.model.position.x = this.x + Math.sin(.6*this.animClock)/20;
          this.model.position.y = this.y + -Math.cos(.6*this.animClock)/20;
        }
        else if(this.animClock< 200){
          this.model.position.x = this.x
          this.yVel -= .02;
          this.model.position.y +=this.yVel;
        }else{
          this.model.position.y = this.y;
          this.broken = false;
          this.animClock = 0;
          this.yVel = 0;
        }
      }
    },
    onCollide: function(){
      this.broken = true;
    },
    init: function(w,x,y,seed){
      this.w = w;
      this.x = x;
      this.y = y;
      this.model = createSnowPlatformModel(w,x,y,seed);
      this.model.base.parentObject = this;

    },
  }
  snowPlatform.init(w,x,y,seed);
  return snowPlatform;
}

function createSnowPlatformModel( wid, x, y, seed ){

  var model = new THREE.Object3D();

  var matSnow = new THREE.MeshPhongMaterial(
                          {color:0xCCCCCC, shading:THREE.FlatShading});
  var geomBase = new THREE.BoxGeometry(wid, 1, 5);
  model.base = new THREE.Mesh(geomBase,matSnow);
  model.base.solid = true;
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

    icicle.position.y = -.5;
    icicle.position.x = -(wid/2)+wid/5;
    model.add(icicle.clone());

    icicle.position.y = 0;
    icicle.position.x = wid/5;
    model.add(icicle.clone());
  }

  model.scale.set(1,.3,.3);
  model.position.x = x;
  model.position.y = y;
  model.name = "snowPlatform";

  return model;
}

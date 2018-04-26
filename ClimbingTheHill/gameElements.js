//Dependencies: levels.js, Models/
//-------------------------- models ---------------------

var stonePlatformModel = createStonePlatformModel(0,0,true);

var snowPlatformModel = createSnowPlatformModel(3, 0, 0, 0);

var tokenModel = createTokenModel();

var gooseModel = createGooseModel();

var wallModel = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH/2 + CELL_WIDTH/4, CELL_HEIGHT + CELL_HEIGHT/2, CELL_WIDTH/2),
  new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
);

//---------------------------collidable meshes------------
var stonePlatformCollidable = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH, CELL_HEIGHT, CELL_WIDTH),
  new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
);

var snowPlatformCollidable = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH * 3, .25, CELL_WIDTH),
  new THREE.MeshLambertMaterial( { color: 0xFFFFFF } )
);

var tokenCollidable = new THREE.Mesh(
  new THREE.CylinderGeometry( .05, .05, .05, 10), // very samll spehere
  new THREE.MeshLambertMaterial( { color: 0xF8CD30 } )
);

//-------------------------- platform ---------------------

class Platform{
  constructor(x, y, isLive){
    this.x = x;
    this.y = y;
    this.isLive = isLive;

    if(this.isLive){
      this.w = 3; // default for live platforms
      this.yVel =  0;

      this.animClock =  0;
      this.broken = false;

      this.model = snowPlatformModel.clone();
      this.collidableMesh = snowPlatformCollidable.clone();
    }
    else{
      this.model = stonePlatformModel.clone();
      this.collidableMesh = stonePlatformCollidable.clone();
    }
    this.collidableMesh.parentObject = this;

    this.model.position.set(x, y, 0);
    this.collidableMesh.position.set(x, y, 0);
  }

  update(){
    // only live platforms update
    if(this.isLive && this.broken){
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
      this.collidableMesh.position.set(this.model.position.x, this.model.position.y, 0);
    }
  }

  onCollide(){
    this.broken = true;
  }
}

//-------------------------- wall ---------------------

class Wall{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.isLive = false;

    this.model = wallModel.clone();
    this.model.position.set(x, y, 0);

    this.collidableMesh = this.model;
  }

  update(){

  }

  onCollide(){
    // do something
  }
}

//-------------------------- token ---------------------

class Token{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.isLive = true;

    this.model = tokenModel.clone();
    this.model.position.set(x, y, 0);

    this.collidableMesh = this.model.clone(); //tokenCollidable.clone();
    this.collidableMesh.position.set(x, y, 0);
    this.collidableMesh.parentObject = this
  }

  update(){
    this.model.rotation.y += 0.5;
  }

  onCollide(){
    his.model.position.x = -100;
    this.collidableMesh.position.x = -100;
    game.tokens++;
  }
}

// //-------------------------- goose ---------------------

class Goose{
  constructor(x, y, xmin, xmax, flying){
    var scale = .25;

    this.x = x;
    this.y = y + .1;
    this.xmin = xmin;
    this.xmax = xmax;

    this.speed = .04;

    this.goingRight = true;
    this.flying = false;

    this.model = createGooseModel();
    if(flying){
      this.flyingModel();
      this.flying = true;
    }
    this.model.scale.set(scale, scale,scale);
    this.model.torso.base.parentObject = this;

    // not clean
    this.collidableMesh = this.model.torso.base.clone();
    this.collidableMesh.scale.set(scale, scale,scale);
    this.collidableMesh.parentObject = this
  }

  onCollide(){
    hero.die();
  }

  update(){
    this.animate();

    if(this.goingRight){
      this.x += this.speed;
      if(this.x > this.xmax){
        this.goingRight = false;
        this.x = this.xmax;
      }
    }else if(!this.goingRight){
      this.x -= this.speed;
      if(this.x < this.xmin){
        this.goingRight = true;
        this.x = this.xmin;
      }
    }

    this.model.position.x = this.x;
    this.model.position.y = this.y;

    // not clean
    this.collidableMesh.position.x = this.x;
    this.collidableMesh.position.y = this.y;
    this.collidableMesh.rotation.y = this.model.rotation.y;
  }

  animate(){
    if(this.goingRight){
      this.model.rotation.y = .7;
    } else {
      this.model.rotation.y = -.7;
    }
    if(!this.flying){
      this.model.rightLeg.rotation.x = Math.sin(.1*clock)/2;
      this.model.leftLeg.rotation.x = -Math.sin(.1*clock)/2;
    }else{
      this.model.rightWing.rotation.z = Math.sin(.05*clock)/3;
      this.model.leftWing.rotation.z = -Math.sin(.05*clock)/3;
    }
    this.model.head.rotation.x = Math.sin(.05*clock)/5;
    this.model.head.top.rotation.x = -Math.sin(.05*clock)/5;
  }

  flyingModel(){
    var brown = new THREE.MeshPhongMaterial(
                      {color:0x855E39});
    var geomWing = new THREE.BoxGeometry(3,.5,2);
    var wing = new THREE.Mesh(geomWing, brown);
    wing.position.x = 1.5;
    wing.position.y = .5;
    var leftWing = new THREE.Object3D();
    leftWing.add(wing.clone());
    this.model.leftWing = leftWing;
    this.model.add(this.model.leftWing);

    wing.position.x = -1.5
    var rightWing = new THREE.Object3D();
    rightWing.add(wing);
    this.model.rightWing = rightWing;
    this.model.add(this.model.rightWing);

    this.model.rightLeg.rotation.x = -2;
    this.model.leftLeg.rotation.x = -2;
  }
}


//-------------------------- cloud ---------------------

function createCloud(){
  var cloud = {
    x:0,
    y:0,
    model:undefined,
    animClock:0,
    done:true,
    bs1:0,bs2:0,bs3:0,bs4:0,

    init:function(x,y){
      this.x = x;
      this.y = y;
      if(this.model == undefined){ this.model = createCloudModel();}
      else{ this.changeModel();}
      this.bs1 = this.model.blocks[0].scale.x;
      this.bs2 = this.model.blocks[1].scale.x;
      this.bs3 = this.model.blocks[2].scale.x;
      this.bs4 = this.model.blocks[3].scale.x;
      this.model.position.x = x;
      this.model.position.y = y;
      this.animClock = 20;
      this.done = false;
    },

    update:function(){
      if(this.animClock > 1){
        this.animClock--;
        var s = this.animClock/20;
        var blockScale = this.bs1 * s;
        this.model.blocks[0].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[0].rotation.z += .05;
        blockScale = this.bs2 * s;
        this.model.blocks[1].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[1].rotation.z += .05;
        blockScale = this.bs3 * s;
        this.model.blocks[2].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[2].rotation.z += .05;
        blockScale = this.bs4 * s;
        this.model.blocks[3].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[3].rotation.z += .05;
      } else{
        this.done = true;
        this.model.position.x = -100;
      }
    },

    changeModel:function(){
      for(var i = 0; i<this.model.blocks.length; i++){
        this.model.blocks[i].position.y = Math.random();
    		this.model.blocks[i].position.z = Math.random();
    		this.model.blocks[i].rotation.z = Math.random()*Math.PI*2;
    		this.model.blocks[i].rotation.y = Math.random()*Math.PI*2;
        var s = .1 + Math.random()*.9;
    		this.model.blocks[i].scale.set(s,s,s);
      }
    }
  }
  return cloud;
}

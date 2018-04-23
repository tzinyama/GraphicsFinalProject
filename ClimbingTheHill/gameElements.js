//Dependencies: levels.js, Models/
//-------------------------- models ---------------------

var stonePlatformModel = createStonePlatformModel(5,-8,true);

var livePlatform = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH * 3, CELL_HEIGHT/2, CELL_WIDTH/2),
  new THREE.MeshLambertMaterial( { color: 0xAA0000 } )
);

var wallModel = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_WIDTH/2 + CELL_WIDTH/4, CELL_HEIGHT + CELL_HEIGHT/2, CELL_WIDTH/2),
  new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
);

var tokenModel = createTokenModel();

var gooseModel = createGooseModel();

//-------------------------- platform ---------------------

class Platform{
  constructor(x, y, isLive){
    this.x = x;
    this.y = y;
    this.isLive = isLive;

    this.model = isLive ? livePlatform.clone() : stonePlatformModel.clone();
    this.model.position.set(x, y, 0);
  }

  update(){
    // do something
  }

  onCollide(){
    // do something
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
  }

  update(){
    this.model.rotation.y += 0.5;
  }

  onCollide(){
    // move off the screen
    this.model.position.x = -100;
    game.tokens++;
  }
}

// //-------------------------- goose ---------------------

class Goose{
  constructor(x, y, xmin, xmax, flying){
    var scale = .25;

    this.x = x;
    this.y = y;
    this.y += scale* 4.2;
    this.xmin = xmin;
    this.xmax = xmax;

    this.goingRight = true;
    this.flying = false;

    this.model.torso.base.parentObject = this;

    this.model = gooseModel.clone();
    if(flying){
      this.flyingModel();
      this.flying = true;
    }
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

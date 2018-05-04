// Code for the main character
"use strict";

var hero = {
  x: 0,
  y: 0,
  hHeight: 1,
  hWidth: .75,
  xVel: 0,
  yVel: 0,
  accel: .013,
  maxSpeed: .17,
  xdamp: .2,
  jumpSpeed: .02,
  onGround: true,
  wasOnGround: true,
  jumpHold: 10,
  jumpHoldMax: 10,
  jumped: false,
  canJump: true,
  canDoubleJump: false,
  haveDoubleJumped: false,
  resetDoubleJump: false,
  facingRight: true,
  animTicker: 0,
  walking: false,
  deathAnimClock: 0,
  deathYVel: .32,
  model: createHeroModel(),
  spawnX: 1,
  spawnY: 1,
  update: function(){

    if(this.deathAnimClock > 0){

      this.deathAnimClock--;
      this.model.position.y += this.deathYVel;
      this.deathYVel -= .02;
      this.model.rotation.z += .2;
      // this.model.rotation.x += .2;
      if(this.deathAnimClock == 0){
        this.deathYVel = .32;
        this.x = this.spawnX;
        this.y = this.spawnY; // CELL_HEIGHT * 2; // was 0;
        this.xVel = 0;
        this.yVel = 0;
        for(var i = 0; i<game.levelElements.length; i++){
          if(game.levelElements[i].reset != undefined){
            game.levelElements[i].reset();
          }
        }
        game.tokens = game.tokensSinceLevel;
        cloud.model.position.x = -100;
        game.update();
      }
      return;
    }

    if(this.y < 0) hero.die(); // was (this.y < -12)

    //Model rotation
    if(this.facingRight) this.model.rotation.set(0,.7,0);
    else this.model.rotation.set(0,-.7,0);

    //dampen movement when not holding move keys (on ground)
    if(this.xVel!=0 && ((!heldKeys.right && !heldKeys.left) || (heldKeys.right && heldKeys.left)) && this.onGround){
      this.xVel = this.xVel*.5;
      this.walking = false;
    }

    //dampen movement when not holding move keys (in air)
    if(this.xVel!=0 && ((!heldKeys.right && !heldKeys.left) || (heldKeys.right && heldKeys.left)) && !this.onGround){
      this.xVel = this.xVel*.9;
      this.walking = false;
    }
    //Walking left
    if(heldKeys.left && !heldKeys.right){
      accelLeft(this.accel);
      this.walking = true;
    }
    //Walking right
    if(heldKeys.right && !heldKeys.left){
      accelRight(this.accel);
      this.walking = true;
    }
    //Jumping
    if((heldKeys.up || heldKeys.space)){
      this.jump();
    }

    //Update player position
    this.x+=this.xVel;
    hero.y += hero.yVel;

    //Screen edges
    if(this.x > WIDTH){ // was 11.5
       this.x = WIDTH;
       this.xVel = 0;
     }
    if(this.x < 0){ // was -12
       this.x = 0;
       this.xVel = 0;
     }


    //Gravity is always applied
    if(this.yVel > -.8){
      this.yVel -= .02;
    }

    handleBBoxCollisions();
    handleRayCollisions();
    //Draws arrows when on
    if(debugMode){
      drawDebugMode();
    }


    if((!heldKeys.up && this.resetDoubleJump)){ //In case hero runs off platform
      this.canDoubleJump = true;                //while holding jump, don't
      this.resetDoubleJump = false;             //activate double jump instantly
    }

    this.bBoxH.update();

    //Actually update model position
    this.model.position.x = this.x;
    this.model.position.y = this.y;
    this.animate();

  },

  jump: function(){  //jump, or handle mid-air jump key functions
    if(this.onGround && this.canJump){ //jumping from on a platform
      this.jumped = true;
      this.yVel += .2;
      this.onGround = false;
      this.canJump = false;
      cloud.init(this.x, this.y);
    }else if(this.onGround && ! this.canJump){
      return; //if jump was held since before landing, do nothing
    }else if( this.jumpHold > 0 ){ //Increase jump height if held longer
      this.jumpHold--;
      this.yVel += this.jumpSpeed;
    } else if (this.canDoubleJump && !this.haveDoubleJumped){ //double jump
      // game.nextLevel();
      cloud.init(this.x, this.y);
      this.yVel = .15;
      this.canDoubleJump = false;
      this.haveDoubleJumped = true;
      this.jumpHold = this.jumpHoldMax/2;
      this.canJump = false;
      cloud.init(this.x, this.y);
    }
  },

  animate: function(){        //Move parts of hero model
    this.animTicker = (this.animTicker+this.xVel) % 1000000;

    //Blinking
    if(clock % 300 < 8){
      this.model.head.eyes.scale.set(1,0.2,1);
      this.model.head.eyes.position.y = -.5;
    } else{
      this.model.head.eyes.scale.set(1,1,1);
      this.model.head.eyes.position.y = 0;
    }

    //walk cycle
    if(this.walking && this.xVel != 0){
      this.model.rightArm.rotation.x = Math.sin(2.5*this.animTicker)/2;
      this.model.leftArm.rotation.x = -1* Math.sin(2.5*this.animTicker)/2;
      this.model.rightLeg.position.y = 1.5 + Math.sin(2.5*this.animTicker)/2;
      this.model.leftLeg.position.y = 1.5 - Math.sin(2.5*this.animTicker)/2;

      if(this.model.head.rotation.x < -.1){
        this.model.head.rotation.x -= (this.model.head.rotation.x)/20;
      }

    //default
    } else {
      this.model.rightArm.rotation.x = 0;
      this.model.leftArm.rotation.x = 0;
      this.model.rightLeg.position.y = 1.5;
      this.model.leftLeg.position.y = 1.5;
      if(this.model.head.rotation.x > -.25){
        this.model.head.rotation.x += (this.model.head.rotation.x -.25)/20;
      }
    }
  },

  die: function(){
    this.deathAnimClock = 50;
    game.deaths++;
    game.update();
  }
}

function checkCol(pos, dir, near, far) {

  var ray = new THREE.Raycaster(pos, dir.normalize(), near, far);
  var collisionResults = ray.intersectObjects( collidableMeshList );

  if (collisionResults.length > 0) {

    if(collisionResults[0].object.parentObject != undefined){
      collisionResults[0].object.parentObject.onCollide()
    }

    return collisionResults[0].distance;
  }
}

function useMin(col1, col2){
  if (col1 && col2) {
    return Math.min(col1, col2);
  }
  return col1 || col2;
}

//accelerate hero right by n velocity
function accelRight(n){
  hero.facingRight = true;
  if(hero.xVel < 0 && hero.onGround){
    hero.xVel = 0;
  }
  hero.xVel += n;
  if(hero.xVel > hero.maxSpeed){
    hero.xVel = hero.maxSpeed;}
}

//accelerate hero left by n velocity
function accelLeft(n){
  hero.facingRight = false;
  if(hero.xVel > 0 && hero.onGround){
    hero.xVel = 0;
  }
  hero.xVel -= n;
  if(hero.xVel < -1*hero.maxSpeed){
    hero.xVel = -1*hero.maxSpeed;}
}

//Called when hero touches ground
function land(){
  // if(hero.yVel < -.4){ cloud.init(hero.x,hero.y);}
  hero.jumped = false;
  hero.onGround = true;
  hero.wasOnGround = true;
  hero.yVel = 0;
  hero.jumpHold = hero.jumpHoldMax;
  hero.canDoubleJump = false;
  hero.haveDoubleJumped = false;
}

//called when jump key is released
function jumpRelease(){
  hero.jumpHold = 0;
  hero.canJump = true;
  if(!hero.canDoubleJump){
    hero.canDoubleJump = true;
  }
}


function handleBBoxCollisions(){
  var heroBox = new THREE.Box3();
  var checkBox = new THREE.Box3();
  heroBox.setFromObject(hero.model.invisibleBox);
  for(var i = 0; i < game.levelElements.length; i++){
    checkBox.setFromObject(game.levelElements[i].collidableMesh);
    if (heroBox.intersectsBox(checkBox)){
      game.levelElements[i].onCollide();
    }
  }
}


function handleRayCollisions(){
  var hBoundingBox = [
      new THREE.Vector3(hero.x -.4, hero.y + 1.15, 0),
      new THREE.Vector3(hero.x +.4, hero.y + 1.15, 0),
      new THREE.Vector3(hero.x +.4, hero.y, 0),
      new THREE.Vector3(hero.x -.4, hero.y, 0)];

  var testLen = .25;

  var checkUp = useMin(checkCol(hBoundingBox[0], dirVectors[0], 0, .25),
  checkCol(hBoundingBox[1], dirVectors[0], 0, .25));
  if (checkUp){
    if(hero.yVel > 0){
        hero.yVel = 0;
    }
  }

  var checkLeft = useMin(checkCol(hBoundingBox[3], dirVectors[3], 0, .25),
    checkCol(hBoundingBox[0],dirVectors[3], 0, .25));
  if (checkLeft){
    if (hero.xVel < 0){
      hero.xVel = 0;
      hero.x += .1 - checkLeft;
    }
  }

  var checkRight = useMin(checkCol(hBoundingBox[2], dirVectors[1], 0, .25),
    checkCol(hBoundingBox[1],dirVectors[1], 0, .25));
  if (checkRight){
    if (hero.xVel > 0){
      hero.xVel = 0;
      hero.x -= .1 - checkRight;
    }
  }

  var checkDown1 = useMin(checkCol(hBoundingBox[2], dirVectors[2], 0, .25),
      checkCol(hBoundingBox[3], dirVectors[2], 0, .25));
  if (!checkDown1){
  var checkDown2 = useMin(checkCol(hBoundingBox[0], dirVectors[2], 0, 1.25),
      checkCol(hBoundingBox[1], dirVectors[2], 0, 1.25));
  }
  if (checkDown1) {
    if (hero.yVel < 0){
      land();
      hero.y += .1-checkDown1;
    }

  }
  else if (checkDown2){
    if (hero.yVel < 0){
      land();
      hero.y += 1.25-checkDown2;
    }
  }

  else if (hero.wasOnGround && !hero.jumped){
    hero.wasOnGround = false;
    hero.resetDoubleJump = true;
    hero.onGround = false;
    hero.jumpHold = 0;
  }

}


function drawDebugMode(){

  var hBoundingBox = [
    new THREE.Vector3(hero.x -.4, hero.y + 1.15, 0),
    new THREE.Vector3(hero.x +.4, hero.y + 1.15, 0),
    new THREE.Vector3(hero.x +.4, hero.y, 0),
    new THREE.Vector3(hero.x -.4, hero.y, 0)];
    var testLen = .5;

    //For testing raycasts
    scene.remove(testArrows[0], testArrows[1], testArrows[2], testArrows[3],
      testArrows[4], testArrows[5], testArrows[6], testArrows[7]);
    var arrow = new THREE.ArrowHelper(dirVectors[0], hBoundingBox[0], testLen, 0xff0000, testLen * .9, .15);
    testArrows[0] = arrow;
    arrow = new THREE.ArrowHelper(dirVectors[0], hBoundingBox[1], testLen, 0xff0000, testLen * .9, .15);
    testArrows[1] = arrow;
    arrow = new THREE.ArrowHelper(dirVectors[1], hBoundingBox[1], testLen, 0xff8800, testLen * .9, .15);
    testArrows[2] = arrow;
    arrow = new THREE.ArrowHelper(dirVectors[1], hBoundingBox[2], testLen, 0xff8800, testLen * .9, .15);
    testArrows[3] = arrow;
    var arrow = new THREE.ArrowHelper(dirVectors[2], hBoundingBox[2], testLen, 0x0000ff, testLen * .9, .15);
    testArrows[4] = arrow;
    arrow = new THREE.ArrowHelper(dirVectors[2], hBoundingBox[3], testLen, 0x0000ff, testLen * .9, .15);
    testArrows[5] = arrow;
    arrow = new THREE.ArrowHelper(dirVectors[3], hBoundingBox[0], testLen, 0x00bb00, testLen * .9, .15);
    testArrows[6] = arrow;
    arrow = new THREE.ArrowHelper(dirVectors[3], hBoundingBox[3], testLen, 0x00bb00, testLen * .9, .15);
    testArrows[7] = arrow;
    scene.add(testArrows[0], testArrows[1], testArrows[2], testArrows[3],
      testArrows[4], testArrows[5], testArrows[6], testArrows[7]);
}

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
  maxSpeed: .175,
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
  model: createHeroModel(),
  update: function(){

    if(this.y < -12) hero.die();

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
    if(this.x >11.5){
       this.x = 11.5;
       this.xVel = 0;
     }
    if(this.x <-12){
       this.x = -12;
       this.xVel = 0;
     }


    //Gravity is always applied
    if(this.yVel > -.8){
      this.yVel -= .02;
    }
    //console.log(goose.model);

    var offsetY = 1.9;

    var hBoundingBox = [
        new THREE.Vector3(this.x -.4, this.y + 1 - offsetY, 0),
        new THREE.Vector3(this.x +.4, this.y + 1 - offsetY, 0),
        new THREE.Vector3(this.x +.4, this.y - offsetY, 0),
        new THREE.Vector3(this.x -.4, this.y - offsetY, 0)];


    var originPoint = new THREE.Vector3(this.x, this.y, 0);

    //For testing raycasts
    //var arrow = new THREE.ArrowHelper(dirVectors[0], hBoundingBox[0], 1, 0xff00ff);
    //scene.add(arrow);
    //arrow = new THREE.ArrowHelper(dirVectors[0], hBoundingBox[1], 1, 0xff0000);
    //scene.add(arrow);
    //arrow = new THREE.ArrowHelper(dirVectors[0], hBoundingBox[2], 1, 0x0000ff);
    //scene.add(arrow);
    //arrow = new THREE.ArrowHelper(dirVectors[0], hBoundingBox[3], 1, 0xff8800);
    //scene.add(arrow);

    var checkUp = useMin(checkCol(hBoundingBox[0], dirVectors[0], 0, .25),
    checkCol(hBoundingBox[1], dirVectors[0], 0, .25));
    if (checkUp){
      if(this.yVel > 0){
          this.yVel = 0;
          //this.y += .25-checkUp;

      }
    }
    var checkLeft = useMin(checkCol(hBoundingBox[3], dirVectors[3], 0, .25),
      checkCol(hBoundingBox[0],dirVectors[3], 0, .25));
    if (checkLeft){
      if (this.xVel < 0){
        this.xVel = 0;
        this.x += .1 - checkLeft;
      }
    }

    var checkRight = useMin(checkCol(hBoundingBox[2], dirVectors[1], 0, .25),
      checkCol(hBoundingBox[1],dirVectors[1], 0, .25));
    if (checkRight){
      if (this.xVel > 0){
        this.xVel = 0;
        this.x -= .1 - checkRight;
      }
    }


    var checkDown1 = useMin(checkCol(hBoundingBox[2], dirVectors[2], 0, .25),
        checkCol(hBoundingBox[3], dirVectors[2], 0, .25));
    if (!checkDown1){
    var checkDown2 = useMin(checkCol(hBoundingBox[0], dirVectors[2], 0, 1.25),
        checkCol(hBoundingBox[1], dirVectors[2], 0, 1.25));
    }
    if (checkDown1) {
      if (this.yVel < 0){
        land();
        this.y += .1-checkDown1;
      }

    }
    else if (checkDown2){
      if (this.yVel < 0){
        land();
        this.y += 1.25-checkDown2;
      }
    }

    else if (this.wasOnGround && !this.jumped){
      this.wasOnGround = false;
      this.resetDoubleJump = true;
      this.onGround = false;
      this.jumpHold = 0;
    }

    if((!heldKeys.up && this.resetDoubleJump)){ //In case hero runs off platform
      this.canDoubleJump = true;                //while holding jump, don't
      this.resetDoubleJump = false;             //activate double jump instantly
    }

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
    }else if(this.onGround && ! this.canJump){
      return; //if jump was held since before landing, do nothing
    }else if( this.jumpHold > 0 ){ //Increase jump height if held longer
      this.jumpHold--;
      this.yVel += this.jumpSpeed;
    } else if (this.canDoubleJump && !this.haveDoubleJumped){ //double jump
      this.yVel = .15;
      this.canDoubleJump = false;
      this.haveDoubleJumped = true;
      this.jumpHold = this.jumpHoldMax/2;
      this.canJump = false;
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
    if(this.walking){
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
    game.deaths++;
    this.x = 0;
    this.y = 0;
    this.xVel = 0;
    this.yVel = 0;
    for(var i = 0; i<tokens.length; i++){
      tokens[i].model.position.x = tokens[i].x;
    }
    for(var i = 0; i<snowPlatforms.length; i++){
      snowPlatforms[i].model.position.y = snowPlatforms[i].y;
      snowPlatforms[i].broken = false;
      snowPlatforms[i].animClock = 0;
      snowPlatforms[i].yVel = 0;
    }
    game.tokens = 0;

  }
}

function checkCol(pos, dir, near, far) {

  var ray = new THREE.Raycaster(pos, dir.normalize(), near, far);
  var collisionResults = ray.intersectObjects( collidableMeshList );

  if (collisionResults.length > 0) {

    if(collisionResults[0].object.parentObject != undefined){
      // console.log("onCollide triggered");
      collisionResults[0].object.parentObject.onCollide()
    }

    if(collisionResults[0].object.solid){
      return collisionResults[0].distance;
    }
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

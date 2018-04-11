// Code for the main character
"use strict";

var hero = {
  x: 0,
  y: 0,
  hHeight: 1,
  hWidth: .75,
  xVel: 0,
  yVel: 0,
  accel: .015,
  maxSpeed: .2,
  xdamp: .2,
  jumpSpeed: .02,
  onGround: true,
  wasOnGround: true,
  jumpHold: 10,
  jumpHoldMax: 10,
  jumped: false,
  canDoubleJump: false,
  haveDoubleJumped: false,
  facingRight: true,
  animTicker: 0,
  walking: false,
  model: createHeroModel(),
  update: function(){



    //Screen loop
    if(this.x >12) this.x = -12;
    if(this.x <-12) this.x = 12;
    if(this.y <-12) this.y = 12;

    //Model rotation
    if(this.facingRight) this.model.rotation.set(0,.7,0);
    else this.model.rotation.set(0,-.7,0);


    if(this.xVel!=0 && ((!heldKeys.right && !heldKeys.left) || (heldKeys.right && heldKeys.left)) && this.onGround){
      this.xVel = this.xVel*.5;
      this.walking = false;
    }

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
    if(heldKeys.up || heldKeys.space){
      this.jump();
    }



    //Update player position
    this.x+=this.xVel;
    hero.y += hero.yVel;


    //Gravity is always applied
    if(this.yVel > -.8){
      this.yVel -= .02;
    }


    //console.log(hero.model.position.z);

    //console.log(this.x);
    //console.log(this.y);
    var hBoundingBox = [
        new THREE.Vector3(this.x -.4, this.y, 0),
        new THREE.Vector3(this.x +.4, this.y + 2, 0),
        new THREE.Vector3(this.x +.4, this.y, 0),
        new THREE.Vector3(this.x -.4, this.y, 0)];


    var originPoint = new THREE.Vector3(this.x, this.y, 0);
    //console.log(this.x);

    var checkUp = checkCol(originPoint, dirVectors[0], 0, 2);
    if (checkUp){
      //console.log(checkUp);
      if(this.yVel > 0){
          this.yVel = 0;
          //this.y += 2-checkUp;

      }
      //console.log(checkUp);
    }


    var checkDown = useMin(checkCol(hBoundingBox[2], dirVectors[2], 0, 2),
        checkCol(hBoundingBox[3], dirVectors[2], 0, 2));

    if (checkDown) {
      //console.log("on land");
      land();
      this.y += 2-checkDown;
    }
    else if (this.wasOnGround && !this.jumped){
      this.wasOnGround = false;
      this.canDoubleJump = true;
      this.onGround = false;
      this.jumpHold = 0;
    }

    //Actually update model position
    this.model.position.x = this.x;
    this.model.position.y = this.y;
    this.animate();

  },

  jump: function(){
    if(this.onGround){
      this.jumped = true;
      this.yVel += .2;
      this.onGround = false;
    } else if( this.jumpHold > 0 ){
      this.jumpHold--;
      this.yVel += this.jumpSpeed;
    } else if (this.canDoubleJump && !this.haveDoubleJumped){
      this.yVel = .15;
      this.canDoubleJump = false;
      this.haveDoubleJumped = true;
      this.jumpHold = this.jumpHoldMax/2;
    }
  },

  animate: function(){        //Move parts of hero model
    this.animTicker = (this.animTicker+this.xVel) % 1000000;
    if(clock % 300 < 8){
      this.model.head.eyes.scale.set(1,0.2,1);
      this.model.head.eyes.position.y = -.5;
    } else{
      this.model.head.eyes.scale.set(1,1,1);
      this.model.head.eyes.position.y = 0;
    }
    if(this.walking){
      this.model.rightArm.rotation.x = Math.sin(2.5*this.animTicker)/2;
      this.model.leftArm.rotation.x = -1* Math.sin(2.5*this.animTicker)/2;
      this.model.rightLeg.position.y = 1.5 + Math.sin(2.5*this.animTicker)/2;
      this.model.leftLeg.position.y = 1.5 - Math.sin(2.5*this.animTicker)/2;

      if(this.model.head.rotation.x < -.1){
        this.model.head.rotation.x -= (this.model.head.rotation.x)/20;
      }

    } else {
      this.model.rightArm.rotation.x = 0;
      this.model.leftArm.rotation.x = 0;
      this.model.rightLeg.position.y = 1.5;
      this.model.leftLeg.position.y = 1.5;
      if(this.model.head.rotation.x > -.25){
        this.model.head.rotation.x += (this.model.head.rotation.x -.25)/20;
      }
    }
  }
}

function checkCol(pos, dir, near, far) {
  var ray = new THREE.Raycaster(pos, dir.normalize(), near, far);
  var collisionResults = ray.intersectObjects( collidableMeshList );
  if (collisionResults.length > 0) {
    return collisionResults[0].distance;
  }
}

function useMin(col1, col2){
  if (col1 && col2) {
    return Math.min(col1, col2);
  }
  return col1 || col2;
}

function accelRight(n){
  hero.facingRight = true;
  if(hero.xVel < 0 && hero.onGround){
    hero.xVel = 0;
  }
  hero.xVel += n;
  if(hero.xVel > hero.maxSpeed){
    hero.xVel = hero.maxSpeed;}
}

function accelLeft(n){
  hero.facingRight = false;
  if(hero.xVel > 0 && hero.onGround){
    hero.xVel = 0;
  }
  hero.xVel -= n;
  if(hero.xVel < -1*hero.maxSpeed){
    hero.xVel = -1*hero.maxSpeed;}
}


function land(){
  hero.jumped = false;
  hero.onGround = true;
  hero.wasOnGround = true;
  hero.yVel = 0;
  hero.jumpHold = hero.jumpHoldMax;
  hero.canDoubleJump = false;
  hero.haveDoubleJumped = false;
}

function jumpRelease(){
  hero.jumpHold = 0;
  if(!hero.canDoubleJump){
    hero.canDoubleJump = true;
  }
}

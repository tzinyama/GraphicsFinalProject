// Code for the main character

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
  jumpHold: 10,
  jumpHoldMax: 10,
  canDoubleJump: false,
  haveDoubleJumped: false,
  facingRight: true,
  model: new THREE.Mesh(
    new THREE.BoxGeometry(.75,1,.75),
    new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
  ),
  update: function(){
    if(this.xVel!=0 && ((!heldKeys.right && !heldKeys.left) || (heldKeys.right && heldKeys.left)) && this.onGround){
      this.xVel = this.xVel*.5;
    }
    if(this.xVel!=0 && ((!heldKeys.right && !heldKeys.left) || (heldKeys.right && heldKeys.left)) && !this.onGround){
      this.xVel = this.xVel*.9;
    }
    if(heldKeys.left && !heldKeys.right){
      accelLeft(this.accel);
    }
    if(heldKeys.right && !heldKeys.left){
      accelRight(this.accel);
    }
    if(heldKeys.up || heldKeys.space){
      this.jump();
    }
    this.x+=this.xVel;
    moveY();
    this.model.position.x = this.x;
    this.model.position.y = this.y;
    if(this.x >12) this.x = -12;
    if(this.x <-12) this.x = 12;
    if(this.facingRight) this.model.rotation.set(0,.3,0);
    else this.model.rotation.set(0,-.3,0);
  },

  jump: function(){
    if(this.onGround){
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
  }
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

function moveY(){
  hero.y += hero.yVel;
  hero.yVel -= .02;
  if(hero.y < 0){
    hero.y = 0;
    land();
  }
}

function land(){
  hero.onGround = true;
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

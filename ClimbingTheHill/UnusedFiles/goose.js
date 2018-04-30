//Code for goose enemy

"use strict";

var goose = {
  x:0,
  y:0,
  xmin:0,
  xmax:10,
  speed:.04,
  goingRight: true,
  flying: false,
  model:createGooseModel(),
  init: function(x,y,xmin,xmax,flying){
    var scale = .25;
    if(flying){
      this.flyingModel();
      this.flying = true;
    }
    this.model.scale.set(scale,scale,scale);
    this.x = x;
    this.y = y;
    this.y += scale* 4.2;
    this.xmin = xmin;
    this.xmax = xmax;
    this.model.torso.base.parentObject = this;

  },
  onCollide: function(){
    hero.die();
  },
  update: function(){

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
  },
  animate: function(){
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
  },
  flyingModel: function(){
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


function createGoose(x,y,xmin,xmax,flying){
  var goose = {
    x:0,
    y:0,
    xmin:0,
    xmax:10,
    speed:.04,
    goingRight: true,
    flying: false,
    model:createGooseModel(),
    init: function(x,y,xmin,xmax,flying){
      var scale = .25;
      if(flying){
        this.flyingModel();
        this.flying = true;
      }
      this.model.scale.set(scale,scale,scale);
      this.x = x;
      this.y = y;
      this.y += scale* 4.2;
      this.xmin = xmin;
      this.xmax = xmax;
      this.model.torso.base.parentObject = this;

    },
    onCollide: function(){
      hero.die();
    },
    update: function(){

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
    },
    animate: function(){
      if(this.goingRight){
        this.model.rotation.y = .7;
      } else {
        this.model.rotation.y = -.7;
      }
      if(!this.flying){
        this.model.rightLeg.rotation.x = Math.sin(.2*clock)/2;
        this.model.leftLeg.rotation.x = -Math.sin(.2*clock)/2;
        this.model.head.rotation.x = Math.sin(.05*clock)/5;
        this.model.head.top.rotation.x = -Math.sin(.05*clock)/5;
      }else{
        this.model.rightWing.rotation.z = Math.sin(.2*clock)/3;
        this.model.leftWing.rotation.z = -Math.sin(.2*clock)/3;
        this.model.head.rotation.x = .5 + Math.sin(.05*clock)/5;
        this.model.head.top.rotation.x = -(.5+ Math.sin(.05*clock)/5);
      }
    },

    flyingModel: function(){
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

  goose.init(x,y,xmin,xmax,flying);
  return goose;
}

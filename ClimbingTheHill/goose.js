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

function createGooseModel(){
  var model = new THREE.Object3D();

  var brown = new THREE.MeshPhongMaterial(
                          {color:0x855E39});
  var black = new THREE.MeshPhongMaterial(
                          {color:0x050505});
  var grey = new THREE.MeshPhongMaterial(
                          {color:0x58595b});
  var white = new THREE.MeshPhongMaterial(
                          {color:0xFCF0E6});

  var geomTorso = new THREE.BoxGeometry(2,2,3);
  model.torso = new THREE.Object3D();
  var base = new THREE.Mesh(geomTorso, white);
  model.torso.base = base;
  model.torso.add(model.torso.base);

  var geomTail = new THREE.BoxGeometry(2.1,1.1,3);
  model.torso.tail = new THREE.Mesh(geomTail, brown);
  model.torso.tail.position.z = -1;
  model.torso.tail.position.y = .5;
  model.torso.add(model.torso.tail);
  model.add(model.torso);

  model.head = new THREE.Object3D();
  var geomNeck = new THREE.BoxGeometry(.75,2,.75);
  model.head.neck = new THREE.Mesh(geomNeck, black);
  model.head.neck.position.y = 1;
  model.head.add(model.head.neck);
  model.head.position.y = 1;
  model.head.position.z = 1;
  var geomTop = new THREE.BoxGeometry(.75,.75,1.25);
  model.head.top = new THREE.Mesh(geomTop, black);
  model.head.top.position.y = 2;
  model.head.top.position.z = .25;

  var geomCheeks = new THREE.BoxGeometry(.77,.5,.5);
  var cheeks = new THREE.Mesh(geomCheeks, white);
  cheeks.position.z = .15;
  cheeks.position.y = -.15;
  model.head.top.add(cheeks);

  var geomBeak = new THREE.BoxGeometry(.7,.2,.75);
  var beak = new THREE.Mesh(geomBeak, grey);
  beak.position.z = 1;
  beak.position.y = -.15;
  model.head.top.add(beak);
  model.head.add(model.head.top);

  model.add(model.head);

  var leg = new THREE.Object3D();
  var geomLegStalk = new THREE.BoxGeometry(.2,1,.2);
  var legStalk = new THREE.Mesh(geomLegStalk, grey);
  legStalk.position.y = -.5;
  leg.add(legStalk);

  var geomFoot = new THREE.BoxGeometry(.5,.2,.8);
  var foot = new THREE.Mesh(geomFoot,grey);
  foot.position.y = -1;
  foot.position.z = .3;
  leg.add(foot);

  leg.position.x = -.5;
  model.rightLeg = leg.clone();
  model.add(model.rightLeg);
  model.rightLeg.position.y = -1;
  leg.position.x = .5;
  model.leftLeg = leg;
  model.add(model.leftLeg);
  model.leftLeg.position.y = -1;

  model.name = "goose";

  return model;
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

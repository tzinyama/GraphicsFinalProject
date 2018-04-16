//Code for goose enemy

"use strict";

var goose = {
  x:0,
  y:0,
  xmin:0,
  xmax:10,
  speed:.04,
  goingRight: true,
  model:createGooseModel(),
  onCollide: function(){
    hero.die();
  }
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
    this.model.rightLeg.rotation.x = Math.sin(.1*clock)/2;
    this.model.leftLeg.rotation.x = -Math.sin(.1*clock)/2;
    this.model.head.rotation.x = Math.sin(.05*clock)/5;
    this.model.head.top.rotation.x = -Math.sin(.05*clock)/5;
  }
}

function createGooseModel(){
  var model = new THREE.Object3D();

  var brown = new THREE.MeshPhongMaterial(
                          {color:0x855E39, shading:THREE.FlatShading});
  var black = new THREE.MeshPhongMaterial(
                          {color:0x050505, shading:THREE.FlatShading});
  var grey = new THREE.MeshPhongMaterial(
                          {color:0x58595b, shading:THREE.FlatShading});
  var white = new THREE.MeshPhongMaterial(
                          {color:0xFCF0E6, shading:THREE.FlatShading});

  var geomTorso = new THREE.BoxGeometry(2,2,3);
  model.torso = new THREE.Object3D();
  model.torso.add(new THREE.Mesh(geomTorso, white));

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

  return model;
}

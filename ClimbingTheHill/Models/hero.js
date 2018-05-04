"use strict";

var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    maroon:0x862633,
};


function createHeroModel(){
  var model = new THREE.Object3D();

  var maroon = new THREE.MeshPhongMaterial(
                          {color:0x862633});
  var grey = new THREE.MeshPhongMaterial(
                          {color:0x58595b});
  var white = new THREE.MeshPhongMaterial(
                          {color:0xffffff});
  var denim = new THREE.MeshPhongMaterial(
                          {color:0x365777});
  var invisibleMat = new THREE.MeshLambertMaterial(
                          {color: 0x00ff00});
  invisibleMat.transparent = true;
  invisibleMat.opacity = 0.0;




  //torso
  var geomTorso = new THREE.BoxGeometry(6.2,4,3.2);
  model.torso = new THREE.Object3D();
  model.torso.sweater = new THREE.Mesh(geomTorso, maroon);
  model.torso.sweater.position.y = .5;
  model.torso.add(model.torso.sweater);
  var geomButt = new THREE.BoxGeometry(6,1,2);
  var matButt = new THREE.MeshPhongMaterial(
                          {color:0x365777});
  model.torso.butt = new THREE.Mesh(geomButt, matButt);
  model.torso.butt.position.y = -1.75;
  model.torso.add(model.torso.butt);
  model.torso.position.y = 4.5;
  model.torso.castShadow = true;
  model.torso.receiveShadow = true;

  model.add(model.torso);

  //Head
  model.head = new THREE.Object3D
  var geomHead = new THREE.BoxGeometry(6,6,6);
  var matHead = new THREE.MeshPhongMaterial(
                          {color:0xffffff});
  var headBase = new THREE.Mesh(geomHead, white);
  model.head.add(headBase);

    //Beanie
  var geomBeanie = new THREE.BoxGeometry(6.1,2.5,6.1);
  var matBeanie = new THREE.MeshPhongMaterial(
                          {color:0x862633});
  var beanie = new THREE.Mesh(geomBeanie, matBeanie);
  beanie.position.y = 2;
  var geomBrim = new THREE.BoxGeometry(7,1,7);
  var brim = new THREE.Mesh(geomBrim, matBeanie);
  brim.position.y = -1.5;
  beanie.brim = brim;
  beanie.add(beanie.brim);

  var geomPoof = new THREE.BoxGeometry(1.5,1.5,1.5);
  beanie.poof = new THREE.Mesh(geomPoof, grey);
  beanie.poof.position.y = 1.75;
  beanie.poof.position.z = -1;
  beanie.add(beanie.poof);

  model.head.add(beanie);

    //eyes
  var geomEye = new THREE.BoxGeometry(.65,1.5,.5);
  var matEye = new THREE.MeshPhongMaterial(
                          {color:0x000000});
  model.head.eyes = new THREE.Object3D();
  var eye = new THREE.Mesh(geomEye, matEye);
  eye.position.z = 3;
  eye.position.x = 1.75;
  eye.position.y = -1;
  model.head.eyes.add(eye.clone());
  eye.position.x = -1.75;
  model.head.eyes.add(eye);
  model.head.add(model.head.eyes);


  model.head.position.y = 10;
  model.head.position.z = .5;
  model.add(model.head);


  //legs
  var geomLeg = new THREE.BoxGeometry(2,3,2);

  var leg = new THREE.Mesh(geomLeg, denim);
  leg.castShadow = true;
  leg.receiveShadow = true;
  leg.position.y = 1.5;
  leg.position.x = 2;
  model.rightLeg = leg.clone();
  model.rightLeg.position.x = -2;
  model.add(model.rightLeg);
  model.leftLeg = leg;
  model.leftLeg.position.x = 2;
  model.add(model.leftLeg);

  //Arms
  var arm = new THREE.Object3D();
  model.rightArm = new THREE.Object3D();
  model.leftArm = new THREE.Object3D();
  var geomSleeve =  new THREE.BoxGeometry(2,3,2);
  var sleeve = new THREE.Mesh(geomSleeve,maroon);
  sleeve.position.y = -1;
  arm.add(sleeve.clone());
  var geomHand = new THREE.BoxGeometry(1.75,1,1.75);
  var hand = new THREE.Mesh(geomHand,white);
  hand.position.y = -3;
  arm.add(hand);

  model.rightArm.add(arm.clone());
  model.leftArm.add(arm);
  model.rightArm.castShadow = true;
  model.rightArm.receiveShadow = true;
  model.rightArm.position.y = model.torso.position.y+2;
  model.rightArm.position.x = -4;
  model.leftArm.castShadow = true;
  model.leftArm.receiveShadow = true;
  model.leftArm.position.y = model.torso.position.y+2;
  model.leftArm.position.x = 4;
  model.add(model.rightArm);
  model.add(model.leftArm);
  // arm.position.x = -4;
  // model.add(arm);

  //Used for bounding box
  var geomBBox = new THREE.BoxGeometry(8,13.5,4);
  model.invisibleBox = new THREE.Mesh(geomBBox, invisibleMat);
  model.invisibleBox.position.y += 7;
  model.add(model.invisibleBox);


  //Backpack
  var geomPack = new THREE.BoxGeometry(7,8,3);
  model.backpack = new THREE.Object3D();
  var pack = new THREE.Mesh(geomPack, grey);
  model.backpack.add(pack);
  geomPack = new THREE.BoxGeometry(7,4,2);
  pack = new THREE.Mesh(geomPack, grey);
  pack.position.y = -1;
  pack.position.z = -2;
  model.backpack.add(pack);
  model.backpack.position.y = 5;
  model.backpack.position.z = -3.5;
  model.add(model.backpack);

  model.scale.set(.1,.1,.1);
  return model;
}

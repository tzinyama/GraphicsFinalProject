function createSignModel(){
  var model = new THREE.Object3D();

  var geomPole = new THREE.BoxGeometry(.2,1.7,.2);
  var matPole = new THREE.MeshPhongMaterial({color:0x58595b});

  model.pole = new THREE.Mesh(geomPole,matPole);
  // model.pole.position.y = 5;
  model.add(model.pole);

  model.sign = new THREE.Object3D();
  var geomSign = new THREE.BoxGeometry(1,.4,.1);
  var matSign = new THREE.MeshPhongMaterial({color:0x862633,shading:THREE.FlatShading});
  var base = new THREE.Mesh(geomSign,matSign);
  base.position.x -= .1;
  model.sign.add(base);

  var geomPyramid = new THREE.Geometry();

  geomPyramid.vertices = [
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 1, 0 ),
      new THREE.Vector3( 1, 1, 0 ),
      new THREE.Vector3( 1, 0, 0 ),
      new THREE.Vector3( 0.5, 0.5, 1),
  ];

  geomPyramid.faces = [
      new THREE.Face3( 0, 1, 2 ),
      new THREE.Face3( 0, 2, 3 ),
      new THREE.Face3( 1, 0, 4 ),
      new THREE.Face3( 2, 1, 4 ),
      new THREE.Face3( 3, 2, 4 ),
      new THREE.Face3( 0, 3, 4 )
  ];
  var tip = new THREE.Mesh(geomPyramid,matSign);
  tip.rotation.y = Math.PI/2;
  tip.scale.set(.05,.4,.3);
  tip.rotation.y = .01+Math.PI/2;
  tip.position.set(.4,-.2,.03);

  model.sign.add(tip);

  model.sign.position.set(0,.6,.1);
  model.sign.rotation.z = .2;
  model.add(model.sign);


  return model;
}

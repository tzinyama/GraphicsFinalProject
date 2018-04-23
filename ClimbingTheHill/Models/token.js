function createTokenModel(){
  var model = new THREE.Object3D();
  var geomToken = new THREE.CylinderGeometry( 1, 1, .2, 32);
  var matToken = new THREE.MeshPhongMaterial(
                          {color:0xF8CD30});
  model.base = new THREE.Mesh(geomToken, matToken);
  model.base.rotation.x = Math.PI/2
  model.base.scale.set(.4,.4,.4);
  model.base.position.y = .5;
  model.base.solid = false;
  model.add(model.base);
  model.name = "token";

  return model;
}

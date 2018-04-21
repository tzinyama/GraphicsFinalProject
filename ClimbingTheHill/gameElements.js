var token = {
  x: 0,
  y: 0,
  model: undefined,
  init: function(x,y){
    this.x = x;
    this.y = y;
    this.model = createTokenModel()
    this.model.position.x = x;
    this.model.position.y = y;
  },
  update: function(){
    this.model.rotation.y += .03;

  },
  onCollide: function(){
    this.model.position.x = -100;
    game.tokens++;
  }
}

function createTokenModel(){
  var model = new THREE.Object3D();
  var geomToken = new THREE.CylinderGeometry( 1, 1, .2, 32);
  var matToken = new THREE.MeshPhongMaterial(
                          {color:0xF8CD30, shading:THREE.FlatShading});
  model.base = new THREE.Mesh(geomToken, matToken);
  model.base.rotation.x = Math.PI/2
  model.base.scale.set(.4,.4,.4);
  model.base.position.y = .5;
  model.add(model.base);

  return model;
}

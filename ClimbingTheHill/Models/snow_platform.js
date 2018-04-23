function createSnowPlatformModel( wid, x, y, seed ){

  var model = new THREE.Object3D();

  var matSnow = new THREE.MeshPhongMaterial(
                          {color:0xCCCCCC, shading:THREE.FlatShading});
  var geomBase = new THREE.BoxGeometry(wid, 1, 5);
  model.base = new THREE.Mesh(geomBase,matSnow);
  model.base.solid = true;
  model.base.position.y-=.5;
  model.add(model.base);

// Icicles
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
  var pyramid = new THREE.Mesh(geomPyramid, matSnow);

  pyramid.scale.set(.5,.5,1.5);
  pyramid.rotation.z = (Math.PI/4);
  pyramid.rotation.x = (Math.PI/2);
  pyramid.position.y = -.5;

  var icicle = new THREE.Object3D();
  icicle.add(pyramid);

  if(seed == 0 || seed == undefined){
    icicle.scale.set(.5,1.5,.5);
    icicle.position.y = -.5;
    icicle.position.x = -(wid/2)+wid/5;
    model.add(icicle.clone());

    icicle.position.y = .5;
    icicle.position.x = -(wid/2)+wid/12;
    model.add(icicle.clone());

    icicle.position.x = (wid/2)-wid/12;
    model.add(icicle.clone());
  }else if(seed == 1){
    icicle.scale.set(.5,1.5,.5);
    icicle.position.y = 0;
    icicle.position.x = (wid/2)-wid/6;
    model.add(icicle.clone());

    icicle.position.y = -.5;
    icicle.position.x = -(wid/2)+wid/5;
    model.add(icicle.clone());

    icicle.position.y = 0;
    icicle.position.x = wid/5;
    model.add(icicle.clone());
  }

  model.scale.set(1,.3,.3);
  model.position.x = x;
  model.position.y = y;
  model.name = "snowPlatform";

  return model;
}

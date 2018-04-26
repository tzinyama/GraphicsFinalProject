function createCloudModel(){

  var model = new THREE.Object3D();
  var geom = new THREE.BoxGeometry(2,2,2);
  var mat = new THREE.MeshPhongMaterial({
		color:0xFFFFFF,
	});
  model.blocks = [];
  for (var i=0; i<4; i++ ){

		// create the mesh by cloning the geometry
		var m = new THREE.Mesh(geom, mat);

		// set the position and the rotation of each cube randomly
		m.position.x = i*.8 - 1.5;
		m.position.y = Math.random() * 2;
		m.position.z = Math.random();
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;

		// set the size of the cube randomly
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);

    model.blocks.push(m);
		model.add(m);
	}
  model.scale.set(.25,.25,.25);
  return model;
}

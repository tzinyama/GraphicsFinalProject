

function createToken(x,y){

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
      this.model.base.parentObject = this;
    },
    update: function(){
      this.model.rotation.y += .03;

    },
    onCollide: function(){
      this.model.position.x = -100;
      game.tokens++;
    }
  }

  token.init(x,y);
  return token;

}


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

function createCloud(){
  var cloud = {
    x:0,
    y:0,
    model:undefined,
    animClock:0,
    done:true,
    bs1:0,bs2:0,bs3:0,bs4:0,
    init:function(x,y){
      this.x = x;
      this.y = y;
      if(this.model == undefined){ this.model = createCloudModel();}
      else{ this.changeModel();}
      this.bs1 = this.model.blocks[0].scale.x;
      this.bs2 = this.model.blocks[1].scale.x;
      this.bs3 = this.model.blocks[2].scale.x;
      this.bs4 = this.model.blocks[3].scale.x;
      this.model.position.x = x;
      this.model.position.y = y;
      this.animClock = 20;
      this.done = false;
    },
    update:function(){
      if(this.animClock > 1){
        this.animClock--;
        var s = this.animClock/20;
        var blockScale = this.bs1 * s;
        this.model.blocks[0].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[0].rotation.z += .05;
        blockScale = this.bs2 * s;
        this.model.blocks[1].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[1].rotation.z += .05;
        blockScale = this.bs3 * s;
        this.model.blocks[2].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[2].rotation.z += .05;
        blockScale = this.bs4 * s;
        this.model.blocks[3].scale.set(blockScale,blockScale,blockScale);
        this.model.blocks[3].rotation.z += .05;
      } else{
        this.done = true;
        this.model.position.x = -100;
      }
    },
    changeModel:function(){
      for(var i = 0; i<this.model.blocks.length; i++){
        this.model.blocks[i].position.y = Math.random();
    		this.model.blocks[i].position.z = Math.random();
    		this.model.blocks[i].rotation.z = Math.random()*Math.PI*2;
    		this.model.blocks[i].rotation.y = Math.random()*Math.PI*2;
        var s = .1 + Math.random()*.9;
    		this.model.blocks[i].scale.set(s,s,s);
      }
    }
  }

  return cloud;
}

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

		// allow each cube to cast and to receive shadows

		// add the cube to the container we first created
    model.blocks.push(m);
		model.add(m);
	}
  model.scale.set(.25,.25,.25);
  return model;


}

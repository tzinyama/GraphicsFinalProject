"use strict";

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;

var hemisphereLight, shadowLight;

function createPlatform() {
   var platform = new THREE.Mesh(
            new THREE.BoxGeometry(5,5,0),
            new THREE.MeshLambertMaterial( { color: 0x00CC55 } )
          );
   scene.add(platform);
}

function createLights() {
	// A hemisphere light is a gradient colored light;
	// the first parameter is the sky color, the second parameter is the ground color,
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

	// A directional light shines from a specific direction.
	// It acts like the sun, that means that all the rays produced are parallel.
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Set the direction of the light
	shadowLight.position.set(150, 350, 350);

	// Allow shadow casting
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better,
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}


function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();

	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);

	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 100;
	camera.position.y = 0;

	// Create the renderer
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the
	// container we created in the HTML
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);

  renderer.render(scene, camera);
};

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}


function loop(){
	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}



function init() {
	// set up the scene, the camera and the renderer
	createScene();

	// add game elements
	createLights();
  createPlatform();

	loop();
}

window.addEventListener('load', init, false);


window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	
	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 50;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	hlight = new THREE.AmbientLight (0xffffff,1);
	scene.add(hlight);

	light = new THREE.DirectionalLight(0xffffff,2);
	light.position.set(0,100,100);
	scene.add(light);

	light2 = new THREE.PointLight(0xffffff,1);
	light2.position.set(0,1000,0);
	scene.add(light2);

	

	const loader = new THREE.GLTFLoader();
	loader.load('./model/scene.gltf', function(gltf){
	  keyBoard = gltf.scene.children[0];
	  keyBoard.scale.set(0.5,0.5,0.5);
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	function animate(time) {
		time *= 0.001;  // convert time to seconds

		const speed = 1;
		const rot = time * speed;
		keyBoard.rotation.x = rot;
		
	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);
}



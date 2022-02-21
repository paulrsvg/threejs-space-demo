import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 1. Scene - background
const scene = new THREE.Scene();

// 2. Camera - perspective,  frame of view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 3. Renderer - doing the drawing stuff
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// 1. Geometry - the xyz pts that makeup a shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// 2. Material - the wrapping paper/texture for an object
// to see wireframe, no lighting needed
// const material = new THREE.MeshBasicMaterial ({ color: 0xFF00FF, wireframe: true,}); 
const material = new THREE.MeshStandardMaterial ({ color: 0xFF6347});

// 3. Mesh - geometry + the material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);


// Lights

// ps 0xffffff is a hex literal value in js
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
//need lighting to see standard material (not just wireframe)
pointLight.position.set(15, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//now some helpers yay
const sphereSize = 1;
const pointlightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
//gridhelper reminds me of battlezone grid haha
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointlightHelper, gridHelper);

// listen to dom events w/ mouse and update camera accordingly
const controls = new OrbitControls(camera, renderer.domElement);

//TODO: learn how to do rainbows and make the color pink or purple - my daughter lol

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  // randomly generate array w/ xyz coords to put a star in space somewhere
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar); //make 200 stars dang

//add space backgrd (from unsplash https://unsplash.com/photos/ln5drpv_ImI)
const spaceTexture = new THREE.TextureLoader().load('space-unsplash.jpg');
scene.background = spaceTexture;

//texture mapping - taking 2d pixels and mapping to a 3d geometry, adding diff textures to diff parts or materials
// kinda like sprite mapping in gamedev? texture is more an image applied to a surface

// avatar/headshot
const paulTexture = new THREE.TextureLoader().load('paul.jpg');

const paul = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: paulTexture})
);

scene.add(paul);

// add a planet, texture map from: https://www.solarsystemscope.com/textures/
const moonTexture = new THREE.TextureLoader().load('mars.jpg');
// add a normal map to give it bumps: https://www.deviantart.com/samio85/art/Cite-Normal-Map-Inverse-459058966
const normalTexture = new THREE.TextureLoader().load('normal.jpg');


const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30; // these do the same thing
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  paul.rotation.y += 0.01;
  paul.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate () { // similar to a game loop in gamedev
  requestAnimationFrame(animate);
  
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera)
}

animate();
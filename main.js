import './style.css'

import * as THREE from 'three';

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

renderer.render(scene, camera);

// 1. Geometry - the xyz pts that makeup a shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// 2. Material - the wrapping paper/texture for an object
// to see wireframe, no lighting needed
// const material = new THREE.MeshBasicMaterial ({ color: 0xFF6347, wireframe: true,}); 
const material = new THREE.MeshStandardMaterial ({ color: 0xFF6347});

// 3. Mesh - geometry + the material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// ps 0xffffff is a hex literal value in js
const pointLight = new THREE.PointLight(0xffffff);
//need lighting to see standard material (not just wireframe)
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

function animate () { // similar to a game loop in gamedev
  requestAnimationFrame(animate);
  renderer.render(scene, camera)
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
}

animate();
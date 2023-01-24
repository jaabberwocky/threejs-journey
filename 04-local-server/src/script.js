import * as THREE from "three";

// scene is needed to add anything
const scene = new THREE.Scene();

// manually set size
const sizes = {
    width: 800,
    height: 600,
}

// red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#301E67' });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl'),
})
console.log(renderer);
renderer.setSize(sizes.width, sizes.height);

// move camera backwards
camera.position.z = 3;
camera.position.y = 1;
renderer.render(scene, camera);
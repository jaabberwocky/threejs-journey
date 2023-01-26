import * as THREE from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// animations
const clock = new THREE.Clock();

// animation functions to keep things 
// well-structured
function moveCube(elapsedTime) {
    mesh.position.y = Math.sin(elapsedTime);
}

function rotateCube(elapsedTime) {
    mesh.rotation.x = elapsedTime;
    mesh.rotation.z = elapsedTime * Math.PI * 1 / 2;
    mesh.rotation.y = elapsedTime;
}

// gsap - external animation library
gsap.to(mesh.position, { duration: 5, delay: 0.5, x: 4, z: -3 })

// main animation function
const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    rotateCube(elapsedTime);
    moveCube(elapsedTime);

    camera.lookAt(mesh.position);

    renderer.render(scene, camera)
    window.requestAnimationFrame(animate);
}
animate();
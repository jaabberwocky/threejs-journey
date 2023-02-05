import * as THREE from 'three'
import { AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log(OrbitControls);

/**
 * Camera
 */
const cursor = {
    x: 0,
    y: 0
}

// listen to the camera move
window.addEventListener('mousemove', (event) => {
    // subtract 0.5 to normalize middle to 0
    cursor.x = Math.min(event.clientX / sizes.width - 0.5, 0.5);
    cursor.y = Math.min(event.clientY / sizes.height - 0.5, 0.5);
    // console.log(cursor);
})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// axes helper
const axesHelper = new AxesHelper();
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // // update camera
    // if (Math.abs(cursor.x) == 0.5) {
    //     camera.position.x = 0;
    // }
    // if (Math.abs(cursor.y) == 0.5) {
    //     camera.position.y = 0;
    // }
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = -cursor.y * 5;
    // camera.lookAt(mesh.position);

    // update controls
    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
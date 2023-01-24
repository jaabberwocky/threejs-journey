import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// using group this time
const group = new THREE.Group();
scene.add(group);

const colors = ['#84D2C5', '#E4C988', '#C27664', '#B05A7A'];

for (let i = 0; i < 4; i++) {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: colors[i] }),
    )
    cube.position.set(1 + (i * 2), 1, 1);
    group.add(cube);
}

group.scale.z = -2;
group.rotation.y = Math.PI * (1 / 8);
group.rotation.x = Math.PI * (1 / 4);
group.rotation.z = Math.PI / 12;

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 7);
scene.add(camera)

// add axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
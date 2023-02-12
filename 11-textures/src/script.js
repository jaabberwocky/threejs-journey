import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/* Texture loading */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log('loading start')
loadingManager.onProgress = () => console.log('loading in progress')
loadingManager.onLoaded = () => console.log('load complete')
loadingManager.onError = (e) => console.log(e + ': load error')

const textureLoader = new THREE.TextureLoader(loadingManager); // you can reuse this textureLoader for other textures
const colorTexture = textureLoader.load(
    '/textures/door/color.jpg'
)
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const checkboardTexture = textureLoader.load('/textures/checkerboard-8x8.png')

/* rock textures */
const rockyTexture = textureLoader.load('/textures/rock/GroundDirtRocky002_COL_2K.jpg')
const rockyNormalTexture = textureLoader.load('/textures/rock/GroundDirtRocky002_NRM_2K.jpg')
const rockyHeightTexture = textureLoader.load('/textures/rock/GroundDirtRocky002_DISP_2K.jpg')
const rockyBumpTexture = textureLoader.load('/textures/rock/GroundDirtRocky002_BUMP_2K.jpg')
const rockyAOTexture = textureLoader.load('/textures/rock/GroundDirtRocky002_AO_2K.jpg')
const rockyMetalTexture = textureLoader.load('/textures/rock/GroundDirtRocky002_GLOSS_2K.jpg')

// colorTexture.repeat.y = 2
// colorTexture.repeat.x = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 1.5
// colorTexture.center.y = 1.5

checkboardTexture.minFilter = THREE.NearestFilter
checkboardTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshBasicMaterial({ map: checkboardTexture, color: 0xffbbff })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

/*  
Add rock
*/
const rockGeometry = new THREE.SphereGeometry()
const rockMaterial = new THREE.MeshStandardMaterial({
    map: rockyTexture,
    normalMap: rockyNormalTexture,
    displacementMap: rockyHeightTexture,
    displacementScale: 0.05,
    roughnessMap: rockyBumpTexture,
    roughness: 0.7,
    aoMap: rockyAOTexture,
    metalnessMap: rockyMetalTexture
})
const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial)
rockMesh.minFilter = THREE.NearestFilter
rockMesh.magFilter = THREE.NearestFilter
scene.add(rockMesh)

/* directional light */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
directionalLight.position.set(5, 20, 0);
scene.add(directionalLight);
scene.add(lightHelper);

const bottomDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
const bottomLightHelper = new THREE.DirectionalLightHelper(bottomDirectionalLight, 5);
bottomDirectionalLight.position.set(-5, -20, 0)
scene.add(bottomDirectionalLight)
scene.add(bottomLightHelper)

/* ambient light */
const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // rotate sphere
    rockMesh.rotation.x = elapsedTime * Math.PI / 16

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
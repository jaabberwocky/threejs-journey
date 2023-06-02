import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import * as dat from 'lil-gui'
import { check } from 'prettier';

/**
 * Base
 */
// Debug


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/3.png')
const matcapTextureFont = textureLoader.load('textures/matcaps/8.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

/**
 * utility functions
 */
const checkIntersection = (mesh1, mesh2) => {
    let bbox1 = new THREE.Box3().setFromObject(mesh1)
    let bbox2 = new THREE.Box3().setFromObject(mesh2)

    return bbox1.intersectsBox(bbox2)
}

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const materialFont = new THREE.MeshMatcapMaterial({ matcap: matcapTextureFont })

        // Text
        const textGeometry = new TextGeometry(
            'Tobias',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, materialFont)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

        // create spheres
        for (let i = 0; i < 150; i++) {
            // random color
            let randomColor = '#' + (Math.floor(Math.random() * 2 ** 24)).toString(16).padStart(0, 6)
            const tetraMaterial = new THREE.MeshPhongMaterial({ color: randomColor, wireframe: false })
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1, 4, 4),
                tetraMaterial
            )
            sphere.position.x = (Math.random() - 0.5) * 10
            sphere.position.y = (Math.random() - 0.5) * 10
            sphere.position.z = (Math.random() - 0.5) * 10

            if (checkIntersection(sphere, text)) {
                continue
            }
            sphere.rotation.x = Math.random() * Math.PI
            sphere.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            sphere.scale.set(scale, scale, scale)

            scene.add(sphere);
        }

        for (let i = 0; i < 50; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            if (checkIntersection(donut, text)) {
                continue
            }
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)

// add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

// post processing

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);

const outputPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(outputPass);

const params = {
    shape: 1,
    radius: 5,
    rotateR: Math.PI / 12,
    rotateB: Math.PI / 12 * 2,
    rotateG: Math.PI / 12 * 3,
    scatter: 0,
    blending: 1,
    blendingMode: 1,
    greyscale: false,
    disable: false
};
const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, params);
composer.addPass(halftonePass);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // rotate camera
    camera.position.x = Math.sin(elapsedTime * 0.5)
    camera.position.y = Math.sin(elapsedTime * 0.5)
    camera.position.z = Math.cos(elapsedTime * 0.5)

    // Update controls
    controls.update()

    // Render
    composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
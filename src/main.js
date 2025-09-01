import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// === Basic Scene Setup ===
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// === Camera ===
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 4); // Pull the camera back
scene.add(camera);

// === Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


// === GLTF Model Loader ===
const gltfLoader = new GLTFLoader();
let model = null; // We'll store the model here to access it in the animation loop

gltfLoader.load(
    '../res/models/device.glb', // Your model file
    (gltf) => {
        console.log('Model loaded successfully!');
        model = gltf.scene;

        // Automatically center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.3 / maxDim;
        model.scale.set(scale, scale, scale);

        model.position.x = 1.4;

        scene.add(model);
    },
    (progress) => { console.log(`Loading: ${Math.round(progress.loaded / progress.total * 100)}%`); },
    (error) => { console.error('Error loading model:', error); }
);


// === Renderer ===
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;


// === Animation Loop ===
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // If the model has loaded, rotate it smoothly on the Y-axis
    if (model) {
        model.rotation.y = elapsedTime * 0.4; // Adjust '0.4' to make it faster or slower
    }

    // Render the scene
    renderer.render(scene, camera);

    // Call the next frame
    window.requestAnimationFrame(tick);
};

tick();


// === Handle Window Resizing ===
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});



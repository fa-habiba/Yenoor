import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

// --- 1. CONTROL PANEL ---
const CONTAINER_ID = 'canvas-container';

// SETTINGS FOR MAIN LOGO ("YENOOR")
const LOGO_OPTS = {
    scaleDesktop: 0.02,    
    scaleMobile: 0.006,    
    yOffset: 0.5,          // Move up slightly
    color: 0xffffff,       
    metalness: 0.0,        
    roughness: 0.0,        
    transmission: 0.8,     
    thickness: 1.0,        
    opacity: 1.0,          
};

// SETTINGS FOR SUBTITLE ("COMING SOON")
const SUBTITLE_OPTS = {
    scaleDesktop: 0.005,   // Usually smaller than logo
    scaleMobile: 0.003,    
    yOffset: -1.0,         // Move DOWN below the logo
    color: 0xffffff,       
    metalness: 0.2,        
    roughness: 0.1,        
    transmission: 0.75,     
    thickness: 1.0,        
    opacity: 1.0,          
};

// --- Global Variables ---
let camera, scene, renderer;
let controls;
let raycaster, mouse;
let clickableObjects = []; 
let floatingObjects = []; 
let pivotGroup; 
let logoMesh; 
let subtitleMesh; // New variable for the subtitle

init();
animate();

function init() {
    const container = document.getElementById(CONTAINER_ID);
    const isMobile = window.innerWidth < 768;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = null; 

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 14 : 9); 

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace; 
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 5A. LOAD MAIN LOGO
    if (window.GAME_ASSETS && window.GAME_ASSETS.logo) {
        loadSVG(window.GAME_ASSETS.logo, LOGO_OPTS, (mesh) => {
            logoMesh = mesh;
            scene.add(logoMesh);
        });
    }

    // 5B. LOAD SUBTITLE
    if (window.GAME_ASSETS && window.GAME_ASSETS.subtitle) {
        loadSVG(window.GAME_ASSETS.subtitle, SUBTITLE_OPTS, (mesh) => {
            subtitleMesh = mesh;
            scene.add(subtitleMesh);
        });
    }

    // 6. Pivot Group
    pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    // 7. Load Assets (Jewelry)
    const gltfLoader = new GLTFLoader();
    const assetKeys = Object.keys(window.GAME_ASSETS || {});
    // Ignore SVGs
    const glbKeys = assetKeys.filter(key => key !== 'logo' && key !== 'subtitle'); 
    const totalItems = glbKeys.length;
    
    const radius = isMobile ? 2.0 : 3.0; 

    if (totalItems > 0) {
        glbKeys.forEach((key, index) => {
            const url = window.GAME_ASSETS[key];
            gltfLoader.load(url, function (gltf) {
                const model = gltf.scene;
                const angle = (index / totalItems) * Math.PI * 2;
                
                model.position.x = Math.cos(angle) * radius;
                model.position.z = Math.sin(angle) * radius;
                model.position.y = 0; 
                
                const itemScale = isMobile ? 0.3 : 0.1;
                model.scale.set(itemScale, itemScale, itemScale);
                
                model.rotation.y = Math.random() * Math.PI;
                model.rotation.z = Math.random() * 0.5;

                if (key === 'ring') model.name = "Mystery_Ring";
                if (key === 'bracelet') model.name = "Bracelet_Of_Speed";

                model.traverse((node) => { 
                    if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } 
                });

                pivotGroup.add(model);
                clickableObjects.push(model);
                floatingObjects.push({ 
                    mesh: model, baseY: 0, speed: 1.0 + Math.random(), amp: 0.2, offset: Math.random() * Math.PI 
                });

                const loader = document.getElementById('loading-overlay');
                if(loader) loader.style.display = 'none';
            });
        });
    } else {
        const loader = document.getElementById('loading-overlay');
        if(loader) loader.style.display = 'none';
    }

    // 8. Interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; 

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('pointerdown', onPointerDown);
}

// --- HELPER: GENERIC SVG LOADER ---
function loadSVG(url, options, callback) {
    const isMobile = window.innerWidth < 768;
    const svgLoader = new SVGLoader();
    
    svgLoader.load(url, function (data) {
        const paths = data.paths;
        const group = new THREE.Group();

        const material = new THREE.MeshPhysicalMaterial({
            color: options.color,
            metalness: options.metalness,
            roughness: options.roughness,
            transmission: options.transmission,
            thickness: options.thickness,
            opacity: options.opacity,
            transparent: (options.opacity < 1.0 || options.transmission > 0),
            side: THREE.DoubleSide
        });

        for (const path of paths) {
            const shapes = SVGLoader.createShapes(path);
            for (const shape of shapes) {
                const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 2, 
                    bevelEnabled: true, 
                    bevelThickness: 0.5, 
                    bevelSize: 0.5, 
                    bevelSegments: 3
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true; 
                mesh.receiveShadow = true;
                group.add(mesh);
            }
        }

        // Center Geometry
        const box = new THREE.Box3().setFromObject(group);
        const center = new THREE.Vector3(); 
        box.getCenter(center);
        group.position.set(-center.x, -center.y, -center.z);

        // Wrapper for scaling/positioning
        const meshWrapper = new THREE.Group();
        meshWrapper.add(group);

        const finalScale = isMobile ? options.scaleMobile : options.scaleDesktop;
        meshWrapper.scale.set(finalScale, -finalScale, finalScale); 
        
        // Apply Y Offset (Up or Down)
        meshWrapper.position.y = options.yOffset;

        callback(meshWrapper);
    });
}

function onWindowResize() {
    const container = document.getElementById(CONTAINER_ID);
    const isMobile = container.clientWidth < 768;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.position.z = isMobile ? 14 : 9;
}

function onPointerDown(event) {
    const modal = document.getElementById('game-modal');
    if (modal && modal.style.display !== 'none') return;
    if (event.target !== renderer.domElement) return;

    const container = document.getElementById(CONTAINER_ID);
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pivotGroup.children, true);

    if (intersects.length > 0) {
        let object = intersects[0].object;
        while(object.parent && object.parent !== pivotGroup) {
            object = object.parent;
        }
        if (clickableObjects.includes(object)) triggerGame(object.name);
    }
}

function triggerGame(objectName) {
    const modal = document.getElementById('game-modal');
    const title = document.getElementById('game-title');
    modal.style.display = 'flex';
    title.innerText = objectName.replace('_', ' ');
    if (window.loadGameModule) window.loadGameModule(objectName);
}

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    pivotGroup.rotation.y = time * 0.2; 
    pivotGroup.rotation.z = Math.sin(time * 0.1) * 0.1; 

    // FACE BOTH SVGs TO CAMERA
    if (logoMesh) logoMesh.lookAt(camera.position);
    if (subtitleMesh) subtitleMesh.lookAt(camera.position);

    floatingObjects.forEach(obj => {
        obj.mesh.position.y = obj.baseY + Math.sin(time * obj.speed + obj.offset) * obj.amp;
        obj.mesh.rotation.y += 0.01;
    });

    controls.update();
    renderer.render(scene, camera);
}
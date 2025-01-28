import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from 'lil-gui';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
const dracoLoaderPath = "https://raw.githubusercontent.com/armouredmaoG/Recreation-Assets/main/draco/";
const envPath = "https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/2k.hdr";
//Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Draco Loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(dracoLoaderPath);
loader.setDRACOLoader(dracoLoader);

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(sizes.width, sizes.height);

//Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener("mousemove", (e)=>{
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
})



const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () =>{
    console.log("loading started");
}
loadingManager.onProgress = (url, loaded, total) =>{
    console.log(`${url} loaded ${loaded} / ${total}`);
}
loadingManager.onLoad = () =>{
    console.log("loading complete");
}
loadingManager.onError = () =>{
    console.log("error occured");
}

/**
 * Objects
 */
const door = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/67987878ecfff5a72e8a8f8f_door.jpg");
const doorAmbientTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/ambientOcclusion.jpg");
const doorMetalnessTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/679882aae68ab6a242e9f5f1_metalness.jpg");
const doorRoughnessTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/679882aa71c9ba99a5ae632e_roughness.jpg");
const doorNormalTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/6798812c2a289e9c90c6ae74_normal.jpg");
const doorAlphaTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/679881bb8a779976f88faa6e_alpha.jpg");
const doorHeightTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/679881f0a93b7dd2569e0a91_height.png");
const mapCapTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/6798787819518c6721d2b9e8_1.png");
const gradientTexture = new THREE.TextureLoader(loadingManager).load("https://cdn.prod.website-files.com/678f866a4e1fe9f87e767014/67987878979c58d8cc47df36_3.jpg");
door.colorSpace = THREE.SRGBColorSpace;
mapCapTexture.colorSpace = THREE.SRGBColorSpace;
gradientTexture.colorSpace = THREE.SRGBColorSpace;

//MeshStandard Material
const material = new THREE.MeshStandardMaterial();
// material.matcap = mapCapTexture;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

material.metalness = 1;
material.roughness = 1;
material.map = door;
material.aoMap = doorAmbientTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);

// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);


const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1.1,100, 100), material);
planeMesh.position.x = -1.5;
const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
// sphereMesh.position.x = 1;
const torusMesh = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 28), material);
torusMesh.position.x = 1.5;

scene.add(planeMesh, sphereMesh, torusMesh);

//Lights

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;

// scene.add(pointLight);

//Envirnment Map

const rgbeLoader = new RGBELoader();
rgbeLoader.load(envPath, (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
    scene.environment = envMap;
})


window.addEventListener("resize", (e)=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
})

window.addEventListener("dblclick", (e)=>{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen){
            canvas.requestFullscreen();
        }else if(canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen();
        }   
    }
    else
    {
        if(document.exitFullscreen){
            document.exitFullscreen();
        }else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }
    }
})  

/**
 * Camera
 */
const aspectRatio = sizes.width / sizes.height; 
const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 30); // Perspective Camera
camera.position.z = 8; //Camera positions for Perspective Camera
scene.add(camera)


//Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;



const clock = new THREE.Clock();

const tick = () =>{

    let elapsedTime = clock.getElapsedTime();
    sphereMesh.rotation.y = 0.5 * elapsedTime;
    planeMesh.rotation.y = 0.5 * elapsedTime;
    torusMesh.rotation.y = 0.5 * elapsedTime;

    sphereMesh.rotation.y = -0.5 * elapsedTime;
    planeMesh.rotation.y = -0.5 * elapsedTime;
    torusMesh.rotation.y = -0.5 * elapsedTime;

    //Update controls
    controls.update();


    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);;
}

tick();
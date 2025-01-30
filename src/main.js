import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const dracoLoaderPath = "https://raw.githubusercontent.com/armouredmaoG/Recreation-Assets/main/draco/";

const models = {
    candyWrapper: "https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/chocolatina_silencio_c.glb",
    canObject: "https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/can_silencio_c.glb",
    bolsaObject: "https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/bolsa_silencio_c.glb",
    zumoObject: "https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/zumo_silencio_c.glb"
};

const envStudio = "https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/studio_small_09_1k_low.hdr";

//Sizes
const sizes = {
    x: window.innerWidth,
    y: window.innerHeight
}

//Debug
// const gui = new GUI();

// Canvas
const canvas = document.getElementById('root');

// Scene
const scene = new THREE.Scene();
gsap.registerPlugin(ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
  var preloader = document.getElementById("preloader");
  var aceptar = document.querySelector("#aceptar");
  var lateral = document.querySelector("#lateral");
  var superiorstart = document.querySelector("#superiorstart");
  var silenciostart = document.querySelector("#silenciostart");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50, // Field of view (FoV)
    sizes.x / sizes.y, // Aspect ratio
    0.1, // Near clipping
    50 // Far clipping
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 12;
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.update();

  const renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
 
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(20, 0, 0); 
  directionalLight.target.position.set(0, 0, 0);
  scene.add(directionalLight);

  // Load the GLB file
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoLoaderPath);
  loader.setDRACOLoader(dracoLoader);

  // Load HDR environment map
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(envStudio, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = texture;
  });

  loader.load(models.candyWrapper, (gltf) => {
    const model = gltf.scene;
    let light = new THREE.PointLight("red", 1);
    light.position.set(-5, -20, 5);
    
    model.traverse((node) => {
        if (node.isMesh) {
          let mesh = node;
          mesh.material.metalness = 0;
          mesh.material.roughness = 0;  
          mesh.castShadow = true;
          mesh.receiveShadow = true;   
        
        }
    });

    model.position.x = 0.5;
    model.position.y = 2.5;
    model.position.z = -5;
    model.scale.set(0.05, 0.05, 0.05);
    model.rotation.x = 0.1;
    model.rotation.y = 1.4;
    model.rotation.z = 1.4;
    model.add(light);
    scene.add(model);
    gsap.from(model.position, {
        y: -20,
        duration: 4,
        ease: "power4.inOut",
    }),
    gsap.to(model.rotation, {
        duration: 4,
        x: 2.625,
        y: 0.4,
        z: 5.82,
        ease: "power4.easeInOut",
        immediateRender: !1,
    });
  });

  loader.load(models.bolsaObject, (gltf) => {
    const model = gltf.scene;
    let light = new THREE.PointLight("red", 1);
    light.position.set(-5, -20, 5);
    
    model.traverse((node) => {
        if (node.isMesh) {
          let mesh = node;

          mesh.material.metalness = 0;
          mesh.material.roughness = 0.15;  
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.scale.set(100, 100, 100);
        
        }
    });

    model.position.x = -3.5;
    model.position.y = 0;
    model.position.z = 0;
    model.scale.set(0.03, 0.03, 0.03);
    model.rotation.x = -Math.PI / 2;
    model.rotation.y = -0.2;
    model.rotation.z = 0.1;
    model.add(light);
    scene.add(model);
    gsap.from(model.position, {
        y: -20,
        duration: 4,
        ease: "power4.inOut",
    }),
    gsap.from(model.rotation, {
        duration: 4,
        x: 0,
        y: 0,
        z: 0,
        ease: "power4.easeInOut",
        immediateRender: !1,
    });
  });

  loader.load(models.canObject, (gltf) => {
    const model = gltf.scene;
    let light = new THREE.PointLight("red", 1);
    light.position.set(-5, -20, 5);
    
    model.traverse((node) => {
        if (node.isMesh) {
            if(node.name === "Aluminum_Standard_Can_330ml_v_2"){
                node.material.metalness = 0;
                node.material.roughness = 0.2;
                node.rotation.set(-(Math.PI / 2), 0, .37);
            }else if(node.name === "Aluminum_Standard_Can_330ml_v_21"){
                node.material.roughness = 0.3;
                node.rotation.set(-(Math.PI / 2), 0, 1.57);

            }else if(node.name === "Aluminum_Standard_Can_330ml_v_22"){
                node.material.roughness = 0.3;
                node.rotation.set(-(Math.PI / 2), 0, 0);
            }
            node.position.x = 0;
            node.position.y = 0;
            node.position.z = 0;     
        }
    });
    model.rotation.set(-Math.PI / 2, 0, -3.1);
    model.scale.set(0.025, 0.025, 0.025);
    model.position.set(0, -2, 2);
    model.add(light);
    scene.add(model);
    gsap.from(model.position, {
        y: -20,
        duration: 4,
        ease: "power4.inOut",
    }),
    
    gsap.from(model.rotation, {
        duration: 4,
        x: 0,
        y: 0,
        z: 0,
        ease: "power4.easeInOut",
        immediateRender: !1,
    });
  });
  loader.load(models.zumoObject, (gltf) => {
    const model = gltf.scene;
    console.log("Zumo Model: ",model)
    let light = new THREE.PointLight("red", 1);
    light.position.set(-5, -20, 5);
    
    model.traverse((node) => {
        if(node.isObject3D){
            if(node.name === "Subdivision_Surface" || node.name === "Subdivision_Surface001" || node.name === "Subdivision_Surface002"){
                node.position.set(0, -56.29, 0);
            }
        }

        if (node.isMesh) {
            if(node.name === "Wrapper"){
                node.position.set(-.76, 61.13, 18.16);
                node.rotation.set(0, 0, 2.88); 
                node.material.color.set(0xffffff);
                node.material.side= THREE.DoubleSide; 
                node.material.opacity= 0.7; // Ensures visibility from both sides
                node.material.transparent= true; // Allows transparency
                node.material.needsUpdate = true;
            }else if(node.name === "Straw"){
                node.position.set(32.15, 159.14, 19.83);
                node.rotation.set(Math.PI / 2, -.26, Math.PI);
                node.scale.set(1, -1, 1);
            }else if(node.name === "Packaging-Box"){
                node.position.set(-.76, 61.13, 18.16);
                node.material.metalness = 0;
                node.material.roughness = 0.5;
            }else if(node.name === "Packaging-Foil"){
                node.position.set(-.76, 61.13, 18.16);
            }
            console.log("Found mesh for Zumo:", node);
            let mesh = node;
        
        }
    });
    model.add(light);
    model.position.set(3.2, 0, 0);
    model.scale.set(0.025, 0.025, 0.025);
    scene.add(model);
    gsap.from(model.position, {
        y: -20,
        duration: 4,
        ease: "power4.inOut",
    }),
    gsap.from(model.rotation, {
        duration: 4,
        x: 0,
        y: 0,
        z: 0,
        ease: "power4.easeInOut",
        immediateRender: !1,
    });
  });
  
  
  let clock = new THREE.Clock();
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  preloader.classList.add("ready");
  document.fonts.ready.then(function () {
    aceptar.classList.add("fonts");
    silenciostart.classList.add("ready");
    gsap.to("#root", {
      filter: "blur(0px)",
      ease: "power4.easeInOut",
      immediateRender: !1,
    });    
    animate();//Float models
    setTimeout(function () {
      setTimeout(function () {
        aceptar.classList.add("ready");
      }, 4000),
      gsap.to(silenciostart, {
          duration: 1.5,
          x: 0,
          ease: "power4.easeOut",
          immediateRender: !1,
      }),
      gsap.to("#superiormask div", {
          delay: 1,
          duration: 0.8,
          y: 0,
          stagger: 0.3,
          ease: "power4.easeOut",
          immediateRender: !1,
      });
    }, 500);
  });

  

  const moveElement = (x, y) => {
    gsap.to("#aceptar .aceptar_text", {
      x: x,
      y: y,
      duration: 0.1,
      ease: "power4.easeInOut",
      immediateRender: false,
    });
  };
  document.addEventListener("mousemove", (event) => {
    moveElement(event.pageX, event.pageY);
  });

  aceptar.onclick = function () {
    setTimeout(function () {
      setTimeout(function () {
        // printAudio.play();
      }, 100);
    }, 2000);
    superiorstart.classList.add("ready");
    lateral.classList.add("ready");
    aceptar.classList.add("out");

    ScrollTrigger.refresh();
  };
});

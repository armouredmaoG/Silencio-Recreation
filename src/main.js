import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) =>{
  lenis.raf(time * 1000);
})
gsap.ticker.lagSmoothing(0);
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
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
document.addEventListener("DOMContentLoaded", () => {
  var preloader = document.getElementById("preloader");
  var wrapper = document.querySelector("#wrapper");
  var aceptar = document.querySelector("#aceptar");
  var lateral = document.querySelector("#lateral");
  var superiorstart = document.querySelector("#superiorstart");
  var superior = document.querySelector("#superior");
  var silenciostart = document.querySelector("#silenciostart");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50, // Field of view (FoV)
    sizes.x / sizes.y, // Aspect ratio
    0.1, // Near clipping
    30 // Far clipping
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 12;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);
  // gui.add(camera.position, 'x', -100, 100).step(1).name('Camera X');
  // gui.add(camera.position, 'y', -100, 100).step(1).name('Camera Y');
  // gui.add(camera.position, 'z', 1, 100).step(1).name('Camera Z');
  // gui.add(camera.rotation, 'x', -100, 100).step(0.01).name('Camera Rotation X');
  // gui.add(camera.rotation, 'y', -100, 100).step(0.01).name('Camera Rotation Y');
  // gui.add(camera.rotation, 'z', 1, 100).step(0.01).name('Camera Rotation Z');
    

  // const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;
  // controls.enableZoom = true;
  // controls.update();

  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  canvas.appendChild(renderer.domElement);
 
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0);
  scene.add(ambientLight);
 
function FloatingModel(
  object, 
  speed = 1, 
  rotationIntensity = 1, 
  floatIntensity = 1, 
  floatingRange = [-0.1, 0.1]
) {
  const baseRotationX = object.rotation.x;
  const baseRotationY = object.rotation.y;
  const baseRotationZ = object.rotation.z;

  let startTime = Math.random() * 10000;

  function update(deltaTime) {
    if (!isRotationEnabled) return; // If rotation is disabled, skip the update

    const elapsedTime = startTime + deltaTime;

    object.rotation.x = baseRotationX + Math.cos((elapsedTime / 4) * speed) / 8 * rotationIntensity;
    object.rotation.y = baseRotationY + Math.sin((elapsedTime / 4) * speed) / 8 * rotationIntensity;
    object.rotation.z = baseRotationZ + Math.sin((elapsedTime / 4) * speed) / 20 * rotationIntensity;

    let floatValue = Math.sin((elapsedTime / 4) * speed) / 10;
    floatValue = THREE.MathUtils.mapLinear(floatValue, -0.1, 0.1, floatingRange[0], floatingRange[1]);
    // object.position.y = basePositionY + floatValue * floatIntensity;
  }

  return update;
}


  const floatingEffects = [];

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    // Update all floating effects
    let deltaTime = clock.getElapsedTime();
    floatingEffects.forEach(updateEffect => updateEffect(deltaTime));
    // Render scene
    renderer.render(scene, camera);
  }


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

  let isRotationEnabled = true;  // Flag to control floating rotation

  let modelGroup = new THREE.Group();


  let candyModel, bolsaModel, canModel, zumoModel;
  loader.load(models.candyWrapper, (gltf) => {
    let speed = 5, rotationIntensity = 1, floatIntensity = 1, floatingRange = [-0.05, 0.05];
    candyModel = gltf.scene;
    console.log(candyModel);
    
    candyModel.traverse((node) => {
        if (node.isMesh) {
          let mesh = node;
          mesh.material.metalness = 0;
          mesh.material.roughness = 0;  
          mesh.castShadow = true;
          mesh.receiveShadow = true;   
        }
    });
    
    candyModel.position.x = 0.5;
    candyModel.position.y = 2.5;
    candyModel.position.z = -5;
    candyModel.scale.set(0.05, 0.05, 0.05);
    candyModel.rotation.x = 2.625;
    candyModel.rotation.y = 0.4;
    candyModel.rotation.z = 5.82;

    // gui.add(candyModel.rotation, 'x').min(-Math.PI / 2).max(Math.PI / 2).step(0.01);
    // gui.add(candyModel.rotation, 'y').min(-Math.PI / 2).max(Math.PI / 2).step(0.01);
    // gui.add(candyModel.rotation, 'z').min(-Math.PI / 2).max(Math.PI / 2).step(0.01);
    // model.add(light);
    modelGroup.add(candyModel);
    const floatingEffect = FloatingModel(candyModel, speed, rotationIntensity, floatIntensity, floatingRange);
    floatingEffects.push(floatingEffect);
    // gsap.from(candyModel.position, {
    //   y: -20,
    //   duration: 4,
    //   ease: "power1.inOut",
    // });
    animate();

  });


  loader.load(models.bolsaObject, (gltf) => {
    let speed = 5, rotationIntensity = 1, floatIntensity = 1, floatingRange = [-0.05, 0.05];
    bolsaModel = gltf.scene;
    // let light = new THREE.PointLight("red", 1);
    // light.position.set(-5, -20, 5);
    
    bolsaModel.traverse((node) => {
        if (node.isMesh) {
          let mesh = node;
          mesh.material.metalness = 0;
          mesh.material.roughness = 0.15;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.scale.set(100, 100, 100);
        }
    });

    bolsaModel.position.x = -3.5;
    bolsaModel.position.y = 0;
    bolsaModel.position.z = 1;
    bolsaModel.scale.set(0.03, 0.03, 0.03);
    bolsaModel.rotation.x = 1.4;
    bolsaModel.rotation.y = 0.18;
    bolsaModel.rotation.z = -0.01;
    modelGroup.add(bolsaModel);

    // gui.add(model.rotation, 'x').min(-Math.PI / 2).max(Math.PI / 2).step(0.01);
    // gui.add(model.rotation, 'y').min(-Math.PI / 2).max(Math.PI / 2).step(0.01);
    // gui.add(model.rotation, 'z').min(-Math.PI / 2).max(Math.PI / 2).step(0.01); 

    const floatingEffect = FloatingModel(bolsaModel, speed, rotationIntensity, floatIntensity, floatingRange);
    floatingEffects.push(floatingEffect);
    // gsap.from(bolsaModel.position, {
    //   y: -20,
    //   duration: 4,
    //   ease: "power1.inOut"
    // });
    animate();

  });

  loader.load(models.canObject, (gltf) => {
    let speed = 5, rotationIntensity = 0.5, floatIntensity = 0.5, floatingRange = [-0.01, 0.01];
    canModel = gltf.scene;
    canModel.position.set(0, -2, 0);
    canModel.scale.set(0.03, 0.03, 0.03);
    canModel.rotation.set(Math.PI / 2, 0, 0);
    modelGroup.add(canModel);
    const floatingEffect = FloatingModel(canModel, speed, rotationIntensity, floatIntensity, floatingRange);
    floatingEffects.push(floatingEffect);
    // gsap.from(canModel.position, {
    //   y: -20,
    //   duration: 4,
    //   ease: "power1.inOut",
    // });
    gsap.from(canModel.rotation, {
      x: 0,
      y:0,
      z:0,
      duration: 4,
      ease: "power4.inOut",
    });

    // gui.add(canModel.rotation, 'x').min(-Math.PI / 2).max(Math.PI / 2).step(0.01).name('Can Rotation X');
    // gui.add(canModel.rotation, 'y').min(-Math.PI / 2).max(Math.PI / 2).step(0.01).name('Can Rotation Y');
    // gui.add(canModel.rotation, 'z').min(-Math.PI / 2).max(Math.PI / 2).step(0.01).name('Can Rotation Z');
    animate();
  });


  
  loader.load(models.zumoObject, (gltf) => {
    let speed = 5, rotationIntensity = 1, floatIntensity = 1, floatingRange = [-0.05, 0.05];
    zumoModel = gltf.scene;
    console.log("PacketWithStraw Model: ",zumoModel)
    let light = new THREE.PointLight("red", 1);
    light.position.set(-5, -20, 5);
    
    zumoModel.traverse((node) => {
        if (node.isMesh) {
            if(node.name === "Wrapper"){
                node.position.set(-.76, 61.13, 18.16);
                node.rotation.set(0, 0, 2.88); 
                node.material.color.set(0xffffff);
                node.material.opacity= 0.7;
                node.material.transparent= true;
                node.material.needsUpdate = true;
                node.scale.set(1, -1, 1);
            }else if(node.name === "Packaging-Box"){
                  node.material.metalness = 0;
                  node.material.roughness = 0.5;
                  node.scale.set(1, -1, 1);
            }
            console.log("Found mesh for Zumo:", node);
        
        }
    });
    zumoModel.add(light);
    zumoModel.position.set(3.2, 0, 0);
    zumoModel.rotation.set(0, -.3, -.6);
    zumoModel.scale.set(0.025, 0.025, 0.025);
    modelGroup.add(zumoModel);
    
    const floatingEffect = FloatingModel(zumoModel, speed, rotationIntensity, floatIntensity, floatingRange);
    floatingEffects.push(floatingEffect);
    // gsap.from(zumoModel.position, {
    //   y: -20,
    //   duration: 4,
    //   ease: "power1.inOut"
    // });
    animate();
    
  });


  scene.add(modelGroup);

  // gsap.from(modelGroup.rotate, {
  //   z: -20,
  //   duration: 4,
  //   ease: "power1.inOut"
  // });
  

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  preloader.classList.add("ready");
  wrapper.classList.add("ready");
 
  ScrollSmoother.create({
    wrapper: "#wrapper",
    content: "#content",
    smooth: 1,
    normalizeScroll: true,
    ignoreMobileResize: true,
    effects: true,
    preventDefault: true
  });
  ScrollTrigger.create({
    trigger: "#root",
    start: "top 0",
    end: "top -20000%",
    scrub: .2,
    pin: "#root",
    pinSpacing: !1
  });
  // ScrollTrigger.create({
  //   trigger: "#landing",
  //   start: "top -40%",
  //   end: "top -41%",
  //   onEnter: o
  // });
  const mainHeadings = document.querySelectorAll(".main-heading");
  function splitTextMain() {
    mainHeadings.forEach(mainHeading => {
        // First split: Break into characters and lines, assigning class "char"
        var split1 = new SplitText(mainHeading, {
            type: "chars, lines",
            charsClass: "char"
        });

        // Second split: Break previously split chars into smaller parts, assigning class "charin"
        var split2 = new SplitText(split1.chars, {  // Apply SplitText on already split chars
            type: "chars",
            charsClass: "char-in"
        });
    });
  }
  splitTextMain();

  const subParas = document.querySelectorAll(".sub-para");
  function splitTextSub() {
    subParas.forEach(subPara => {
        var split1 = new SplitText(subPara, {
            type: "words, lines",
            wordsClass: "word"
        });

        // Second split: Break previously split chars into smaller parts, assigning class "charin"
        var split2 = new SplitText(split1.words, {  // Apply SplitText on already split chars
            type: "words",
            wordsClass: "word-in"
        });
    });
  }
  splitTextSub();

  var h = document.querySelector("#content");
  h.classList.add("fix");
  window.scrollTo(0, 0);
  document.fonts.ready.then(function () {
    aceptar.classList.add("fonts");
    silenciostart.classList.add("ready");
    // gsap.to("#root", {
    //   filter: "blur(0px)",
    //   ease: "power4.easeInOut",
    //   immediateRender: !1,
    // });  
    // animate();//Float models
    // / Animate the position of the modelGroup using GSAP
    // gsap.from(modelGroup.position, {
    //   x: 20,   
    //   y: -20,
    //   z: 0,
    //   duration: 4,  // Duration of the animation (4 seconds)
    //   ease: "power4.inOut", // Easing function to make the animation smooth
    // });

    // You can also animate the rotation of the modelGroup:
    gsap.from(modelGroup.position, {
      y: -20, // Rotate 90 degrees along Z-axis
      duration: 6,
      ease: "power4.inOut"
    });
    gsap.from(modelGroup.rotation, {
      y: Math.PI,
      z: Math.PI,
      duration: 6,
      ease: "power4.inOut"
    });
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
    // isRotationEnabled = false; 

    gsap.to(".char-in", {
      delay: .3,
      y: 0,
      stagger: .03,
      duration: 1,
      ease: "power4.easeOut"
    });
    gsap.to("#landing h2", {
      delay: 1,
      y: 0,
      duration: 1,
      ease: "power4.easeOut"
    });
    gsap.to(".word-in", {
      delay: 1,
      y: 0,
      stagger: .015,
      duration: 1,
      ease: "power4.easeOut"
    });
    setTimeout(function () {
      setTimeout(function () {
        // printAudio.play();
      }, 100);
    }, 2000);
    superiorstart.classList.add("ready");
    setTimeout(function() {
      superiorstart.classList.add("out"),
      superior.classList.add("ready")
    }, 1000)
    lateral.classList.add("ready");
    aceptar.classList.add("out");
    // **GSAP Camera Animation**
    // gsap.to(camera.position, {
    //   y: 0,
    //   z: 8,
    //   duration: 1,  // Duration of animation in seconds
    //   ease: "power2.inOut",
    //   onUpdate: function () {
    //       camera.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure camera stays focused on the scene
    //   }
    // });
    gsap.to(modelGroup.rotation, {
      z: Math.PI,
      duration: 6,
      ease: "power4.inOut"
    });

    ScrollTrigger.refresh();
  };
});

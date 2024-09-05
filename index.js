import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { Planet } from "./src/planet.js";
import { Starfield } from "./src/starfield.js";
import { Sun } from "./src/sun.js";
import { OBJLoader } from 'jsm/loaders/OBJLoader.js';
import { AsteroidBelt } from './src/asteroidbelt.js';
import getNebula from './src/getNebula.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

const solarSystem = new THREE.Group();
solarSystem.userData.update = (t) => {
    solarSystem.children.forEach((child) => {
        child.userData.update?.(t);
    });
};
scene.add(solarSystem);

const fake_sun_for_earth = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_earth.position.set(0.5, 0, 0);
const fake_sun_for_mars = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_mars.position.set(3, 0, 0);
const fake_sun_for_venus = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_venus.position.set(0.2, 0, 0);
const fake_sun_for_mercury = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_mercury.position.set(-0.1, 0, 0);
const fake_sun_for_jupiter = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_jupiter.position.set(1, 0, 0);
const fake_sun_for_saturn = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_saturn.position.set(1.5, 0, 0);
const fake_sun_for_uranus = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_uranus.position.set(0.3, 0, 0);
const fake_sun_for_belt = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
fake_sun_for_belt.position.set(-6, 0, 0);




const sun = new Sun(2);
solarSystem.add(sun.mesh);

const earth = new Planet({ parent: fake_sun_for_earth, semiMajorAxis:12.5, semiMinorAxis:12.4, img: 'earth.jpg', size: 0.3, orbitSpeed: 1.0, rotationSpeed: 1, inclination: 0 });
earth.drawEllipse(solarSystem);
solarSystem.add(earth.mesh);

const moon = new Planet({ parent: earth.mesh, semiMajorAxis:1.2, semiMinorAxis:1.2, img: 'moon.jpg', size: 0.05, orbitSpeed: 3, rotationSpeed: 0.5, inclination: 5.145 });
moon.drawEllipse(solarSystem);
solarSystem.add(moon.mesh);

const mars = new Planet({ parent: fake_sun_for_mars, semiMajorAxis:18, semiMinorAxis:17, img: 'mars.jpg', size: 0.5, orbitSpeed: 0.5, rotationSpeed: 0.5, inclination: 1.85 });
mars.drawEllipse(solarSystem);
solarSystem.add(mars.mesh);

const venus = new Planet({ parent: fake_sun_for_venus, semiMajorAxis:9.5, semiMinorAxis:9.4, img: 'venus.jpg', size: 0.2, orbitSpeed: 0.8, rotationSpeed: 0.8, inclination: 3.4 });
venus.drawEllipse(solarSystem);
solarSystem.add(venus.mesh);

const mercury = new Planet({ parent: fake_sun_for_mercury, semiMajorAxis:6.5, semiMinorAxis:6.3, img: 'mercury.jpg', size: 0.1, orbitSpeed: 0.3, rotationSpeed: 0.3, inclination: 7.0 });
mercury.drawEllipse(solarSystem);
solarSystem.add(mercury.mesh);

const jupiter = new Planet({ parent: fake_sun_for_jupiter, semiMajorAxis:35, semiMinorAxis:34, img: 'jupiter.jpg', size: 0.8, orbitSpeed: 0.2, rotationSpeed: 0.2, inclination: 1.3 });
jupiter.drawEllipse(solarSystem);
solarSystem.add(jupiter.mesh);

const saturnRingColorTexture = new THREE.TextureLoader().load('./textures/saturnringcolor.jpg');
const saturn = new Planet({ parent: fake_sun_for_saturn, semiMajorAxis:45, semiMinorAxis:44, img: 'saturn.jpg', size: 0.7, orbitSpeed: 0.1, rotationSpeed: 0.1, inclination: 2.5 });
saturn.drawEllipse(solarSystem);
saturn.drawRing(scene, saturnRingColorTexture, 1.0, 2.8);
solarSystem.add(saturn.mesh);

const uranusRingColorTexture = new THREE.TextureLoader().load('./textures/uranusringcolor.png');
const uranus = new Planet({ parent: fake_sun_for_uranus, semiMajorAxis:55, semiMinorAxis:54, img: 'uranus.jpg', size: 0.6, orbitSpeed: 0.05, rotationSpeed: 0.05, inclination: 0.8 });
uranus.drawEllipse(solarSystem);
uranus.drawRing(scene, uranusRingColorTexture, 1.35, 1.8);
solarSystem.add(uranus.mesh);

const debugLight = new THREE.DirectionalLight(0xffffff, 1);
debugLight.position.set(0, 1, 0);
// scene.add(debugLight);

const starfield = new Starfield({ numStars: 1000, size: 0.05 });
scene.add(starfield.mesh);

const nebula = getNebula({
    hue: 0.6,
    numSprites: 10,
    opacity: 0.02,
    radius: 210,
    size: 340,
    z: -300.5,
  });
  scene.add(nebula);

  const anotherNebula = getNebula({
    hue: 0.0,
    numSprites: 10,
    opacity: 0.02,
    radius: 160,
    size: 250,
    z: 300.5,
  });
  scene.add(anotherNebula);

// Asteroid belt
const asteroidFiles = ['Rock1.obj', 'Rock2.obj', 'Rock3.obj'];
const objLoader = new OBJLoader();
var asteroidObjs = [];
let loaded = 0;
asteroidFiles.forEach((file) => {
    objLoader.load(`../rocks/${file}`, (obj) => {
        obj.traverse((child) => {
            if (child.isMesh) {
                asteroidObjs.push(child);
            }
        });
        loaded++;
        if (loaded === asteroidFiles.length) {
            console.log("on est dedans");
            const asteroidBelt = new AsteroidBelt(fake_sun_for_belt, asteroidObjs, 28, 25, 0.075, 8.5, 0.5);
            scene.add(asteroidBelt.group);
        }
    });
});

let selectedPlanet = null;
let isCameraCentered = false;

function animate(t = 0) {
    const time = t * 0.0002;
    requestAnimationFrame(animate);

    // Update the solar system
    solarSystem.userData.update(time);
    if (isCameraCentered) {
        if (selectedPlanet)
            selectedPlanet.centerOn(camera, controls);
    }
    // Render the scene
    composer.render();

    // Update OrbitControls to ensure smooth camera movement
    controls.update();
}

animate();
// Liste des planètes
const planets = {
    'sun': sun,
    'moon': moon,
    'earth': earth,
    'mars': mars,
    'venus': venus,
    'mercury': mercury,
    'jupiter': jupiter,
    'saturn': saturn,
    'uranus': uranus
};


// Créer un menu pour sélectionner les planètes
const planetSelect = document.createElement('select');
planetSelect.id = 'planet-select';
document.body.appendChild(planetSelect);
// Ajouter une option pour chaque planète dans le menu
for (const planetName in planets) {
    const option = document.createElement('option');
    option.value = planetName;
    option.text = planetName.charAt(0).toUpperCase() + planetName.slice(1);
    planetSelect.appendChild(option);
}

planetSelect.addEventListener('change', (event) => {
    const selectedPlanetName = event.target.value;
    selectedPlanet = planets[selectedPlanetName];

    if (selectedPlanetName === 'sun') {
        selectedPlanet = null;
        isCameraCentered = false;
        camera.position.set(0, 2.5, 4);
        controls.target.set(0, 0, 0);
        controls.update();
        console.log(isCameraCentered)
    } else if (selectedPlanet) {
        selectedPlanet.centerOn(camera, controls);  // Move camera to the selected planet
        isCameraCentered = true;
    }

    isCameraCentered = true;  // Mark that the camera has been centered once
});


function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);




import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { Planet } from "./src/planet.js";
import { Starfield } from "./src/starfield.js";
import { Sun } from "./src/sun.js";
import getNebula from "./src/getNebula.js";
import getAsteroidBelt from "./src/getAsteroidBelt.js";
import { OBJLoader } from 'jsm/loaders/OBJLoader.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2.5, 4);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;  // Activer les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Ajoutez l'effet de bloom
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

const solarSystem = new THREE.Group();
solarSystem.userData.update = (t) => {
    solarSystem.children.forEach((child) => {
        child.userData.update?.(t);
    });
};
scene.add(solarSystem);
/* Fake object in a way for planets to be placed well*/
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

const sun = new Sun(2);
solarSystem.add(sun.mesh);
//faire un mesh invisible mais avec des coordonnées pour le soleil
/*
Mercury: 7.0°
Venus: 3.4°
Earth: 0° (by definition, as the reference point)
Mars: 1.85°
Jupiter: 1.3°
Saturn: 2.5°
Uranus: 0.8°
Neptune: 1.8°
Pluto (dwarf planet): 17.2° (not technically a planet, but its inclination is significant)
*/

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




const debugLight = new THREE.DirectionalLight(0xffffff, 1);
debugLight.position.set(0, 1, 0);
// scene.add(debugLight);

const starfield = new Starfield({ numStars: 20000, size: 0.05 });
scene.add(starfield.mesh);

function animate(t = 0) {
    const time = t * 0.0002;
    requestAnimationFrame(animate);

    solarSystem.userData.update(time);
    composer.render(); // Utiliser composer au lieu de renderer pour les effets de post-traitement
    controls.update();
}


animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Assurez-vous que le composer est redimensionné
}
window.addEventListener('resize', handleWindowResize, false);

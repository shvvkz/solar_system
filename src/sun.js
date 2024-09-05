import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';


const GlowShader = {
    vertexShader: `
        varying vec3 vVertexWorldPosition;
        varying vec3 vVertexNormal;
        void main() {
            vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            vVertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        uniform vec3 viewVector;
        uniform float intensityFactor;
        varying vec3 vVertexWorldPosition;
        varying vec3 vVertexNormal;
        void main() {
            // Calculer l'intensité basée sur la distance à la caméra
            vec3 viewDir = normalize(vVertexWorldPosition - cameraPosition);
            float intensity = dot(vVertexNormal, viewDir);

            // Ajuster l'intensité pour un effet de glow plus étendu
            intensity = pow(abs(intensity), 0.5) * intensityFactor;

            // Clamper l'intensité pour éviter une atténuation trop rapide
            intensity = clamp(intensity, 0.0, 1.0);

            gl_FragColor = vec4(glowColor * intensity, 1.0);
        }
    `
};

class Sun {
    constructor(radius = 0.9) {

        const sunMat = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./textures/sun.jpg'),
            transparent: true,  // Activer la transparence
            opacity: 0.5,       // Ajuster l'opacité pour laisser passer la lumière
            depthWrite: false,  // Éviter l'écriture dans le buffer de profondeur pour des effets de transparence corrects
            blending: THREE.AdditiveBlending, // Utiliser un mélange additif pour un effet de lumière passant à travers
            side: THREE.DoubleSide,  // Rendre la texture visible des deux côtés, si nécessaire
        });
        const geo = new THREE.IcosahedronGeometry(radius, 10);
        this.mesh = new THREE.Mesh(geo, sunMat);
        const customMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { type: 'c', value: new THREE.Color(0xffff00) },
                viewVector: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
                intensityFactor: { type: 'f', value: 2.0 } // Ajuster cette valeur pour rendre le glow visible de plus loin
            },
            vertexShader: GlowShader.vertexShader,
            fragmentShader: GlowShader.fragmentShader,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        const sunGlow = new THREE.Mesh(geo, customMaterial);
        this.mesh.add(sunGlow);

        const sunLight = new THREE.PointLight(0xffffff, 1, 100, 0);  // Distance is 5000, decay set to 0 for no decay over range
        sunLight.intensity = 2;  // Set the intensity to 200
        sunLight.distance = 100;  // Light will reach up to 5000 units
        sunLight.decay = 0;  // No decay over distance, so intensity stays strong until distance limit
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 100;  // Shadows extend up to 5000 units
        
        this.mesh.add(sunLight);
        
        

        this.mesh.userData.update = (t) => {
            this.mesh.rotation.y = t;
        };
    }
}
export { Sun };
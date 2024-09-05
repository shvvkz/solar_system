import * as THREE from 'three';

class Planet {
    constructor({ parent, semiMajorAxis = 1, semiMinorAxis = 0.8, img = '', size = 1, orbitSpeed = 1, rotationSpeed = 1, inclination = 0 }) {
        this.geo = new THREE.IcosahedronGeometry(1, 10);
        this.texLoader = new THREE.TextureLoader();
        this.parent = parent;
        this.semiMajorAxis = semiMajorAxis; // Demi-grand axe pour l'ellipse
        this.semiMinorAxis = semiMinorAxis; // Demi-petit axe pour l'ellipse
        this.img = img;
        this.size = size;
        this.orbitSpeed = orbitSpeed;
        this.rotationSpeed = rotationSpeed;
        this.inclination = THREE.MathUtils.degToRad(inclination); // Convertir l'inclinaison en radians
        this.initialAngle = Math.random() * Math.PI * 2; // Angle initial aléatoire

        // Calculer la distance du foyer par rapport au centre
        this.focalDistance = Math.sqrt(this.semiMajorAxis ** 2 - this.semiMinorAxis ** 2); 

        this.mesh = this.createPlanet();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Créer et stocker les points de l'ellipse
        this.ellipseGeometry = null;
        this.ellipsePoints = [];

        // Référence pour l'anneau de la planète
        this.ring = null;

        // Pour permettre à la planète d'être mise à jour constamment
        this.mesh.userData.update = (t) => this.update(t);
    }

    createPlanet() {
        const path = `./textures/${this.img}`;
        const map = this.texLoader.load(path);
        
        const planetMat = new THREE.MeshStandardMaterial({ 
            map, 
            metalness: 0,  // Keep metalness low to avoid strong reflections
            roughness: 0.8,  // Increase roughness for less reflectivity
            emissive: new THREE.Color(0x000000),  // Ensure no emissive color
            emissiveIntensity: 0.05,  // Optional: Slight glow if needed
        });
        
        const planet = new THREE.Mesh(this.geo, planetMat);
    
        const x = Math.cos(this.initialAngle) * this.semiMajorAxis - this.focalDistance + this.parent.position.x;
        const z = Math.sin(this.initialAngle) * this.semiMinorAxis + this.parent.position.z;
        
        planet.position.set(x, 0, z);
        planet.scale.setScalar(this.size);
        return planet;
    }
    

    update(t) {
        // Calculer l'angle en fonction du temps
        const angle = t * this.orbitSpeed + this.initialAngle;

        // Calculer la position de la planète sur l'ellipse
        let x = Math.cos(angle) * this.semiMajorAxis - this.focalDistance;
        let z = Math.sin(angle) * this.semiMinorAxis;

        // Appliquer la rotation d'inclinaison (autour de l'axe X ou Z)
        const rotatedPosition = this.applyInclination(new THREE.Vector3(x, 0, z));

        // Mettre à jour la position de la planète en fonction de l'inclinaison
        this.mesh.position.set(
            rotatedPosition.x + this.parent.position.x, 
            rotatedPosition.y + this.parent.position.y, 
            rotatedPosition.z + this.parent.position.z
        );

        // Mettre à jour l'angle pour la prochaine itération
        const currentDistance = rotatedPosition.length(); // Distance au parent
        const velocityFactor = this.orbitSpeed * (1 / currentDistance);
        this.initialAngle += velocityFactor * 0.01;

        // Rotation de la planète sur elle-même
        this.mesh.rotation.y = t * this.rotationSpeed;

        // Mise à jour de l'ellipse si elle est déjà créée
        if (this.ellipseGeometry) {
            this.updateEllipsePoints();
        }

        // Mise à jour de l'anneau si existant
        if (this.ring) {
            this.updateRing();
        }
    }

    applyInclination(position) {
        // Appliquer une rotation autour de l'axe X ou Z pour incliner l'ellipse
        const rotationMatrix = new THREE.Matrix4().makeRotationX(this.inclination); // Inclinaison sur l'axe X (change Y et Z)
        return position.applyMatrix4(rotationMatrix);
    }

    // Crée l'ellipse une seule fois et stocke les points dans la géométrie
    drawEllipse(scene) {
        const segments = 100; // Nombre de segments pour dessiner l'ellipse
        this.ellipsePoints = new Float32Array((segments + 1) * 3); // Stockage des coordonnées XYZ

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI; // Angle pour chaque segment
            let x = Math.cos(angle) * this.semiMajorAxis - this.focalDistance;
            let z = Math.sin(angle) * this.semiMinorAxis;

            // Appliquer l'inclinaison aux points de l'ellipse
            const rotatedPosition = this.applyInclination(new THREE.Vector3(x, 0, z));

            this.ellipsePoints[i * 3] = rotatedPosition.x + this.parent.position.x;      // Position X
            this.ellipsePoints[i * 3 + 1] = rotatedPosition.y + this.parent.position.y;  // Position Y
            this.ellipsePoints[i * 3 + 2] = rotatedPosition.z + this.parent.position.z;  // Position Z
        }

        // Crée la géométrie de l'ellipse avec les points
        this.ellipseGeometry = new THREE.BufferGeometry();
        this.ellipseGeometry.setAttribute('position', new THREE.BufferAttribute(this.ellipsePoints, 3));

        // Crée un matériau basique pour la ligne
        const ellipseMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, fog: false, linewidth: 100 });

        // Crée une ligne avec la géométrie et le matériau
        const ellipse = new THREE.Line(this.ellipseGeometry, ellipseMaterial);

        // Ajoute l'ellipse à la scène
        scene.add(ellipse);
    }

    // Met à jour les points de l'ellipse en fonction de la position actuelle du parent
    updateEllipsePoints() {
        const segments = 100;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI; // Angle pour chaque segment
            let x = Math.cos(angle) * this.semiMajorAxis - this.focalDistance;
            let z = Math.sin(angle) * this.semiMinorAxis;

            // Appliquer l'inclinaison aux points de l'ellipse
            const rotatedPosition = this.applyInclination(new THREE.Vector3(x, 0, z));

            this.ellipsePoints[i * 3] = rotatedPosition.x + this.parent.position.x;      // Position X
            this.ellipsePoints[i * 3 + 1] = rotatedPosition.y + this.parent.position.y;  // Position Y
            this.ellipsePoints[i * 3 + 2] = rotatedPosition.z + this.parent.position.z;  // Position Z
        }

        // Mettre à jour l'attribut de position de la géométrie
        this.ellipseGeometry.attributes.position.needsUpdate = true;
    }
    drawRing(scene, ringTexture, innerRadius = 3, outerRadius = 5) {
        // Use THREE.RingGeometry instead of RingBufferGeometry
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    
        // Modify the UV mapping to properly align the texture
        const pos = geometry.attributes.position;
        const v3 = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            geometry.attributes.uv.setXY(i, v3.length() < (innerRadius + outerRadius) / 2 ? 0 : 1, 1);
        }
    
        // Create the material with the ring texture, making sure it's transparent
        const material = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true
        });
    
        // Create the mesh and position it at the planet's location
        const ringMesh = new THREE.Mesh(geometry, material);
        ringMesh.position.copy(this.mesh.position);
        ringMesh.rotation.x = THREE.MathUtils.degToRad(90); // Align the ring flat horizontally
    
        // Add the ring to the scene
        scene.add(ringMesh);
        this.ring = ringMesh; // Store the reference for updates
    }
    
    updateRing() {
        if (!this.ring) return;
        this.ring.position.copy(this.mesh.position);
    }
    
    centerOn(camera, controls) {
        const planetPosition = this.mesh.position.clone();
        
        const direction = new THREE.Vector3().subVectors(camera.position, planetPosition).normalize();

        const distance = 4 * this.size; 
        const newCameraPosition = planetPosition.clone().add(direction.multiplyScalar(distance));
    
        camera.position.copy(newCameraPosition);
        controls.target.copy(planetPosition);
        controls.update();
    } 
    

}

export { Planet };

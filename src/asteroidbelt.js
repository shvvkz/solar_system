import * as THREE from 'three';

class AsteroidBelt {
    constructor(parent, objs, semiMajorAxis = 2.5, semiMinorAxis = 2.0, size = 0.035, thicknessX = 0.5, thicknessY = 0.5) {
        this.parent = parent;  // Parent object for the asteroid belt
        this.objs = objs;  // Array of loaded OBJ meshes
        this.semiMajorAxis = semiMajorAxis;  // Semi-major axis of the elliptical orbit
        this.semiMinorAxis = semiMinorAxis;  // Semi-minor axis of the elliptical orbit
        this.size = size;  // Base size for the asteroids
        this.thicknessX = thicknessX;  // Thickness (randomness) in the X-axis
        this.thicknessY = thicknessY;  // Thickness (randomness) in the Y-axis
        this.group = new THREE.Group();  // Initialize the group here
        
        this.createBelt();  // Create the belt after initialization
    }

    createBelt() {
        if (!this.objs || this.objs.length === 0) {
            console.error('Asteroid objects not loaded');
            return;
        }

        const numAsteroids = 2000;  // Number of asteroids in the belt

        for (let i = 0; i < numAsteroids; i++) {
            const asteroid = this.objs[Math.floor(Math.random() * this.objs.length)].clone();
            const angle = Math.random() * Math.PI * 2;

            // Generate positions on an elliptical orbit with added thickness in both X and Y directions
            const x = Math.cos(angle) * (this.semiMajorAxis + (Math.random() - 0.5) * this.thicknessX) + this.parent.position.x; // Elliptical x-coordinate with thickness
            const z = Math.sin(angle) * (this.semiMinorAxis + (Math.random() - 0.5) * this.thicknessX) + this.parent.position.z; // Elliptical z-coordinate with thickness
            
            const y = (Math.random() - 0.5) * this.thicknessY + this.parent.position.y; // Adding thickness in y-axis for vertical randomness
            asteroid.position.set(x, y, z);
            asteroid.scale.setScalar(this.size + (Math.random() - 0.5) * 0.05);
            // applique une couleur aléatoire a chaque asteroid ils peuvent avoir que 6 de ces couleurs 60,60,60 120,120,120 102,85,76 139,69,19 150,75,40 90,60,50
            const colors = [0x3c3c3c, 0x787878, 0x66554c, 0x8b4513, 0x964b28, 0x5a3c32];
            asteroid.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
            this.group.add(asteroid);  // Add the asteroid to the group
        }
        // ajoute une rotation a chaque asteroid
        this.group.userData = {
            update: (t) => {
                const rate = -0.0002;  // Adjust rotation speed
                this.group.rotation.z = t * rate;
            }
        };
    }

    // Method to return the group containing the asteroid belt
    getBelt() {
        return this.group;
    }
}

export { AsteroidBelt };

import * as THREE from "three";

class Starfield {
    constructor({ numStars = 500, size = 0.2 } = {}) {
        this.numStars = numStars;
        this.size = size;
        this.mesh = this.createStarfield();
    }

    randomSpherePoint() {
        // Augmentation de la zone, par exemple, entre 100 et 200 unités
        const radius = Math.random() * 20 + 200; // Générer entre 100 et 200 pour des étoiles plus éloignées
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.sin(phi) * Math.sin(theta);
        let z = radius * Math.cos(phi);

        return {
            pos: new THREE.Vector3(x, y, z),
            hue: 0.6, // Couleur basée sur le rayon
            minDist: radius, // Distance de l'étoile pour référence
        };
    }

    createStarfield() {
        const verts = [];
        const colors = [];
        const positions = [];
        let col;
        for (let i = 0; i < this.numStars; i += 1) {
            let p = this.randomSpherePoint();
            const { pos, hue } = p;
            positions.push(p);
            col = new THREE.Color().setHSL(hue, 0.2, Math.random());
            verts.push(pos.x, pos.y, pos.z);
            colors.push(col.r, col.g, col.b);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
            size: this.size,
            vertexColors: true,
            map: new THREE.TextureLoader().load("./src/circle.png"),
        });
        const points = new THREE.Points(geo, mat);
        return points;
    }
}

export { Starfield };

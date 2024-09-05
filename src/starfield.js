import * as THREE from "three";

class Starfield {
    constructor({ numStars = 500, size = 0.2 } = {}) {
        this.numStars = numStars;
        this.size = size;
        this.mesh = this.createStarfield();
    }

    randomSpherePoint() {
        const radius = Math.random() * 20 + 200; // Stars at random distances
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
    }

    createStarfield() {
        const verts = [];
        const colorsArray = [];
        const hexColors = [
            "#9bb0ff", "#aabfff", "#cad7ff", "#f8f7ff", "#fff4ea", 
            "#ffddb4", "#ffcc6f", "#ffc07f", "#ff8000", "#ffd27f", 
            "#ffffff", "#ffecd0", "#ffb07c"
        ];

        for (let i = 0; i < this.numStars; i += 1) {
            const pos = this.randomSpherePoint();
            verts.push(pos.x, pos.y, pos.z);

            // Randomly select a color from the list
            const hexColor = hexColors[Math.floor(Math.random() * hexColors.length)];
            const color = new THREE.Color(hexColor);
            colorsArray.push(color.r, color.g, color.b);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(colorsArray, 3));

        const mat = new THREE.PointsMaterial({
            size: this.size,
            vertexColors: true,  // Enable per-vertex colors
            map: new THREE.TextureLoader().load("./src/circle.png"),
            transparent: true
        });

        return new THREE.Points(geo, mat);
    }
}

export { Starfield };

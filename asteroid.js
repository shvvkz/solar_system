export class Asteroid {
    constructor() {
        const geometry = this.createAsteroidGeometry(); // Générez une géométrie d'astéroïde personnalisée
        const texture = new THREE.TextureLoader().load('texture/asteroid2.jpg'); // Chargez une texture pour l'astéroïde

        const material = new THREE.MeshLambertMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true; // Activer la réception d'ombre sur l'astéroïde

        this.object = new THREE.Object3D();
        this.object.add(mesh);
    }

    createAsteroidGeometry() {
        var radius = Math.random() * (0.03 - 0.001) + 0.001;
        const asteroidGeometry = new THREE.IcosahedronGeometry(radius, 3); // Utilisez une géométrie plus complexe (IcosahedronGeometry)
        const random = new THREE.Vector3(); // Utilisez des valeurs aléatoires pour déformer la géométrie

        for (let i = 0; i < asteroidGeometry.vertices.length; i++) {
            random.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.02);
            asteroidGeometry.vertices[i].add(random);
        }

        asteroidGeometry.verticesNeedUpdate = true;
        return asteroidGeometry;
    }

    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }
    move(tic){
        this.object.position.x += 0.01 * Math.cos(tic * (this.orbitalPara.speed/100));
        this.object.position.y += 0.01 * Math.sin(tic * (this.orbitalPara.speed/100));
    }
}
export function createAsteroidBelt(center, radius, numberOfAsteroids) {
    const asteroids = [];

    for (let i = 0; i < numberOfAsteroids; i++) {
        const angle = (i / numberOfAsteroids) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        
        const asteroid = new Asteroid();
        asteroid.setPosition(x, y, 0);
        
        asteroids.push(asteroid.object); // Ajouter seulement l'objet de l'astéroïde
    }

    return asteroids;
}


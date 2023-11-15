export class CelestialBody{

    material;
    geometry;
    body;
    orbitalPara;
    orbitalCenter;
    ring;
    name;
    

    constructor( geometry, material, orbitalPara, orbitalCenter = null, name){
        
        this.geometry = geometry;
        this.material = material;
        this.body = new THREE.Mesh(this.geometry, this.material);
        this.body.scale.set(1,1,1);
        this.orbitalPara = orbitalPara;
        this.orbitalCenter = orbitalCenter;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.name = name;
        
        if (this.orbitalPara && this.orbitalCenter){
            this.ring = new THREE.Mesh( new THREE.RingGeometry( this.orbitalPara.distance, this.orbitalPara.distance +0.03,128 ) , 
            new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide,transparent: true,opacity: 0.2 } ),)
        }
        


    }
    addTo(scene){
        scene.add(this.body);
        if (this.ring){
            scene.add(this.ring)
        }
    }
    move(tic) {
        // Calculer la nouvelle position orbitale de la planète
        this.body.position.x = this.orbitalCenter.body.position.x + Math.cos(tic * (this.orbitalPara.speed/100)) * this.orbitalPara.distance + this.orbitalPara.excentricity;
        this.body.position.y = this.orbitalCenter.body.position.y + Math.sin(tic * (this.orbitalPara.speed/100)) * this.orbitalPara.distance - this.orbitalPara.excentricity;

          //ring
          this.ring.position.x = this.orbitalCenter.body.position.x + this.orbitalPara.excentricity
          this.ring.position.y = this.orbitalCenter.body.position.y - this.orbitalPara.excentricity
          this.ring.position.z = this.orbitalCenter.body.position.z
          
    } 

    rotate() {
        // Faire tourner la planète sur elle-même
        this.body.rotation.y += 0.01 * this.orbitalPara.speedRotation;

    }
}

export class orbitalPara{
    excentricity;
    speed;
    distance;

    constructor( speed, distance,speedRotation ){
        this.speed = speed;
        this.distance = distance;
        this.speedRotation = speedRotation
    }
}
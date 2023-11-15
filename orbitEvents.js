// Importez OrbitControls comme mentionné précédemment
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

export function setupOrbitControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    return controls;
}

export function setupClickEvents(camera, scene, planets, controls) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let selectedPlanet = null;

    function onClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(planets.map(planet => planet.body));

        if (intersects.length > 0) {
            selectedPlanet = planets.find(planet => planet.body === intersects[0].object);
            if (selectedPlanet) {
                // Mettez à jour les contrôles pour cibler la planète sélectionnée
                controls.target.copy(selectedPlanet.body.position);
            }
        }
    }

    function updateCameraPosition() {
        if (selectedPlanet) {
            // Déplacez la caméra vers la position de la planète sélectionnée
            //recupere le x et y de la planete
            const newPosition = new THREE.Vector3(selectedPlanet.body.position.x, selectedPlanet.body.position.y, camera.position.z);

            // Mettez à jour la position de la caméra
            camera.position.copy(newPosition);
        }
    }

    function addClickListener() {
        window.addEventListener('click', onClick);
    }

    function removeClickListener() {
        window.removeEventListener('click', onClick);
    }

    function animate() {
        updateCameraPosition();
        requestAnimationFrame(animate);
        controls.update();
    }

    addClickListener();
    animate(); // Commencez l'animation pour mettre à jour continuellement la position de la caméra

    return removeClickListener;
}

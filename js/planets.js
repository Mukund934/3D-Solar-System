// planet settings
const PLANET_DATA = {
    mercury: { name: 'Mercury', radius: 0.4, distance: 8, color: 0x8C7853, baseSpeed: 0.6 },
    venus:   { name: 'Venus', radius: 0.7, distance: 12, color: 0xFFC649, baseSpeed: 0.2 },
    earth:   { name: 'Earth', radius: 0.8, distance: 16, color: 0x4F94CD, baseSpeed: 0.2 },
    mars:    { name: 'Mars', radius: 0.6, distance: 20, color: 0xCD5C5C, baseSpeed: 0.2 },
    jupiter: { name: 'Jupiter', radius: 2.2, distance: 28, color: 0xD2691E, baseSpeed: 0.08 },
    saturn:  { name: 'Saturn', radius: 1.8, distance: 36, color: 0xFAD5A5, baseSpeed: 0.03 },
    uranus:  { name: 'Uranus', radius: 1.2, distance: 44, color: 0x4FD0E7, baseSpeed: 0.01 },
    neptune: { name: 'Neptune', radius: 1.1, distance: 52, color: 0x4169E1, baseSpeed: 0.006 }
};

class Planet {
    constructor(data, scene) {
        this.data = data;
        this.scene = scene;
        this.currentSpeed = data.baseSpeed;
        this.angle = Math.random() * Math.PI * 2;

        this.createPlanet();
        this.createOrbit();
    }

    createPlanet() {
        const g = new THREE.SphereGeometry(this.data.radius, 32, 32);
        const m = new THREE.MeshPhongMaterial({ color: this.data.color, shininess: 30, specular: 0x111111 });
        this.mesh = new THREE.Mesh(g, m);
        this.mesh.userData = { planetData: this.data };
        this.mesh.position.x = this.data.distance;
        this.scene.add(this.mesh);
    }

    createOrbit() {
        const g = new THREE.RingGeometry(this.data.distance - 0.05, this.data.distance + 0.05, 64);
        const m = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        this.orbitMesh = new THREE.Mesh(g, m);
        this.orbitMesh.rotation.x = Math.PI / 2;
        this.scene.add(this.orbitMesh);
    }

    update(dt, speedMultiplier = 1) {
        if (!this.mesh) return;

        this.angle += this.currentSpeed * speedMultiplier * dt * 0.01;
        this.mesh.position.x = Math.cos(this.angle) * this.data.distance;
        this.mesh.position.z = Math.sin(this.angle) * this.data.distance;
        this.mesh.rotation.y += dt * 0.005;
    }

    setSpeed(s) {
        this.currentSpeed = s;
    }

    getPosition() {
        return this.mesh.position.clone();
    }

    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        if (this.orbitMesh) {
            this.scene.remove(this.orbitMesh);
            this.orbitMesh.geometry.dispose();
            this.orbitMesh.material.dispose();
        }
    }
}

class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.planets = new Map();
        this.isPaused = false;
        this.globalSpeedMultiplier = 1.0;

        this.createSun();
        this.createPlanets();
        this.createStarField();
    }

    createSun() {
        const g = new THREE.SphereGeometry(3, 32, 32);
        const m = new THREE.MeshBasicMaterial({ color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 0.8 });
        this.sun = new THREE.Mesh(g, m);
        this.scene.add(this.sun);

        const glowG = new THREE.SphereGeometry(3.5, 32, 32);
        const glowM = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.3 });
        this.sunGlow = new THREE.Mesh(glowG, glowM);
        this.scene.add(this.sunGlow);
    }

    createPlanets() {
        Object.keys(PLANET_DATA).forEach(key => {
            const p = new Planet(PLANET_DATA[key], this.scene);
            this.planets.set(key, p);
        });
    }

    createStarField() {
        const g = new THREE.BufferGeometry();
        const count = 2000;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 400;
            pos[i + 1] = (Math.random() - 0.5) * 400;
            pos[i + 2] = (Math.random() - 0.5) * 400;
        }

        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const m = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1, transparent: true, opacity: 0.8 });
        this.stars = new THREE.Points(g, m);
        this.scene.add(this.stars);
    }

    update(dt) {
        if (this.isPaused) return;

        if (this.sun) {
            this.sun.rotation.y += dt * 0.001;
            this.sunGlow.rotation.y -= dt * 0.0005;
        }

        this.planets.forEach(p => p.update(dt, this.globalSpeedMultiplier));

        if (this.stars) {
            this.stars.rotation.y += dt * 0.0001;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    reset() {
        this.planets.forEach(p => {
            p.angle = Math.random() * Math.PI * 2;
            p.currentSpeed = p.data.baseSpeed;
        });
    }

    setPlanetSpeed(key, s) {
        const p = this.planets.get(key);
        if (p) p.setSpeed(s);
    }

    getPlanet(key) {
        return this.planets.get(key);
    }

    getAllPlanets() {
        return Array.from(this.planets.values());
    }

    dispose() {
        this.planets.forEach(p => p.dispose());
        this.planets.clear();

        if (this.sun) {
            this.scene.remove(this.sun);
            this.sun.geometry.dispose();
            this.sun.material.dispose();
        }

        if (this.sunGlow) {
            this.scene.remove(this.sunGlow);
            this.sunGlow.geometry.dispose();
            this.sunGlow.material.dispose();
        }

        if (this.stars) {
            this.scene.remove(this.stars);
            this.stars.geometry.dispose();
            this.stars.material.dispose();
        }
    }
}

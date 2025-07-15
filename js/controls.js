// UI Controls: Speed sliders, pause, reset, theme toggle
class UIControls {
    constructor(solarSystem, camera, renderer) {
        this.solarSystem = solarSystem;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.initElements();
        this.addPlanetControls();
        this.bindEvents();
    }

    initElements() {
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.togglePanel = document.getElementById('toggle-panel');
        this.panelContent = document.querySelector('.panel-content');
        this.canvas = document.getElementById('solar-canvas');
    }

    addPlanetControls() {
        const container = document.getElementById('planet-controls');

        Object.keys(PLANET_DATA).forEach(p => {
            const d = PLANET_DATA[p];
            const div = document.createElement('div');
            div.className = 'planet-control';

            div.innerHTML = `
                <h4>
                    <span class="planet-color" style="background-color: #${d.color.toString(16).padStart(6, '0')}"></span>
                    ${d.name}
                </h4>
                <div class="speed-control">
                    <input type="range" class="speed-slider" id="speed-${p}" min="0" max="5" step="0.1" value="${d.baseSpeed}">
                    <span class="speed-value" id="value-${p}">${d.baseSpeed.toFixed(1)}x</span>
                </div>
            `;

            container.appendChild(div);

            const slider = div.querySelector('.speed-slider');
            const label = div.querySelector('.speed-value');

            slider.addEventListener('input', (e) => {
                const v = parseFloat(e.target.value);
                label.textContent = `${v.toFixed(1)}x`;
                this.solarSystem.setPlanetSpeed(p, v);
            });
        });
    }

    bindEvents() {
        this.pauseBtn.addEventListener('click', () => {
            if (this.solarSystem.isPaused) {
                this.solarSystem.resume();
                this.pauseBtn.textContent = 'Pause';
                this.pauseBtn.classList.remove('paused');
            } else {
                this.solarSystem.pause();
                this.pauseBtn.textContent = 'Resume';
                this.pauseBtn.classList.add('paused');
            }
        });

        this.resetBtn.addEventListener('click', () => {
            this.solarSystem.reset();
            this.resetSliders();

            if (this.solarSystem.isPaused) {
                this.solarSystem.resume();
                this.pauseBtn.textContent = 'Pause';
                this.pauseBtn.classList.remove('paused');
            }
        });

        this.themeToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('light-theme', e.target.checked);
        });

        this.togglePanel.addEventListener('click', () => {
            this.panelContent.classList.toggle('collapsed');
            this.togglePanel.textContent = this.panelContent.classList.contains('collapsed') ? '▲' : '▼';
        });

        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.onMouseClick(e));

        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('resize', () => this.onResize());
    }

    resetSliders() {
        Object.keys(PLANET_DATA).forEach(p => {
            const v = PLANET_DATA[p].baseSpeed;
            document.getElementById(`speed-${p}`).value = v;
            document.getElementById(`value-${p}`).textContent = `${v.toFixed(1)}x`;
        });
    }

    onMouseMove(e) {
        const r = this.canvas.getBoundingClientRect();
        this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        this.setCursor();
    }

    onMouseClick(e) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
            this.solarSystem.getAllPlanets().map(p => p.mesh)
        );
        if (!intersects.length) return;
    }

    setCursor() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
            this.solarSystem.getAllPlanets().map(p => p.mesh)
        );
        this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }

    onKeyDown(e) {
        switch (e.code) {
            case 'Space': e.preventDefault(); this.pauseBtn.click(); break;
            case 'KeyR': e.preventDefault(); this.resetBtn.click(); break;
            case 'KeyT': e.preventDefault(); this.themeToggle.click(); break;
        }
    }

    onResize() {
        const c = document.getElementById('app');
        const w = c.clientWidth;
        const h = c.clientHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

// Camera movement: drag, zoom, touch
class CameraControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.spherical = new THREE.Spherical();
        this.sphericalDelta = new THREE.Spherical();
        this.target = new THREE.Vector3();

        this.isDragging = false;
        this.rotateSpeed = 1;
        this.zoomSpeed = 1;
        this.minDistance = 20;
        this.maxDistance = 150;

        this.mouseStart = new THREE.Vector2();
        this.mouseEnd = new THREE.Vector2();

        this.addEvents();
        this.update();
    }

    addEvents() {
        this.domElement.addEventListener('mousedown', e => this.startDrag(e));
        this.domElement.addEventListener('mousemove', e => this.drag(e));
        this.domElement.addEventListener('mouseup', () => this.endDrag());
        this.domElement.addEventListener('wheel', e => this.zoom(e));

        this.domElement.addEventListener('touchstart', e => this.startTouch(e));
        this.domElement.addEventListener('touchmove', e => this.moveTouch(e));
        this.domElement.addEventListener('touchend', () => this.endTouch());

        this.domElement.addEventListener('contextmenu', e => e.preventDefault());
    }

    startDrag(e) {
        if (e.button === 0) {
            this.isDragging = true;
            this.mouseStart.set(e.clientX, e.clientY);
        }
    }

    drag(e) {
        if (!this.isDragging) return;

        this.mouseEnd.set(e.clientX, e.clientY);
        const delta = this.mouseEnd.clone().sub(this.mouseStart);
        const el = this.domElement;

        this.sphericalDelta.theta -= 2 * Math.PI * delta.x / el.clientWidth * this.rotateSpeed;
        this.sphericalDelta.phi -= 2 * Math.PI * delta.y / el.clientHeight * this.rotateSpeed;

        this.mouseStart.copy(this.mouseEnd);
    }

    endDrag() {
        this.isDragging = false;
    }

    zoom(e) {
        e.preventDefault();
        this.sphericalDelta.radius *= e.deltaY < 0 ? 0.95 : 1.05;
    }

    startTouch(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.mouseStart.set(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    moveTouch(e) {
        e.preventDefault();
        if (!this.isDragging || e.touches.length !== 1) return;

        this.mouseEnd.set(e.touches[0].clientX, e.touches[0].clientY);
        const delta = this.mouseEnd.clone().sub(this.mouseStart);
        const el = this.domElement;

        this.sphericalDelta.theta -= 2 * Math.PI * delta.x / el.clientWidth * this.rotateSpeed;
        this.sphericalDelta.phi -= 2 * Math.PI * delta.y / el.clientHeight * this.rotateSpeed;

        this.mouseStart.copy(this.mouseEnd);
    }

    endTouch() {
        this.isDragging = false;
    }

    update() {
        const offset = this.camera.position.clone().sub(this.target);
        this.spherical.setFromVector3(offset);

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;
        this.spherical.radius += this.sphericalDelta.radius;

        this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
        this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

        offset.setFromSpherical(this.spherical);
        this.camera.position.copy(this.target).add(offset);
        this.camera.lookAt(this.target);

        this.sphericalDelta.theta *= 0.95;
        this.sphericalDelta.phi *= 0.95;
        this.sphericalDelta.radius *= 0.95;

        return true;
    }
}

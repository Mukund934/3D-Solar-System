// Entry point for the solar system app
class SolarSystemApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.solarSystem = null;
        this.controls = null;
        this.cameraControls = null;
        this.clock = new THREE.Clock();
        this.animationId = null;
        this.init();
    }

    async init() {
        try {
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLighting();

            this.solarSystem = new SolarSystem(this.scene);
            this.controls = new UIControls(this.solarSystem, this.camera, this.renderer);
            this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);

            this.animate();
            this.hideLoadingScreen();
        } catch (e) {
            console.error('Init error:', e);
            this.showError('Failed to load. Please refresh.');
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 100, 300);
    }

    setupCamera() {
        const c = document.getElementById('app');
        const aspect = c.clientWidth / c.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        const canvas = document.getElementById('solar-canvas');
        const c = document.getElementById('app');

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        this.renderer.setSize(c.clientWidth, c.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    setupLighting() {
        const aLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(aLight);

        const sunLight = new THREE.PointLight(0xFFFFFF, 1.5, 200);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 100;
        this.scene.add(sunLight);

        const dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        dLight.position.set(10, 10, 5);
        dLight.castShadow = true;
        dLight.shadow.mapSize.width = 1024;
        dLight.shadow.mapSize.height = 1024;
        this.scene.add(dLight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta() * 1000;

        if (this.solarSystem) this.solarSystem.update(dt);
        if (this.cameraControls) this.cameraControls.update();

        this.renderer.render(this.scene, this.camera);

        this.monitorPerformance();
    }

    monitorPerformance() {
        if (this.clock.elapsedTime > 5) {
            const fps = this.renderer.info.render.frame / this.clock.elapsedTime;
            if (fps < 30) console.warn('Low FPS:', fps.toFixed(1));
        }
    }

    hideLoadingScreen() {
        const loader = document.getElementById('loading');
        setTimeout(() => loader.classList.add('hidden'), 1000);
    }

    showError(msg) {
        const loader = document.getElementById('loading');
        loader.innerHTML = `
            <div style="color: #ff6b6b; text-align: center;">
                <h3>Error</h3>
                <p>${msg}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; border: none; color: white; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }

    dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.solarSystem) this.solarSystem.dispose();
        if (this.renderer) this.renderer.dispose();
    }
}

// Lower graphics for mobile
function optimizeForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.documentElement.style.setProperty('--star-count', '1000');
        console.log('Mobile detected - optimization applied');
    }
}

// Start app on load
document.addEventListener('DOMContentLoaded', () => {
    optimizeForMobile();

    if (!window.WebGLRenderingContext) {
        document.getElementById('loading').innerHTML = `
            <div style="color: #ff6b6b; text-align: center;">
                <h3>WebGL Not Supported</h3>
                <p>Your browser doesn't support WebGL.</p>
            </div>
        `;
        return;
    }

    window.solarSystemApp = new SolarSystemApp();
});

// Pause/resume on tab switch
document.addEventListener('visibilitychange', () => {
    if (window.solarSystemApp?.solarSystem) {
        document.hidden ? window.solarSystemApp.solarSystem.pause() : window.solarSystemApp.solarSystem.resume();
    }
});

// Clean up on page close
window.addEventListener('beforeunload', () => {
    if (window.solarSystemApp) window.solarSystemApp.dispose();
});

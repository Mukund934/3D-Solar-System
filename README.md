
---

# 🌌 3D Solar System – Real-Time Orbital Simulation

🪐 A stunning real-time 3D simulation of the Solar System with planetary orbits, animations, and interactive UI. Built using **Three.js** and **vanilla JavaScript**, this project offers a professional experience with zero dependencies or builds required.

---

## 🧪 How to Run This Project

After downloading and extracting the zip file, you have **two options** to run this project:

---

### ✅ Method 1 – Simple HTML Preview (Recommended for Demo)

1. **Unzip** the file: `Mukund Thakur.zip`
2. **Open VS Code** (or any code editor)
3. Navigate to the extracted folder
4. **Right-click** `index.html` → Click **“Open with Live Server”**

   * *(If you don't have Live Server, simply double-click `index.html` to open it in the browser)*
5. You're ready to explore the Solar System 🌍

---

### ✅ Method 2 – Using `npm` and a Local Server (for Dev Mode)

> Requires Node.js installed.

1. Unzip the folder
2. Open the folder in VS Code
3. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser
5. Solar System loads and runs in development mode

---

## 📖 Overview

This project was built as part of the **Frontend Assignment** for internship evaluation. It simulates planetary orbits in 3D with complete interactivity and customization. The focus is on:

* Realistic visuals and physics
* Clean UI/UX
* Optimized performance
* Zero external dependencies (except Three.js via CDN)

---

## 🌟 Features

### ☀️ Core Experience

* Real-time 3D solar system with all 8 planets
* Accurate scale for radius, distance, and speed
* Custom orbital motion using Three.js
* UI sliders to control speed of individual planets
* Interactive info panel per planet

### 🎨 UI & Accessibility

* Dark/Light theme toggle
* Responsive UI for mobile and tablet
* Glassmorphism control and info panels
* Keyboard controls:

  * `Space` – Pause/Resume
  * `R` – Reset
  * `T` – Theme toggle

---

## 📁 File Structure

```bash
├── index.html           # Main entry point
├── style.css            # Styling for layout and UI
├── js/
│   ├── main.js          # Initializes Three.js and animation
│   ├── planets.js       # Planet data, creation, and motion
│   └── controls.js      # Camera controls and UI interactions
├── README.md            # Project documentation
├── package.json         # For npm-based method (optional)
└── demo.mp4             # Demo video showing the working app
```

---

## 🎮 Controls

### Mouse / Touch

| Action       | Description                 |
| ------------ | --------------------------- |
| Drag         | Rotate camera around system |
| Scroll/Pinch | Zoom in/out                 |
| Click Planet | Show detailed info panel    |

### Keyboard

| Key   | Action              |
| ----- | ------------------- |
| Space | Pause/Resume motion |
| R     | Reset scene         |
| T     | Toggle theme        |


---

## 📱 Mobile Support

* Fully responsive layout
* Touch drag and pinch to zoom
* Performance optimization for lower-end devices
* Bigger tap targets for controls

---

## ✏️ Customization

* Add planets in `js/planets.js` under `PLANET_DATA`
* Adjust:

  * `radius`: size of the planet
  * `distance`: from the Sun
  * `baseSpeed`: orbital speed
  * `color`: display color

* The UI will auto-generate new sliders based on this data

---

## 🔬 Built With

| Tool              | Purpose                     |
| ----------------- | --------------------------- |
| **Three.js**      | 3D rendering and animations |
| **HTML/CSS**      | Page structure and styling  |
| **JavaScript**    | Scene setup and logic       |
| **No Frameworks** | Simple and dependency-free  |

---

## 📥 Included in ZIP

✅ All Code Files
✅ `README.md`
✅ Demo Video – `demo.mp4`

---

## 📩 Submission Format

* A zip file: `Mukund Thakur.zip`
* Subject Line: **Frontend Assignment – Mukund Thakur**
* Contents:

  * Complete project files
  * `README.md` with setup instructions
  * `demo.mp4` video showing functionality

---

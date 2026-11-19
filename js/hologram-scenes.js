/**
 * 3D & AR-Tisch-Szenen (Three.js)
 * Unterstützt:
 * 1) "ar"      – Kamera-AR (Dinos laufen auf dem Tisch!) + optional WebXR
 * 2) "single"  – 3D-Einzelansicht (drehbar)
 * 3) "pyramid" – 4-Fach Pepper's Ghost Pyramiden-Hologramm
 */
window.HologramPlayer = (function () {
  let renderer, scene, cameras = [], singleCamera;
  let animId = null;
  let mode = "ar"; // "ar" | "single" | "pyramid"
  let activeGroup = null;
  let walkingDinos = [];
  let animatedItems = [];
  let particleSystem = null;

  // User interaction state (AR & Single mode)
  let userRotY = 0;
  let userScale = 1.0;
  let userOffsetX = 0;
  let userOffsetY = -0.35;
  let isDragging = false;
  let lastX = 0, lastY = 0;

  function makeHoloMat(colorHex, wireframe = false, opacity = 0.88) {
    return new THREE.MeshPhongMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: mode === "ar" ? 0.25 : 0.55,
      shininess: 90,
      transparent: true,
      opacity: opacity,
      wireframe: wireframe,
      side: THREE.DoubleSide
    });
  }

  function makeWireOverlay(mesh, colorHex) {
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.35 })
    );
    mesh.add(wire);
  }

  // Build 3D Cute T-Rex (Rexi) with articulated legs for walking
  function buildRexi(color = 0x33dd77) {
    const g = new THREE.Group();
    const mat = makeHoloMat(color, false, 0.92);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), mat);
    body.scale.set(0.9, 1.15, 1.1);
    body.position.set(0, 0.55, 0);
    makeWireOverlay(body, 0xffffff);
    g.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.48, 0.72), mat);
    head.position.set(0, 1.28, 0.38);
    makeWireOverlay(head, 0xffffff);
    g.add(head);

    const eyeMat = makeHoloMat(0xffffff, false, 1);
    [-0.22, 0.22].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
      eye.position.set(ex, 1.38, 0.72);
      g.add(eye);
    });

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.26, 1.0, 10), mat);
    tail.rotation.x = -Math.PI / 2.4;
    tail.position.set(0, 0.38, -0.78);
    g.add(tail);

    const legs = [];
    [-0.26, 0.26].forEach((lx) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(lx, 0.2, 0);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.55, 10), mat);
      leg.position.set(0, -0.25, 0);
      legPivot.add(leg);
      g.add(legPivot);
      legs.push(legPivot);
    });

    [-0.36, 0.36].forEach((ax) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), mat);
      arm.rotation.x = Math.PI / 3;
      arm.position.set(ax, 0.72, 0.45);
      g.add(arm);
    });

    g.userData.legs = legs;
    return g;
  }

  // Build 3D Cute Triceratops (Tobi) with articulated legs
  function buildTobi(color = 0x44bbff) {
    const g = new THREE.Group();
    const mat = makeHoloMat(color, false, 0.92);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12), mat);
    body.scale.set(0.95, 0.85, 1.25);
    body.position.set(0, 0.45, 0);
    makeWireOverlay(body, 0xffffff);
    g.add(body);

    const frill = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.46, 0.12, 16), mat);
    frill.rotation.x = Math.PI / 2.3;
    frill.position.set(0, 0.82, 0.52);
    makeWireOverlay(frill, 0xffffff);
    g.add(frill);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.38, 0.52), mat);
    head.position.set(0, 0.58, 0.72);
    g.add(head);

    const hornMat = makeHoloMat(0xffffaa, false, 0.95);
    [-0.16, 0.16].forEach((hx) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.48, 8), hornMat);
      horn.rotation.x = Math.PI / 3;
      horn.position.set(hx, 0.82, 0.96);
      g.add(horn);
    });
    const noseHorn = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.25, 8), hornMat);
    noseHorn.rotation.x = Math.PI / 5;
    noseHorn.position.set(0, 0.72, 1.0);
    g.add(noseHorn);

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.75, 10), mat);
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(0, 0.35, -0.78);
    g.add(tail);

    const legs = [];
    [[-0.28, 0.32], [0.28, 0.32], [-0.28, -0.32], [0.28, -0.32]].forEach(([lx, lz]) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(lx, 0.2, lz);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.45, 8), mat);
      leg.position.set(0, -0.2, 0);
      legPivot.add(leg);
      g.add(legPivot);
      legs.push(legPivot);
    });

    g.userData.legs = legs;
    return g;
  }

  function buildFips(color = 0x55eeff) {
    const g = new THREE.Group();
    const mat = makeHoloMat(color, false, 0.9);
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 10), mat);
    body.rotation.x = Math.PI / 2;
    g.add(body);

    const wingGeo = new THREE.BoxGeometry(1.1, 0.04, 0.35);
    const leftWing = new THREE.Mesh(wingGeo, mat);
    leftWing.position.set(-0.6, 0.05, 0);
    const rightWing = new THREE.Mesh(wingGeo, mat);
    rightWing.position.set(0.6, 0.05, 0);
    g.add(leftWing, rightWing);
    g.userData = { leftWing, rightWing };
    return g;
  }

  function createParticles(colorHex, count = 70, spread = 3.5) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * spread;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.07,
      transparent: true,
      opacity: 0.85
    });
    return new THREE.Points(geo, mat);
  }

  function populateScene(story) {
    if (activeGroup) scene.remove(activeGroup);
    if (particleSystem) scene.remove(particleSystem);
    animatedItems = [];
    walkingDinos = [];

    const group = new THREE.Group();
    const c1 = new THREE.Color(story.accentColor || "#44ddff").getHex();
    const c2 = new THREE.Color(story.secondaryColor || "#ff77ff").getHex();

    // Table surface ring / shadow disc so it looks grounded on the table
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.025, 12, 48),
      makeHoloMat(c1, false, 0.55)
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.1;
    group.add(ring);

    const tableDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.75, 48),
      new THREE.MeshBasicMaterial({ color: c1, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    tableDisc.rotation.x = Math.PI / 2;
    tableDisc.position.y = -0.11;
    group.add(tableDisc);

    // Add Rexi & Tobi walking on the table!
    const rexi = buildRexi(0x33ee77);
    rexi.scale.setScalar(0.62);
    group.add(rexi);
    walkingDinos.push({ obj: rexi, radius: 1.05, speed: 0.55, phase: 0 });

    const tobi = buildTobi(0x44bbff);
    tobi.scale.setScalar(0.62);
    group.add(tobi);
    walkingDinos.push({ obj: tobi, radius: 1.05, speed: 0.55, phase: Math.PI });

    // Scene-specific 3D centerpiece in the middle of the table
    const d = story.day;
    if (d === 1 || d === 24) {
      const stone = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.48, 0),
        makeHoloMat(c1, false, 0.92)
      );
      stone.position.set(0, 0.55, 0);
      makeWireOverlay(stone, 0xffffff);
      group.add(stone);
      animatedItems.push({ obj: stone, type: "spin" });

      if (d === 24) {
        for (let i = 0; i < 10; i++) {
          const star = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.1, 0),
            makeHoloMat(i % 2 === 0 ? c1 : c2, false, 0.95)
          );
          const angle = (i / 10) * Math.PI * 2;
          star.position.set(Math.cos(angle) * 1.4, 0.9 + (i % 3) * 0.3, Math.sin(angle) * 1.4);
          group.add(star);
          animatedItems.push({ obj: star, type: "spin" });
        }
      }
    } else if (d === 3) {
      const volc = new THREE.Mesh(
        new THREE.ConeGeometry(0.65, 1.1, 16, 1, true),
        makeHoloMat(0xff5533, false, 0.82)
      );
      volc.position.set(0, 0.45, 0);
      makeWireOverlay(volc, 0xffaa66);
      group.add(volc);
    } else if (d === 5 || d === 21) {
      if (d === 5) {
        const fips = buildFips(0x66eeff);
        fips.position.set(0, 1.25, 0);
        group.add(fips);
        animatedItems.push({ obj: fips, type: "fly" });
      } else {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 24, 20),
          makeHoloMat(0x88ffff, true, 0.55)
        );
        bubble.position.set(0, 0.85, 0);
        group.add(bubble);
        animatedItems.push({ obj: bubble, type: "bob", phase: 0.7 });
      }
    } else if (d === 6) {
      [-0.3, 0, 0.3].forEach((cx, idx) => {
        const crys = new THREE.Mesh(
          new THREE.ConeGeometry(0.15, 0.75 + (idx % 2) * 0.35, 6),
          makeHoloMat(idx === 1 ? c1 : c2, false, 0.88)
        );
        crys.position.set(cx, 0.3, 0);
        makeWireOverlay(crys, 0xffffff);
        group.add(crys);
      });
    } else if (d === 10 || d === 20) {
      const moon = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.08, 10, 24, Math.PI * 1.3),
        makeHoloMat(0xffee66, false, 0.95)
      );
      moon.position.set(0, 1.35, 0);
      moon.rotation.z = 0.6;
      group.add(moon);
      animatedItems.push({ obj: moon, type: "bob", phase: 0.3 });
    } else if (d === 16) {
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), makeHoloMat(0xffffff, false, 0.95));
      b1.position.set(0, 0.15, 0);
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), makeHoloMat(0xffffff, false, 0.95));
      b2.position.set(0, 0.55, 0);
      group.add(b1, b2);
    } else if (d === 23) {
      const tree = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 1.2, 12),
        makeHoloMat(0x44ff88, false, 0.85)
      );
      tree.position.set(0, 0.5, 0);
      makeWireOverlay(tree, 0xaaffcc);
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.15, 0),
        makeHoloMat(0xffee44, false, 1)
      );
      star.position.set(0, 1.2, 0);
      group.add(tree, star);
      animatedItems.push({ obj: star, type: "spin" });
    } else {
      const gem = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.32, 0),
        makeHoloMat(c1, false, 0.88)
      );
      gem.position.set(0, 0.55, 0);
      makeWireOverlay(gem, 0xffffff);
      group.add(gem);
      animatedItems.push({ obj: gem, type: "spin" });
    }

    activeGroup = group;
    scene.add(activeGroup);

    particleSystem = createParticles(c2, 65, 3.6);
    scene.add(particleSystem);
  }

  function init(container, story, initialMode = "ar") {
    mode = initialMode;
    if (typeof THREE === "undefined") {
      container.innerHTML = `<div style="color:#55eeff;text-align:center;padding:2rem;">
        <h2>3D-Bibliothek (Three.js) konnte nicht geladen werden.</h2>
        <p>Bitte prüfe die Internetverbindung auf deinem Gerät.</p>
      </div>`;
      return;
    }

    // alpha: true allows the live rear camera video to show behind the 3D dinos!
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, mode === "ar" ? 0 : 1);
    renderer.setScissorTest(true);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    const dir = new THREE.DirectionalLight(0xffffff, 1.25);
    dir.position.set(3, 6, 4);
    scene.add(amb, dir);

    cameras = [];
    for (let i = 0; i < 4; i++) {
      cameras.push(new THREE.PerspectiveCamera(40, 1, 0.1, 50));
    }
    singleCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    singleCamera.position.set(0, 1.55, 4.3);
    singleCamera.lookAt(0, 0.2, 0);

    populateScene(story);
    onResize(container);

    window.addEventListener("resize", () => onResize(container));

    // Touch / drag to rotate & move dinos on the table
    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      userRotY += (e.clientX - lastX) * 0.01;
      if (mode === "ar") {
        userOffsetY = Math.max(-1.4, Math.min(0.8, userOffsetY - (e.clientY - lastY) * 0.004));
      }
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    if (animId) cancelAnimationFrame(animId);
    animate();
  }

  function onResize(container) {
    if (!renderer) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
  }

  function setMode(newMode) {
    mode = newMode;
    if (renderer) {
      renderer.setClearColor(0x000000, mode === "ar" ? 0 : 1);
    }
  }

  function setScale(s) {
    userScale = s;
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    if (activeGroup) {
      if (mode === "ar") {
        activeGroup.rotation.y = userRotY;
        activeGroup.position.set(userOffsetX, userOffsetY, 0);
        activeGroup.scale.setScalar(userScale);
      } else if (mode === "single") {
        activeGroup.rotation.y = t * 0.25 + userRotY;
        activeGroup.position.set(0, 0, 0);
        activeGroup.scale.setScalar(1);
      } else {
        activeGroup.rotation.y = t * 0.45;
        activeGroup.position.set(0, 0, 0);
        activeGroup.scale.setScalar(1);
      }
    }

    // Animate Rexi & Tobi walking around the table!
    walkingDinos.forEach((d) => {
      const angle = t * d.speed + d.phase;
      d.obj.position.x = Math.cos(angle) * d.radius;
      d.obj.position.z = Math.sin(angle) * d.radius;
      // Face walking direction (tangent to circle)
      d.obj.rotation.y = -angle;
      // Gentle walking bounce
      d.obj.position.y = Math.abs(Math.sin(t * 6 + d.phase)) * 0.06;

      // Swing legs
      if (d.obj.userData.legs) {
        d.obj.userData.legs.forEach((leg, idx) => {
          const swing = Math.sin(t * 7 + d.phase + (idx % 2 === 0 ? 0 : Math.PI)) * 0.45;
          leg.rotation.x = swing;
        });
      }
    });

    if (particleSystem) {
      particleSystem.rotation.y = -t * 0.15;
    }

    animatedItems.forEach((item) => {
      if (item.type === "spin") {
        item.obj.rotation.y = t * 1.4;
        item.obj.rotation.x = Math.sin(t) * 0.3;
      } else if (item.type === "bob") {
        item.obj.position.y += Math.sin(t * 2.5 + item.phase) * 0.0018;
      } else if (item.type === "fly") {
        item.obj.position.y = 1.25 + Math.sin(t * 2) * 0.18;
        if (item.obj.userData.leftWing) {
          item.obj.userData.leftWing.rotation.z = Math.sin(t * 7) * 0.35;
          item.obj.userData.rightWing.rotation.z = -Math.sin(t * 7) * 0.35;
        }
      }
    });

    const w = renderer.domElement.clientWidth;
    const h = renderer.domElement.clientHeight;

    if (mode === "ar" || mode === "single") {
      singleCamera.aspect = w / Math.max(h, 1);
      singleCamera.updateProjectionMatrix();
      renderer.setViewport(0, 0, w, h);
      renderer.setScissor(0, 0, w, h);
      renderer.render(scene, singleCamera);
      return;
    }

    // Pepper's Ghost 4-Way Pyramid Layout
    const size = Math.min(w, h);
    const ox = Math.floor((w - size) / 2);
    const oy = Math.floor((h - size) / 2);
    const viewSize = Math.floor(size * 0.33);

    renderer.setViewport(0, 0, w, h);
    renderer.setScissor(0, 0, w, h);
    renderer.clear();

    const dist = 4.2;
    const positions = [
      { x: ox + (size - viewSize) / 2, y: oy + size - viewSize, camPos: [0, 0.7, dist], up: [0, -1, 0] },
      { x: ox + (size - viewSize) / 2, y: oy, camPos: [0, 0.7, -dist], up: [0, 1, 0] },
      { x: ox, y: oy + (size - viewSize) / 2, camPos: [-dist, 0.7, 0], up: [1, 0, 0] },
      { x: ox + size - viewSize, y: oy + (size - viewSize) / 2, camPos: [dist, 0.7, 0], up: [-1, 0, 0] }
    ];

    positions.forEach((p, idx) => {
      const cam = cameras[idx];
      cam.aspect = 1;
      cam.position.set(...p.camPos);
      cam.up.set(...p.up);
      cam.lookAt(0, 0.35, 0);
      cam.updateProjectionMatrix();

      renderer.setViewport(p.x, p.y, viewSize, viewSize);
      renderer.setScissor(p.x, p.y, viewSize, viewSize);
      renderer.render(scene, cam);
    });
  }

  return { init, setMode, setScale, populateScene };
})();

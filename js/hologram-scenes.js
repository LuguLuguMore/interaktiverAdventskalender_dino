/**
 * 3D & AR-Tisch-Szenen (Three.js + Blender GLB Rigged Dinos)
 * Lädt models/rexi.glb & models/tobi.glb mit ihren Blender-Animationen
 * (Walk, Happy, Idle, Sleep) und fällt bei Bedarf auf prozedurale Dinos zurück.
 */
window.HologramPlayer = (function () {
  let renderer, scene, cameras = [], singleCamera;
  let animId = null;
  let mode = "ar"; // "ar" | "single" | "pyramid"
  let activeGroup = null;
  let walkingDinos = [];
  let animatedItems = [];
  let particleSystem = null;
  let mixers = [];
  let dinoControllers = []; // { mixer, clips, currentAction, root, radius, speed, phase }
  let currentAnimName = "Walk";
  const clock = new THREE.Clock();

  // User interaction state
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

  function createParticles(colorHex, count = 65, spread = 3.6) {
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

  function playClipOnController(ctrl, animName) {
    if (!ctrl || !ctrl.clips || ctrl.clips.length === 0) return;
    const clip =
      ctrl.clips.find((c) => c.name.toLowerCase().includes(animName.toLowerCase())) ||
      ctrl.clips[0];
    if (!clip) return;
    const nextAction = ctrl.mixer.clipAction(clip);
    if (ctrl.currentAction === nextAction) return;
    if (ctrl.currentAction) {
      ctrl.currentAction.fadeOut(0.25);
    }
    nextAction.reset().fadeIn(0.25).play();
    ctrl.currentAction = nextAction;
  }

  function setAnimation(animName) {
    currentAnimName = animName;
    dinoControllers.forEach((ctrl) => playClipOnController(ctrl, animName));
  }

  function loadGLBDino(url, targetGroup, phase, defaultAnim) {
    if (typeof THREE.GLTFLoader === "undefined") return;
    const loader = new THREE.GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(0.65);
        targetGroup.add(model);

        const mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);

        const ctrl = {
          mixer,
          clips: gltf.animations || [],
          currentAction: null,
          root: model,
          radius: 1.05,
          speed: 0.55,
          phase
        };
        dinoControllers.push(ctrl);
        playClipOnController(ctrl, defaultAnim);
      },
      undefined,
      (err) => {
        console.warn("GLB konnte nicht geladen werden:", url, err);
      }
    );
  }

  function populateScene(story) {
    if (activeGroup) scene.remove(activeGroup);
    if (particleSystem) scene.remove(particleSystem);
    animatedItems = [];
    walkingDinos = [];
    mixers = [];
    dinoControllers = [];

    const group = new THREE.Group();
    const c1 = new THREE.Color(story.accentColor || "#44ddff").getHex();
    const c2 = new THREE.Color(story.secondaryColor || "#ff77ff").getHex();

    // Table surface ring / shadow disc
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.025, 12, 48),
      makeHoloMat(c1, false, 0.55)
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.05;
    group.add(ring);

    const tableDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.75, 48),
      new THREE.MeshBasicMaterial({ color: c1, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    tableDisc.rotation.x = Math.PI / 2;
    tableDisc.position.y = -0.06;
    group.add(tableDisc);

    // Choose initial pose based on story day
    const d = story.day;
    let initialAnim = "Walk";
    if ([4, 10, 14, 22].includes(d)) initialAnim = "Sleep";
    else if ([1, 2, 12, 19, 23, 24].includes(d)) initialAnim = "Happy";
    currentAnimName = initialAnim;

    // Load Blender Rigged GLB Dinos!
    loadGLBDino("models/rexi.glb", group, 0, initialAnim);
    loadGLBDino("models/tobi.glb", group, Math.PI, initialAnim);

    function loadGuestGLB(url, pos, scale, animName, rotY = 0, orbitFn = null) {
      if (typeof THREE.GLTFLoader === "undefined") return;
      new THREE.GLTFLoader().load(url, (gltf) => {
        const m = gltf.scene;
        m.scale.setScalar(scale);
        m.position.set(...pos);
        m.rotation.y = rotY;
        group.add(m);
        const mixer = new THREE.AnimationMixer(m);
        mixers.push(mixer);
        const clips = gltf.animations || [];
        const clip = clips.find((c) => c.name.toLowerCase().includes(animName.toLowerCase())) || clips[0];
        if (clip) mixer.clipAction(clip).play();
        if (orbitFn) animatedItems.push({ obj: m, type: "custom", fn: orbitFn });
      });
    }

    // Add story-specific Blender guest characters!
    if (d === 2) {
      loadGuestGLB("models/paul.glb", [0, 0, -0.35], 0.58, "Walk", 0.3);
    } else if (d === 4) {
      loadGuestGLB("models/anky.glb", [0, 0, 0.25], 0.65, "Sleep", -0.4);
    } else if (d === 5 || d === 21) {
      loadGuestGLB("models/fips.glb", [0, 1.35, 0], 0.65, "Fly", 0, (obj, t) => {
        const a = t * 1.1;
        obj.position.set(Math.cos(a) * 0.95, 1.3 + Math.sin(t * 2) * 0.15, Math.sin(a) * 0.95);
        obj.rotation.y = -a;
      });
    } else if (d === 8) {
      loadGuestGLB("models/stella.glb", [0, 0, 0.1], 0.62, "Happy", -0.3);
    } else if (d === 12) {
      loadGuestGLB("models/turtle.glb", [-0.45, 0, 0.2], 0.45, "Dance", 0.2);
      loadGuestGLB("models/turtle.glb", [0, 0, -0.2], 0.48, "Dance", 0.0);
      loadGuestGLB("models/turtle.glb", [0.45, 0, 0.2], 0.45, "Dance", -0.2);
    } else if (d === 14) {
      loadGuestGLB("models/paul.glb", [0, 0, 0], 0.68, "Sleep", 1.2);
    } else if (d === 24) {
      // Grand Finale: All Dino friends celebrate!
      loadGuestGLB("models/fips.glb", [0, 1.5, 0], 0.55, "Fly", 0, (obj, t) => {
        const a = t * 1.2;
        obj.position.set(Math.cos(a) * 1.15, 1.45 + Math.sin(t * 2) * 0.12, Math.sin(a) * 1.15);
        obj.rotation.y = -a;
      });
      loadGuestGLB("models/stella.glb", [-0.75, 0, -0.75], 0.5, "Happy", 0.6);
      loadGuestGLB("models/paul.glb", [0.75, 0, -0.8], 0.48, "Walk", -0.6);
    }

    // Add Poly Haven Nature Props (Farntal ferns, fallen log, boulders)
    if ([1, 2, 4, 8, 9, 11, 13, 19, 21, 23].includes(d)) {
      loadGuestGLB("models/fern.glb", [-0.9, -0.05, -0.9], 0.65, "", 0.4);
      loadGuestGLB("models/fern.glb", [0.95, -0.05, -0.85], 0.55, "", -0.8);
    }
    if ([7, 15, 18].includes(d)) {
      loadGuestGLB("models/log.glb", [0, 0.05, 0], 0.85, "", 0.3);
    }
    if ([5, 6, 22].includes(d)) {
      loadGuestGLB("models/rock.glb", [-0.85, 0, -0.75], 0.75, "", 0.5);
    }

    // Scene-specific 3D centerpiece in the middle of the table
    if (d === 1 || d === 24) {
      const stone = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
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
      volc.position.set(0, 0.5, 0);
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
        crys.position.set(cx, 0.35, 0);
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
      b1.position.set(0, 0.2, 0);
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), makeHoloMat(0xffffff, false, 0.95));
      b2.position.set(0, 0.6, 0);
      group.add(b1, b2);
    } else if (d === 23) {
      const tree = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 1.2, 12),
        makeHoloMat(0x44ff88, false, 0.85)
      );
      tree.position.set(0, 0.55, 0);
      makeWireOverlay(tree, 0xaaffcc);
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.15, 0),
        makeHoloMat(0xffee44, false, 1)
      );
      star.position.set(0, 1.25, 0);
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

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, mode === "ar" ? 0 : 1);
    renderer.setScissorTest(true);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    const amb = new THREE.AmbientLight(0xffffff, 0.95);
    const dir = new THREE.DirectionalLight(0xffffff, 1.25);
    dir.position.set(3, 6, 4);
    scene.add(amb, dir);

    cameras = [];
    for (let i = 0; i < 4; i++) {
      cameras.push(new THREE.PerspectiveCamera(40, 1, 0.1, 50));
    }
    singleCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    singleCamera.position.set(0, 1.65, 4.4);
    singleCamera.lookAt(0, 0.25, 0);

    populateScene(story);
    onResize(container);

    window.addEventListener("resize", () => onResize(container));

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
    const delta = clock.getDelta();
    const t = clock.elapsedTime;

    mixers.forEach((m) => m.update(delta));

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

    // Move GLB Dinos around the table when Walk is active, or face center otherwise
    dinoControllers.forEach((ctrl) => {
      const angle = (currentAnimName === "Walk" ? t * ctrl.speed : 0) + ctrl.phase;
      ctrl.root.position.x = Math.cos(angle) * ctrl.radius;
      ctrl.root.position.z = Math.sin(angle) * ctrl.radius;
      if (currentAnimName === "Walk") {
        ctrl.root.rotation.y = -angle;
      } else {
        // Face slightly toward viewer/center
        ctrl.root.rotation.y = ctrl.phase === 0 ? -0.6 : 0.6;
      }
    });

    if (particleSystem) {
      particleSystem.rotation.y = -t * 0.15;
    }

    animatedItems.forEach((item) => {
      if (item.type === "custom" && item.fn) {
        item.fn(item.obj, t);
      } else if (item.type === "spin") {
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

  return { init, setMode, setScale, setAnimation, populateScene };
})();

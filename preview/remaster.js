(function () {
  "use strict";

  var state = {
    stamina: 100,
    sprinting: false,
    checkpoint: new BABYLON.Vector3(-20, 8, 0),
    checkpointIndex: 0,
    lastLives: null,
    bossStartedAt: null,
    lastZone: "Ingresso"
  };

  var hud = document.getElementById("remasterHud");
  var zoneEl = document.getElementById("zoneName");
  var progressEl = document.getElementById("progressFill");
  var staminaEl = document.getElementById("staminaFill");
  var bossEl = document.getElementById("bossStatus");
  var toastEl = document.getElementById("toast");
  var damageEl = document.getElementById("damageFlash");
  var toastTimer;

  function notify(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  function flashDamage() {
    damageEl.classList.remove("hit");
    void damageEl.offsetWidth;
    damageEl.classList.add("hit");
  }

  function configureVisuals() {
    scene.clearColor = new BABYLON.Color4(0.025, 0.035, 0.055, 1);
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = new BABYLON.Color3(0.055, 0.07, 0.1);
    scene.fogStart = 260;
    scene.fogEnd = 1150;
    scene.imageProcessingConfiguration.contrast = 1.14;
    scene.imageProcessingConfiguration.exposure = 1.05;

    var fill = new BABYLON.HemisphericLight("remasterFill", new BABYLON.Vector3(0, 1, 0), scene);
    fill.intensity = 0.22;
    fill.diffuse = new BABYLON.Color3(0.45, 0.58, 0.78);
    fill.groundColor = new BABYLON.Color3(0.05, 0.035, 0.025);

    if (BABYLON.DefaultRenderingPipeline) {
      try {
        var pipeline = new BABYLON.DefaultRenderingPipeline("remasterPipeline", true, scene, [camera]);
        pipeline.fxaaEnabled = true;
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.82;
        pipeline.bloomWeight = 0.16;
        pipeline.bloomKernel = 48;
        pipeline.samples = 1;
      } catch (error) {
        console.warn("Post processing ridotto", error);
      }
    }

    camera.fov = 0.72;
    camera.cameraAcceleration = 0.055;
    camera.maxCameraSpeed = 55;
  }

  function makeBeacon(x, z, color) {
    var orb = BABYLON.MeshBuilder.CreateSphere("guideBeacon", { diameter: 1.5, segments: 10 }, scene);
    orb.position = new BABYLON.Vector3(x, 1.4, z);
    orb.isPickable = false;
    var material = new BABYLON.StandardMaterial("guideBeaconMaterial", scene);
    material.diffuseColor = color.scale(0.12);
    material.emissiveColor = color;
    material.specularColor = BABYLON.Color3.Black();
    material.freeze();
    orb.material = material;
    return orb;
  }

  function enrichLevel() {
    var cyan = new BABYLON.Color3(0.12, 0.72, 1);
    var amber = new BABYLON.Color3(1, 0.34, 0.08);
    [-5, 210, 430, 665, 845, 1245, 1400].forEach(function (x, index) {
      var color = x >= 845 ? amber : cyan;
      makeBeacon(x, -43, color);
      makeBeacon(x, 43, color);
    });

    [380, 820, 1260].forEach(function (x) {
      var ring = BABYLON.MeshBuilder.CreateTorus("checkpointRing", { diameter: 12, thickness: 0.45, tessellation: 32 }, scene);
      ring.position = new BABYLON.Vector3(x, 7, 0);
      ring.rotation.x = Math.PI / 2;
      ring.isPickable = false;
      var mat = new BABYLON.StandardMaterial("checkpointMaterial", scene);
      mat.emissiveColor = new BABYLON.Color3(0.08, 0.7, 1);
      mat.diffuseColor = new BABYLON.Color3(0.02, 0.12, 0.2);
      mat.alpha = 0.72;
      ring.material = mat;
      scene.registerBeforeRender(function () {
        ring.rotation.z += 0.008 * Math.min(engine.getDeltaTime() / 16.67, 2);
      });
    });
  }

  function currentZone(x) {
    if (x < 300) return "Ingresso · Addestramento";
    if (x < 700) return "Distretto dei Segugi";
    if (x < 880) return "Deposito Instabile";
    if (x < 1320) return "Fiume di Lava";
    if (x < 1400) return "Ultimo Avamposto";
    return "Nucleo · Scontro Finale";
  }

  function updateCheckpoint(x) {
    var marks = [380, 820, 1260];
    if (state.checkpointIndex < marks.length && x >= marks[state.checkpointIndex]) {
      state.checkpoint = new BABYLON.Vector3(marks[state.checkpointIndex] + 8, 9, 0);
      state.checkpointIndex++;
      notify("CHECKPOINT " + state.checkpointIndex + " RAGGIUNTO");
    }
  }

  function respawn() {
    if (!body || !body.physicsImpostor || clicks !== 1) return;
    body.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    body.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    body.position.copyFrom(state.checkpoint);
    notify("RIPARTENZA DAL CHECKPOINT");
  }

  window.addEventListener("keydown", function (event) {
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") state.sprinting = true;
    if (event.code === "KeyR") respawn();
  });
  window.addEventListener("keyup", function (event) {
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") state.sprinting = false;
  });

  configureVisuals();
  enrichLevel();

  scene.registerBeforeRender(function () {
    if (!body || clicks !== 1) {
      hud.classList.remove("active");
      return;
    }

    hud.classList.add("active");
    var delta = Math.min(engine.getDeltaTime(), 40) / 1000;
    var moving = !!(map.w || map.W || map.a || map.A || map.s || map.S || map.d || map.D);
    var canSprint = state.sprinting && moving && state.stamina > 1;
    if (canSprint) state.stamina = Math.max(0, state.stamina - 30 * delta);
    else state.stamina = Math.min(100, state.stamina + 20 * delta);
    movementStep = 36 * delta * (canSprint ? 1.55 : 1);
    staminaEl.style.transform = "scaleX(" + (state.stamina / 100).toFixed(3) + ")";

    var x = body.position.x;
    var zone = currentZone(x);
    if (zone !== state.lastZone) {
      state.lastZone = zone;
      notify(zone.toUpperCase());
    }
    zoneEl.textContent = zone;
    progressEl.style.transform = "scaleX(" + Math.max(0, Math.min(1, (x + 20) / 1540)).toFixed(3) + ")";
    updateCheckpoint(x);

    if (body.position.y < -35) respawn();

    var lives = life1 && life1.text;
    if (state.lastLives !== null && lives !== state.lastLives && lives !== "GAME OVER") flashDamage();
    state.lastLives = lives;

    if (x >= 1400 && state.bossStartedAt === null) state.bossStartedAt = performance.now();
    if (state.bossStartedAt !== null && !victory) {
      var remaining = Math.max(0, 45 - (performance.now() - state.bossStartedAt) / 1000);
      bossEl.textContent = "SOVRACCARICO BOSS  " + remaining.toFixed(1) + "s";
      bossEl.classList.add("visible");
    } else {
      bossEl.classList.remove("visible");
    }
  });

  notify("SHIFT PER CORRERE · R PER IL CHECKPOINT");
})();


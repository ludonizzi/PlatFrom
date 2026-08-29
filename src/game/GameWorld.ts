import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh, MeshBuilder } from "@babylonjs/core/Meshes";
import { DirectionalLight, HemisphericLight } from "@babylonjs/core/Lights";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Collisions/collisionCoordinator";
import type { Engine } from "@babylonjs/core/Engines/engine";
import type { InputController } from "./InputController";
import type { UI } from "./UI";

type Platform = { mesh: Mesh; top: number };

export class GameWorld {
  readonly scene: Scene;
  elapsed = 0;
  private readonly player: Mesh;
  private readonly camera: ArcRotateCamera;
  private readonly platforms: Platform[] = [];
  private readonly cores: Mesh[] = [];
  private velocityY = 0;
  private grounded = false;
  private lives = 3;
  private collected = 0;
  private checkpoint = new Vector3(0, 2, 0);
  private finished = false;

  constructor(engine: Engine, canvas: HTMLCanvasElement, private readonly input: InputController, private readonly ui: UI, private readonly onFinish: (won: boolean) => void) {
    this.scene = new Scene(engine);
    this.scene.clearColor = new Color4(0.025, 0.035, 0.08, 1);
    this.scene.collisionsEnabled = true;

    new HemisphericLight("ambient", new Vector3(0, 1, 0), this.scene).intensity = 0.65;
    const sun = new DirectionalLight("sun", new Vector3(-0.4, -1, 0.25), this.scene); sun.position = new Vector3(20, 40, -20); sun.intensity = 3;
    this.player = this.createPlayer();
    this.camera = new ArcRotateCamera("camera", -Math.PI / 2, 1.05, 13, this.player.position, this.scene);
    this.camera.lowerRadiusLimit = 7; this.camera.upperRadiusLimit = 18; this.camera.lowerBetaLimit = 0.65; this.camera.upperBetaLimit = 1.35;
    this.camera.wheelDeltaPercentage = 0.01; this.camera.panningSensibility = 0; this.camera.attachControl(canvas, true);
    this.buildLevel();
    const pipeline = new DefaultRenderingPipeline("quality", true, this.scene, [this.camera]);
    pipeline.fxaaEnabled = true; pipeline.bloomEnabled = true; pipeline.bloomWeight = 0.18; pipeline.bloomThreshold = 0.76; pipeline.imageProcessing.contrast = 1.18; pipeline.imageProcessing.exposure = 1.05;
    this.syncHud(); this.ui.toast("Collect every energy core");
  }

  update(dt: number): void {
    if (this.finished) return;
    this.elapsed += dt;
    const axis = this.input.axis(); const sprint = this.input.isDown("ShiftLeft") || this.input.isDown("ShiftRight");
    const forward = this.camera.getForwardRay().direction; forward.y = 0; forward.normalize();
    const right = Vector3.Cross(Vector3.Up(), forward).normalize();
    const direction = forward.scale(axis.z).add(right.scale(axis.x));
    if (direction.lengthSquared() > 0.01) {
      direction.normalize(); const speed = sprint ? 8.8 : 6.2;
      this.player.moveWithCollisions(direction.scale(speed * dt));
      this.player.rotation.y = Math.atan2(direction.x, direction.z);
    }
    if (this.grounded && this.input.consume("Space")) { this.velocityY = 9.2; this.grounded = false; }
    this.velocityY -= 24 * dt;
    const previousY = this.player.position.y; this.player.moveWithCollisions(new Vector3(0, this.velocityY * dt, 0));
    if (this.velocityY <= 0 && Math.abs(this.player.position.y - previousY) < Math.abs(this.velocityY * dt) * 0.25) { this.velocityY = 0; this.grounded = true; }
    else if (this.velocityY > 0) this.grounded = false;
    this.camera.target.copyFrom(this.player.position.add(new Vector3(0, 1.2, 0)));
    this.animateCores(dt); this.checkProgress();
    if (this.player.position.y < -12) this.respawn();
    this.ui.update(this.collected, this.cores.length + this.collected, this.lives, this.elapsed);
  }

  render(): void { this.scene.render(); }
  dispose(): void { this.scene.dispose(); }
  syncHud(): void { this.ui.update(this.collected, this.cores.length + this.collected, this.lives, this.elapsed); }

  private createPlayer(): Mesh {
    const mesh = MeshBuilder.CreateCapsule("runner", { height: 2.2, radius: 0.55, tessellation: 12 }, this.scene);
    mesh.position.copyFrom(this.checkpoint); mesh.ellipsoid = new Vector3(0.5, 1.05, 0.5); mesh.ellipsoidOffset = new Vector3(0, 1.05, 0); mesh.checkCollisions = true;
    const material = new PBRMaterial("runnerMaterial", this.scene); material.albedoColor = new Color3(0.18, 0.95, 0.78); material.metallic = 0.2; material.roughness = 0.35; material.emissiveColor = new Color3(0.02, 0.18, 0.14); mesh.material = material;
    return mesh;
  }

  private buildLevel(): void {
    const layout: Array<[number, number, number, number, number, number]> = [
      [0, -1, 0, 12, 2, 12], [0, 1, 12, 7, 1.5, 7], [7, 2.5, 18, 6, 1.5, 6], [1, 4, 25, 8, 1.5, 7],
      [-7, 5.5, 32, 6, 1.5, 6], [0, 7, 39, 8, 1.5, 7], [8, 8.5, 47, 7, 1.5, 7], [0, 10, 56, 10, 2, 10],
    ];
    layout.forEach(([x, y, z, w, h, d], index) => {
      const mesh = MeshBuilder.CreateBox(`platform-${index}`, { width: w, height: h, depth: d }, this.scene); mesh.position.set(x, y, z); mesh.checkCollisions = true;
      const material = new PBRMaterial(`platformMaterial-${index}`, this.scene); material.albedoColor = index % 2 ? new Color3(0.12, 0.15, 0.28) : new Color3(0.17, 0.1, 0.3); material.metallic = 0.45; material.roughness = 0.62; mesh.material = material;
      this.platforms.push({ mesh, top: y + h / 2 });
      if (index > 0 && index < layout.length - 1) this.createCore(new Vector3(x, y + h / 2 + 1.3, z));
    });
    for (let i = 0; i < 34; i++) { const tower = MeshBuilder.CreateBox(`tower-${i}`, { width: 3 + Math.random() * 5, height: 8 + Math.random() * 35, depth: 3 + Math.random() * 5 }, this.scene); tower.position.set((Math.random() > .5 ? 1 : -1) * (16 + Math.random() * 35), tower.scaling.y - 8, -8 + Math.random() * 78); const m = new PBRMaterial(`towerMaterial-${i}`, this.scene); m.albedoColor = new Color3(.025, .035 + Math.random() * .04, .075 + Math.random() * .08); m.roughness = .9; tower.material = m; }
    const gate = MeshBuilder.CreateTorus("extraction", { diameter: 5, thickness: .35, tessellation: 48 }, this.scene); gate.position.set(0, 13, 56); gate.rotation.x = Math.PI / 2; const gm = new PBRMaterial("gateMaterial", this.scene); gm.albedoColor = new Color3(.2, .9, 1); gm.emissiveColor = new Color3(.1, .7, 1); gate.material = gm;
  }

  private createCore(position: Vector3): void { const core = MeshBuilder.CreatePolyhedron("core", { type: 1, size: .65 }, this.scene); core.position.copyFrom(position); const m = new PBRMaterial("coreMaterial", this.scene); m.albedoColor = new Color3(.45, .35, 1); m.emissiveColor = new Color3(.35, .2, 1); m.metallic = .4; m.roughness = .2; core.material = m; this.cores.push(core); }
  private animateCores(dt: number): void { for (const core of this.cores) { core.rotation.y += dt * 1.8; core.rotation.x += dt * .6; } }
  private checkProgress(): void {
    for (let i = this.cores.length - 1; i >= 0; i--) if (Vector3.DistanceSquared(this.player.position, this.cores[i].position) < 2.4) { this.cores[i].dispose(); this.cores.splice(i, 1); this.collected++; this.checkpoint.copyFrom(this.player.position); this.ui.toast("Checkpoint restored"); }
    if (this.cores.length === 0 && Vector3.DistanceSquared(this.player.position, new Vector3(0, 12, 56)) < 10) { this.finished = true; this.onFinish(true); }
  }
  private respawn(): void { this.lives--; if (this.lives <= 0) { this.finished = true; this.onFinish(false); return; } this.player.position.copyFrom(this.checkpoint); this.velocityY = 0; this.ui.toast("Signal recovered"); }
}

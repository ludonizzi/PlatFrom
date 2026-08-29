import { Engine } from "@babylonjs/core/Engines/engine";
import { InputController } from "./InputController";
import { GameWorld } from "./GameWorld";
import { UI } from "./UI";

type State = "menu" | "playing" | "paused" | "result";

export class App {
  private readonly engine: Engine;
  private readonly input = new InputController();
  private readonly ui: UI;
  private world?: GameWorld;
  private state: State = "menu";

  constructor(private readonly canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.engine = new Engine(canvas, true, { adaptToDeviceRatio: true, powerPreference: "high-performance" });
    this.ui = new UI(uiRoot);
    window.addEventListener("resize", () => this.engine.resize());
    document.addEventListener("visibilitychange", () => { if (document.hidden && this.state === "playing") this.pause(); });
  }

  start(): void {
    this.ui.menu(() => this.newRun());
    this.engine.runRenderLoop(() => {
      const dt = Math.min(this.engine.getDeltaTime() / 1000, 1 / 20);
      if (this.state === "playing" && this.world) {
        if (this.input.consume("Escape")) this.pause();
        else this.world.update(dt);
      } else if (this.state === "paused" && this.input.consume("Escape")) this.resume();
      this.world?.render(); this.input.endFrame();
    });
  }

  private newRun(): void {
    try {
      this.world?.dispose();
      this.world = new GameWorld(this.engine, this.canvas, this.input, this.ui, (won) => this.finish(won));
      this.state = "playing"; this.ui.hud(); this.canvas.focus();
    } catch (error) {
      console.error("Unable to start the run", error);
      this.state = "menu";
    }
  }
  private pause(): void { if (this.state !== "playing") return; this.state = "paused"; this.ui.pause(() => this.resume(), () => this.newRun()); }
  private resume(): void { this.state = "playing"; this.ui.hud(); this.world?.syncHud(); this.canvas.focus(); }
  private finish(won: boolean): void { this.state = "result"; this.ui.result(won, this.world?.elapsed ?? 0, () => this.newRun()); }
}

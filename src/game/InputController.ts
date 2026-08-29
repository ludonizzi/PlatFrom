export class InputController {
  private readonly down = new Set<string>();
  private readonly pressed = new Set<string>();

  constructor(private readonly target: Window = window) {
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
    this.target.addEventListener("blur", this.clear);
  }

  axis(): { x: number; z: number } {
    const x = Number(this.down.has("KeyD") || this.down.has("ArrowRight")) - Number(this.down.has("KeyA") || this.down.has("ArrowLeft"));
    const z = Number(this.down.has("KeyW") || this.down.has("ArrowUp")) - Number(this.down.has("KeyS") || this.down.has("ArrowDown"));
    const length = Math.hypot(x, z) || 1;
    return { x: x / length, z: z / length };
  }

  isDown(code: string): boolean { return this.down.has(code); }
  consume(code: string): boolean { const value = this.pressed.has(code); this.pressed.delete(code); return value; }
  endFrame(): void { this.pressed.clear(); }
  dispose(): void { this.target.removeEventListener("keydown", this.onKeyDown); this.target.removeEventListener("keyup", this.onKeyUp); this.target.removeEventListener("blur", this.clear); }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
    if (!event.repeat) this.pressed.add(event.code);
    this.down.add(event.code);
  };
  private readonly onKeyUp = (event: KeyboardEvent): void => { this.down.delete(event.code); };
  private readonly clear = (): void => { this.down.clear(); this.pressed.clear(); };
}

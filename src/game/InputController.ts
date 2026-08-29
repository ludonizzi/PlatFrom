export class InputController {
  private readonly down = new Set<string>();
  private readonly pressed = new Set<string>();
  private readonly virtual = new Set<string>();

  constructor(private readonly target: Window = window) {
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
    this.target.addEventListener("blur", this.clear);
  }

  axis(): { x: number; z: number } {
    const active = (code: string) => this.down.has(code) || this.virtual.has(code);
    const x = Number(active("KeyD") || active("ArrowRight")) - Number(active("KeyA") || active("ArrowLeft"));
    const z = Number(active("KeyW") || active("ArrowUp")) - Number(active("KeyS") || active("ArrowDown"));
    const length = Math.hypot(x, z) || 1;
    return { x: x / length, z: z / length };
  }

  isDown(code: string): boolean { return this.down.has(code) || this.virtual.has(code); }
  consume(code: string): boolean { const value = this.pressed.has(code); this.pressed.delete(code); return value; }
  virtualKey(code: string, active: boolean): void { if (active) { if (!this.virtual.has(code)) this.pressed.add(code); this.virtual.add(code); } else this.virtual.delete(code); }
  endFrame(): void { this.pressed.clear(); }
  dispose(): void { this.target.removeEventListener("keydown", this.onKeyDown); this.target.removeEventListener("keyup", this.onKeyUp); this.target.removeEventListener("blur", this.clear); }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
    if (!event.repeat) this.pressed.add(event.code);
    this.down.add(event.code);
  };
  private readonly onKeyUp = (event: KeyboardEvent): void => { this.down.delete(event.code); };
  private readonly clear = (): void => { this.down.clear(); this.virtual.clear(); this.pressed.clear(); };
}

export class UI {
  private toastTimer = 0;
  constructor(private readonly root: HTMLElement) {}

  menu(onStart: () => void): void {
    this.root.className = "screen";
    this.root.innerHTML = `<main class="panel"><p class="eyebrow">A city above the void</p><h1>Plat<span>From</span></h1><p class="lead">Recover the energy cores, reactivate the skyline and reach the extraction gate. Every jump matters.</p><div class="actions"><button class="primary" data-start>Start run</button></div><p class="help">WASD / arrows to move · Space to jump · Shift to sprint · Esc to pause</p></main>`;
    this.root.onclick = (event) => { if ((event.target as Element).closest("[data-start]")) onStart(); };
  }

  hud(onVirtualKey?: (code: string, active: boolean) => void): void {
    this.root.onclick = null;
    this.root.className = "hud";
    this.root.innerHTML = `<div class="hud-group"><div class="pill">ENERGY <strong data-cores>0 / 0</strong></div><div class="pill">LIVES <strong data-lives>3</strong></div></div><div class="pill">TIME <strong data-time>00:00</strong></div><div class="toast" data-toast></div><div class="mobile-controls" aria-label="Touch controls"><div class="dpad"><button data-key="KeyW">▲</button><button data-key="KeyA">◀</button><button data-key="KeyS">▼</button><button data-key="KeyD">▶</button></div><button class="jump" data-key="Space">JUMP</button></div>`;
    if (onVirtualKey) for (const button of this.root.querySelectorAll<HTMLButtonElement>("[data-key]")) {
      const code = button.dataset.key ?? "";
      const set = (active: boolean) => onVirtualKey(code, active);
      button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); set(true); });
      button.addEventListener("pointerup", () => set(false)); button.addEventListener("pointercancel", () => set(false));
    }
  }

  update(cores: number, total: number, lives: number, seconds: number): void {
    this.set("[data-cores]", `${cores} / ${total}`); this.set("[data-lives]", String(lives));
    this.set("[data-time]", `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`);
  }

  pause(onResume: () => void, onRestart: () => void): void {
    this.root.className = "screen";
    this.root.innerHTML = `<main class="panel"><p class="eyebrow">Run suspended</p><h1>Pause</h1><p class="lead">The city will wait. Take a breath.</p><div class="actions"><button class="primary" data-resume>Resume</button><button data-restart>Restart run</button></div></main>`;
    this.root.onclick = (event) => { const target = event.target as Element; if (target.closest("[data-resume]")) onResume(); else if (target.closest("[data-restart]")) onRestart(); };
  }

  result(won: boolean, seconds: number, onRestart: () => void): void {
    this.root.className = "screen";
    this.root.innerHTML = `<main class="panel"><p class="eyebrow">${won ? "Skyline restored" : "Signal lost"}</p><h1>${won ? "Run complete" : "Game over"}</h1><p class="lead">${won ? `Extraction reached in ${Math.floor(seconds)} seconds.` : "The void wins this round. Your last checkpoint is waiting."}</p><div class="actions"><button class="primary" data-restart>Play again</button></div></main>`;
    this.root.onclick = (event) => { if ((event.target as Element).closest("[data-restart]")) onRestart(); };
  }

  toast(message: string): void {
    const element = this.root.querySelector<HTMLElement>("[data-toast]"); if (!element) return;
    window.clearTimeout(this.toastTimer); element.textContent = message; element.classList.add("show");
    this.toastTimer = window.setTimeout(() => element.classList.remove("show"), 1800);
  }
  private set(selector: string, text: string): void { const element = this.root.querySelector(selector); if (element) element.textContent = text; }
}

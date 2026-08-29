import "./styles.css";
import { App } from "./game/App";

const canvas = document.querySelector<HTMLCanvasElement>("#game");
const ui = document.querySelector<HTMLElement>("#ui");
if (!canvas || !ui) throw new Error("Game shell is missing");

new App(canvas, ui).start();

import { html, render } from "lit-html";
import { Bimp } from "./Bimp";
import { App } from "./App";
import { grid } from "./grid";
import { pointerTracker } from "./pointerTracker";
import { outline } from "./outline";
import { brush } from "./tools";
import { drawingCanvas } from "./drawingCanvas";

let state = {
  activeColor: 0,
  scale: 40 / devicePixelRatio,
  bitmap: Bimp.empty(16, 16, 1),
  palette: [
    "#20344c",
    "#faead6",
    "#de7895",
    "#f75060",
    "#f7885f",
    "#f2c469",
    "#b1d36f",
    "#3ee0cf",
    "#0091c2",
    "#ad6dca",
  ],
  paletteEdit: false,
};

let canvasSize = 16 * state.scale;

function view() {
  return html`<div id="site">
    <div id="editor-container">
      <canvas
        id="art"
        width="${canvasSize}px"
        height="${canvasSize}px"></canvas>

      <canvas
        id="grid"
        width="${canvasSize}px"
        height="${canvasSize}px"></canvas>
      <canvas
        id="outline"
        width="${canvasSize}px"
        height="${canvasSize}px"></canvas>
    </div>

    <div id="color-palette">
      ${state.palette.map(
        (hex, index) =>
          html`<div
            style="background-color: ${hex}"
            class="color-select ${index == state.activeColor ? "selected" : ""}"
            @click=${() => (state.activeColor = index)}>
            <!-- <label class="edit-color" for="color-${index}">
              <i class="fa-solid fa-pen"></i>
            </label>
            <input
              type="color"
              value="${hex}"
              @input=${(e) => {
              state.palette[index] = e.target.value;
            }} /> -->
          </div>`
      )}
      <button>edit</button>
    </div>
    <canvas
      id="actual-size"
      width="${16 * devicePixelRatio}px"
      height="${16 * devicePixelRatio}px"></canvas>
  </div>`;
}

const r = () => {
  render(view(), document.body);
  window.requestAnimationFrame(r);
};

window.onload = () => {
  r();

  const gridCanvas = document.getElementById("grid");
  const outlineCanvas = document.getElementById("outline");
  const faviconCanvas = document.getElementById("art");

  new App({
    state,
    components: [
      drawingCanvas({ canvas: faviconCanvas }),
      grid({ canvas: gridCanvas }),
      pointerTracker({ target: outlineCanvas }),
      outline({ canvas: outlineCanvas }),
    ],
  });
};

import { html, render } from "lit-html";
import { Bimp } from "./Bimp";
import { App } from "./App";
import { grid } from "./grid";
import { pointerTracker } from "./pointerTracker";
import { outline } from "./outline";
import { brush, flood, line, rect, shift } from "/tools";
import { drawingCanvas } from "./drawingCanvas";
import { previewCanvas } from "./previewCanvas";
import { toolbox } from "./toolbox";

import jscolor from "@eastdesire/jscolor";

import fav from "./start.json";

let app, previewApp;

let siteContainer,
  paletteContainer,
  preview,
  toolsContainer,
  editorContainer,
  gridCanvas,
  outlineCanvas,
  editorCanvas;

let state = {
  activeColor: 0,
  activeTool: "brush",
  scale: 0,
  bitmap: Bimp.fromJSON(fav),
  palette: [
    "#00000000",
    "#000000ff",
    "#ffffffff",
    "#44AA90FF",
    "#faead6ff",
    "#de7895ff",
    "#f75060ff",
    "#f7885fff",
    "#f2c469ff",
    "#b1d36fff",
    "#3ee0cfff",
    "#0091c2ff",
    "#ad6dcaff",
  ],
  paletteEdit: false,
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const tools = { brush, flood, line, rect, shift };
const iconMap = {
  flood: "fa-fill-drip",
  brush: "fa-paintbrush",
  rect: "fa-vector-square",
  line: "fa-minus",
  shift: "fa-up-down-left-right",
};

function updateState(state, action) {
  return { ...state, ...action };
}

function dispatch(action) {
  const changes = Object.keys(action);
  state = updateState(state, action);
  app.syncState(state, changes);
  previewApp.syncState(state, changes);
}

function download() {
  const downloadAnchorNode = document.createElement("a");

  downloadAnchorNode.setAttribute(
    "href",
    editorCanvas.toDataURL("image/x-icon")
  );
  downloadAnchorNode.setAttribute("download", "favicon.ico");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function deleteColor(index) {
  if (state.palette.length == 1) {
    alert("you need some color in your life");
    return;
  }
  const newPalette = state.palette.filter((color, i) => i != index);
  const newBitmap = state.bitmap.pixels.map((bit) => {
    if (bit == index) return 0;
    if (bit > index) return bit - 1;
    return bit;
  });

  dispatch({ palette: newPalette, bitmap: new Bimp(16, 16, newBitmap) });
}

function updatePalette(picker, index) {
  const newPalette = [...state.palette];
  newPalette[index] = picker.toRGBAString();
  dispatch({
    palette: newPalette,
    bitmap: new Bimp(16, 16, state.bitmap.pixels),
  });
}

function editColor(index) {
  const target = document.getElementById(`color-${index}`);
  if (!target.jscolor) {
    const picker = new jscolor(target, {
      preset: "dark large",
      format: "hexa",
      value: state.palette[index],
      onInput: () => updatePalette(picker, index),
      previewElement: null,
    });
  }
  target.jscolor.show();
}

function view() {
  return html`<div id="site">
    <div id="tool-container">
      ${Object.keys(tools).map(
        (tool) =>
          html`<button
            class=${state.activeTool == tool ? "active" : ""}
            @click=${() => dispatch({ activeTool: tool })}>
            <i class="fa-solid ${iconMap[tool]}"></i>
          </button>`
      )}

      <canvas
        id="preview"
        width="${16 * devicePixelRatio}px"
        height="${16 * devicePixelRatio}px"></canvas>

      <button @click=${() => download()}>
        <i class="fa-solid fa-download"></i>
      </button>
    </div>

    <div id="editor-container">
      <canvas id="art"></canvas>
      <canvas id="grid"></canvas>
      <canvas id="outline"></canvas>
    </div>

    <div id="color-palette">
      <button
        class="${state.editingPalette ? "selected" : ""}"
        @click=${() => dispatch({ editingPalette: !state.editingPalette })}>
        <i class="fa-solid fa-pen"></i>
      </button>
      <button
        style="aspect-ratio: 1;"
        @click=${() => {
          let newPalette = [...state.palette];
          newPalette.push(getRandomColor());
          dispatch({ palette: newPalette });
        }}>
        <i class="fa-solid fa-plus"></i>
      </button>
      ${state.palette.map(
        (hexa, index) =>
          html`<div
            style="--current: ${hexa};"
            class="color-select ${index == state.activeColor ? "selected" : ""}"
            @click=${() => dispatch({ activeColor: index })}>
            ${state.editingPalette && index > 0
              ? html`
                  <button class="delete" @click=${() => deleteColor(index)}>
                    <i class="fa-solid fa-x"></i>
                  </button>
                  <button
                    id="color-${index}"
                    class="edit-color"
                    @click=${(e) => editColor(index, e.currentTarget)}></button>
                  <div class="editicon" @click=${(e) => editColor(index)}>
                    <i class="fa-solid fa-pen"></i>
                  </div>
                `
              : ""}
          </div>`
      )}
    </div>
  </div>`;
}

const r = () => {
  render(view(), document.body);
  window.requestAnimationFrame(r);
};

function isMobile() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}

function measure() {
  const paletteHeight = paletteContainer.getBoundingClientRect().height;
  const toolboxHeight = toolsContainer.getBoundingClientRect().height;

  const bbox = siteContainer.getBoundingClientRect();

  const availableX = bbox.width * devicePixelRatio;
  const availableY = (bbox.height - toolboxHeight - 150) * devicePixelRatio;

  const scale = Math.min(
    Math.floor(availableX / 16),
    Math.floor(availableY / 16)
  );

  const canvasSize = scale * 16;
  const cssSize = canvasSize / devicePixelRatio;

  paletteContainer.style.cssText = `width: ${cssSize}px;`;
  toolsContainer.style.cssText = `width: ${cssSize}px;`;

  return scale;
}

window.onload = () => {
  render(view(), document.body);

  siteContainer = document.getElementById("site");
  gridCanvas = document.getElementById("grid");
  outlineCanvas = document.getElementById("outline");
  preview = document.getElementById("preview");
  editorCanvas = document.getElementById("art");
  editorContainer = document.getElementById("editor-container");
  paletteContainer = document.getElementById("color-palette");
  toolsContainer = document.getElementById("tool-container");

  state.scale = measure();

  function sync({ state }) {
    let { bitmap } = state;
    return {
      syncState(state) {
        if (state.bitmap == bitmap) return;
        bitmap = state.bitmap;
        const existingIcons = document.querySelectorAll(
          'link[rel="shortcut icon"]'
        );
        for (let i = 0, len = existingIcons.length; i < len; i++) {
          document.head.removeChild(existingIcons[i]);
        }
        const link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = editorCanvas.toDataURL("image/x-icon");
        document.getElementsByTagName("head")[0].appendChild(link);
      },
    };
  }

  previewApp = new App({
    state,
    dispatch,
    components: [
      previewCanvas({
        canvas: preview,
      }),
    ],
  });

  app = new App({
    state,
    dispatch,
    components: [
      drawingCanvas({ canvas: editorCanvas }),
      grid({ canvas: gridCanvas }),
      pointerTracker({ target: outlineCanvas }),
      outline({ canvas: outlineCanvas }),
      toolbox({
        tools,
        target: outlineCanvas,
      }),
      sync,
    ],
  });

  r();
};

window.addEventListener("resize", (event) => {
  dispatch({ scale: measure(), bitmap: new Bimp(16, 16, state.bitmap.pixels) });
});

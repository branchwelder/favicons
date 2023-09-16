import { Bimp } from "/Bimp";
import { BimpEditor } from "/BimpEditor";

import { brush, flood, line, rect, shift } from "/tools";
import { toolbox } from "/toolbox";
import { controlPanel } from "/controlPanel";

import { drawingCanvas } from "/drawingCanvas";
import { outline } from "/outline";
import { buildHexPalette } from "/palette";

import startingTile from "./defaultBitmap.json";

const startBimp = Bimp.fromJSON(startingTile);
const startMap = Bimp.fromTile(200, 200, startBimp);

const startPalette = [
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
];

export function tileEditor(tileParent, mapParent) {
  let mapState = {
    bitmap: startMap,
    aspectRatio: [1, 1],
    scale: 1,
    pan: { x: 0, y: 0 },
  };

  let map = new BimpEditor({
    state: mapState,
    parent: mapParent,
    components: [
      drawingCanvas({
        paletteBuilder: buildHexPalette(startPalette),
        paletteSelect: false,
      }),
      controlPanel({ container: "taskbarPrimary" }),
    ],
  });
  let tileState = {
    bitmap: startBimp,
    aspectRatio: [1, 1],
    scale: 1,
    pan: { x: 0, y: 0 },
  };

  function sync({ state }) {
    let { bitmap } = state;
    return {
      syncState(state) {
        if (state.bitmap == bitmap) return;
        bitmap = state.bitmap;
        const tiled = Bimp.fromTile(
          map.state.bitmap.width,
          map.state.bitmap.height,
          bitmap
        );
        map.dispatch({
          bitmap: tiled,
        });
      },
    };
  }

  let tile = new BimpEditor({
    state: tileState,
    parent: tileParent,
    components: [
      drawingCanvas({
        paletteBuilder: buildHexPalette(startPalette),
        palettePosition: "taskbarSecondary",
      }),
      outline(),
      toolbox({
        tools: { brush, flood, line, rect, shift },
        container: "taskbarPrimary",
      }),
      controlPanel({ container: "taskbarPrimary" }),
      sync,
    ],
  });
}

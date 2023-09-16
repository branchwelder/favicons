function canvasExtension({ state, dispatch }, { canvas }) {
  let { scale, palette, bitmap } = state;

  let lastDrawn = null;

  function draw() {
    // Draws only the pixels that have changed
    const ctx = canvas.getContext("2d");

    for (let y = 0; y < bitmap.height; y++) {
      for (let x = 0; x < bitmap.width; x++) {
        let paletteIndex = bitmap.pixel(x, y);

        if (lastDrawn == null || lastDrawn.pixel(x, y) != paletteIndex) {
          ctx.translate(x * scale, y * scale);

          ctx.fillStyle = palette[paletteIndex];
          ctx.fillRect(0, 0, scale, scale);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    }
    lastDrawn = bitmap;
  }

  draw();

  return {
    syncState(state) {
      if (state.scale != scale) {
        ({ scale, bitmap } = state);
        lastDrawn = null;
        updateDom();
      }

      if (lastDrawn != state.bitmap) {
        ({ bitmap } = state);
        draw();
      }
    },
  };
}

export function drawingCanvas(options = {}) {
  return (config) => canvasExtension(config, options);
}

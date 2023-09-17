function canvasExtension({ state }, { canvas }) {
  let { scale, palette, bitmap } = state;

  let lastDrawn = null;

  function sizeCanvas() {
    const canvasSize = scale * 16;
    const cssSize = canvasSize / devicePixelRatio;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    canvas.style.cssText = `width: ${cssSize}px; height: ${cssSize}`;

    lastDrawn = null;
    draw();
  }

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

  sizeCanvas();

  return {
    syncState(state) {
      if (palette != state.palette) {
        palette = state.palette;
        lastDrawn = null;
      }

      if (scale != state.scale) {
        scale = state.scale;
        sizeCanvas();
        lastDrawn = null;
      }

      if (lastDrawn != state.bitmap) {
        bitmap = state.bitmap;
        draw();
      }
    },
  };
}

export function drawingCanvas(options = {}) {
  return (config) => canvasExtension(config, options);
}

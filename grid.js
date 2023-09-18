function makeGrid({ state }, { canvas }) {
  let { scale, bitmap } = state;

  function sizeCanvas() {
    const canvasSize = scale * 16;
    const cssSize = canvasSize / devicePixelRatio - devicePixelRatio;

    canvas.width = canvasSize - 1;
    canvas.height = canvasSize - 1;

    canvas.style.cssText = `width: ${cssSize}px; height: ${cssSize}`;
    draw();
  }

  function draw() {
    const ctx = canvas.getContext("2d");
    ctx.resetTransform();

    ctx.translate(-0.5, -0.5);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    for (let x = 0; x < bitmap.width; x++) {
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, bitmap.height * scale + 1);
    }

    for (let y = 0; y < bitmap.height; y++) {
      ctx.moveTo(0, y * scale);
      ctx.lineTo(bitmap.width * scale + 1, y * scale);
    }

    ctx.stroke();
  }

  sizeCanvas();

  return {
    syncState(state) {
      if (scale != state.scale) {
        scale = state.scale;
        sizeCanvas();
      }
    },
  };
}

export function grid(options = {}) {
  return (config) => makeGrid(config, options);
}

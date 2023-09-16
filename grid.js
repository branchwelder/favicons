function makeGrid({ state }, { canvas }) {
  let { scale, bitmap } = state;

  function draw() {
    const ctx = canvas.getContext("2d");
    ctx.resetTransform();

    ctx.translate(-0.5, -0.5);
    // ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    for (let x = 0; x <= bitmap.width; x++) {
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, bitmap.height * scale + 1);
    }

    for (let y = 0; y <= bitmap.height; y++) {
      ctx.moveTo(0, y * scale);
      ctx.lineTo(bitmap.width * scale + 1, y * scale);
    }

    ctx.stroke();
  }

  draw();

  return {
    syncState(state) {
      if (
        state.bitmap.width != bitmap.width ||
        state.bitmap.height != bitmap.height
      ) {
        ({ scale, bitmap } = state);
        draw();
      }
    },
  };
}

export function grid(options = {}) {
  return (config) => makeGrid(config, options);
}

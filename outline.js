function outlineExtension(
  { state },
  { inner = "#000000", outer = "#ffffff", canvas }
) {
  let { scale, pos } = state;
  function sizeCanvas() {
    const canvasSize = scale * 16;
    const cssSize = canvasSize / devicePixelRatio - devicePixelRatio;

    canvas.width = canvasSize - 1;
    canvas.height = canvasSize - 1;

    canvas.style.cssText = `width: ${cssSize}px; height: ${cssSize}`;
  }

  function draw() {
    const ctx = canvas.getContext("2d");
    ctx.resetTransform();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pos.x < 0 || pos.y < 0) return;
    ctx.translate(-0.5, -0.5);
    ctx.imageSmoothingEnabled = false;

    ctx.strokeStyle = outer;
    ctx.strokeRect(pos.x * scale + 1, pos.y * scale + 1, scale - 2, scale - 2);
    ctx.strokeStyle = inner;
    ctx.strokeRect(pos.x * scale + 2, pos.y * scale + 2, scale - 4, scale - 4);
  }

  sizeCanvas();
  return {
    syncState(state) {
      if (scale != state.scale) {
        scale = state.scale;
        sizeCanvas();
      }
      if (state.pos != pos) {
        pos = state.pos;

        draw();
      }
    },
  };
}

export function outline(options = {}) {
  return (config) => outlineExtension(config, options);
}

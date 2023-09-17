function outlineExtension(
  { state },
  { inner = "#000000", outer = "#ffffff", canvas }
) {
  let { scale, bitmap, pos } = state;
  const px = 1 / devicePixelRatio;

  function sizeCanvas() {
    const canvasSize = scale * 16;
    const cssSize = canvasSize / devicePixelRatio;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    canvas.style.cssText = `width: ${cssSize}px; height: ${cssSize}`;
  }

  function draw() {
    const ctx = canvas.getContext("2d");
    ctx.resetTransform();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pos.x < 0 || pos.y < 0) return;
    // ctx.translate(-0.5, -0.5);
    ctx.imageSmoothingEnabled = false;

    ctx.strokeStyle = inner;

    ctx.beginPath();
    ctx.moveTo(pos.x * scale + 0.5, pos.y * scale + 0.5);
    ctx.lineTo((pos.x + 1) * scale - px - 0.5, pos.y * scale + 0.5);
    ctx.lineTo((pos.x + 1) * scale - px - 0.5, (pos.y + 1) * scale - 0.5);
    ctx.lineTo(pos.x * scale + 1, pos.y * scale + scale - 1);
    ctx.lineTo(pos.x * scale + 1, pos.y * scale + 1);
    // ctx.moveTo(pos.x * scale + px, pos.y * scale + px);
    // ctx.lineTo((pos.x * scale + px ) + (scale-2*px), pos.y * scale + px);
    // ctx.lineTo((pos.x * scale +px) + (scale-2*px), pos.y * scale + scale - px);
    // ctx.lineTo(pos.x * scale + px, pos.y * scale + scale - px);
    // ctx.lineTo(pos.x * scale + px, pos.y * scale + px);

    ctx.stroke();

    // ctx.strokeStyle = inner;
    // ctx.beginPath();

    // ctx.moveTo(pos.x * scale + 2, pos.y * scale + 2.5 * px);
    // ctx.lineTo(pos.x * scale + scale - 1, pos.y * scale + 2.5 * px);
    // ctx.lineTo(pos.x * scale + scale - 1, pos.y * scale + scale - 1);
    // ctx.lineTo(pos.x * scale + 2, pos.y * scale + scale - 1);
    // ctx.lineTo(pos.x * scale + 2, pos.y * scale + 2.5 * px);

    // ctx.stroke();
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
function highlightExtension(
  { state, parent },
  { cell = true, row = false, col = false, color = "#00000044", canvas }
) {
  let { scale, bitmap, pos } = state;

  function draw() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;

    if (cell) {
      ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale);
    }
    if (row) {
      ctx.fillRect(0, pos.y * scale, scale * bitmap.width, scale);
    }
    if (col) {
      ctx.fillRect(pos.x * scale, 0, scale, scale * bitmap.height);
    }
  }

  return {
    syncState(state) {
      if (state.scale != scale || state.pos != pos) {
        pos = state.pos;
        bitmap = state.bitmap;
        scale = state.scale;

        draw();
      }
    },
  };
}

export function highlight(options = {}) {
  return (config) => highlightExtension(config, options);
}

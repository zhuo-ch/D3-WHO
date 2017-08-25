export const drawObj = (ctx, path, obj, color) => {
    ctx.beginPath();
    path(obj);
    ctx.fillStyle = color;
    ctx.fill();
  }

export const drawLine = (ctx, path, line, color) => {
    ctx.beginPath();
    path(line);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

export const drawMap = (ctx, path, worldMap, colorGrad) => {
    worldMap.features.forEach(feature => {
      let val;
      val = feature.fact === undefined ? colorGrad.length - 1 : Math.floor(feature.fact.value.numeric / 10);
      ctx.beginPath();
      ctx.fillStyle = d3.color(colorGrad[val]);
      path(feature);
      ctx.fill();
    })
  }

const getFittedText = (ctx, text, maxWidth) => {
  text = text.split(' ');
  let lines = [];
  let line = '';

  for (let i = 0; i < text.length; i++) {
    if (line === '') {
      line = text[i];
    } else if (ctx.measureText(line + ' ' + text[i]).width < maxWidth) {
      line = line + ' ' + text[i];
    } else {
      lines.push(line);
      line = text[i];
    }
  }

  lines.push(line);

  return lines;
}

export const drawTitle = (ctx, text, dims) => {
  const maxWidth = (dims[0] / 4) - 100;
  const fittedText = getFittedText(ctx, text, maxWidth);
  const x = dims[0] * 3 / 4;
  let y = dims[1] / 3;

  fittedText.forEach(line => {
    ctx.font = '1.2em Open Sans, sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(line, x, y);
    y += 20;
  });

  ctx.font = '1em Open Sans, sans-serif';
  [['No Data', '#0000ff'], ['Low', '#3366ff'], ['High', '#990000']].forEach(text => {
    ctx.fillStyle = text[1];
    ctx.fillRect(x, y, 10, 10);
    ctx.fillText(text[0], x + 20, y + 10)
    y += 20;
  })
}

export const drawMenu = (ctx, dims, currentIndicator) => {
  let x = dims[0] * 3 / 4;
  let y = (dims[1] / 3) - 100;
  const colors = ['#0000ff', '#3366ff', '#990000']
  ctx.font = '1.7em Open Sans, sans-serif';
  ctx.fillStyle = '#0000ff';
  ctx.fillText('Indicators', x, y);
  x += 10;
  y += 20;
  let menuItems = [0, 1, 2]

  menuItems = menuItems.map((item, idx)=> {
    if (idx === currentIndicator) {
      ctx.fillStyle = colors[idx];
      ctx.fillRect(x, y, 10, 10);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, 14, 14);
    } else {
      ctx.fillStyle = colors[idx];
      ctx.fillRect(x, y, 10, 10);
    }
    x += 20;
    return { nw: [x - 20, y], se: [x - 6, y + 14]}
  });

  return menuItems;
}

export const drawHighlight = (ctx, coords) => {
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 3;
  ctx.strokeRect(coords.nw[0] - 3, coords.nw[1] - 3, 16, 16);
}

export const drawLoading = (ctx, dims, time) => {
  ctx.clearRect(0, 0, dims[0], dims[1]);
  const text = 'Loading from World Health Organization ...';
  ctx.font = '1.5em Open Sans, sans-serif';
  ctx.fillStyle = '#3366ff';
  ctx.fillText(text.slice(0, text.length - 2 + (time % 3)), dims[0] / 4, dims[1] / 2);
}

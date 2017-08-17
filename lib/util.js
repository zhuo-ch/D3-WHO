export const nasa = () => {
  return $.ajax({
    method: 'GET',
    url: `https://eonet.sci.gsfc.nasa.gov/api/v2.1/events`,
  });
}

export const drawObj = (ctx, obj, color) {
    ctx.beginPath();
    this.path(obj);
    ctx.fillStyle = color;
    ctx.fill();
  }

export const drawLine = (ctx, line, color) {
    ctx.beginPath();
    this.path(line);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

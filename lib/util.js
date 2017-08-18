export const nasa = () => {
  return $.ajax({
    method: 'GET',
    url: `https://eonet.sci.gsfc.nasa.gov/api/v2.1/events`,
  });
}

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

// export const drawEvent = (ctx, path, pos) => {
//     ctx.beginPath();
//     path(pos);
//     const x = pos[0], y = pos[1];
//
//     const grade = ctx.createRadialGradient(
//       x,
//       y,
//       Math.floor(2),
//       x,
//       y,
//       2
//     );
//
//     grade.addColorStop(0, 'white');
//     grade.addColorStop(1, 'red');
//
//     ctx.arc(
//       x,
//       y,
//       2,
//       0,
//       2 * Math.PI
//     );
//
//     ctx.fillStyle = grade;
//     ctx.fill();
//   }

export const drawEvents = (context, path, events, color, globe) => {
  let circles = [];
  const circle = d3.geoCircle()
  circle.radius(1);

  events.forEach(event => {
    const coords = event.geometries[0].coordinates;
    const newCircle = circle.center(coords);
    circles.push(newCircle());
  });

  context.beginPath();
  path({type: "GeometryCollection", geometries: circles});
  context.fillStyle = 'red';
  context.fill();
  context.stroke();
}

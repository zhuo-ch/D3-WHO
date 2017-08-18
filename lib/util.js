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
  context.fillStyle = color;
  context.fill();
  context.stroke();
}

export const findEvent = (e, pos) => {
  const x = e[0], y = e[1];
  const nE = [pos[0] + 1, pos[1] + 1];
  const sW = [pos[0] - 1, pos[1] - 1];

  if ((x < nE[0] && x > sW[0]) && (y < nE[1] && y > sW[1])) {
    return true;
  }

  return false;
}

export const createGeoJSON = data => {
  const geoJSON = { type: 'FeatureCollection', features: [] };

  data.forEach(datum => {
    datum.type = 'Feature';
    datum.geometry = datum.geometries[0];
    geoJSON.features.push(datum);
  });

  return geoJSON;
}

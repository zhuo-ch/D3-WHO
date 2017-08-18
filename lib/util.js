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

export const findCountryEvents = (country, events) => {
  const foundEvents = events.filter(ev => {
    return d3.geoContains(country, ev.geometries[0].coordinates);
  });

  return formatCategories(foundEvents);
}

function formatCategories(events) {
  const categories = {};

  events.forEach(event => {
    const newEvent = { id: event.id, title: event.title, link: event.link };
    event.categories.forEach(cat => {
      if (categories[cat.title]) {
        categories[cat.title].push(newEvent);
      } else {
        categories[cat.title] = [newEvent];
      }
    });
  });

  const arr = Object.keys(categories).map(key => categories[key]);

  return arr;
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

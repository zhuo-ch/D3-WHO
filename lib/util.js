export const nasa = () => {
  return $.ajax({
    method: 'GET',
    url: `https://eonet.sci.gsfc.nasa.gov/api/v2.1/events`,
  });
}

// const getXHR = () => {
//   const method = 'GET', url = 'http://apps.who.int/gho/athena/api/GHO?format=json';
//
//   var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr) {
//       xhr.open(method, url, true);
//     } else if (typeof XDomainRequest != "undefined") {
//       xhr = new XDomainRequest();
//       xhr.open(method, url);
//     } else {
//       xhr = null;
//     }
//
//   return xhr;
// }
//
// export const whoCors = () => {
//   const xhr = getXHR();
//
//   xhr.onload = () => {
//     debugger
//     console.log(data);
//   }
//   xhr.onerror = () => {
//     debugger
//   }
//
//   if (!xhr) {
//     throw new Error('CORS not supported');
//   }
//
//   xhr.send();
// }
//

// url: 'http://climatedataapi.worldbank.org/v2/climateweb/rest/annualanom/tas/1980/2017/usa?format=json',
// url: 'http://api.worldbank.org/v2/countries/all/indicators/NY.GDP.MKTP.CD?format=json',
export const who = () => {
  return $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: `http://apps.who.int/gho/athena/api/GHO?format=json`,
  });
}

export const fetchWHO = () => {
  return $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: `http://apps.who.int/gho/athena/api/GHO/MDG_0000000001?filter=YEAR:2015&format=json`,
  });

// infant mortality per 1000 "MDG_0000000001"
}
// mortality causes http://apps.who.int/gho/athena/data/GHO/MORT_100.json?filter=CHILDCAUSE:*;COUNTRY:AND
export const fetchCountry = (id) => {
  return $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: `http://apps.who.int/gho/athena/api/GHO/MORT_100?filter=COUNTRY:${id};CHILDCAUSE:*;YEAR:2015&format=json`,
  });
}

export const bindMap = (map, facts) => {
  for (let i = 0; i < map.features.length; i++) {
    map.features[i].fact = facts.find(fact => map.features[i].id === fact.country);
  }

  return map;
}

export const formatWHO = data => {
  const arr = [];

  for (let i = 0; i < data.fact.length; i++) {
      const country = data.fact[i].Dim.find(el => el.category === 'COUNTRY');

      if (country) {
        const newObj = {};
        newObj.country = country.code;
        newObj.value = data.fact[i].value;
        newObj.title = data.dimension.find(el => el.display === 'Indicator').code[0].display;
        arr.push(newObj);
      }
  }

  return arr;
}

export const formatWHOCountry = data => {
  let labels = {};
  let facts = {};
  const labelSet = data.dimension.find(el => el.label === 'CHILDCAUSE').code;

  labelSet.forEach(el => labels[el.label] = el.display);

  data.fact.forEach(el => {
    const cause = labels[el.Dim.find(el => el.category === 'CHILDCAUSE').code];
    facts[cause] = facts[cause] ? facts[cause] + el.value.numeric : el.value.numeric;
  });

  return Object.keys(facts).map(key => { return {[key]: facts[key]} } );
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

export const drawMap = (ctx, path, worldMap, colorGrad) => {
    worldMap.features.forEach(feature => {
      let val;
      val = feature.fact === undefined ? 0 : Math.floor(feature.fact.value.numeric / 10);
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
  const maxWidth = (dims[0] / 5) - 20;
  const fittedText = getFittedText(ctx, text, maxWidth);
  let y = dims[1] / 3;

  fittedText.forEach(line => {
    ctx.strokeStyle = 'gray';
    ctx.strokeText(line, dims[0] * 4 / 5, y);
    y += 20;
  });
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
    let coords;
    let inBounds;

    if (ev.geometries[0].type === 'Point') {
      coords = ev.geometries[0].coordinates;
      inBounds = d3.geoContains(country, coords);
    } else {
      coords = ev.geometries[0].coordinates[0];
      inBounds = coords.some(coord => d3.geoContains(country, coord));
    }

    return inBounds;
  });

  return formatCategories(foundEvents);
}

function formatCategories(events) {
  const categories = {};

  events.forEach(event => {
    event.categories.forEach(cat => {
      if (categories[cat.title]) {
        categories[cat.title].push(cat);
      } else {
        categories[cat.title] = [cat];
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

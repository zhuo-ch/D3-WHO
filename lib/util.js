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
}

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

  return Object.keys(facts).map(key => { return {[key]: facts[key]} }).sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
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

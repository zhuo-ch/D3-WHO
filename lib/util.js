export const who = () => {
  return $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: `http://apps.who.int/gho/athena/api/GHO?format=json`,
  });
}

export const fetchWHO = (listItem) => {
  const globeSource = listItem.globeSource;
  const globeFilter = listItem.globeFilter ? 'filter=' + listItem.globeFilter + '&' : '';

  return $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: `http://apps.who.int/gho/athena/api/GHO/${globeSource}?${globeFilter}format=json`,
  });
}

export const getCountry = (listItem, id) => {
  return listItem.pieSource.map((source, idx)=> {
    return createAjax(listItem, id, idx);
  });
}

export const createAjax = (listItem, id, idx) => {
  const pieSource = listItem.pieSource[idx];
  const pieFilter = listItem.pieFilter ? ';' + listItem.pieFilter : '';

  return $.ajax({
    method: 'GET',
    dataType: 'jsonp',
    url: `http://apps.who.int/gho/athena/api/GHO/${pieSource}?filter=COUNTRY:${id}${pieFilter}&format=json`,
  });
}

// export const fetchCountry = (listItem, id) => {
//   const pieSource = listItem.pieSource;
//   const pieFilter = listItem.pieFilter ? ';' + pieFilter : '';
//
//   return $.ajax({
//     method: 'GET',
//     dataType: 'jsonp',
//     url: `http://apps.who.int/gho/athena/api/GHO/${pieSource}?filter=COUNTRY:${id}${pieFilter}&format=json`,
//   });
// }

export const bindMap = (map, facts) => {
  for (let i = 0; i < map.features.length; i++) {
    map.features[i].fact = facts.find(fact => map.features[i].id === fact.country);
    console.log(map.features[i]);
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

export const formatSingleIndicator = data => {
  let facts = data.dimension.find(el => el.label === 'CHILDCAUSE').code;
  facts = facts.map(fact => { return { label: fact.label, display: fact.display.split(' <br> ').join(' '), value: 0 } });

  data.fact.forEach(el => {
    const label = el.Dim.find(cat => cat.category === 'CHILDCAUSE').code;
    facts.find(el2 => el2.label === label).value += el.value.numeric;
  });

  facts.forEach(fact => fact.value = parseValue(fact.value));

  return facts.sort((a, b) => sortFacts(a, b));
}

export const formatMultipleIndicators = data => {
  let facts = [];

  data.forEach(f => {
    const indicator = f[0].dimension.find(el => el.display === 'Indicator').code[0];
    facts.push({
      label: indicator.label,
      display: indicator.display.split(' <br> ').join(' '),
      value: f[0].fact[f[0].fact.length - 1].value.numeric,
    });
  });

  facts.forEach(fact => fact.value = parseValue(fact.value));

  return facts.sort((a, b) => sortFacts(a, b));
}

const sortFacts = (a, b) => b.value - a.value;

const parseValue = value => {
  const val = value.toString().split('.');
  return parseFloat(val[0] + '.' + val[1].slice(0, 2));
};

export const createGeoJSON = data => {
  const geoJSON = { type: 'FeatureCollection', features: [] };

  data.forEach(datum => {
    datum.type = 'Feature';
    datum.geometry = datum.geometries[0];
    geoJSON.features.push(datum);
  });

  return geoJSON;
}

export const whoList = [
  {
    title: 'Infant Mortality per 1000',
    globeSource: 'MDG_0000000001',
    globeFilter: 'YEAR:2015',
    pieSource: ['MORT_100'],
    pieFilter: 'CHILDCAUSE:*'
  },
  // {
  //   title: 'Adult literacy',
  //   globeSource: 'WHS9_85',
  //   pieSource: ['SE_G23_MATH', 'SE_G23_RDG', 'SE_LSC_MATH', 'SE_LSC_RDNG', 'SE_PRM_MATH', 'SE_PRM_RDNG', 'SE_PRE_PARTN'],
  // },
  {
    title: 'Public Health',
    globeSource: 'WHS7_156',
    globeFilter: 'YEAR:2014',
    pieSource: ['DEVICES00', 'DEVICES01', 'DEVICES02', 'DEVICES03', 'DEVICES04'],
  },
  {
    title: 'Poverty',
    globeSource: 'CCO_1',
    pieSource: ['NUTRITION_WH_2', 'NUTRITION_WH2', 'NUTRITION_HA_2', 'NUTRITION_WA_2'],
  }
]
// infant mortality per 1000 "MDG_0000000001"
// mortality causes http://apps.who.int/gho/athena/data/GHO/MORT_100.json?filter=CHILDCAUSE:*;COUNTRY:AND
// {label: "WHS2_126", display: "Distribution of years of life lost by major cause group", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=90", attr: Array(2)}
// {label: "MORT_61", display: "Mortality - crude death rate per 100 000 population", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=41", attr: Array(2)}

// {label: "SA_0000001398", display: "Alcohol, consumption of pure alcohol by type of beverage (%)", display_sequence: 100, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=462", attr: Array(2)}
// {label: "SA_0000001401", display: "Alcohol, recorded per capita (15+) consumption (in litres of pure alcohol), three-year average", display_sequence: 20, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=462", attr: Array(2)}
// {label: "SA_0000001461", display: "Alcohol dependence (15+ ), 12-month prevalence (%) with 95%CI", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=1389", attr: Array(2)}


// {label: "RSUD_1", display: "Point prevalence (%), alcohol use disorders, 15+ years", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=2497", attr: Array(2)}
//
// {label: "RSUD_2", display: "Point prevalence (%), drug use disorders, 15+ years", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=2498", attr: Array(2)}
//
// {label: "RSUD_3", display: "Age-standardized death rates, alcohol and drug use disorders, per 100 000", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=2500", attr: Array(2)}
//
// {label: "RSUD_4", display: "Age-standardized death rates, drug use disorders, per 100 000", display_sequence: 0, url: "", attr: Array(1)}

// {label: "MEDS2_01_05", display: "Public Health Expenditure as a % of Government Expenditure", display_sequence: 23, url: "", attr: Array(1)}
// {label: "MEDS2020200C", display: "Density of pharmacists (per 10 000 population)", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=2257", attr: Array(2)}
// {label: "DEVICES01", display: "Total density per 100 000 population: Health posts", display_sequence: 1, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=3010", attr: Array(2)}
// {label: "DEVICES02", display: "Total density per 100 000 population: Health centres", display_sequence: 2, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=3011", attr: Array(2)}
// {label: "DEVICES03", display: "Total density per 100 000 population: District/rural hospitals", display_sequence: 3, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=3012", attr: Array(2)}
// {label: "DEVICES04", display: "Total density per 100 000 population: Provincial hospitals", display_sequence: 4, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=3013", attr: Array(2)}
// {label: "DEVICES05", display: "Total density per 100 000 population: Specialized hospitals", display_sequence: 5, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=3014", attr: Array(2)}
// {label: "DEVICES00", display: "Total density per 100 000 population: Hospitals", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=3361", attr: Array(2)}

// "WHS9_85", display: "Literacy rate among adults aged >= 15 years (%)", display_sequence: 150, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=77", attr: Array(2)}
// "SE_G23_MATH", display: "Proportion of children in grades 2/3 achieving at …st a minimum proficiency level in mathematics (%)", display_sequence: 1, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4742", attr: Array(0)}
// {label: "SE_G23_RDG", display: "Proportion of children in grades 2/3 achieving at least a minimum proficiency level in reading (%)", display_sequence: 2, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4742", attr: Array(0)}
// {label: "SE_LSC_MATH", display: "Proportion of children at the end of lower seconda…st a minimum proficiency level in mathematics (%)", display_sequence: 3, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4742", attr: Array(0)}
// {label: "SE_LSC_RDNG", display: "Proportion of children at the end of lower seconda… least a minimum proficiency level in reading (%)", display_sequence: 4, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4742", attr: Array(0)}
// {label: "SE_PRM_MATH", display: "Proportion of children at the end of primary achie…st a minimum proficiency level in mathematics (%)", display_sequence: 5, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4742", attr: Array(0)}
// {label: "SE_PRM_RDNG", display: "Proportion of children at the end of primary achie… least a minimum proficiency level in reading (%)", display_sequence: 6, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4742", attr: Array(0)}
// "SE_PRE_PARTN", display: "Participation rate in organized learning (one year before the official primary entry age) (%)", display_sequence: 0, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=4745", attr: Array(0)}

// "CCO_1", display: "Poverty headcount ratio at $1.25 a day (PPP) (% of population)", display_sequence: 200, url: "", attr: Array(1)}
// "NUTRITION_WH_2", display: "Children aged <5 years wasted <br> (% weight-for-height <-2 SD)", display_sequence: 10, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=302", attr: Array(2)}
// {label: "NUTRITION_WH2", display: "Children aged <5 years overweight <br> (% weight-for-height >+2 SD)", display_sequence: 20, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=74", attr: Array(2)}
// {label: "NUTRITION_HA_2", display: "Children aged <5 years stunted <br> (% height-for-age <-2 SD)", display_sequence: 30, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=72", attr: Array(2)}
// {label: "NUTRITION_WA_2", display: "Children aged <5 years underweight <br> (% weight-for-age <-2 SD) (%)", display_sequence: 40, url: "http://apps.who.int/gho/indicatorregistry/App_Main/view_indicator.aspx?iid=27", attr: Array(2)}

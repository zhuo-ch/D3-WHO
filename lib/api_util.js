import * as $ from 'jquery';

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

export const whoList = [
  {
    title: 'Infant Mortality',
    globeSource: 'MDG_0000000001',
    globeFilter: 'YEAR:2015',
    pieSource: ['MORT_100'],
    pieFilter: 'CHILDCAUSE:*'
  },
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
];

// {
//   title: 'Adult literacy',
//   globeSource: 'WHS9_85',
//   pieSource: ['SE_G23_MATH', 'SE_G23_RDG', 'SE_LSC_MATH', 'SE_LSC_RDNG', 'SE_PRM_MATH', 'SE_PRM_RDNG', 'SE_PRE_PARTN'],
// },

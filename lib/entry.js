import Globe from './globe';
import * as Util from './util';

document.addEventListener('DOMContentLoaded', () => {
  const doc = document.documentElement;
  const dims = [doc.clientWidth - 10, doc.clientHeight - 65];
  const globe = new Globe(dims);
  globe.setup();
});

export const whoList = [
  {
    title: 'Infant Mortality per 1000',
    globeSource: 'MDG_0000000007',
    pieSource: 'MORT_100',
    pieFilter: 'CHILDCAUSE:*'
  },
  {
    title: 'Adult literacy',
    globeSource: 'WHS9_85',
    pieSource: ['SE_G23_MATH', 'SE_G23_RDG', 'SE_LSC_MATH', 'SE_LSC_RDNG', 'SE_PRM_MATH', 'SE_PRM_RDNG', 'SE_PRE_PARTN'],
    pieFilter: '',
  },
  {
    title: 'Public Health',
    globeSource: 'MEDS2_01_05',
    pieSource: ['DEVICES00', 'DEVICES01', 'DEVICES02', 'DEVICES03', 'DEVICES04', 'DEVICES005'],
    pieFilter: '',
  },
  {
    title: 'Poverty',
    globeSource: 'CCO_1',
    pieSource: ['NUTRITION_WH_2', 'NUTRITION_WH2', 'NUTRITION_HA_2', 'NUTRITION_WA_2'],
    pieFilter: '',
  }
]

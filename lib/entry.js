import Globe from './globe';
import * as Util from './util';

const whoList = {
  // infant mortality per 1000 "MDG_0000000001"
  // mortality causes http://apps.who.int/gho/athena/data/GHO/MORT_100.json?filter=CHILDCAUSE:*;COUNTRY:AND
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];

  Util.fetchWHO().then(data => {
    const items = Util.formatWHO(data);
    const globe = new Globe(dims, items);
    globe.setup();
    globe.startGlobe();
  });
});

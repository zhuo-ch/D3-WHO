import Globe from './globe';
import * as Util from './util';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];
  const globe = new Globe(dims);
  globe.setup();
});

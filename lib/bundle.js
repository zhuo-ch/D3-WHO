/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Globe = __webpack_require__(1);

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const canvas = d3.select('#canvas');
  const context = canvas.node().getContext('2d');
  const current = d3.select('#current');
  let globe;
  getData(data => {
    const land = topojson.feature(data, data.objects.land);
    debugger
    globe = new Globe(canvas, context, land);
    globe.setD3();
    globe.render();
  });
  // find_locations().then(data => {
  //   // data.locations.location.forEach(el => root.append(el.name));
  //   chart(data.locations.location);
  // });
});

function getData(callback) {
  d3.json('https://unpkg.com/world-atlas@1/world/110m.json', (err, data) => {
    debugger
    callback(data);
  });
}

// function render() {
//   const context = d3.select('#canvas').node().getContext('2d');
//   const path = d3.geoPath().context(context);
//
//   d3.json('https://unpkg.com/us-atlas@1/us/10m.json', function(error, us) {
//     if (error) throw error;
// debugger
//     context.beginPath();
//     path(topojson.mesh(us));
//     context.stroke();
//   })
// }
//
// function find_locations() {
//   const api_key = 'e31133fc79147d1ff4c9e5495187cd2c';
//   const met = 'aj.jobs.getLocations';
//   const url = 'https://authenticjobs.com/api/?';
//
//   return $.ajax({
//     method:'GET',
//     url: `${url}api_key=${api_key}&method=${met}&format=json`,
//     dataType: 'jsonp',
//   });
// }
//
// function chart(data) {
//   d3.select("#root")
//   .selectAll("div")
//   .data(data)
//     .enter()
//     .append("div")
//     .style("width", function(d) { return (d.count*10) + "px"; })
//     .style("background-color", "red")
//     .text(function(d) { return d.count; });
// }


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class Globe {
  constructor(canvas, context, land) {
    this.canvas = canvas;
    this.context = context;
    this.land = land;
    this.water = { type: 'Sphere' };
    this.colors = { water: '#fff', land: '#111', grat: '#ccc', country: '#a00' };
    this.angles = { x: -20, y: 40, z: 0 };
  }

  setD3() {
    this.projection = d3.geoOrthographic().precision(0.1);
    this.grat = d3.geoGraticule10();
    this.path = d3.geoPath(this.projection).context(this.context);
    this.scale();
  }

  scale() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.canvas.attr('width', this.width).attr('height', this.height);
    this.projection
      .scale((0.8 * Math.min(this.width, this.height))/2)
      .translate([this.width / 2, this.height / 2]);

  }

  drawObj(obj, color) {
    this.context.beginPath();
    this.path(obj);
    this.context.fillStyle = color;
    this.context.fill();
  }

  drawLine(line, color) {
    this.context.beginPath();
    this.path(line);
    this.context.fillStyle = color;
    this.context.fill();
  }

  render() {
    debugger
    const ctx = this.context
    ctx.clearRect(0, 0, this.width, this.height)
    this.drawObj(this.water, this.colors.water);
    this.drawLine(this.grat, this.colors.grat);
    this.drawObj(this.land, this.colors.land);
  }
}

module.exports = Globe;


/***/ })
/******/ ]);
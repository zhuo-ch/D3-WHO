import Globe from './globe';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const canvas = d3.select('#canvas');
  const context = canvas.node().getContext('2d');
  const current = d3.select('#current');
  // let globe;
  // getData(data => {
  //   const land = topojson.feature(data, data.objects.land);
    const globe = new Globe(canvas, context);
    globe.setD3();
    globe.startRender();
  // });
});

function getData(callback) {
  d3.json('https://unpkg.com/world-atlas@1/world/110m.json', (err, data) => {
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

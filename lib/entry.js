import Globe from './globe';
import * as Util from './util';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const dims = [document.documentElement.clientWidth, document.documentElement.clientHeight];

  // $.ajax({
  //   headers: { "Accept": "application/json"},
  //   type: 'GET',
  //   url: 'http://cl.ly/2wr4',
  //   crossDomain: true,
  //   beforeSend: function(xhr){
  //     xhr.withCredentials = true;
  //   },
  //   success: function(data, textStatus, request){
  //     debugger
  //     console.log(data);
  //   }
  // });
  // d3.request('http://apps.who.int/gho/athena/api/COUNTRY?format=json')
  //     .header("Accept-Language", "en-US")
  //     .header("X-Requested-With", "*")
  //     .get(data => {
  //       debugger
  //       console.log(data);
  //     });
  //
  // Util.who().then(data => {
  //   debugger
  //
  // })

  // d3.request('http://apps.who.int/gho/athena/api/GHO?format=json')
  //   .header("Accept-Language", "en-US")
  //   .header("X-Requested-With", "XMLHttpRequest")
  //   .header("Content-Type", "application/x-www-form-urlencoded")
  //   .on('beforesend', request => {
  //     request.withCredentials = true})
  //   .on('error', error => {
  //     throw error;
  //   })
  //   .on('load', data => {
  //     console.log(data);
  //   })
  //   .get(data => {
  //     const items = Util.formatWHO(data);
  //     const globe = new Globe();
  //    globe.setup();
  //    globe.startGlobe();
  //  });

  Util.fetchWHO().then(data => {
    const items = Util.formatWHO(data);
    const globe = new Globe(dims, items);
    globe.setup();
    globe.startGlobe();
  });

  // const data = Util.whoCors();

});

function drawSvg(dims) {
  var radius = Math.min(dims[0], dims[1]) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory20b);
  var data = [1,3,4,7,9,21];

  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

  var svg = d3.select("body").append("svg")
    .attr("width", dims[0])
    .attr("height", dims[1])
    .append("g")
    .attr("transform", "translate(" + dims[0] / 2 + "," + dims[1] / 2 + ")");

  var pie = d3.pie()
    .value(d => d)
    .sort(null);

  var path = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d);
    });
}
// function chart(data) {
//   debugger
//   d3.select("#root")
//   .selectAll("div")
//   .data(data)
//     .enter()
//     .append("div")
//     .style("width", function(d) { return (d.count*10) + "px"; })
//     .style("background-color", "red")
//     .text(function(d) { return d.count; });
// }

// function getWeather() {
//   const endPoint = 'api.openweathermap.org';
//   const appKey = 'APPID=1a5e0bde9fb84f9f3608bc218c98d9c3';
//   const layer = 'temp_new';
//   const area = 'worldwide';
//   const url = `http://tile.openweathermap.org/map/${layer}/0/0/0.png?${appKey}`;
//
//   return $.ajax({
//     method: 'GET',
//     url: url,
//   });
// }

// api.openweathermap.org
// &APPID=1a5e0bde9fb84f9f3608bc218c98d9c3
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1a5e0bde9fb84f9f3608bc218c98d9c3

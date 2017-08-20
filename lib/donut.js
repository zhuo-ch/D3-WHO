import * as Util from './util';

class Donut {
  constructor(data) {
    this.data = data;
  }

  setupDonut() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.radius = Math.min(this.width, this.height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory20);
    // var color = d3.scaleOrdinal(d3.schemeCategory20);

    var arc = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);

    var svg = d3.select("#root").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    var pie = d3.pie()
      .value(d => d.length)
      .sort(null);
debugger
    var path = svg.selectAll('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d) {
        return color(d.data[0].title);
      });
  }
//
//   render() {
//
//   }
}

export default Donut;

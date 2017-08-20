import * as Util from './util';

class Donut {
  constructor(data) {
    this.data = data;
    this.color = d3.scaleOrdinal(d3.schemeCategory20c);
  }

  drawDonut() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight - (d3.select('#canvas').node().getBoundingClientRect().height * 1.2);
    this.radius = Math.min(this.width, this.height) / 2;

    const arc = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);

    const svg = d3.select("#svg").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 3 + "," + this.height / 2 + ")");

    const pie = d3.pie()
      .value(d => Object.values(d)[0])
      .sort(null);

    let delay = 0;

    const path = svg.selectAll('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', 'white')
      .on('mouseover', () => this.attr('fill', 'white'));
    .transition()
      .delay(() => {
        delay += 50;
        return delay;
      })
      .attr('fill', d => this.color(Object.keys(d.data)[0]));
  }

  drawLabels() {
    d3.select('#svg')
      .append('ul')
      .append('li');
  }
}

export default Donut;

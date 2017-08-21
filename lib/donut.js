import * as Util from './util';

class Donut {
  constructor(data, country) {
    this.data = data;
    this.country = country;
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
      .on('mouseover', function(d) {
        d3.select(this).style('opacity', 0.5);
      })
      .on('mouseout', function(d) {
        d3.select(this).style('opacity', 1);
      })
    .transition()
      .delay(() => {
        delay += 50;
        return delay;
      })
      .attr('fill', d => {
        return this.color(Object.keys(d.data)[0]);
      })
      .attr('class', 'donut');

    setTimeout(() => {
      this.drawTitle();
      this.drawLabelBoxes();
      this.drawLabels();
    }, 500);
  }

  drawTitle() {
    const x = this.width * 3 / 5;
    const y = 20;

    d3.select('svg')
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('font-size', '1.1em')
      .text(this.country.properties.name)
  }

  drawLabelBoxes() {
    const x = this.width * 3 / 5;
    const spaceBetween = 20;
    let y = 10;
    let delay = 0

    d3.select('svg')
      .selectAll('rect')
      .data(this.data.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]))
        .enter()
        .append('rect')
        .attr('x', x)
        .attr('y', () => {
          y += 20;
          return y;
        })
        .attr('width', '0.8em')
        .attr('height', '0.8em')
        .attr('fill', 'white')
      .transition()
        .delay(() => {
          delay += 50;
          return delay;
        })
        .attr('fill', d => this.color(Object.keys(d)[0]));
  }

  drawLabels() {
    const x = (this.width * 3 / 5) + 20;
    let y = 20;

    d3.select('svg')
      .selectAll('text')
      .data(this.data.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]))
        .enter()
        .append('text')
        .attr('x', x)
        .attr('y', () => {
          y += 20;
          return y;
        })
        .attr('font-size', '0.8em')
        .text(d => {
          return Object.keys(d).map(key => Math.floor(d[key]) + ' - ' + key);
        })
        // .style('stroke', d => this.color(Object.keys(d)[0]));
  }
}

export default Donut;

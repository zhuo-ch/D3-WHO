import * as Util from './util';

class Donut {
  constructor(dims, data, country) {
    this.dims = dims;
    this.data = data;
    this.country = country;
    this.color = this.data.length < 10 ? d3.scaleOrdinal(d3.schemeCategory10) : d3.scaleOrdinal(d3.schemeCategory20c);
  }

  drawDonut() {
    this.width = this.dims[0];
    this.height = this.dims[1]
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
      .value((d, i) => {
        return d.value;
      })
      .sort(null);

    let delay = 0;

    const path = d3.select('g')
      .selectAll('donut')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', 'white')
      .attr('class', 'donut')
      .attr('id', (d, i) => `pie${i}`)
      .on('mouseover', function(d, i) {
        d3.select(this).style('opacity', 0.5);
        d3.selectAll(`#label${i}`)
          .attr('font-size', '1.2em');
      })
      .on('mouseout', function(d, i) {
        d3.select(this).style('opacity', 1);
        d3.selectAll(`#label${i}`)
          .attr('font-size', '0.8em');
      })
    .transition()
      .delay(() => {
        delay += 50;
        return delay;
      })
      .attr('fill', (d, i)=> {
        return this.color(i);
      })

    setTimeout(() => {
      this.drawLabelBoxes();
      this.drawLabels();
      this.drawTitle();
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
      .text(this.country.properties.name + '  2015 Totals')
  }

  drawLabelBoxes() {
    const x = this.width * 3 / 5;
    const spaceBetween = 20;
    let y = 10;
    let delay = 0

    d3.select('svg')
      .selectAll('rect')
      .data(this.data)
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
        .attr('fill', (d, i) => this.color(i));
  }

  drawLabels() {
    const x = (this.width * 3 / 5) + 20;
    let y = 20;

    d3.select('svg')
      .selectAll('text')
      .data(this.data)
        .enter()
        .append('text')
        .attr('id', (d, i)=> `label${i}`)
        .on('mouseover', function(d, i) {
          d3.select(this).attr('font-size', '1.2em');
          d3.select(`#pie${i}`)
            .style('opacity', 0.5);
        })
        .on('mouseout', function(d, i) {
          d3.select(this).attr('font-size', '0.8em');
          d3.select(`#pie${i}`)
            .style('opacity', 1);
        })
        .attr('x', x)
        .attr('y', () => {
          y += 20;
          return y;
        })
        .attr('font-size', '0.8em')
        .text(d => {
          return d.value + ': ' + d.display;
        })

  }
}

export default Donut;

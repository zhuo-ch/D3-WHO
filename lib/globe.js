import { worldMap } from './world_map';
import * as Util from './util';
import Donut from './donut';

class Globe {
  constructor(dims, items) {
    this.dims = dims
    this.items = items
    this.worldMap = Util.bindMap(worldMap, items);
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.colorGrad = ['#0000ff', '#3366ff', '#6699ff', '#9999ff', '#cc66ff', '#ff66cc', '#ff0066', '#ff0000', '#990000'];
    this.coords = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
    this.prevTime = d3.now();
  }

  setup() {
    this.checkDims();
    this.setupGlobe();

    this.canvas.call(
      d3.drag()
      .on('start', this.dragStart.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnd.bind(this))
    )
    .on('mousemove', this.handleMouseMove.bind(this))
    .on('click', null)
    .on('click', this.handleClick.bind(this));
  }

  checkDims() {
    if (!(this.renderDims)) {
        this.renderDims = this.dims;
    }
  }

  setupGlobe() {
    this.clearGlobe();
    this.canvas = d3.select('#canvas').append('canvas');
    this.context = this.canvas.node().getContext('2d');
    this.globe = d3.geoOrthographic().precision(0.1);
    this.grat = d3.geoGraticule10();
    this.path = d3.geoPath(this.globe).context(this.context);
    this.scale();
  }

  handleMouseMove() {
    this.findHoverItem(d3.event);
  }

  handleClick() {
    const country = this.findClickItem(d3.event);

    if (country) {
      Util.fetchCountry(country.id).then(data => {
        const facts = Util.formatWHOCountry(data);
        const donut = new Donut(facts, country);
        donut.drawDonut();
      });
    }
  }

  findHoverItem(event) {
    const pos = this.globe.invert([event.layerX, event.layerY]);
    const country = this.worldMap.features.find(feature => d3.geoContains(feature, pos));

    if (country) {
      this.highlight = { type: 'FeatureCollection', features: [country]};
    } else {
      this.highlight = {};
    }
  }

  findClickItem(event) {
    if (this.highlight.features) {
      const country = this.highlight.features[0];
      this.setupMini();
      return country;
    }
  }

  setupMini() {
    this.renderDims = [this.dims[0] / 4, this.dims[1] / 4];
    d3.select('canvas')
      .attr('width', this.dims[0] / 4)
      .attr('height', this.dims[1] / 4);
    this.setup();
    this.startGlobe();
    this.canvas
      .on('click', null)
      .on('click', this.revertGlobe.bind(this));
  }

  revertGlobe() {
    d3.selectAll('svg').remove();
    this.renderDims = this.dims;
    this.setup();
    this.startGlobe();
  }

  clearGlobe() {
    this.timer ? this.timer.stop() : '';
    d3.select('canvas').remove();
  }

  scale() {
    const width = this.renderDims[0], height = this.renderDims[1];
    this.canvas.attr('width', width).attr('height', height);
    this.globe
      .scale((0.8 * Math.min(width, height))/2)
      .translate([width * 2 / 5, height / 2]);
  }

  dragStart() {
    this.timer.stop();
    this.coords.prevX = 0;
    this.coords.prevY = 0;
  }

  dragging() {
    const zyx = [this.coords.x, this.coords.y, this.coords.z];

    if (this.coords.prevX === 0 && this.coords.prevY === 0) {
      this.coords.prevX = d3.event.x;
      this.coords.prevY = d3.event.y;
    } else {
      this.coords.y -= (d3.event.y - this.coords.prevY);
      this.coords.x += (d3.event.x - this.coords.prevX);
      this.coords.prevY = d3.event.y;
      this.coords.prevX = d3.event.x;
      this.globe.rotate(zyx);
      this.render();
    }
  }

  dragEnd() {
    this.startGlobe(1000);
  }

  setRotation(timeElapsed) {
    const currentTime = d3.now();
    const timeDifference = currentTime - this.prevTime;

    if (timeDifference < timeElapsed) {
      const xyz = this.globe.rotate();
      xyz[0] += timeDifference * this.coords.rate;
      this.globe.rotate(xyz);
      this.coords.x = xyz[0];
      this.render();
    }

    this.prevTime = currentTime;
  }

  startGlobe(delay) {
    delay = delay ? delay : 0;
    this.timer = d3.timer(this.setRotation.bind(this), delay);
  }

  findColor(country) {
    const color = this.items.find(item => item.country = country.id);

    return Math.floor(color.value.numeric / 10);
  }

  render() {
    const ctx = this.context, path = this.path, renderDims = this.renderDims;
    ctx.clearRect(0, 0, renderDims[0], renderDims[1]);
    ctx.globalAlpha = 0.7;
    Util.drawObj(ctx, path, this.water, this.colors.water);
    Util.drawLine(ctx, path, this.grat, this.colors.grat);
    Util.drawMap(ctx, path, this.worldMap, this.colorGrad);
    Util.drawTitle(ctx, this.worldMap.features[0].fact.title, this.renderDims);

    if (this.highlight) {
      Util.drawObj(ctx, this.path, this.highlight, 'white');
    }
  }
}

export default Globe;

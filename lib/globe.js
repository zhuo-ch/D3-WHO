import { worldMap } from './world_map';
import * as Util from './util';
import Donut from './donut';

class Globe {
  constructor(dims, events) {
    this.dims = dims
    this.events = events
    this.worldMap = worldMap;
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.data = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
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
    const item = this.findClickItem(d3.event);

    if (item) {
      const events = Util.findCountryEvents(item, this.events);
      const donut = new Donut(events);
      donut.setupDonut();
    }
  }

  findHoverItem(event) {
    const pos = this.globe.invert([event.layerX, event.layerY]);
    const country = this.worldMap.features.find(feature => d3.geoContains(feature, pos));
    const ev = this.events.find(evt => Util.findEvent(evt.geometries[0].coordinates, pos));

    if (ev) {

    } else if (country) {
      this.highlight = { type: 'FeatureCollection', features: [country]};
    } else {
      this.highlight = {};
    }
  }

  findClickItem(event) {
    const pos = this.globe.invert([event.layerX, event.layerY]);
    const country = this.worldMap.features.find(feature => d3.geoContains(feature, pos));

    if (country) {
      this.setupMini();
    }

    return country;
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
      .translate([width / 2, height / 2]);
  }

  dragStart() {
    this.timer.stop();
    this.data.prevX = 0;
    this.data.prevY = 0;
  }

  dragging() {
    const zyx = [this.data.x, this.data.y, this.data.z];
    if (this.data.prevX === 0 && this.data.prevY === 0) {
      this.data.prevX = d3.event.x;
      this.data.prevY = d3.event.y;
    } else {
      this.data.y -= (d3.event.y - this.data.prevY);
      this.data.x += (d3.event.x - this.data.prevX);
      this.data.prevY = d3.event.y;
      this.data.prevX = d3.event.x;
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
      xyz[0] += timeDifference * this.data.rate;
      this.globe.rotate(xyz);
      this.data.x = xyz[0];
      this.render();
    }

    this.prevTime = currentTime;
  }

  startGlobe(delay) {
    delay = delay ? delay : 0;
    this.timer = d3.timer(this.setRotation.bind(this), delay);
  }

  render() {

    const ctx = this.context
    ctx.clearRect(0, 0, this.renderDims[0], this.renderDims[1]);
    ctx.globalAlpha = 0.7;
    Util.drawObj(ctx, this.path, this.water, this.colors.water);
    Util.drawLine(ctx, this.path, this.worldMap, this.colors.land);
    Util.drawLine(ctx, this.path, this.grat, this.colors.grat);

    if (this.highlight) {
      Util.drawObj(ctx, this.path, this.highlight, 'navy');
    }

    Util.drawEvents(ctx, this.path, this.events, 'red');
  }
}

export default Globe;

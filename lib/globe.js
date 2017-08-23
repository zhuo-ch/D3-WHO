import { worldMap } from './world_map';
import * as DrawUtil from './draw_util';
import * as Util from './util';
import Donut from './donut';

class Globe {
  constructor(dims) {
    this.dims = dims
    this.whoList = Util.whoList;
    this.currentListItem = this.whoList[0];
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.colorGrad = ['#0000ff', '#3366ff', '#6699ff', '#9999ff', '#cc66ff', '#ff66cc', '#ff0066', '#ff0000', '#990000'];
    this.coords = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
    this.prevTime = d3.now();
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setDrag = this.setDrag.bind(this);
    this.setRotation = this.setRotation.bind(this);
  }

  getItems() {
    this.startLoading();
    Util.fetchWHO(this.currentListItem).then(data => {
      this.items = Util.formatWHO(data);
      this.worldMap = Util.bindMap(worldMap, this.items);
      setTimeout(this.startGlobe(), 1000);
    });
  }

  setup() {
    this.getItems();
    this.checkDims();
    this.setCanvas();
    this.setGlobe();
    this.setDrag();
  }

  setDrag() {
    this.canvas.call(
      d3.drag()
      .on('start', this.dragStart.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnd.bind(this))
    )
    .on('mousemove', this.handleMouseMove)
    .on('click', this.handleClick);
  }

  checkDims() {
    if (!(this.renderDims)) {
        this.renderDims = this.dims;
    }
  }

  setCanvas() {
    this.canvas = d3.select('#canvas').append('canvas');
    this.context = this.canvas.node().getContext('2d');
  }

  setGlobe() {
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
      Util.fetchCountry(this.currentListItem, country.id).then(data => {
        const facts = Util.formatWHOCountry(data);
        this.donut = new Donut(facts, country);
        this.donut.drawDonut();
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
    // this.clearGlobe();
    this.renderDims = [this.dims[0] / 4, this.dims[1] / 4];
    d3.select('canvas')
      .attr('width', this.dims[0] / 4)
      .attr('height', this.dims[1] / 4);
    // this.canvas.call(
    //   d3.drag()
    //     .on('start', null)
    //     .on('drag', null)
    //     .on('end', null)
    // )
    this.setGlobe();
    this.startGlobe();
    this.canvas.on('click', this.revertGlobe.bind(this));
  }

  revertGlobe() {
    d3.selectAll('svg').selectAll('*').remove();
    d3.selectAll('svg').remove();
    this.renderDims = this.dims;
    this.setGlobe();
    this.startGlobe();
    // this.setDrag();
    this.canvas.on('click', this.handleClick);
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
    console.log('s')
  }

  dragging() {
    const xyz = [this.coords.x, this.coords.y, this.coords.z];

    if (this.coords.prevX === 0 && this.coords.prevY === 0) {
      this.coords.prevX = d3.event.x;
      this.coords.prevY = d3.event.y;
    } else {
      this.coords.y -= (d3.event.y - this.coords.prevY);
      this.coords.x += (d3.event.x - this.coords.prevX);
      this.coords.prevY = d3.event.y;
      this.coords.prevX = d3.event.x;
      this.globe.rotate(xyz);
      this.render();
    }
  }

  dragEnd() {
    this.timer.restart(this.setRotation, 700);
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

  startGlobe() {
    clearInterval(this.interval);
    if (this.timer) {
      this.timer.restart(this.setRotation);
    } else {
      this.timer = d3.timer(this.setRotation);
    }
  }

  startLoading() {
    let int = 0;
    this.interval = setInterval(() => {
      this.renderLoading(int);
      int += 1;
    }, 300);
  }

  findColor(country) {
    const color = this.items.find(item => item.country = country.id);

    return Math.floor(color.value.numeric / 10);
  }

  renderLoading(time) {
    DrawUtil.drawLoading(this.context, this.renderDims, time);
  }

  render() {
    const ctx = this.context, path = this.path, renderDims = this.renderDims;
    ctx.clearRect(0, 0, renderDims[0], renderDims[1]);
    ctx.globalAlpha = 0.7;
    DrawUtil.drawObj(ctx, path, this.water, this.colors.water);
    DrawUtil.drawLine(ctx, path, this.grat, this.colors.grat);
    DrawUtil.drawMap(ctx, path, this.worldMap, this.colorGrad);

    if (this.renderDims === this.dims) {
      DrawUtil.drawTitle(ctx, this.worldMap.features[0].fact.title, this.renderDims);
    }

    if (this.highlight) {
      DrawUtil.drawObj(ctx, this.path, this.highlight, 'white');
    }
  }
}

export default Globe;

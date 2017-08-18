import { worldMap } from './world_map';
import * as Util from './util';

class Globe {
  constructor(canvas, context, events) {
    this.canvas = canvas;
    this.context = context;
    this.events = events
    this.worldMap = worldMap;
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.data = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
    this.prevTime = d3.now();
  }

  startSetup() {

  }

  setupGlobe() {
    this.globe = d3.geoOrthographic().precision(0.1);
    this.grat = d3.geoGraticule10();
    this.path = d3.geoPath(this.globe).context(this.context);
    this.scale();
    this.canvas.call(
      d3.drag()
      .on('start', this.dragStart.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnd.bind(this))
    )
    .on('mousemove', this.handleMouseMove.bind(this))
    .on('click');
  }

  handleMouseMove() {
    this.findCountry(d3.event);
  }

  findCountry(event) {
    const pos = this.globe.invert([event.layerX, event.layerY]);
    const country = this.worldMap.features.find(feature => d3.geoContains(feature, pos));
    const ev = this.events.find(evt => Util.findEvent(evt.geometries[0].coordinates, pos));

    if (ev) {
      debugger
    }else if (country) {
      this.highlight = { type: 'FeatureCollection', features: [country]};
    }
  }

  scale() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.canvas.attr('width', this.width).attr('height', this.height);
    this.globe
      .scale((0.8 * Math.min(this.width, this.height))/2)
      .translate([this.width / 2, this.height / 2]);
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
    this.startRender(1000);
  }

  setRotation(timeElapsed) {
    const currentTime = d3.now();
    const timeDifference = currentTime - this.prevTime;

    if (timeDifference < timeElapsed) {
      const yxz = this.globe.rotate();
      yxz[0] += timeDifference * this.data.rate;
      this.globe.rotate(yxz);
      this.render();
    }

    this.prevTime = currentTime;
  }

  startRender(delay) {
    delay = delay ? delay : 0;
    this.timer = d3.timer(this.setRotation.bind(this), delay);
  }

  render() {

    const ctx = this.context
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 0.7;
    Util.drawObj(ctx, this.path, this.water, this.colors.water);
    Util.drawLine(ctx, this.path, this.worldMap, this.colors.land);
    Util.drawLine(ctx, this.path, this.grat, this.colors.grat);
    Util.drawEvents(ctx, this.path, this.events, 'red');

    if (this.highlight) {
      Util.drawObj(ctx, this.path, this.highlight, 'red');
    }
  }
}

export default Globe;

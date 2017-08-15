import { worldMap } from './world_map';

class Globe {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    // this.land = land;
    this.worldMap = worldMap;
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.data = { prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
    this.prevTime = d3.now();
  }

  setupGlobe() {
    this.globe = d3.geoOrthographic().precision(0.1);
    this.grat = d3.geoGraticule10();
    this.path = d3.geoPath(this.globe).context(this.context);
    // this.worldMap = topojson.feature(worldMap, worldMap.features);
    // debugger
    this.scale();
    this.canvas.call(
      d3.drag()
      .on('start', this.dragStart.bind(this))
      .on('drag', this.dragging.bind(this))
      .on('end', this.dragEnd)
    );
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
    const xyz = this.globe.rotate();
    this.data.z = xyz[2];
    this.data.y = xyz[1];
    this.data.x = xyz[0];

  }

  dragging(d, i) {
    const zyx = [this.data.x, this.data.y, this.data.z];
    this.globe.rotate(zyx);

    if (this.data.prevX === 0 && this.data.prevY === 0) {
      this.data.prevX = d3.event.x;
      this.data.prevY = d3.event.y;
    } else {
      this.data.y += (d3.event.y - this.data.prevY);
      this.data.x += (d3.event.x - this.data.prevX);
      this.data.prevY = d3.event.y;
      this.data.prevX = d3.event.x;
    }
  }

  dragEnd(d, i) {

  }

  drawObj(obj, color) {
    this.context.beginPath();
    this.path(obj);
    this.context.fillStyle = color;
    this.context.fill();
  }

  drawLine(line, color) {
    this.context.beginPath();
    this.path(line);
    this.context.strokeStyle = color;
    this.context.stroke();
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

  stopRotation() {
  }

  startRender() {
    d3.timer(this.setRotation.bind(this));
  }

  render() {

    const ctx = this.context
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 0.7;
    this.drawObj(this.water, this.colors.water);
    this.drawLine(this.worldMap, this.colors.land);
    this.drawLine(this.grat, this.colors.grat);
  }
}

export default Globe;

import { worldMap } from './world_map';

class Globe {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.worldMap = worldMap;
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.data = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
    this.prevTime = d3.now();
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
    .on('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseMove() {
    this.getCountry(d3.event);
  }

  getCountry(event) {
    var pos = this.globe.invert([event.layerX, event.layerY]);
    const count = this.worldMap.features.find(f => {
      return this.getCoords(f).find(c1 => {
        return this.polygonContains(c1, pos) || c1.find(c2 => {
          return this.polygonContains(c2, pos)
        })
      })
    })
    if(count) {
      console.log(count.properties.name);
      this.highlight = { type: 'FeatureCollection', features: [count]};
    }
  }

  getCoords(country) {
    if (country.geometry.type === 'MultiPolygon') {
      return [country.geometry.coordinates.reduce((accum, arr) => accum.concat(arr[0]), [])];
    } else {
      return country.geometry.coordinates;
    }
  }

  polygonContains(polygon, point) {
    var n = polygon.length
    var p = polygon[n - 1]
    var x = point[0], y = point[1]
    var x0 = p[0], y0 = p[1]
    var x1, y1
    var inside = false
    for (var i = 0; i < n; ++i) {
      p = polygon[i], x1 = p[0], y1 = p[1]
      if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
      x0 = x1, y0 = y1
    }
    return inside
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

  startRender(delay) {
    delay = delay ? delay : 0;
    this.timer = d3.timer(this.setRotation.bind(this), delay);
  }

  render() {

    const ctx = this.context
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 0.7;
    this.drawObj(this.water, this.colors.water);
    this.drawLine(this.worldMap, this.colors.land);
    this.drawLine(this.grat, this.colors.grat);

    if (this.highlight) {
      this.drawObj(this.highlight, 'red');
    }
  }
}

export default Globe;

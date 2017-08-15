class Globe {
  constructor(canvas, context, land) {
    this.canvas = canvas;
    this.context = context;
    this.land = land;
    this.water = { type: 'Sphere' };
    this.colors = { water: '#fff', land: '#111', grat: '#ccc', country: '#a00' };
    this.angles = { x: -20, y: 40, z: 0 };
  }

  setD3() {
    this.projection = d3.geoOrthographic().precision(0.1);
    this.grat = d3.geoGraticule10();
    this.path = d3.geoPath(this.projection).context(this.context);
    this.scale();
  }

  scale() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.canvas.attr('width', this.width).attr('height', this.height);
    this.projection
      .scale((0.8 * Math.min(this.width, this.height))/2)
      .translate([this.width / 2, this.height / 2]);

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
    this.context.fillStyle = color;
    this.context.fill();
  }

  render() {
    debugger
    const ctx = this.context
    ctx.clearRect(0, 0, this.width, this.height)
    this.drawObj(this.water, this.colors.water);
    this.drawLine(this.grat, this.colors.grat);
    this.drawObj(this.land, this.colors.land);
  }
}

module.exports = Globe;

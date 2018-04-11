import React from 'react';
import { worldMap } from './world_map';
import * as DrawUtil from './draw_util';
import * as Util from './util';
import * as APIUtil from './api_util';
import Donut from './donut';

class Globe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globe: '',
      grat: '',
      path: '',
      context: '',
      initialized: false,
      highlight: '',
    };
    this.water = { type: 'Sphere' };
    this.colors = { water: '#aacbff', land: '#003fa5', grat: '#89b6ff', country: '#a00' };
    this.colorGrad = ['#3366ff', '#5b84ff', '#6699ff', '#9999ff', '#cc66ff', '#ffa8e2', '#ff66cc', '#ff0066', '#ff0000', '#990000', '#0000ff'];
    this.coords = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, rate: 0.004 };
    this.prevTime = d3.now();
    this.setRotation = this.setRotation.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  componentDidMount() {
    this.setGlobe();
  }

  handleHover(e) {
    e.preventDefault();

    this.findHoverItem(e);
  }

  setGlobe() {
    const context = this.getContext();
    const globe = d3.geoOrthographic().precision(0.1);
    const grat = d3.geoGraticule10();
    const path = d3.geoPath(globe).context(context);

    this.setState({ globe, grat, path, context }, this.startGlobe);
  }

  scale() {
    const canvas = this.refs.canvas;
    const width = this.props.dims[0], height = this.props.dims[1];
    canvas.width = width, canvas.height = height;

    const globe = this.state.globe
      .scale((0.8 * Math.min(width, height))/2)
      .translate([width / 2, height / 2]);

    this.setState({ canvas, globe, renderDims: [width, height] });
  }

  setRotation(timeElapsed) {
    clearInterval(this.interval);
    const currentTime = d3.now();
    const timeDifference = currentTime - this.prevTime;

    if (timeDifference < timeElapsed) {
      const xyz = this.state.globe.rotate();
      xyz[0] += timeDifference * this.coords.rate;
      this.state.globe.rotate(xyz);
      this.coords.x = xyz[0];
      this.drawGlobe();
    }

    this.prevTime = currentTime;
  }

  startGlobe() {
    this.scale();

    if (this.timer) {
      this.timer.restart(this.setRotation);
    } else {
      this.timer = d3.timer(this.setRotation);
    }

    this.setState({ initialized: true });
  }

  findHoverItem(e) {
    // debugger
    const pos = this.state.globe.invert([e.pageX, e.pageY]);
    const country = this.props.indicatorValues.globeMap.features.find(feature => d3.geoContains(feature, pos));
    const highlight = { type: 'FeatureCollection', features: [country] };

    if (country) {
      this.highlight = highlight;
    }

    // const menuItem = this.findMenuItem(event);

    // if (menuItem) {
    //   this.setMenuHighlight(menuItem);
    // } else if (country) {
    //   this.setCountryHighlight(country);
    // } else {
    //   this.setMenuHighlight();
    // }
  }

  findColor(country) {
    const color = this.items.find(item => item.country = country.id);

    return Math.floor(color.value.numeric / 10);
  }

  getContext() {
    return this.refs.canvas.getContext('2d');
  }

  drawGlobe() {
    const { context, path, renderDims } = this.state;

    context.clearRect(0, 0, renderDims[0], renderDims[1]);
    context.globalAlpha = 0.7;
    DrawUtil.drawObj(context, path, this.water, this.colors.water);
    DrawUtil.drawLine(context, path, this.state.grat, this.colors.grat);
    DrawUtil.drawMap(context, path, this.props.indicatorValues.globeMap, this.colorGrad);
    if (this.highlight) {
      DrawUtil.drawObj(context, path, this.highlight, 'white');
    }

    // DrawUtil.drawHighlight(context, this.state.highlight);

    // this.setState({ context, path });
  }

  drawHighlight() {
    const { context, path } = this.state;
    if (this.highlight) {
      debugger

    }

  }

  render() {
    const [ width, height ] = this.props.dims;

    return (
      <canvas
        ref="canvas"
        width={ width }
        height={ height }
        onMouseOver={ this.handleHover } >
      </canvas>
    );
  }
}

export default Globe;

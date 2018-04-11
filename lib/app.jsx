import React from 'react';
import * as APIUtil from './api_util';
import * as Util from './util';
import Globe from './globe.jsx';
import { worldMap } from './world_map';

class Who extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showGlobe: false, indicator: 0, countries: [], globeMap: {}, title: '' };
  }

  componentDidMount() {
    const list = APIUtil.whoList;
    let data;

    APIUtil.fetchWHO(list[this.state.indicator])
      .then(data => this.setData(data));
  }

  setData(data) {
    // debugger
    const countries = Util.formatCountries(data);
    const globeMap = Util.bindMap(worldMap, countries);
    const title = globeMap.features.find(el => el.fact).fact.title;
debugger
    this.setState({ countries, globeMap, title, showGlobe: true });
  }

  render() {
    debugger
    return (
      this.state.showGlobe
      && <Globe dims={ this.props.dims } indicatorValues={ this.state }/>
    );
  }
}

export default Who;

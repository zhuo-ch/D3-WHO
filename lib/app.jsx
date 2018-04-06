import React from 'react';
import * as APIUtil from './api_util';
import * as Util from './util';
import Globe from './globe.jsx';
import { worldMap } from './world_map';

class Who extends React.Component {
  constructor(props) {
    super(props);
    this.state = { indicator: 0, countries: [], worldMap: {}, title: '' };
  }

  componentDidMount() {
    const list = APIUtil.whoList;
    let data;

    APIUtil.fetchWHO(list[this.state.indicator])
      .then(data => this.setData(data));
  }

  setData(data) {
    const countries = Util.formatCountries(data);
    const worldMap = Util.bindMap(worldMap, countries);
    const title = worldMap.features.find(el => el.fact).fact.title;

    this.setState({ countries, worldMap, title });
  }

  render() {
    return <Globe dims={ this.props.dims } indicator={ this.state.indicator }/>
  }
}

export default Who;

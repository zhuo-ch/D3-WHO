import React from 'react';
import * as APIUtil from './api_util';
import * as Util from './util';
import Globe from './globe.jsx';
import { worldMap } from './world_map';

class Who extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showGlobe: false, indicator: 0, countries: [], globeMap: {}, title: '', selecting: false };
    this.handleSelectionClick = this.handleSelectionClick.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleSelectionClick(e) {
    e.preventDefault();

    this.setState({ selecting: this.state.selecting ? false : true });
  }

  handleListClick(e) {
    e.preventDefault();
    this.setState({ indicator: e.currentTarget.value }, this.getData)
  }

  getData() {
    const list = APIUtil.whoList;

    return APIUtil.fetchWHO(list[this.state.indicator]).then(data => this.setData(data));
  }

  setData(data) {
    const countries = Util.formatCountries(data);
    const globeMap = Util.bindMap(worldMap, countries);
    const title = globeMap.features.find(el => el.fact).fact.title;

    this.setState({ countries, globeMap, title, showGlobe: true });
  }

  getHeaderItem(text) {
    return (
      <article>
        <span className="letter-accent">{ text[0] }</span><span>{ text.slice(1, text.length ) }</span>
      </article>
    );
  }

  getHeader() {
    const title = ["World", "Health", "Viewer"].map(el => this.getHeaderItem(el));

    return <article className="header">{ title }</article>;
  }

  getListEl(item, idx) {
    return (
      <li
        key={ idx }
        value={ idx }
        className="menu-item"
        onClick={ this.handleListClick } >
        { item.title }
      </li>
    );
  }

  getList() {
    const list = APIUtil.whoList.map(this.getListEl.bind(this));
    const { selecting } = this.state;
    const hidden = this.state.selecting ? '' : 'hidden';

    return (
      <ul className={ `menu-items ${ hidden }`}>
        { list }
      </ul>
    );
  }

  getSelector() {
    const selectionList = this.getList();
    const selecting = this.state.selecting ? "menu-selecting" : "menu";

    return (
      <article
        className={ selecting }
        onClick={ this.handleSelectionClick }>
        <span className="menu-title">
          Select a Data Set
        </span>
        { selectionList }
      </article>
    );
  }

  getMenu() {
    const header = this.getHeader();
    const selector = this.getSelector();

    return (
      <div className="nav-bar">
        { header }
        { selector }
      </div>
    );
  }

  render() {
    const menu = this.getMenu();

    return (
      <div>
        { menu }
        {
          this.state.showGlobe
          && <Globe dims={ this.props.dims } indicatorValues={ this.state }/>
        }
      </div>
    );
  }
}

export default Who;

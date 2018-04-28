import React from 'react';
import { merge } from 'lodash';
import * as APIUtil from './api_util';
import * as Util from './util';
import Globe from './globe.jsx';
import { worldMap } from './world_map';

class Who extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGlobe: false,
      indicator: 0,
      countries: [],
      globeMap: {},
      title: '',
      selecting: true,
      fetching: true
    };
    this.handleSelectionClick = this.handleSelectionClick.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleSelectionClick(e) {
    e.preventDefault();

    this.setState({ selecting: this.toggleState('selecting') });
  }

  handleListClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState(
      { indicator: e.currentTarget.value, fetching: this.toggleState('fetching') }
      , this.getData
    );
  }

  getData() {
    this.getGlobeData()
      .then(newState => {
        newState.selecting = this.toggleState('selecting');
        newState.fetching = this.toggleState('fetching');

        this.setState(newState);
      });
  }

  toggleState(toggle) {
    return this.state[toggle] ? false : true;
  }

  getGlobeData() {
    const listItem = APIUtil.whoList[this.state.indicator];

    return APIUtil.fetchWHO(listItem).then(data => {
      const countries = Util.formatCountries(data);
      const globeMap = Util.bindMap(worldMap, countries);
      const title = globeMap.features.find(el => el.fact).fact.title;

      return { countries, globeMap, title, showGlobe: true };
    });
  }

  getHeaderItem(text, idx) {
    return (
      <article key={ idx }>
        <span className="letter-accent">{ text[0] }</span><span>{ text.slice(1, text.length ) }</span>
      </article>
    );
  }

  getHeader() {
    const title = ["World", "Health", "Viewer"].map((el, idx)=> this.getHeaderItem(el, idx));

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

  getSpinner() {
    return (
      <div className="modal">
        <div className='modal spinner-cover'></div>
        <i className='icon fa fa-spinner fa-pulse'></i>

      </div>
    )
  }

  render() {
    const menu = this.getMenu();

    return (
      <div>
        { menu }
        {
          this.state.fetching
          && this.getSpinner()
        }
        {
          this.state.showGlobe
          && <Globe dims={ this.props.dims } indicatorValues={ this.state }/>
        }
      </div>
    );
  }
}

export default Who;

/* eslint-disable */

import Element from '../Element';

import { getSelectValues, } from '../../utils';

import './oldApp.css';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

const default_lv = 'hy-lv-68';
// end::vars[]


// tag::app[]
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      educations: [], lvs: [], lv: '', education: {}, lvNames: {}
    };
    this.onChangeLv = this.onChangeLv.bind(this);
    this.onChangeEd = this.onChangeEd.bind(this);
    this.onViewAll = this.onViewAll.bind(this);
    this.initLv = this.initLv.bind(this);
  }

  componentWillMount() {
    client({ method: 'GET', path: '/api/educations' }).done((response) => {
      this.setState({ educations: response.entity.educations });
      client({ method: 'GET', path: `/api/available_lvs/${event.target.value}` }).done((response) => {
        this.setState({ lvs: response.entity });
        this.initLv(response.entity);
      });
    });
    client({ method: 'GET', path: '/api/lv_names' }).done((response) => {
      this.setState({ lvNames: response.entity });
    });
  }

  onChangeEd(event) {
    this.setState({ lvs: [] });
    client({ method: 'GET', path: `/api/available_lvs/${event.target.value}` }).done((response) => {
      this.setState({ lvs: response.entity });
      this.initLv(response.entity);
    });
    client({
      method: 'GET',
      path: `/api/by_id/${event.target.value}?lv=${this.state.lv}`
    }).done((response) => {
      this.setState({ education: response.entity });
    });
  }

  componentDidMount() {
    //document.getElementById('lv').onChange();
  }

  initLv(entity) {
   // const elementById = document.getElementById('lv');
    console.log(`lv response, old value: ${this.state.lv}`);
    console.log(entity);
    let lv = default_lv;
    if (this.state.lv == '' && entity.indexOf(default_lv) >= 0) {
      elementById.value = default_lv;
    } else if (this.state.lv != '' && entity.indexOf(this.state.lv) > 0) {
      elementById.value = this.state.lv;
      lv = this.state.lv;
    } else {
      elementById.value = default_lv;
    }
    this.setState({ lv });
    const event = new Event('onchange', { bubbles: true });
    elementById.dispatchEvent(event);
    return lv;
  }

  onViewAll(event) {
    this.updateEducation(getSelectValues(document.getElementById('ed'))[0], this.state.lv);
  }

  onChangeLv(event) {
    this.setState({ lv: event.target.value });
    this.updateEducation(getSelectValues(document.getElementById('ed'))[0], event.target.value);
  }

  updateEducation(edId, lv) {
    client({ method: 'GET', path: `/api/by_id/${edId}?lv=${lv}` }).done((response) => {
      this.setState({ education: response.entity });
    });
  }

  render() {
    const educationOptions = this.state.educations.map(ed => (
      <option key={ed.id} value={ed.id}>
        {ed.name.fi}
      </option>
    ));

    let options = [];

    if (this.state.lvs.length > 0) {
      options = this.state.lvs.map(lv => (
        <option key={lv} value={lv}>
          {this.state.lvNames[lv]}
        </option>
      ));
    }

    return (
      <ul>
        <li>
          <input type="checkbox" id="viewAll" name="viewAll" onChange={this.onViewAll} />
Näytä kaikki
        </li>
        <li>
          <select id="lv" name="lv" onChange={this.onChangeLv}>
            {options}
          </select>
        </li>
        <li>
          <select id="ed" name="ed" onChange={this.onChangeEd}>
            {educationOptions}
          </select>
        </li>
        {this.state.lv != undefined && <Element key={this.state.education.id} id={this.state.education.id} elem={this.state.education} lv={this.state.lv} />}
      </ul>
    );
  }
}

/* eslint-disable */

import React from 'react';

import ElementList from '../ElementList/index';
import ErrorMessage from '../../ErrorMessage';
import { getSelectValues } from '../utils/index';
import { fetchAllIdsJson } from '../../../api';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elements: [], selected: {}, error: undefined };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { lv, ids } = this.props;
    fetchAllIdsJson(lv, ids)
      .then(elements => this.setState({ elements }))
      .catch(error => this.setState({ error: error.message }));
  }

  onChange(event) {
    this.setState({ selectedId: [event.target.value] });
  }


  render() {
    const { error } = this.state;

    if (error) {
      return <ErrorMessage errorMessage={error} />
    }

    if (this.state.elements.length == 0) {
      return (
        <div>
          ...
        </div>
      );
    }
    const options = this.state.elements.map(element => (
      <option key={element.id} value={element.id}>
        {element.name.fi}
      </option>
    ));

    const selected = getSelectValues(document.getElementById(`select-${this.props.id}`));

    return (
      <div>
        <select key="test" id={`select-${this.props.id}`} onChange={this.onChange}>
          <option key="" value="">
            ---
          </option>
          {options}
        </select>
        <br />
        <ElementList
          key={`mods-${this.props.rule.localId}`}
          id={`mods-${this.props.rule.localId}`}
          ids={selected}
          lv={this.props.lv}
          rule={this.props.rule}
        />
      </div>

    );
  }
}

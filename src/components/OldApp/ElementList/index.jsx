/* eslint-disable */

import React from 'react';

import Element from '../Element/index';
import { isEqual, qs } from '../utils/index';
import { fetchAllIdsJson } from '../../../api';
import ErrorMessage from '../../ErrorMessage';

export default class ElementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elements: [], error: undefined };
  }

  componentDidMount() {
    const { lv, ids } = this.props;

    if (ids != null && ids.length > 0) {
      this.fetchData(lv, ids);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.fetchData(nextProps.lv, nextProps.ids);
    }
  }

  fetchData(lv, ids) {
    fetchAllIdsJson(lv, ids)
      .then(elements => this.setState({ elements }))
      .catch(error => this.setState({ error }));
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <ErrorMessage errorMessage={error} />
    }

    const elements = this.state.elements.map(elem => <Element key={elem.id} id={elem.id} elem={elem} lv={this.props.lv} />);
    return (
      <div>
        {qs.debug == 'true' && (
          <div>
            id:
            {this.props.id}
          </div>
        )}
        {elements}
      </div>

    );
  }
}

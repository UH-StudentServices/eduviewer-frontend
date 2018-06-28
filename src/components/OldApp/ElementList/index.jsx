/* eslint-disable */

import React from 'react';

import Element from '../Element/index';
import { isEqual, qs } from '../utils/index';
import { fetchAllIdsJson } from '../../../api';

export default class ElementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elements: [] };
  }

  componentDidMount() {
    const { lv, ids } = this.props;

    if (ids != null && ids.length > 0) {
      fetchAllIdsJson(lv, ids).then(elements => this.setState({ elements }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props, nextProps)) {
      return;
    }
    fetchAllIdsJson(nextProps.lv, nextProps.ids).then(elements => this.setState({ elements }));
  }


  componentDidUpdate() {
  }

  render() {
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

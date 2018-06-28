/* eslint-disable */

import React from 'react';

import Element from '../Element/index';
import { isEqual, qs } from '../utils/index';

export default class ElementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elements: [] };
  }

  componentDidMount() {
    if (this.props.ids != null && this.props.ids.length > 0) {
      fetch(`/api/all_ids?lv=${this.props.lv == undefined ? '' : this.props.lv}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.props.ids)
      }).then(response => response.json()).then((responseJson) => {
        this.setState({ elements: responseJson });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props, nextProps)) {
      return;
    }
    fetch(`/api/all_ids?lv=${nextProps.lv == undefined ? '' : nextProps.lv}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextProps.ids)
    }).then(response => response.json()).then((responseJson) => {
      this.setState({ elements: responseJson });
    });
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

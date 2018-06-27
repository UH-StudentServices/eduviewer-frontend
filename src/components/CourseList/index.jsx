/* eslint-disable */

import React, { Component } from 'react';

export default class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = { courseNames: [] };
  }

  componentDidMount() {
    if (this.props.ids != null && this.props.ids.length > 0) {
      fetch(`/api/cu/names?lv=${this.props.lv != undefined ? this.props.lv : ''}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.props.ids)
      }).then(response => response.json()).then((responseJson) => {
        this.setState({ courseNames: responseJson });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props, nextProps)) {
      return;
    }
    fetch(`/api/cu/names?lv=${this.props.lv}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextProps.ids)
    }).then(response => response.json()).then((responseJson) => {
      this.setState({ courseNames: responseJson });
    });
  }


  render() {
    const courseNames = this.state.courseNames.map((node, index) => (
      <li key={`${index}${node.name.fi}`}>
        {node.code}
        {' '}
        {node.name.fi}
        &nbsp;
        (
        {(node.credits.min == node.credits.max)
          ? (
            <b>
              {node.credits.min}
            </b>
          )
          : (
            <b>
              {node.credits.min}
              -
              {node.credits.max}
            </b>
          )}
        <b>
          op
        </b>
        )
      </li>
    ));
    return (
      <ul>
        {courseNames}
      </ul>
    );
  }
}

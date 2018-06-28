/* eslint-disable */

import React, { Component } from 'react';
import { fetchCourseNames } from '../../../api';

export default class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = { courseNames: [] };
  }

  componentDidMount() {
    const { ids, lv } = this.props;

    if (ids != null && ids.length > 0) {
      fetchCourseNames(lv, ids).then(courseNames => this.setState({ courseNames }));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lv, ids } = this.props;
    if (isEqual(this.props, nextProps)) {
      return;
    }

    fetchCourseNames(lv, ids).then(courseNames => this.setState({ courseNames }));
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

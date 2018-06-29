/* eslint-disable */

import React, { Component } from 'react';

import { fetchCourseNames } from '../../../api';
import ErrorMessage from '../../ErrorMessage';
import { isEqual } from '../utils';
import Course from '../../Course';

export default class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = { courseNames: [], error: undefined };
  }

  componentDidMount() {
    const { ids, lv } = this.props;

    if (ids != null && ids.length > 0) {
      fetchCourseNames(lv, ids)
        .then(courseNames => this.setState({ courseNames }))
        .catch(error => this.setState({ error: error.message }));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lv, ids } = this.props;
    if (isEqual(this.props, nextProps)) {
      return;
    }

    fetchCourseNames(lv, ids)
      .then(courseNames => this.setState({ courseNames }))
      .catch(error => this.setState({ error: error.message }));
  }


  render() {
    const { error, courseNames } = this.state;

    if (error) {
      return <ErrorMessage errorMessage={error} />
    }

    return (
      <ul>
        {courseNames.map((node, index) => (
          <Course
            key={`${index}${node.name.fi}`}
            code={node.code}
            name={node.name}
            credits={node.credits}
          />
        ))}
      </ul>
    );
  }
}

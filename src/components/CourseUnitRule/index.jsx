import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';

import { fetchCourseNames } from '../../api';
import Course from '../Course';
import ErrorMessage from '../ErrorMessage';

class CourseUnitRule extends Component {
  state = {
    courses: []
  };

  componentDidMount() {
    const { academicYear, code } = this.props;

    fetchCourseNames(academicYear, [code])
      .then(courses => this.setState({ courses }))
      .catch(error => this.setState({ error: error.message }));
  }

  render() {
    const { courses, error } = this.state;

    if (error) {
      return <ErrorMessage errorMessage={error} />;
    }

    return (
      <Fragment>
        {courses.map(({ code, name, credits }) => (
          <Course key={code} code={code} name={name} credits={credits} />
        ))}
      </Fragment>
    );
  }
}

CourseUnitRule.propTypes = {
  academicYear: string.isRequired,
  code: string.isRequired
};

export default CourseUnitRule;

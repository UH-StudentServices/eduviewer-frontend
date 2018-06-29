import React, { Component } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { creditsType, localizedTextType } from '../../types';
import { fetchCourseNames } from '../../api';
import Course from '../Course';
import ErrorMessage from '../ErrorMessage';

export default class StudyModule extends Component {
  state = {
    courses: [],
    error: undefined
  };

  componentDidMount() {
    this.fetchCourses();
  }

  getTargetCredits() {
    const { targetCredits } = this.props;
    const { max, min } = targetCredits;
    return (max === min) ? min : `${min}–${max}`;
  }

  fetchCourses() {
    const { academicYear, rules } = this.props;
    const courseUnitIds = rules
      .filter(rule => rule.type === 'CourseUnitRule')
      .map(rule => rule.courseUnitGroupId);

    fetchCourseNames(academicYear, courseUnitIds)
      .then(courses => this.setState({ courses }))
      .catch(error => this.setState({ error: error.message }));
  }

  render() {
    const { name, code } = this.props;
    const { courses, error } = this.state;

    if (error) {
      return <ErrorMessage errorMessage={error} />;
    }

    return (
      <div>
        <strong>{code} {name.fi} ({this.getTargetCredits()} op)</strong>
        <ul>
          {courses.map(course => (
            <Course
              key={course.code}
              code={course.code}
              name={course.name}
              credits={course.credits}
            />
          ))}
        </ul>
      </div>
    );
  }
}

StudyModule.propTypes = {
  academicYear: string.isRequired,
  name: localizedTextType.isRequired,
  targetCredits: creditsType.isRequired,
  code: string.isRequired,
  rules: arrayOf(
    shape({
      type: string.isRequired,
      courseUnitGroupId: string.isRequired
    })
  ).isRequired
};

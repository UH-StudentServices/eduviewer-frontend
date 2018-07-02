import React, { Component } from 'react';
import { string } from 'prop-types';

import { elemType } from '../../types';
import { fetchAllIdsJson, fetchCourseNames } from '../../api';
import { creditsToString } from '../../utils';
import Course from '../Course';
import ErrorMessage from '../ErrorMessage';
import GroupingModule from '../GroupingModule'; // eslint-disable-line

export default class StudyModule extends Component {
  state = {
    courses: [],
    subModules: [],
    error: undefined
  };

  componentDidMount() {
    this.fetchCourses();
  }

  getTargetCredits() {
    const { module } = this.props;
    const { targetCredits } = module;
    return creditsToString(targetCredits);
  }

  fetchCourses() {
    const { academicYear, module } = this.props;
    const { rule } = module;

    if (!rule || !rule.rules) {
      console.log('courses not fecthed. check module');
      console.log(module);
      return;
    }

    const moduleGroupIds = rule.rules
      .filter(subRule => subRule.type === 'ModuleRule')
      .map(subRule => subRule.moduleGroupId);

    const courseUnitIds = rule.rules
      .filter(subRule => subRule.type === 'CourseUnitRule')
      .map(subRule => subRule.courseUnitGroupId);

    fetchCourseNames(academicYear, courseUnitIds)
      .then(courses => this.setState({ courses }))
      .catch(error => this.setState({ error: error.message }));

    fetchAllIdsJson(academicYear, moduleGroupIds)
      .then(subModules => this.setState({ subModules }));
  }

  render() {
    const { academicYear, module } = this.props;
    const { name, code } = module;
    const { courses, subModules, error } = this.state;

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
          {subModules.map(subModule => (
            <GroupingModule
              key={subModule.id}
              academicYear={academicYear}
              module={subModule}
            />
          ))}
        </ul>
      </div>
    );
  }
}

StudyModule.propTypes = {
  academicYear: string.isRequired,
  module: elemType.isRequired
};

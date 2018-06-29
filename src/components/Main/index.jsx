import React, { Component } from 'react';
import {
  getDegreePrograms,
  getAcademicYearNames,
  getAcademicYearsForDegreeProgram,
  getDegreeProgramForAcademicYear
} from '../../api';

import Element from '../OldApp/Element';
import styles from './main.css';

const DEFAULT_ACADEMIC_YEAR = 'hy-lv-68';

class Main extends Component {
  state = {
    degreePrograms: [],
    academicYears: [],
    academicYearNames: {},
    isLoading: false,
    degreeProgram: '',
    academicYear: ''
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [degreeProgramsResponse, academicYearNames] = await Promise.all(
      [getDegreePrograms(), getAcademicYearNames()]
    );

    const degreePrograms = degreeProgramsResponse.educations;
    const academicYears = await getAcademicYearsForDegreeProgram(degreePrograms[0].id);

    this.setState({
      degreePrograms,
      academicYearNames,
      academicYears,
      isLoading: false
    });
  }

   onDegreeProgramsChange = async (event) => {
     const degreeProgramId = event.target.value;
     this.setState({ isLoading: true });
     const academicYears = await getAcademicYearsForDegreeProgram(degreeProgramId);
     const academicYear = this.getAcademicYear(academicYears);
     const degreeProgram = await getDegreeProgramForAcademicYear(degreeProgramId, academicYear);

     this.setState({
       degreeProgram,
       academicYear,
       academicYears,
       isLoading: false
     });
   }

  onAcademicYearsChange = (event) => {
    const academicYear = event.target.value;
    this.setState({ academicYear });
  }

  getAcademicYear = (academicYears) => {
    const { academicYear: oldSelection } = this.state;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    return isOldSelectionValid ? oldSelection : DEFAULT_ACADEMIC_YEAR;
  }

  renderLoader = () => (
    <div className={styles.loader}>
      <span className="icon--spinner icon-spin" />
    </div>
  )

  renderSelections = () => {
    const {
      degreeProgram, degreePrograms, academicYears, academicYearNames, academicYear, isLoading
    } = this.state;

    if (isLoading) {
      return null;
    }
    const ACADEMIC_YEARS_ID = 'academicYear';
    const DEGREE_PROGRAMS_ID = 'degreePrograms';

    return (
      <div>
        <label htmlFor={ACADEMIC_YEARS_ID}>
          Lukuvuodet
          <select
            name={ACADEMIC_YEARS_ID}
            id={ACADEMIC_YEARS_ID}
            value={academicYear}
            onChange={this.onAcademicYearsChange}
          >
            {academicYears.map(ay => (
              <option key={ay} value={ay}>
                {academicYearNames[ay]}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={DEGREE_PROGRAMS_ID}>
          Koulutusohjelmat
          <select
            name={DEGREE_PROGRAMS_ID}
            id={DEGREE_PROGRAMS_ID}
            value={degreeProgram}
            onChange={this.onDegreeProgramsChange}
          >
            { degreePrograms.map(dp => <option key={dp.id} value={dp.id}>{dp.name.fi}</option>) }
          </select>
        </label>
      </div>
    );
  }

  renderContent = () => {
    const {
      degreeProgram, academicYear
    } = this.state;
    if (!academicYear) {
      return <div>Ei lukuvuosia</div>;
    }
    console.log(degreeProgram);
    return (
      <div>
        <Element
          key={degreeProgram.id}
          id={degreeProgram.id}
          elem={degreeProgram}
          lv={academicYear}
        />
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;

    return (
      <div>
        <main>
          {isLoading && this.renderLoader()}
          { this.renderSelections()}
          { this.renderContent()}
        </main>
      </div>
    );
  }
}

export default Main;

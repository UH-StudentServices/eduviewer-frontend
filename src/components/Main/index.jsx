import React, { Component } from 'react';
import {
  getDegreePrograms,
  getAcademicYearNames,
  getAcademicYearsForDegreeProgram,
  getDegreeProgramForAcademicYear
} from '../../api';

import DegreeProgram from '../DegreeProgram';
import Element from '../OldApp/Element';
import styles from './main.css';

const DEFAULT_ACADEMIC_YEAR = 'hy-lv-68';

class Main extends Component {
  state = {
    degreePrograms: [],
    academicYears: [],
    academicYearNames: {},
    isLoading: false,
    degreeProgram: {},
    academicYear: ''
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [degreeProgramsResponse, academicYearNames] = await Promise.all(
      [getDegreePrograms(), getAcademicYearNames()]
    );

    const degreePrograms = degreeProgramsResponse.educations;
    console.log(degreePrograms[0].id);
    const academicYears = await getAcademicYearsForDegreeProgram(degreePrograms[0].id);
    const academicYear = this.getAcademicYear(academicYears);

    this.setState({
      degreePrograms,
      academicYear,
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

  onAcademicYearsChange = async (event) => {
    const { degreeProgram: { id } } = this.state;
    this.setState({ isLoading: true });
    const academicYear = event.target.value;
    const degreeProgram = await getDegreeProgramForAcademicYear(id, academicYear);
    this.setState({
      degreeProgram,
      academicYear,
      isLoading: false
    });
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
      <form>
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
            value={degreeProgram.id}
            onChange={this.onDegreeProgramsChange}
          >
            { degreePrograms.map(dp => <option key={dp.id} value={dp.id}>{dp.name.fi}</option>) }
          </select>
        </label>
      </form>
    );
  }

  renderContent = () => {
    const {
      degreeProgram, academicYear
    } = this.state;
    if (!academicYear || !degreeProgram.name) {
      return <div>Ei lukuvuosia</div>;
    }
    return (
      <div>
        <DegreeProgram
          key={degreeProgram.id}
          degreeProgram={degreeProgram}
          academicYear={academicYear}
        />
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

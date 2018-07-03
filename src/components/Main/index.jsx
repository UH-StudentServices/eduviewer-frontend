import React, { Component } from 'react';
import {
  getDegreePrograms,
  getAcademicYearNames,
  getAcademicYearsForDegreeProgram,
  getDegreeProgramForAcademicYear
} from '../../api';

import DegreeProgram from '../DegreeProgram';
import LoaderDropdown from '../LoaderDropdown';

import styles from './main.css';
import ToggleSelect from '../ToggleSelect';

const DEFAULT_ACADEMIC_YEAR = 'hy-lv-68';

class Main extends Component {
  state = {
    degreePrograms: [],
    academicYears: [],
    academicYearNames: {},
    isLoading: false,
    degreeProgram: {},
    academicYear: '',
    showAll: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [degreeProgramsResponse, academicYearNames] = await Promise.all(
      [getDegreePrograms(), getAcademicYearNames()]
    );

    const degreePrograms = degreeProgramsResponse.educations;
    const degreeProgram = degreePrograms[0];
    const academicYears = await getAcademicYearsForDegreeProgram(degreeProgram.id);
    const academicYear = this.getAcademicYear(academicYears);

    this.setState({
      degreePrograms,
      degreeProgram,
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

  onShowAll = () => {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  }

  getAcademicYear = (academicYears) => {
    const { academicYear: oldSelection } = this.state;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    return isOldSelectionValid ? oldSelection : DEFAULT_ACADEMIC_YEAR;
  }


  renderSelections = () => {
    const {
      degreeProgram,
      degreePrograms,
      academicYears,
      academicYearNames,
      academicYear,
      showAll,
      isLoading
    } = this.state;

    const getOption = (id, value, text) => ({ id, value, text });

    const ACADEMIC_YEARS_ID = 'academicYear';
    const DEGREE_PROGRAMS_ID = 'degreePrograms';
    const degreeProgramOptions = degreePrograms.map(dp => getOption(dp.id, dp.id, dp.name.fi));
    const academicYearOptions = academicYears.map(ay => getOption(ay, ay, academicYearNames[ay]));

    const academicYearsLabel = 'Lukuvuodet';
    const degreeProgramsLabel = 'Tutkinto-ohjelmat';
    const showAllLabel = 'Näytä kaikki';

    return (
      <div className={styles.selectContainer}>
        <LoaderDropdown
          id={DEGREE_PROGRAMS_ID}
          value={degreeProgram.id}
          onChange={this.onDegreeProgramsChange}
          options={degreeProgramOptions}
          label={degreeProgramsLabel}
          isLoading={isLoading}
        />
        <LoaderDropdown
          id={ACADEMIC_YEARS_ID}
          value={academicYear}
          onChange={this.onAcademicYearsChange}
          options={academicYearOptions}
          label={academicYearsLabel}
          isLoading={isLoading}
        />
        <ToggleSelect
          onChange={this.onShowAll}
          checked={showAll}
          label={showAllLabel}
        />
      </div>
    );
  }

  renderContent = () => {
    const { degreeProgram, academicYear, showAll } = this.state;

    const hasContent = academicYear && degreeProgram.name;

    return (
      <div className={styles.contentContainer}>
        {hasContent
          ? (
            <DegreeProgram
              key={degreeProgram.id}
              degreeProgram={degreeProgram}
              academicYear={academicYear}
              showAll={showAll}
            />
          )
          : <div>Ei näytettävää koulutusohjelmaa</div>
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        <main className={styles.mainContainer}>
          <h2>Eduviewer</h2>
          { this.renderSelections()}
          { this.renderContent()}
        </main>
      </div>
    );
  }
}

export default Main;

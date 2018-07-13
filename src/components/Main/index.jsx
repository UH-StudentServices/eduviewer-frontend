import React, { Component } from 'react';
import { string, oneOf } from 'prop-types';
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
import { availableLanguages } from '../../constants';
import ErrorMessage from '../ErrorMessage';

const DEFAULT_ACADEMIC_YEAR = 'hy-lv-68';

class Main extends Component {
  static propTypes = {
    academicYearCode: string.isRequired,
    degreeProgramId: string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    lang: oneOf(Object.values(availableLanguages)).isRequired,
    header: string.isRequired
  };

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
    const { degreeProgramId, academicYearCode } = this.props;
    if (degreeProgramId && academicYearCode) {
      await this.initSpecificView(degreeProgramId, academicYearCode);
    } else if (degreeProgramId) {
      await this.initAcademicYears(degreeProgramId);
    } else {
      await this.initAllSelects();
    }
  }

   onDegreeProgramsChange = async (event) => {
     this.setState({ isLoading: true, errorMessage: '' });
     const degreeProgramId = event.target.value;
     try {
       const academicYears = await getAcademicYearsForDegreeProgram(degreeProgramId);
       const academicYear = this.getAcademicYear(academicYears);
       const degreeProgram = await getDegreeProgramForAcademicYear(degreeProgramId, academicYear);

       this.setState({
         degreeProgram,
         academicYear,
         academicYears,
         isLoading: false
       });
     } catch (error) {
       this.handleError(error);
     }
   }

  onAcademicYearsChange = async (event) => {
    const { degreeProgram: { id } } = this.state;

    this.setState({ isLoading: true, errorMessage: '' });
    const academicYear = event.target.value;
    try {
      const degreeProgram = await getDegreeProgramForAcademicYear(id, academicYear);

      this.setState({
        degreeProgram,
        academicYear,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  onShowAll = () => {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  }

  getAcademicYear = (academicYears) => {
    const { academicYear: oldSelection } = this.state;
    const { academicYearCode } = this.props;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    return isOldSelectionValid ? oldSelection : academicYearCode || DEFAULT_ACADEMIC_YEAR;
  }

  handleError = (error) => {
    this.setState({ errorMessage: error.message, isLoading: false });
  }

  initAllSelects = async () => {
    this.setState({ isLoading: true });
    try {
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
    } catch (error) {
      this.handleError(error);
    }
  }

  initAcademicYears = async (degreeProgramId) => {
    this.setState({ isLoading: true });
    try {
      const [academicYearNames, academicYears] = await Promise.all(
        [getAcademicYearNames(), getAcademicYearsForDegreeProgram(degreeProgramId)]
      );

      const academicYear = this.getAcademicYear(academicYears);
      const degreeProgram = await getDegreeProgramForAcademicYear(
        degreeProgramId,
        academicYear
      );

      this.setState({
        academicYearNames,
        academicYear,
        academicYears,
        degreeProgram,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  initSpecificView = async (degreeProgramId, academicYear) => {
    this.setState({ isLoading: true });
    try {
      const degreeProgram = await getDegreeProgramForAcademicYear(
        degreeProgramId,
        academicYear
      );

      this.setState({
        academicYear,
        degreeProgram,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
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

    const { degreeProgramId, academicYearCode } = this.props;

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
        {!degreeProgramId
        && (
          <LoaderDropdown
            id={DEGREE_PROGRAMS_ID}
            value={degreeProgram.id}
            onChange={this.onDegreeProgramsChange}
            options={degreeProgramOptions}
            label={degreeProgramsLabel}
            isLoading={isLoading}
          />
        )
        }
        {(!degreeProgramId || !academicYearCode)
          && (
          <LoaderDropdown
            id={ACADEMIC_YEARS_ID}
            value={academicYear}
            onChange={this.onAcademicYearsChange}
            options={academicYearOptions}
            label={academicYearsLabel}
            isLoading={isLoading}
          />
          )
        }
        <ToggleSelect
          onChange={this.onShowAll}
          checked={showAll}
          label={showAllLabel}
        />
      </div>
    );
  }

  renderContent = () => {
    const {
      degreeProgram, academicYear, showAll, errorMessage, isLoading
    } = this.state;

    const hasContent = !isLoading && academicYear && degreeProgram.name;

    return (
      <div className={styles.contentContainer}>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} /> }
        {hasContent
          ? (
            <DegreeProgram
              key={degreeProgram.id}
              degreeProgram={degreeProgram}
              academicYear={academicYear}
              showAll={showAll}
              handleError={this.handleError}
              showContent={!errorMessage}
            />
          )
          : <div className={styles.noContent}>Ei näytettävää koulutusohjelmaa</div>
        }
      </div>
    );
  }

  render() {
    const { header } = this.props;
    return (
      <div>
        <main className={styles.mainContainer}>
          {header && <h2>{header}</h2>}
          { this.renderSelections()}
          { this.renderContent()}
        </main>
      </div>
    );
  }
}

export default Main;

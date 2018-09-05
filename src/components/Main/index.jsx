import React, { Component } from 'react';
import { string, oneOf } from 'prop-types';
import {
  getDegreePrograms,
  getAcademicYearNames,
  getAcademicYearsForDegreeProgram,
  getDegreeProgramForAcademicYear,
  fetchDegreeProgramByCode
} from '../../api';

import DegreeProgram from '../DegreeProgram';
import LoaderDropdown from '../LoaderDropdown';

import styles from './main.css';
import ToggleSelect from '../ToggleSelect';
import { availableLanguages, CURRENT_ACADEMIC_YEAR_CODE } from '../../constants';
import ErrorMessage from '../ErrorMessage';
import Loader from '../Loader';

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
    this.setState({ isLoading: true });
    await this.initAcademicYears(academicYearCode);
    if (degreeProgramId && academicYearCode) {
      await this.initSpecificView(degreeProgramId);
    } else if (degreeProgramId) {
      await this.initAcademicYearsForDegreeProgram(degreeProgramId);
    } else {
      await this.initAllSelects();
    }
    this.setState({ isLoading: false });
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
    const { academicYear: oldSelection, defaultAcademicYearCode } = this.state;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    return isOldSelectionValid ? oldSelection : defaultAcademicYearCode;
  }

  initAcademicYears = async (academicYearCode) => {
    const academicYearNames = await getAcademicYearNames();

    const hasValidAcademicYear = academicYearCode
      && academicYearCode !== CURRENT_ACADEMIC_YEAR_CODE;

    const getCurrentAcademicYear = () => {
      const dateNow = new Date();
      const currentMonth = dateNow.getMonth();
      const zeroBasedAugust = 7;
      const isMonthBeforeAugust = currentMonth < zeroBasedAugust;
      if (isMonthBeforeAugust) {
        dateNow.setFullYear(dateNow.getFullYear() - 1);
      }
      const currentAcademicYear = dateNow.getFullYear();
      const isCurrentAcademicYear = ay => academicYearNames[ay].startsWith(currentAcademicYear);
      return Object.keys(academicYearNames).find(isCurrentAcademicYear);
    };

    const defaultAcademicYearCode = hasValidAcademicYear
      ? academicYearCode
      : getCurrentAcademicYear();

    this.setState({ academicYearNames, defaultAcademicYearCode });
  }

  handleError = (error) => {
    this.setState({ errorMessage: error.message, isLoading: false });
  }

  initAllSelects = async () => {
    try {
      const degreeProgramsResponse = await getDegreePrograms();

      const degreePrograms = degreeProgramsResponse.educations;
      const degreeProgram = degreePrograms[0];

      const academicYears = await getAcademicYearsForDegreeProgram(degreeProgram.id);
      const academicYear = this.getAcademicYear(academicYears);

      this.setState({
        degreePrograms,
        degreeProgram,
        academicYear,
        academicYears
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  initAcademicYearsForDegreeProgram = async (degreeProgramId) => {
    try {
      const academicYears = await getAcademicYearsForDegreeProgram(degreeProgramId);

      const academicYear = this.getAcademicYear(academicYears);
      const degreeProgram = await fetchDegreeProgramByCode(degreeProgramId, academicYear);

      this.setState({
        academicYear,
        academicYears,
        degreeProgram
      });
      this.handleError({
        message: 'Embedding Eduviewer with only degree-program-id attribute without academic-year attribute is not suppoted'
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  initSpecificView = async (degreeProgramId) => {
    const { defaultAcademicYearCode } = this.state;
    try {
      const degreeProgram = await fetchDegreeProgramByCode(
        degreeProgramId,
        defaultAcademicYearCode
      );

      this.setState({
        academicYear: defaultAcademicYearCode,
        degreeProgram
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
          ? (
            <LoaderDropdown
              id={ACADEMIC_YEARS_ID}
              value={academicYear}
              onChange={this.onAcademicYearsChange}
              options={academicYearOptions}
              label={academicYearsLabel}
              isLoading={isLoading}
            />
          )
          : (
            <div className={styles.academicYearContainer}>
              <div className={styles.academicYearLabel}>
                {'Lukuvuosi '}
                <span className={styles.academicYearText}>
                  {academicYearNames[academicYear]}
                </span>
              </div>
            </div>
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

    if (isLoading) {
      return <Loader />;
    }

    const hasContent = !isLoading && academicYear && degreeProgram.name;

    return (
      <div>
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

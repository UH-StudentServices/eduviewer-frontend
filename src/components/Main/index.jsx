import React, { Component } from 'react';
import { string, oneOf } from 'prop-types';
import {
  getDegreePrograms,
  getAcademicYearNames,
  getAcademicYearsByDegreeProgramCode,
  getDegreeProgram
} from '../../api';

import DegreeProgram from '../DegreeProgram';
import LoaderDropdown from '../LoaderDropdown';

import styles from './main.css';
import ToggleSelect from '../ToggleSelect';
import { availableLanguages, CURRENT_ACADEMIC_YEAR_CODE } from '../../constants';
import ErrorMessage from '../ErrorMessage';
import Loader from '../Loader';
import { getDegreeProgramCode } from '../../utils';

class Main extends Component {
  static propTypes = {
    academicYearCode: string.isRequired,
    degreeProgramCode: string.isRequired,
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
    const { degreeProgramCode, academicYearCode } = this.props;
    this.setState({ isLoading: true });
    await this.initAcademicYears(academicYearCode);
    if (degreeProgramCode && academicYearCode) {
      await this.initSpecificView(degreeProgramCode);
    } else if (degreeProgramCode) {
      await this.initAcademicYearsForDegreeProgram(degreeProgramCode);
    } else {
      await this.initAllSelects();
    }
    this.setState({ isLoading: false });
  }

   onDegreeProgramsChange = async (event) => {
     this.setState({ isLoading: true, errorMessage: '' });
     const degreeProgramCode = event.target.value;
     try {
       const academicYears = await getAcademicYearsByDegreeProgramCode(degreeProgramCode);
       const academicYear = this.getAcademicYear(academicYears);
       const degreeProgram = await getDegreeProgram(degreeProgramCode, academicYear);

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
    const { degreeProgram } = this.state;
    this.setState({ isLoading: true, errorMessage: '' });
    const academicYear = event.target.value;
    const degreeProgramCode = getDegreeProgramCode(degreeProgram);
    try {
      const newDegreeProgram = await getDegreeProgram(degreeProgramCode, academicYear);
      this.setState({
        degreeProgram: newDegreeProgram,
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
      const degreePrograms = await getDegreePrograms();

      const { degreeProgrammeCode } = degreePrograms[0];

      const academicYears = await getAcademicYearsByDegreeProgramCode(degreeProgrammeCode);
      const academicYear = this.getAcademicYear(academicYears);

      const degreeProgram = await getDegreeProgram(degreeProgrammeCode, academicYear);

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

  initAcademicYearsForDegreeProgram = async (degreeProgramCode) => {
    try {
      const academicYears = await getAcademicYearsByDegreeProgramCode(degreeProgramCode);

      const academicYear = this.getAcademicYear(academicYears);
      const degreeProgram = await getDegreeProgram(degreeProgramCode, academicYear);

      this.setState({
        academicYear,
        academicYears,
        degreeProgram
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  initSpecificView = async (degreeProgramCode) => {
    const { defaultAcademicYearCode } = this.state;
    try {
      const degreeProgram = await getDegreeProgram(
        degreeProgramCode,
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

    const { degreeProgramCode, academicYearCode } = this.props;

    const getOption = (id, value, text) => ({ id, value, text });

    const ACADEMIC_YEARS_ID = 'academicYear';
    const DEGREE_PROGRAMS_ID = 'degreePrograms';
    const degreeProgramOptions = degreePrograms
      .filter(dp => dp.degreeProgrammeCode)
      .map((dp, i) => getOption(i, dp.degreeProgrammeCode, dp.name.fi));
    const academicYearOptions = academicYears.map(ay => getOption(ay, ay, academicYearNames[ay]));

    const academicYearsLabel = 'Lukuvuodet';
    const degreeProgramsLabel = 'Tutkinto-ohjelmat';
    const showAllLabel = 'Näytä kaikki';

    return (
      <div className={styles.selectContainer}>
        {!degreeProgramCode
        && (
          <LoaderDropdown
            id={DEGREE_PROGRAMS_ID}
            value={getDegreeProgramCode(degreeProgram)}
            onChange={this.onDegreeProgramsChange}
            options={degreeProgramOptions}
            label={degreeProgramsLabel}
            isLoading={isLoading}
          />
        )
        }
        {(!degreeProgramCode || !academicYearCode)
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

    const degreeProgramCode = getDegreeProgramCode(degreeProgram);

    const hasContent = !isLoading
      && academicYear
      && degreeProgram.name
      && degreeProgramCode;

    return (
      <div>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} /> }
        {hasContent
          ? (
            <DegreeProgram
              key={degreeProgramCode}
              degreeProgram={degreeProgram}
              showAll={showAll}
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

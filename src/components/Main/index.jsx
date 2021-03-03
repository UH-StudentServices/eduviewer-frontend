/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-frontend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-frontend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-frontend.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react';
import { func, string, oneOf } from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
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
import { availableLanguages, CURRENT_ACADEMIC_YEAR_CODE, NO_DEGREE_PROGRAM_CODE } from '../../constants';
import ErrorMessage from '../ErrorMessage';
import Loader from '../Loader';
import { getDegreeProgramCode, getLocalizedText } from '../../utils';
import { trackEvent, trackingCategories, trackPageView } from '../../tracking';

import translation from '../../i18n/translations.json';

class Main extends Component {
  constructor(props) {
    super(props);

    props.initialize({
      languages: Object.values(availableLanguages),
      translation,
      options: {
        renderToStaticMarkup,
        defaultLanguage: props.lang
      }
    });

    this.state = {
      degreePrograms: [],
      academicYears: [],
      academicYearNames: {},
      isLoading: false,
      degreeProgram: {},
      academicYear: '',
      showAll: false
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onDegreeProgramsChange = this.onDegreeProgramsChange.bind(this);
    this.onAcademicYearsChange = this.onAcademicYearsChange.bind(this);
    this.onShowAll = this.onShowAll.bind(this);
    this.getAcademicYear = this.getAcademicYear.bind(this);
    this.initAcademicYears = this.initAcademicYears.bind(this);
    this.initAllSelects = this.initAllSelects.bind(this);
    this.initAcademicYearsForDegreeProgram = this.initAcademicYearsForDegreeProgram.bind(this);
    this.initSpecificView = this.initSpecificView.bind(this);
    this.renderSelections = this.renderSelections.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.render = this.render.bind(this);
  }

  async componentDidMount() {
    const { degreeProgramCode, academicYearCode, lang } = this.props;
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

    const { academicYearNames, academicYear } = this.state;
    const trackingDegreeProgramCode = degreeProgramCode || NO_DEGREE_PROGRAM_CODE;
    trackPageView(trackingDegreeProgramCode, academicYearNames[academicYear], lang);
  }

  handleError(error) {
    this.setState({ errorMessage: error.message, isLoading: false });
  }

  async onDegreeProgramsChange(event) {
    this.setState({ isLoading: true, errorMessage: '' });
    const degreeProgramCode = event.target.value;
    try {
      const academicYears = await getAcademicYearsByDegreeProgramCode(degreeProgramCode);
      const academicYear = this.getAcademicYear(academicYears);
      const degreeProgram = await getDegreeProgram(degreeProgramCode, academicYear);

      trackEvent(trackingCategories.SELECT_DEGREE_PROGRAMME, degreeProgramCode);
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

  async onAcademicYearsChange(event) {
    const { degreeProgram } = this.state;
    this.setState({ isLoading: true, errorMessage: '' });
    const academicYear = event.target.value;
    const degreeProgramCode = getDegreeProgramCode(degreeProgram);
    try {
      const newDegreeProgram = await getDegreeProgram(degreeProgramCode, academicYear);
      const { academicYearNames } = this.state;
      trackEvent(trackingCategories.SELECT_ACADEMIC_YEAR, academicYearNames[academicYear]);
      this.setState({
        degreeProgram: newDegreeProgram,
        academicYear,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  onShowAll() {
    const { showAll } = this.state;
    const newShowAll = !showAll;
    trackEvent(trackingCategories.TOGGLE_SHOW_ALL, newShowAll);
    this.setState({ showAll: newShowAll });
  }

  getAcademicYear(academicYears) {
    const { academicYear: oldSelection, defaultAcademicYearCode } = this.state;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    const latestAcademicYear = academicYears.length
      ? academicYears[academicYears.length - 1] : defaultAcademicYearCode;
    return isOldSelectionValid ? oldSelection : latestAcademicYear;
  }

  async initAcademicYears(academicYearCode) {
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
      const isCurrentAcademicYear = (ay) => academicYearNames[ay].startsWith(currentAcademicYear);
      return Object.keys(academicYearNames).find(isCurrentAcademicYear);
    };

    const defaultAcademicYearCode = hasValidAcademicYear
      ? academicYearCode
      : getCurrentAcademicYear();

    this.setState({ academicYearNames, defaultAcademicYearCode });
  }

  async initAllSelects() {
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

  async initAcademicYearsForDegreeProgram(degreeProgramCode) {
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

  async initSpecificView(degreeProgramCode) {
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

  renderSelections() {
    const {
      degreeProgram,
      degreePrograms,
      academicYears,
      academicYearNames,
      academicYear,
      showAll,
      isLoading
    } = this.state;

    const {
      degreeProgramCode,
      academicYearCode,
      translate,
      lang
    } = this.props;

    const getOption = (id, value, text) => ({ id, value, text });

    const ACADEMIC_YEARS_ID = 'academicYear';
    const DEGREE_PROGRAMS_ID = 'degreePrograms';
    const degreeProgramOptions = degreePrograms
      .filter((dp) => dp.degreeProgrammeCode)
      .map((dp, i) => getOption(i, dp.degreeProgrammeCode, getLocalizedText(dp.name, lang)));
    const academicYearOptions = academicYears.map((ay) => getOption(ay, ay, academicYearNames[ay]));

    const academicYearsLabel = translate('academicYear');
    const degreeProgramsLabel = translate('degreePrograms');
    const showAllLabel = translate('showAll');

    return (
      <div className={styles.selectContainer}>
        {
          !degreeProgramCode
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
        {
          (!degreeProgramCode || !academicYearCode)
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
                  <Translate id="academicYear" />{' '}
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

  renderContent() {
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
        {
          hasContent
            ? (
              <DegreeProgram
                key={degreeProgramCode}
                degreeProgram={degreeProgram}
                showAll={showAll}
                showContent={!errorMessage}
              />
            )
            : <div className={styles.noContent}><Translate id="noDegreeProgramToShow" /></div>
        }
      </div>
    );
  }

  render() {
    const { header } = this.props;
    return (
      <div>
        <main className={styles.mainContainer}>
          {header && <h2 className={styles.mainHeader}>{header}</h2>}
          { this.renderSelections()}
          { this.renderContent()}
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  academicYearCode: string.isRequired,
  degreeProgramCode: string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  lang: oneOf(Object.values(availableLanguages)).isRequired,
  header: string.isRequired,
  initialize: func.isRequired,
  translate: func.isRequired
};

export default withLocalize(Main);

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
import {
  func,
  string,
  bool,
  oneOf
} from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  getEducations,
  getAcademicYearNames,
  getAcademicYearsByDegreeProgramCode,
  getEducationHierarchy
} from '../../api';

import DegreeProgram from '../DegreeProgram';
import LoaderDropdown from '../LoaderDropdown';

import styles from './main.css';
import ToggleSelect from '../ToggleSelect';
import {
  availableLanguages, NO_DEGREE_PROGRAM_CODE, NO_EDUCATION_HIERARCHY
} from '../../constants';
import ErrorMessage from '../ErrorMessage';
import Loader from '../Loader';
import { getDegreeProgramCode, getLocalizedText } from '../../utils';
import { trackEvent, trackingCategories, trackPageView } from '../../tracking';

import translation from '../../i18n/translations.json';

const fetchEducationHierarchy = async (degreeProgramCode, academicYear) => {
  if (academicYear) {
    return getEducationHierarchy(degreeProgramCode, academicYear);
  }
  return NO_EDUCATION_HIERARCHY;
};

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
      educations: [],
      academicYears: [],
      academicYearNames: {},
      isLoading: false,
      educationHierarchy: NO_EDUCATION_HIERARCHY,
      academicYear: '',
      showAll: false
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onEducationChange = this.onEducationChange.bind(this);
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

  async componentWillMount() {
    // Insert Cookiebot to header if it is not there already (from embed context),
    // so that it is present before Google Analytics
    const { lang } = this.props;
    if (!document.getElementById('Cookiebot')) {
      const cbot = document.createElement('script');
      cbot.setAttribute('id', 'Cookiebot');
      cbot.setAttribute('src', 'https://consent.cookiebot.com/uc.js');
      cbot.setAttribute('data-cbid', 'e422c4ee-0ebe-400c-b22b-9c74b6faeac3');
      cbot.setAttribute('data-blockingmode', 'auto');
      cbot.setAttribute('type', 'text/javascript');
      cbot.setAttribute('data-culture', lang);
      document.head.insertBefore(cbot, document.head.getElementsByTagName('meta')[0]);
    }
  }

  async componentDidMount() {
    const {
      degreeProgramCode,
      academicYearCode,
      lang,
      onlySelectedAcademicYear
    } = this.props;
    this.setState({ isLoading: true });
    await this.initAcademicYears(academicYearCode);

    if (degreeProgramCode && onlySelectedAcademicYear) {
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

  async onEducationChange(event) {
    this.setState({ isLoading: true, errorMessage: '' });
    const degreeProgramCode = event.target.value;
    try {
      const academicYears = await getAcademicYearsByDegreeProgramCode(degreeProgramCode);
      const academicYear = this.getAcademicYear(academicYears);
      const educationHierarchy = await fetchEducationHierarchy(degreeProgramCode, academicYear);

      trackEvent(trackingCategories.SELECT_EDUCATION_HIERARCHY, degreeProgramCode);
      this.setState({
        educationHierarchy,
        academicYear,
        academicYears,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async onAcademicYearsChange(event) {
    const { educationHierarchy } = this.state;
    this.setState({ isLoading: true, errorMessage: '' });
    const academicYear = event.target.value;
    const degreeProgramCode = getDegreeProgramCode(educationHierarchy);
    try {
      const newEducationHierarchy = await getEducationHierarchy(degreeProgramCode, academicYear);
      const { academicYearNames } = this.state;
      trackEvent(trackingCategories.SELECT_ACADEMIC_YEAR, academicYearNames[academicYear]);
      this.setState({
        educationHierarchy: newEducationHierarchy,
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
    const { academicYear, defaultAcademicYearCode } = this.state;
    const oldSelection = academicYear || defaultAcademicYearCode;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    const latestAcademicYear = academicYears.length
      ? academicYears[academicYears.length - 1] : null;
    return isOldSelectionValid ? oldSelection : latestAcademicYear;
  }

  async initAcademicYears(defaultAcademicYearCode) {
    const academicYearNames = await getAcademicYearNames();
    this.setState({ academicYearNames, defaultAcademicYearCode });
  }

  async initAllSelects() {
    try {
      const educations = await getEducations();

      const { degreeProgrammeCode } = educations[0];

      const academicYears = await getAcademicYearsByDegreeProgramCode(degreeProgrammeCode);
      const academicYear = this.getAcademicYear(academicYears);
      const educationHierarchy = await fetchEducationHierarchy(degreeProgrammeCode, academicYear);

      this.setState({
        educations,
        educationHierarchy,
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
      const educationHierarchy = await fetchEducationHierarchy(degreeProgramCode, academicYear);

      this.setState({
        academicYear,
        academicYears,
        educationHierarchy
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async initSpecificView(degreeProgramCode) {
    const { defaultAcademicYearCode } = this.state;
    try {
      const educationHierarchy = await getEducationHierarchy(
        degreeProgramCode,
        defaultAcademicYearCode
      );

      this.setState({
        academicYear: defaultAcademicYearCode,
        educationHierarchy
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  renderSelections() {
    const {
      educationHierarchy,
      educations,
      academicYears,
      academicYearNames,
      academicYear,
      showAll,
      isLoading
    } = this.state;

    const {
      degreeProgramCode,
      translate,
      lang,
      onlySelectedAcademicYear
    } = this.props;

    const getOption = (id, value, text) => ({ id, value, text });

    const ACADEMIC_YEARS_ID = 'academicYear';
    const EDUCATIONS_ID = 'educations';
    const educationOptions = educations
      .filter((ed) => ed.degreeProgrammeCode)
      .map((ed, i) => getOption(i, ed.degreeProgrammeCode, `${getLocalizedText(ed.name, lang)} [${ed.degreeProgrammeCode}]`));
    const academicYearOptions = academicYears.map((ay) => getOption(ay, ay, academicYearNames[ay]));

    const academicYearsLabel = translate('academicYear');
    const educationsLabel = translate('degreeProgrammes');
    const showAllLabel = translate('showAll');

    return (
      <div className={styles.selectContainer}>
        {
          !degreeProgramCode
            && (
              <LoaderDropdown
                id={EDUCATIONS_ID}
                value={getDegreeProgramCode(educationHierarchy)}
                onChange={this.onEducationChange}
                options={educationOptions}
                label={educationsLabel}
                isLoading={isLoading}
              />
            )
        }
        {
          (degreeProgramCode && onlySelectedAcademicYear)
            ? (
              <div className={styles.academicYearContainer}>
                <div className={styles.academicYearLabel}>
                  <Translate id="academicYear" />{' '}
                  <span className={styles.academicYearText}>
                    {academicYearNames[academicYear]}
                  </span>
                </div>
              </div>
            )
            : (
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

  renderContent() {
    const {
      educationHierarchy, academicYear, showAll, errorMessage, isLoading
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    const degreeProgramCode = getDegreeProgramCode(educationHierarchy);

    const hasContent = !isLoading
      && academicYear
      && educationHierarchy.name
      && degreeProgramCode;

    return (
      <div>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} /> }
        {
          hasContent
            ? (
              <DegreeProgram
                key={degreeProgramCode}
                degreeProgram={educationHierarchy.dataNode}
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
  onlySelectedAcademicYear: bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  lang: oneOf(Object.values(availableLanguages)).isRequired,
  header: string.isRequired,
  initialize: func.isRequired,
  translate: func.isRequired
};

export default withLocalize(Main);

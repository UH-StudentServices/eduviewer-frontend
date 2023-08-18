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
  getAcademicYearsByCode,
  getModuleHierarchy
} from '../../api';

import RootModule from '../RootModule';
import LoaderDropdown from '../LoaderDropdown';

import styles from './main.css';
import ToggleSelect from '../ToggleSelect';
import {
  availableLanguages, NO_DEGREE_PROGRAM_CODE, NO_MODULE_HIERARCHY
} from '../../constants';
import ErrorMessage from '../ErrorMessage';
import Loader from '../Loader';
import { getCode, getLocalizedText } from '../../utils';
import { trackEvent, trackingCategories, trackPageView } from '../../tracking';

import translation from '../../i18n/translations.json';

const fetchModuleHierarchy = async (code, academicYear) => {
  if (academicYear) {
    return getModuleHierarchy(code, academicYear);
  }
  return NO_MODULE_HIERARCHY;
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
      moduleHierarchy: NO_MODULE_HIERARCHY,
      academicYear: '',
      showAll: false
    };

    /* eslint-disable camelcase */
    this.UNSAFE_componentWillMount = this.UNSAFE_componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onEducationChange = this.onEducationChange.bind(this);
    this.onAcademicYearsChange = this.onAcademicYearsChange.bind(this);
    this.changeAcademicYear = this.changeAcademicYear.bind(this);
    this.onShowAll = this.onShowAll.bind(this);
    this.getAcademicYear = this.getAcademicYear.bind(this);
    this.initAcademicYears = this.initAcademicYears.bind(this);
    this.initAllSelects = this.initAllSelects.bind(this);
    this.initAcademicYearsForModule = this.initAcademicYearsForModule.bind(this);
    this.initSpecificView = this.initSpecificView.bind(this);
    this.renderSelections = this.renderSelections.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.render = this.render.bind(this);
  }

  // TODO deprecated: "Move code with side effects to componentDidMount,
  // and set initial state in the constructor."
  async UNSAFE_componentWillMount() {
    // Insert Cookiebot to header if it is not there already (from embed context)
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
      code,
      academicYearCode,
      lang,
      onlySelectedAcademicYear
    } = this.props;
    this.setState({ isLoading: true });
    await this.initAcademicYears(academicYearCode);

    if (code && onlySelectedAcademicYear) {
      await this.initSpecificView(code);
    } else if (code) {
      await this.initAcademicYearsForModule(code);
    } else {
      await this.initAllSelects();
    }
    this.setState({ isLoading: false });

    const { academicYearNames, academicYear } = this.state;
    const trackingCode = code || NO_DEGREE_PROGRAM_CODE;
    trackPageView(trackingCode, academicYearNames[academicYear], lang);
  }

  async componentDidUpdate() {
    const { academicYearCode } = this.props;
    const { defaultAcademicYearCode } = this.state;
    if (academicYearCode !== defaultAcademicYearCode) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ defaultAcademicYearCode: academicYearCode, isLoading: true });
      this.changeAcademicYear(academicYearCode);
    }
  }

  handleError(error) {
    this.setState({ errorMessage: error.message, isLoading: false });
  }

  async onEducationChange(event) {
    this.setState({ isLoading: true, errorMessage: '' });
    const code = event.target.value;
    try {
      const academicYears = await getAcademicYearsByCode(code);
      const academicYear = this.getAcademicYear(academicYears);
      const moduleHierarchy = await fetchModuleHierarchy(code, academicYear);

      trackEvent(trackingCategories.SELECT_EDUCATION_HIERARCHY, code);
      this.setState({
        moduleHierarchy,
        academicYear,
        academicYears,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async onAcademicYearsChange(event) {
    return this.changeAcademicYear(event.target.value);
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

  async changeAcademicYear(academicYear) {
    const { moduleHierarchy } = this.state;
    this.setState({ isLoading: true, errorMessage: '' });
    const code = getCode(moduleHierarchy);
    try {
      const newModuleHierarchy = await getModuleHierarchy(code, academicYear);
      const { academicYearNames } = this.state;
      trackEvent(trackingCategories.SELECT_ACADEMIC_YEAR, academicYearNames[academicYear]);
      this.setState({
        moduleHierarchy: newModuleHierarchy,
        academicYear,
        isLoading: false
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async initAcademicYears(defaultAcademicYearCode) {
    const academicYearNames = await getAcademicYearNames();
    this.setState({ academicYearNames, defaultAcademicYearCode });
  }

  async initAllSelects() {
    try {
      const educations = await getEducations();

      const { degreeProgrammeCode: code } = educations[0];

      const academicYears = await getAcademicYearsByCode(code);
      const academicYear = this.getAcademicYear(academicYears);
      const moduleHierarchy = await fetchModuleHierarchy(code, academicYear);

      this.setState({
        educations,
        moduleHierarchy,
        academicYear,
        academicYears
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async initAcademicYearsForModule(code) {
    try {
      const academicYears = await getAcademicYearsByCode(code);

      const academicYear = this.getAcademicYear(academicYears);
      const moduleHierarchy = await fetchModuleHierarchy(code, academicYear);

      this.setState({
        academicYear,
        academicYears,
        moduleHierarchy
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async initSpecificView(code) {
    const { defaultAcademicYearCode } = this.state;
    try {
      const moduleHierarchy = await getModuleHierarchy(
        code,
        defaultAcademicYearCode
      );

      this.setState({
        academicYear: defaultAcademicYearCode,
        moduleHierarchy
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  renderSelections() {
    const {
      moduleHierarchy,
      educations,
      academicYears,
      academicYearNames,
      academicYear,
      showAll,
      isLoading
    } = this.state;

    const {
      code,
      translate,
      lang,
      hideSelections,
      onlySelectedAcademicYear
    } = this.props;

    if (hideSelections) {
      return null;
    }
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
          !code
            && (
              <LoaderDropdown
                id={EDUCATIONS_ID}
                value={getCode(moduleHierarchy)}
                onChange={this.onEducationChange}
                options={educationOptions}
                label={educationsLabel}
                isLoading={isLoading}
              />
            )
        }
        {
          (code && onlySelectedAcademicYear)
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
      moduleHierarchy, academicYear, showAll, errorMessage, isLoading
    } = this.state;

    const {
      hideAccordion,
      internalCourseLink
    } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    const moduleCode = getCode(moduleHierarchy);

    const hasContent = !isLoading
      && academicYear
      && moduleHierarchy.name
      && moduleCode;

    const getModule = (code, hierarchy, show, errorMsg) => {
      const module = hierarchy.type === 'Education' ? moduleHierarchy.dataNode : moduleHierarchy;
      return (
        <RootModule
          key={code}
          module={module}
          showAll={show}
          showContent={!errorMsg}
          hideAccordion={hideAccordion}
          internalCourseLink={internalCourseLink}
          academicYear={academicYear}
        />
      );
    };
    return (
      <div>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} /> }
        {
          hasContent
            ? getModule(moduleCode, moduleHierarchy, showAll, errorMessage)
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
  code: string.isRequired,
  hideSelections: bool.isRequired,
  hideAccordion: bool.isRequired,
  internalCourseLink: bool.isRequired,
  onlySelectedAcademicYear: bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  lang: oneOf(Object.values(availableLanguages)).isRequired,
  header: string.isRequired,
  initialize: func.isRequired,
  translate: func.isRequired
};

export default withLocalize(Main);

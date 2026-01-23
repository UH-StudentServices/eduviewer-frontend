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

import React, { useEffect, useState } from 'react';
import {
  string,
  bool,
  oneOf
} from 'prop-types';

import {
  getEducations,
  getAcademicYearNames,
  getAcademicYearsByCode,
  getModuleHierarchy
} from '../../api';
import RootModule from '../RootModule';
import styles from './main.css';
import ToggleAllButton from '../ToggleAllButton';
import {
  availableLanguages, NO_DEGREE_PROGRAM_CODE, NO_MODULE_HIERARCHY,
  rootLevel
} from '../../constants';
import ErrorMessage from '../ErrorMessage';
import { getCode, getLocalizedText } from '../../utils';
import { trackEvent, trackingCategories, trackPageView } from '../../tracking';
import useTranslation from '../../hooks/useTranslation';

const fetchModuleHierarchy = async (code, academicYear) => {
  if (academicYear) {
    return getModuleHierarchy(code, academicYear);
  }
  return NO_MODULE_HIERARCHY;
};

const EDUCATION_VALUE_SEPARATOR = '|';

const Main = ({
  code,
  academicYearCode,
  lang,
  onlySelectedAcademicYear,
  hideSelections,
  hideSelectedAcademicYear,
  skipTitle,
  internalCourseLink,
  header
}) => {
  const [educations, setEducations] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [academicYearNames, setAcademicYearNames] = useState({});
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [moduleHierarchy, setModuleHierarchy] = useState(NO_MODULE_HIERARCHY);
  const [moduleAndYear, setModuleAndYear] = useState({ code, academicYear: academicYearCode });
  const [errorMessage, setErrorMessage] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let cbot;
    if (!document.getElementById('Cookiebot') && !cbot) {
      cbot = document.createElement('script');
      cbot.setAttribute('id', 'Cookiebot');
      cbot.setAttribute('src', 'https://consent.cookiebot.com/uc.js');
      cbot.setAttribute('data-cbid', 'e422c4ee-0ebe-400c-b22b-9c74b6faeac3');
      cbot.setAttribute('data-blockingmode', 'auto');
      cbot.setAttribute('type', 'text/javascript');
      cbot.setAttribute('data-culture', lang);
      document.head.insertBefore(cbot, document.head.getElementsByTagName('meta')[0]);
    }
    return () => {
      if (cbot) {
        cbot.remove();
      }
    };
  }, [lang]);

  useEffect(() => {
    if (moduleAndYear?.code && moduleAndYear?.academicYear) {
      (async () => {
        setHierarchyLoading(true);
        setModuleHierarchy(
          (await fetchModuleHierarchy(moduleAndYear.code, moduleAndYear.academicYear))
        );
        setHierarchyLoading(false);
      })();
    } else {
      setModuleHierarchy(NO_MODULE_HIERARCHY);
    }
  }, [moduleAndYear.code, moduleAndYear.academicYear]);

  const handleError = (error) => {
    setErrorMessage(error.message);
    setHierarchyLoading(false);
    setOptionsLoading(false);
  };

  const getAcademicYear = (newAcademicYears) => {
    if (newAcademicYears.includes(moduleAndYear.academicYear)) {
      return moduleAndYear.academicYear;
    }
    return newAcademicYears.length ? newAcademicYears.at(-1) : null;
  };

  const initAcademicYearNames = async () => {
    setAcademicYearNames(await getAcademicYearNames());
  };

  const initEducations = async () => {
    setEducations(await getEducations());
  };

  const initAcademicYearsForPropModule = async () => {
    try {
      const newAcademicYears = await getAcademicYearsByCode(code);
      const newAcademicYear = getAcademicYear(newAcademicYears);
      setModuleAndYear({ code: moduleAndYear.code, academicYear: newAcademicYear });
      setAcademicYears(newAcademicYears);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    async function initWhatNecessary() {
      if (!onlySelectedAcademicYear && !hideSelections && !code) {
        setOptionsLoading(true);
        await initAcademicYearNames();
        await initEducations();
        setOptionsLoading(false);
      } else if (code) {
        setOptionsLoading(true);
        await initAcademicYearNames();
        await initAcademicYearsForPropModule();
        setOptionsLoading(false);
      }
      const trackingCode = code || NO_DEGREE_PROGRAM_CODE;
      trackPageView(trackingCode, academicYearNames[moduleAndYear.academicYear], lang);
    }
    initWhatNecessary();
  }, [academicYearCode, code]);

  const changeAcademicYear = async (newAcademicYear) => {
    try {
      trackEvent(trackingCategories.SELECT_ACADEMIC_YEAR, academicYearNames[newAcademicYear]);
      setModuleAndYear({ code: moduleAndYear.code, academicYear: newAcademicYear });
    } catch (error) {
      handleError(error);
    }
  };

  // change in prop academicYearCode instigates change in state academicYear
  useEffect(() => {
    if ((onlySelectedAcademicYear || hideSelections)
      && academicYearCode !== moduleAndYear.academicYear) {
      changeAcademicYear(academicYearCode);
    }
  }, [academicYearCode, moduleAndYear.academicYear]);

  const onShowAll = () => {
    trackEvent(trackingCategories.TOGGLE_SHOW_ALL, !showAll);
    setShowAll(!showAll);
  };

  const onEducationChange = async (value) => {
    if (!value) {
      // Use initial state
      setModuleAndYear({ code, academicYear: academicYearCode });
      return;
    }

    setOptionsLoading(true);
    setErrorMessage('');

    try {
      const newCode = value.split(EDUCATION_VALUE_SEPARATOR).at(1);
      trackEvent(trackingCategories.SELECT_EDUCATION_HIERARCHY, value);
      const newAcademicYears = await getAcademicYearsByCode(newCode);
      const newAcademicYear = getAcademicYear(newAcademicYears);
      setAcademicYears(newAcademicYears);
      setModuleAndYear({ code: newCode, academicYear: newAcademicYear });
    } catch (error) {
      handleError(error);
    }
    setOptionsLoading(false);
  };

  const renderSelections = () => {
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

    const academicYearsLabel = t('academicYear');
    const educationsLabel = t('degreeProgrammes');
    const moduleCode = getCode(moduleHierarchy);

    return (
      <div className={styles.controlsContainer}>
        {
          !code
            && (
              <eduviewer-ds-combobox
                dsId={EDUCATIONS_ID}
                dsLabel={educationsLabel}
                dsValue={moduleCode}
                dsLoading={optionsLoading}
                dsOptionsError={!optionsLoading && educationOptions.length === 0}
                ondsChange={(event) => onEducationChange(event.detail)}
              >
                {educationOptions.map((option) => (
                  <eduviewer-ds-option key={option.id} dsValue={`${option.id}${EDUCATION_VALUE_SEPARATOR}${option.value}`}>{option.text}</eduviewer-ds-option>
                ))}
              </eduviewer-ds-combobox>
            )
        }
        {
          (code && onlySelectedAcademicYear && !hideSelectedAcademicYear) && (
            <div className="ds-mt-sm">
              <div className="ds-heading-lg">
                {t('academicYear')}{' '}
                <span>
                  {academicYearNames[moduleAndYear.academicYear]}
                </span>
              </div>
            </div>
          )
        }
        {
          (!onlySelectedAcademicYear) && (
            <eduviewer-ds-select
              dsId={ACADEMIC_YEARS_ID}
              dsLabel={academicYearsLabel}
              dsValue={moduleCode ? moduleAndYear.academicYear : ''}
              dsLoading={optionsLoading}
              dsOptionsError={!optionsLoading && academicYearOptions.length === 0}
              dsFullWidth
              dsClearable={false}
              dsDisabled={!moduleCode}
              ondsChange={(event) => changeAcademicYear(event.detail)}
            >
              {academicYearOptions.map((option) => (
                <eduviewer-ds-option
                  key={option.id}
                  dsValue={option.value}
                >
                  {option.text}
                </eduviewer-ds-option>
              ))}
            </eduviewer-ds-select>
          )
        }
        <ToggleAllButton
          onChange={onShowAll}
          showAll={showAll}
        />
      </div>
    );
  };

  const renderRootModule = () => {
    const module = moduleHierarchy.type === 'Education' ? moduleHierarchy.dataNode : moduleHierarchy;

    return (
      <RootModule
        key={moduleAndYear.code}
        module={module}
        showAll={showAll}
        showContent={!errorMessage}
        skipTitle={skipTitle}
        internalCourseLink={internalCourseLink}
        academicYear={moduleAndYear.academicYear}
        rootLevel={rootLevel}
      />
    );
  };

  const renderContent = () => {
    if (hierarchyLoading) {
      return <eduviewer-ds-spinner dsSize="2xLarge" dsText={t('loadingStructure')} />;
    }

    const hasContent = !hierarchyLoading
      && moduleAndYear.academicYear
      && moduleHierarchy.name
      && moduleAndYear.code;

    return (
      <div className={styles.content}>
        {(errorMessage) && <ErrorMessage hlevel={rootLevel + 1} errorMessage={errorMessage} /> }
        {
          hasContent
            ? renderRootModule()
            : <div className="ds-mb-xs ds-ml-xxs ds-bodytext-lg">{t('noDegreeProgramToShow')}</div>
        }
      </div>
    );
  };

  return (
    <div>
      <main className={styles.mainContainer}>
        { header && <h2 className={`${styles.mainHeader} ds-heading-lg`}>{header}</h2> }
        { renderSelections() }
        { renderContent() }
      </main>
    </div>
  );
};

Main.propTypes = {
  academicYearCode: string.isRequired,
  code: string.isRequired,
  hideSelections: bool.isRequired,
  skipTitle: bool.isRequired,
  internalCourseLink: bool.isRequired,
  onlySelectedAcademicYear: bool.isRequired,
  hideSelectedAcademicYear: bool.isRequired,
  lang: oneOf(Object.values(availableLanguages)).isRequired,
  header: string.isRequired
};

export default Main;

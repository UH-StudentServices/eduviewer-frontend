import ReactGA from 'react-ga';
import { TRACKING_ID } from '../../config';

export const TRACKER_NAME = 'Eduviewer';

export const CATEGORIES = {
  SELECT_DEGREE_PROGRAMME: 'SELECT_DEGREE_PROGRAMME',
  SELECT_ACADEMIC_YEAR: 'SELECT_ACADEMIC_YEAR',
  TOGGLE_SHOW_ALL: 'TOGGLE_SHOW_ALL'

};

export const TEST_TRACKING_ID = 'test';

export const initializeTracker = () => {
  const testMode = TRACKING_ID === undefined;

  ReactGA.initialize(testMode ? TEST_TRACKING_ID : TRACKING_ID, {
    gaOptions: {
      name: TRACKER_NAME
    },
    debug: testMode,
    testMode
  });

  ReactGA.ga(`${TRACKER_NAME}.set`, 'anonymizeIp', true);
};

export const trackPageView = (degreeProgramCode, academicYearName, lang) => {
  const host = window.location.hostname;
  ReactGA.ga(`${TRACKER_NAME}.send`, 'pageview', { page: `/${degreeProgramCode}/${academicYearName}/${lang}/${host}` });
};

export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.ga(`${TRACKER_NAME}.send`, 'event', category, action, label, value);
};

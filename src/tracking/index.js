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

import ReactGA from 'react-ga';
import { TRACKING_ID } from '../config';

export const TRACKER_NAME = 'Eduviewer';

export const trackingCategories = {
  SELECT_EDUCATION_HIERARCHY: 'SELECT_EDUCATION_HIERARCHY',
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

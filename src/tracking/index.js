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

import { isNonProd } from '../config';

export const trackingCategories = {
  SELECT_EDUCATION_HIERARCHY: 'EDUVIEWER_SELECT_EDUCATION_HIERARCHY',
  SELECT_ACADEMIC_YEAR: 'EDUVIEWER_SELECT_ACADEMIC_YEAR',
  TOGGLE_SHOW_ALL: 'EDUVIEWER_TOGGLE_SHOW_ALL',
  PAGE_VIEW: 'EDUVIEWER_PAGE_VIEW',
  FOLLOW_LINK: 'EDUVIEWER_FOLLOW_LINK'
};

const loadMatomoTagManagerScript = () => {
  /* eslint-disable */
  var _mtm = window._mtm = window._mtm || [];
  _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://matomo.it.helsinki.fi/matomo/js/container_NMx6LTvF.js'; s.parentNode.insertBefore(g,s);
  /* eslint-enable */
};

export const initializeTracker = () => {
  // eslint-disable-next-line no-underscore-dangle
  if (!window._mtm && !isNonProd()) {
    loadMatomoTagManagerScript();
  }
};

export const trackEvent = (category, action, label = null) => {
  /* eslint-disable no-underscore-dangle */
  if (window._mtm) {
    window._mtm.push({
      event: action, category, label
    });
  }
  /* eslint-enable no-underscore-dangle */
};

export const trackPageView = (moduleCode, academicYearName, lang) => {
  const host = window.location.hostname;
  trackEvent(trackingCategories.PAGE_VIEW, `/${moduleCode}/${academicYearName}/${lang}/${host}`);
};

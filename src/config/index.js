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

// This frontend app can be embedded on any site.
// So we use the PROD tracking id and style url,
// unless we know we are embedded on the QA or DEV server
// or are running locally.

// We use a different base url (and by extension eduviewer backend)
// in QA and elsewhere. When in QA, we use the QA eduviewer backend
// url, otherwise we use the production backend url.

const eduviewerHostnames = {
  LOCAL: 'localhost',
  QA: 'eduviewer-qa.it.helsinki.fi',
  PROD: 'eduviewer.it.helsinki.fi'
};

const eduviewerTrackingIds = {
  QA: 'UA-55852460-20',
  PROD: 'UA-55852460-21'
};

const eduviewerBaseUrls = {
  QA: 'https://od.helsinki.fi/eduviewer-qa',
  PROD: 'https://od.helsinki.fi/eduviewer'
};

const studiesCourseUnitBaseUrls = {
  QA: 'https://studies-qa.it.helsinki.fi/opintotarjonta/cu/',
  PROD: 'https://studies.helsinki.fi/opintotarjonta/cu/'
};

const studiesHostBaseUrls = {
  QA: 'https://studies-qa.it.helsinki.fi/',
  PROD: 'https://studies.helsinki.fi/'
};

const studiesCourseUnits = {
  fi: 'opintotarjonta/cu/',
  en: 'courses/cu/',
  sv: 'studieutbud/cu/'
};

const studiesStudyModules = {
  fi: 'opintotarjonta/sm/',
  en: 'courses/sm/',
  sv: 'studieutbud/sm/'
};

const studiesDegreeProgrammes = {
  fi: 'tutkinto-ohjelma/',
  en: 'degree-program/',
  sv: 'utbildningsprogram/'
};

const getTrackingId = () => {
  const { hostname } = window.location;
  if (hostname === eduviewerHostnames.LOCAL) {
    return null;
  }
  return hostname === eduviewerHostnames.QA ? eduviewerTrackingIds.QA : eduviewerTrackingIds.PROD;
};

const isNonProd = () => {
  const { hostname } = window.location;
  return hostname === eduviewerHostnames.LOCAL || hostname === eduviewerHostnames.QA;
};

const isQA = () => {
  const { hostname } = window.location;
  return hostname.toLowerCase().includes('-qa');
};

const getNonProdStyleUrl = () => {
  const { protocol, hostname, port } = window.location;
  let url = `${protocol}//${hostname}`;
  if (port) {
    url = `${url}:${port}`;
  }
  return url;
};

const getStyleUrl = () => (
  isNonProd()
    ? getNonProdStyleUrl()
    : `https://${eduviewerHostnames.PROD}`
);

const getBaseUrl = (urls) => (
  isQA()
    ? urls.QA
    : urls.PROD
);

module.exports = {
  DEFAULT_BASE_URL: getBaseUrl(eduviewerBaseUrls),
  DEFAULT_STYLE_URL: getStyleUrl(),
  TRACKING_ID: getTrackingId(),
  STUDIES_CU_PAGE_BASE_URL: getBaseUrl(studiesCourseUnitBaseUrls),
  STUDIES_HOST_BASE_URL: getBaseUrl(studiesHostBaseUrls),
  studiesCourseUnits,
  studiesStudyModules,
  studiesDegreeProgrammes
};

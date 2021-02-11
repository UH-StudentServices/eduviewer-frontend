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

const eduviewerHostnames = {
  LOCAL: 'localhost',
  DEV: 'eduviewer-dev.it.helsinki.fi',
  QA: 'eduviewer-qa.it.helsinki.fi',
  PROD: 'eduviewer.it.helsinki.fi'
};

const eduviewerTrackingIds = {
  QA: 'UA-55852460-20',
  PROD: 'UA-55852460-21'
};

const eduviewerBaseUrls = {
  QA: 'https://od.helsinki.fi/eduviewer-qa/',
  PROD: 'https://od.helsinki.fi/eduviewer'
};

const getTrackingId = () => {
  const { hostname } = window.location;
  if (hostname === eduviewerHostnames.DEV || hostname === eduviewerHostnames.LOCAL) {
    return null;
  }
  return hostname === eduviewerHostnames.QA ? eduviewerTrackingIds.QA : eduviewerTrackingIds.PROD;
};

const isNonProd = () => {
  const { hostname } = window.location;
  return hostname === eduviewerHostnames.LOCAL
    || hostname === eduviewerHostnames.DEV
    || hostname === eduviewerHostnames.QA;
};

const isQA = () => {
  const { hostname } = window.location;
  return hostname === eduviewerHostnames.QA;
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

const getBaseUrl = () => (
  isQA()
    ? eduviewerBaseUrls.QA
    : eduviewerBaseUrls.PROD
);

module.exports = {
  DEFAULT_BASE_URL: getBaseUrl(),
  DEFAULT_STYLE_URL: getStyleUrl(),
  TRACKING_ID: getTrackingId()
};

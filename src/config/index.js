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
// So we use the PROD tracking id, unless we know we are embedded on the QA or DEV server
// or are running locally.

const eduviewerHostNames = {
  LOCAL: 'localhost',
  DEV: 'eduviewer-dev.it.helsinki.fi',
  QA: 'eduviewer-qa.it.helsinki.fi',
  PROD: 'eduviewer.it.helsinki.fi'
};

const getTrackingId = () => {
  const host = window.location.hostname;
  if (host === eduviewerHostNames.DEV || host === eduviewerHostNames.LOCAL) {
    return null;
  }
  return host === eduviewerHostNames.QA ? 'UA-55852460-20' : 'UA-55852460-21';
};

const getNonProdStyleUrl = () => {
  const { protocol, hostname, port } = window.location;
  let url = `${protocol}//${hostname}`;
  if (port) {
    url = `${url}:${port}`;
  }
  return url;
};

const getStyleUrl = () => {
  const { hostname } = window.location;
  const isNonProd = hostname === eduviewerHostNames.LOCAL
    || hostname === eduviewerHostNames.DEV
    || hostname === eduviewerHostNames.QA;

  return isNonProd
    ? getNonProdStyleUrl()
    : `https://${eduviewerHostNames.PROD}`;
};

module.exports = {
  DEFAULT_BASE_URL: 'https://od.helsinki.fi/eduviewer',
  DEFAULT_STYLE_URL: getStyleUrl(),
  TRACKING_ID: getTrackingId()
};

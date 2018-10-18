/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-fronted is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-fronted is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-fronted.  If not, see <http://www.gnu.org/licenses/>.
 */

// This frontend app can be embedded on any site.
// So we use the PROD tracking id, unless we know we are embedded on the QA or DEV server
// or are running locally.
const getTrackingId = () => {
  const host = window.location.hostname;
  if (host === 'studies-dev.it.helsinki.fi' || host === 'localhost') {
    return null;
  }
  return host === 'studies-qa.it.helsinki.fi' ? 'UA-55852460-20' : 'UA-55852460-21';
};

module.exports = {
  DEFAULT_BASE_URL: 'https://od.helsinki.fi/eduviewer',
  TRACKING_ID: getTrackingId()
};

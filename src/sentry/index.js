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

import * as Sentry from '@sentry/react';
import { getEnv, SENTRY_ENABLED } from '../config';

Sentry.init({
  dsn: 'https://a584373fc1785925b8bb800b35d5d8fc@sentry.it.helsinki.fi/4',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  enabled: SENTRY_ENABLED,
  environment: getEnv(),
  sendDefaultPii: true
});

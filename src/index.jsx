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

import './sentry';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './register-components';
import { initializeTracker } from './tracking';
import App from './components/App';

import './styles';
import { calculateCurrentLV } from './utils';
import { getRoot, readEmbedConfig } from './utils/rootAttributes';
import ViewportContextProvider from './context/ViewportContext/ViewportContextProvider';
import LangContextProvider from './context/LangContext/LangContextProvider';
import InitializeLang from './components/InitializeLang';

// Attribution for DS component analytics, see
// https://designsystem.helsinki.fi/2de013a32/p/574a88-developers ("Enable analytics")
const DS_APP_NAME_ATTR_NAME = 'data-uhds-app-name';
const DS_APP_NAME = 'eduviewer';

let reactRoot = null;
const getOrCreateReactRoot = () => {
  const container = getRoot();
  if (!container) return null;

  if (!container.hasAttribute(DS_APP_NAME_ATTR_NAME)) {
    container.setAttribute(DS_APP_NAME_ATTR_NAME, DS_APP_NAME);
  }

  if (!reactRoot) {
    reactRoot = createRoot(container);
  }

  return reactRoot;
};

export const render = () => {
  const config = readEmbedConfig(getRoot());
  const academicYearCode = config.academicYearCode || calculateCurrentLV();

  const root = getOrCreateReactRoot();
  if (!root) return;

  root.render(
    <ViewportContextProvider>
      <LangContextProvider>
        <InitializeLang currentLang={config.lang}>
          <App
            code={config.code}
            academicYearCode={academicYearCode}
            hideSelections={config.hideSelections}
            skipTitle={config.skipTitle}
            internalCourseLink={config.internalCourseLink}
            onlySelectedAcademicYear={config.onlySelectedAcademicYear}
            hideSelectedAcademicYear={config.hideSelectedAcademicYear}
            lang={config.lang}
            header={config.header}
          />
        </InitializeLang>
      </LangContextProvider>
    </ViewportContextProvider>
  );
};

export const clear = () => {
  if (reactRoot) {
    // See: https://react.dev/reference/react-dom/client/createRoot#root-unmount
    reactRoot.unmount();
    reactRoot = null;
  }
};

const initializeApp = () => {
  initializeTracker();
  render();
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render();
  });
}

initializeApp();

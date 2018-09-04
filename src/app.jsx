import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Main from './components/Main';

import './styles';
import { availableLanguages, CURRENT_ACADEMIC_YEAR_CODE } from './constants';

const EDUVIEWER_ROOT_ID = 'eduviewer-root';
const LANGUAGE_ATTR_NAME = 'lang';
const DEGREE_PROGRAM_ATTR_NAME = 'degree-program-id';
const ACADEMIC_YEAR_ATTR_NAME = 'academic-year';
const HEADER_ATTR_NAME = 'header';

const getRoot = () => document.getElementById(EDUVIEWER_ROOT_ID);
const getRootAttribute = (attributeName) => {
  const root = getRoot();
  return root ? root.getAttribute(attributeName) : null;
};

const render = () => {
  const degreeProgramId = getRootAttribute(DEGREE_PROGRAM_ATTR_NAME) || '';
  const academicYearCode = getRootAttribute(ACADEMIC_YEAR_ATTR_NAME) || CURRENT_ACADEMIC_YEAR_CODE;
  const lang = getRootAttribute(LANGUAGE_ATTR_NAME) || availableLanguages.FI;
  const header = getRootAttribute(HEADER_ATTR_NAME) || '';
  ReactDOM.render(
    <AppContainer>
      <Main
        degreeProgramId={degreeProgramId}
        academicYearCode={academicYearCode}
        lang={lang}
        header={header}
      />
    </AppContainer>,
    getRoot(),
  );
};

const initializeApp = () => {
  render(Main);
};


if (module.hot) {
  module.hot.accept('./components/Main', () => {
    render();
  });
}

initializeApp();

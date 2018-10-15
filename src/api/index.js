import fetchIntercept from 'fetch-intercept';
import { DEFAULT_BASE_URL } from '../config';

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.url} ${response.status}`));
    }

    return response.json();
  }
});

const getJson = path => fetch(`${DEFAULT_BASE_URL}${path}`, {
  headers: {
    Accept: 'application/json'
  }
});

export const getDegreePrograms = () => getJson('/coded_educations');

export const getAcademicYearsByDegreeProgramCode = degreeProgramCode => getJson(`/lvs/${degreeProgramCode}`);

export const getAcademicYearNames = () => getJson('/lv_names');

export const getDegreeProgram = (code, academicYear = '') => getJson(`/tree_by_code/${code}?lv=${academicYear}`);

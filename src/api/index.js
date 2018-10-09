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

export const getDegreePrograms = () => getJson('/educations');

export const getAcademicYearsForDegreeProgram = degreeProgram => getJson(`/available_lvs/${degreeProgram}`);

export const getAcademicYearNames = () => getJson('/lv_names');

export const getDegreeProgramForAcademicYear = (degreeProgramId, academicYear) => getJson(`/by_id/${degreeProgramId}?lv=${academicYear}`);

export const fetchDegreeProgramByCode = (code, academicYear = '') => getJson(`/tree_by_code/${code}?lv=${academicYear}`);

export const fetchDegreeProgram = (academicYear = '', id) => getJson(`/tree/${id}/?lv=${academicYear}`);

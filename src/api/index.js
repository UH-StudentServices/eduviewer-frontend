import fetchIntercept from 'fetch-intercept';

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.url} ${response.status}`));
    }

    return response.json();
  }
});

const getJson = path => fetch(path, {
  headers: {
    Accept: 'application/json'
  }
});

export const getDegreePrograms = () => getJson('/api/educations');

export const getAcademicYearsForDegreeProgram = degreeProgram => getJson(`/api/available_lvs/${degreeProgram}`);

export const getAcademicYearNames = () => getJson('/api/lv_names');

export const getDegreeProgramForAcademicYear = (degreeProgramId, academicYear) => getJson(`/api/by_id/${degreeProgramId}?lv=${academicYear}`);

export const fetchDegreeProgramByCode = (code, academicYear = '') => getJson(`/api/tree_by_code/${code}?lv=${academicYear}`);

export const fetchDegreeProgram = (academicYear = '', id) => getJson(`/api/tree/${id}/?lv=${academicYear}`);

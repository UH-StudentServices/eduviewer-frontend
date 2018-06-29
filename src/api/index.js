import fetchIntercept from 'fetch-intercept';

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.url} ${response.status}`));
    }

    return response.json();
  }
});

const postForJson = (path, body) => fetch(path, {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body
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

export const fetchAllIdsJson = (academicYear = '', ids) => postForJson(`/api/all_ids?lv=${academicYear}`, JSON.stringify(ids));

export const fetchCourseNames = (academicYear = '', ids) => postForJson(`/api/cu/names?lv=${academicYear}`, JSON.stringify(ids));

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

export const fetchAllIdsJson = (lv = '', ids) => postForJson(`/api/all_ids?lv=${lv}`, JSON.stringify(ids));

export const fetchCourseNames = (lv = '', ids) => postForJson(`/api/cu/names?lv=${lv}`, JSON.stringify(ids));

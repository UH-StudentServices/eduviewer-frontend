const options = ids => ({
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ids)
});

export const fetchAllIdsJson = (lv = '', ids) => fetch(`/api/all_ids?lv=${lv}`, options(ids))
  .then(res => res.json());

export const fetchCourseNames = (lv = '', ids) => fetch(`/api/cu/names?lv=${lv}`, options(ids))
  .then(res => res.json());

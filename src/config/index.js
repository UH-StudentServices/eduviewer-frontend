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

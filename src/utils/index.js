export const creditsToString = (credits) => { // eslint-disable-line
  const { max, min } = credits;
  return (max === min || max === null) ? min : `${min}–${max}`;
};

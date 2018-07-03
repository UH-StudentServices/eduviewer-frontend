export const creditsToString = (credits) => {
  const { max, min } = credits;
  return (max === min || max === null) ? min : `${min}–${max}`;
};

export const getName = rule => (rule.dataNode ? rule.dataNode.name.fi : '');

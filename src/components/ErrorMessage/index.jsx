import React from 'react';
import { string } from 'prop-types';

const ErrorMessage = ({ errorMessage }) => (
  <div>{`Virhe tietojen hakemisessa: ${errorMessage}`}</div>
);

ErrorMessage.propTypes = {
  errorMessage: string.isRequired
};

export default ErrorMessage;

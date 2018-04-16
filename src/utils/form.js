import _ from 'lodash';
export const reduxFormProps = (props) =>
  _.pick(props, ['dirty', 'invalid', 'pristine', 'valid', 'submitSucceeded']);

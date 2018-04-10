import MethodsForm from '../../components/Payments/MethodsForm';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isValidEmail, isValidPhone } from '../../components/ReduxFormFields/helpers';

const validate = values => {
  const errors = {};
  const { firstName, lastName } = values;

  if (!firstName) {
    errors.firstName = 'First name is required.';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }

  return errors;
};

export default connect(
  state => ({
    initialValues: state.paymentsAppState.methods
  })
)(reduxForm({
  form: 'methodsForm',
  validate
})(MethodsForm));

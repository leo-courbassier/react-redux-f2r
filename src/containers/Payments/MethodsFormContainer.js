import MethodsForm from '../../components/Payments/MethodsForm';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isValidEmail, isValidPhone } from '../../components/ReduxFormFields/helpers';

const validate = values => {
  const errors = {};
  const { firstName, lastName, email, address, state, city, zip, dateOfBirth, ssn, phone } = values;

  if (!firstName) {
    errors.firstName = 'First name is required.';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address.';
  }

  if (!address) {
    errors.address = 'Address is required.';
  }

  if (!state) {
    errors.state = 'State is required.';
  }

  if (!city) {
    errors.city = 'City is required.';
  }

  if (!zip) {
    errors.zip = 'Zip Code is required.';
  }

  if (!dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required.';
  } else {
    let parts = dateOfBirth.split('-');
    for (let part of parts) {
      if (part === '' || part === 'undefined') {
        errors.dateOfBirth = 'Date of Birth is required.';
      }
    }
  }

  if (!ssn) {
    errors.ssn = 'Last 4 of SSN is required.';
  } else if (ssn.length !== 4 || isNaN(parseFloat(ssn))) {
    errors.ssn = 'Last 4 of SSN is invalid.';
  }

  if (!phone) {
    errors.phone = 'Phone Number is required.';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Phone Number is invalid.';
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

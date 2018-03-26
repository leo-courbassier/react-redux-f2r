import ProfileForm from '../../components/account/ProfileForm';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isValidEmail, isValidPhone } from '../../components/ReduxFormFields/helpers';

const validate = values => {
  const errors = { userDetails: {} };
  const { firstName, lastName, email, userDetails: {
    phoneNumber, alternativePhone, alternativeEmail
  } } = values;
  if (!firstName) {
    errors.firstName = 'First name is required.';
  }
  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email address';
  }
  if (phoneNumber && !isValidPhone(phoneNumber)) {
    errors.userDetails.phoneNumber = 'Phone number must be at least 10 digits.';
  }
  if (alternativePhone && !isValidPhone(alternativePhone)) {
    errors.userDetails.alternativePhone = 'Phone number must be at least 10 digits.';
  }
  if (alternativeEmail && !isValidEmail(alternativeEmail)) {
    errors.userDetails.alternativeEmail = 'Invalid email address';
  }
  return errors;
};

export default connect(
  state => ({
    initialValues: state.accountAppState.profile
  })
)(reduxForm({
  form: 'profileForm',
  validate
})(ProfileForm));

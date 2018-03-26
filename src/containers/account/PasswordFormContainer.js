import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PasswordForm from '../../components/account/PasswordForm';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';

const getPasswordErrorText = error => {
  let message = '';
  switch (error) {
    case 'length':
      message = 'Password must be 8 characters or more.';
    break;
    case 'upper':
      message = 'Password must contain an upper case letter.';
    break;
    case 'lower':
      message = 'Password must contain a lower case letter.';
    break;
    case 'number':
      message = 'Password must contain a number.';
    break;
  }
  return message;
};

const validate = values => {
  const errors = { userDetails: {} };
  const { oldPwd, newPwd, confirmNewPwd } = values;
  if (!oldPwd) {
    errors.oldPwd = 'Current Password is required.';
  }
  if (!newPwd) {
    errors.newPwd = 'New Password is required.';
  } else {
    const passwordScore = PasswordStrengthMeter.getPasswordScore(newPwd);
    const passwordErrors = PasswordStrengthMeter.getPasswordErrors(newPwd);
    if(passwordScore < 4) {
      errors.newPwd = getPasswordErrorText(passwordErrors[0]);
    }
  }

  if (!confirmNewPwd) {
    errors.confirmNewPwd = 'Confirming new Password is required';
  } else if (newPwd !== confirmNewPwd) {
    errors.confirmNewPwd = 'Passwords must match';
  }

  return errors;
};

const selector = formValueSelector('passwordForm');

export default connect(state => ({
  newPwd: selector(state, 'newPwd')
}))(reduxForm({
  form: 'passwordForm',
  validate
})(PasswordForm));

import React, {Component} from 'react';
import * as BS from 'react-bootstrap';
import { Field } from 'redux-form';
import { renderInput } from '../../ReduxFormFields';
import ButtonSpinner from '../../ButtonSpinner';
import PasswordStrengthMeter from '../../PasswordStrengthMeter';

export default class PasswordForm extends Component {
  handleChangePassword = (values) => {
    const { saveAccountLogin } = this.props;
    saveAccountLogin(values);
  }

  renderFooter() {
    const { submitting, errors, submitSucceeded } = this.props;
    return (
      <div className="account-submit">
        <div className="account-submit-message">
          {errors && (
            <BS.HelpBlock>
              <span className="text-danger">{errors}</span>
            </BS.HelpBlock>
          )}
          {submitSucceeded && (
            <BS.HelpBlock>
              <span className="text-success">Changes saved successfully.</span>
            </BS.HelpBlock>
          )}
        </div>
        <div className="account-submit-button">
          <BS.Button
            className="submit-button"
            bsStyle="success"
            disabled={submitting}
            type="submit">
            {submitting && <div className="spinner"><ButtonSpinner /></div>}
            <div className="text">Save</div>
          </BS.Button>
        </div>
      </div>
    );
  }

  render(){
    const { handleSubmit, newPwd } = this.props;
    return (
      <BS.Form onSubmit={handleSubmit(this.handleChangePassword)}>
        <div className="section">
          Change Password
        </div>

        <Field name="oldPwd"
          label="Current Password"
          placeholder="Current Password"
          type="password"
          component={renderInput} />

        <Field name="newPwd"
          label="New Password"
          placeholder="New Password"
          type="password"
          component={renderInput} />

        <Field name="confirmNewPwd"
          label="Confirm New Password"
          placeholder="Confirm New Password"
          type="password"
          component={renderInput} />

        <PasswordStrengthMeter
          password={newPwd} />

        {this.renderFooter()}
      </BS.Form>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';

import SubmitButton from './SubmitButton';
import PasswordStrengthMeter from './PasswordStrengthMeter';

class ResetForm extends Component {

  resetKeypress(e) {
    this.props.updateResetForm(this.props.appState, e.target.name, e.target.value);
  }
  resetHelpMessage() {
    let valid = this.props.appState.success;
    switch (valid) {
      case false:
        return 'reset Password Error: ' + this.props.appState.error;
      default:
        return '';
    }
  }

  getPasswordError(error) {
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
  }

  submit(e) {
    e.preventDefault();
    let help = ReactDOM.findDOMNode(this.refs.help);
    const passwordScore = this.refs.password.getScore(this.props.appState.password);
    const passwordErrors = this.refs.password.getErrors(this.props.appState.password);
    if(passwordScore < 4){
      help.innerHTML = this.getPasswordError(passwordErrors[0]);
    }else if(this.props.appState.password !== this.props.appState.confirmPassword){
      help.innerHTML = 'passwords must match.';
    }else if (this.props.appState.password == '' || this.props.appState.confirmPassword == ''){
      help.innerHTML = 'passwords cannot be blank';
    }else{
      this.props.reset(
        this.props.appState.password,
        this.props.appState.confirmPassword,
        this.props.token
      );
    }
  }


  render () {
    const resetPanelTitle = (
      <h2>Reset Password</h2>
    );
    const resetForm = (
      <form>

        <BS.FormGroup controlId="resetPassword">
          <BS.FormControl
          value={this.props.appState.password}
          onChange={this.resetKeypress.bind(this)}
          name="password"
          type="password"
          placeholder="PASSWORD" />
          <BS.FormControl.Feedback />
        </BS.FormGroup>
        <BS.FormGroup controlId="resetPasswordConfirm">
          <BS.FormControl
          value={this.props.appState.confirmPassword}
          onChange={this.resetKeypress.bind(this)}
          name="confirmPassword"
          type="password"
          placeholder="CONFIRM PASSWORD" />
          <BS.FormControl.Feedback />
          <PasswordStrengthMeter
          ref="password"
          password={this.props.appState.password} />
        </BS.FormGroup>

        <BS.HelpBlock ref="help" className="warn">
          {this.resetHelpMessage()}
        </BS.HelpBlock>
        {this.props.appState.success === false && (
          <BS.HelpBlock ref="help" className="warn">
            {this.props.appState.error}
          </BS.HelpBlock>
        )}


      <SubmitButton
      appState={this.props.appState}
      statusAction="resetSubmit"
      submit={this.submit.bind(this)}
      textLoading="Requesting">
        Reset Password
      </SubmitButton>

      </form>
    );
    const resetSuccess = (
      <div className="text-success text-center">
        Password reset successfully. <Link to="/">Go to Log In</Link>
      </div>
    );
    const resetPanel = (
      <BS.Panel className='signup-panel' header={resetPanelTitle} bsStyle="primary">
        {this.props.appState.success !== true ? resetForm : resetSuccess}
      </BS.Panel>
    );

    return (
      <div className='signup-page'>
        {resetPanel}
      </div>
    );
  }
}

export default ResetForm;

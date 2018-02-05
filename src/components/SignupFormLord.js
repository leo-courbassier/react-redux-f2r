import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';

import SubmitButton from './SubmitButton';
import PasswordStrengthMeter from './PasswordStrengthMeter';

class SignupFormLord extends Component {

  state = {
    acceptTerms: false
  }

  signupKeypress(e) {
    this.props.updateSignupForm(this.props.appState, e.target.name, e.target.value);
  }
  signupHelpMessage() {
    let valid = this.props.appState.success;
    switch (valid) {
      case false:
        return 'Sign Up Unsuccessful: ' + this.props.appState.error;
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
    const passwordScore = this.refs.password.getScore(this.props.appState.addUser.password);
    const passwordErrors = this.refs.password.getErrors(this.props.appState.addUser.password);

    if (!this.props.appState.addUser.firstName ||
        !this.props.appState.addUser.lastName ||
        !this.props.appState.addUser.email ||
        !this.props.appState.addUser.password) {
      help.innerHTML = 'All fields must be filled out.';
    } else if (!isEmail(this.props.appState.addUser.email)) {
      help.innerHTML = 'Email must be a valid address.';
    } else if (passwordScore < 4) {
      help.innerHTML = this.getPasswordError(passwordErrors[0]);
    } else if (this.props.appState.addUser.password !== this.props.appState.addUser.confirmPassword) {
      help.innerHTML = 'Passwords must match.';
    } else if (!this.state.acceptTerms) {
      help.innerHTML = 'Terms of Service and Privacy Policy must be accepted.';
    } else {
      this.props.signup(
        this.props.appState.addUser.firstName,
        this.props.appState.addUser.lastName,
        this.props.appState.addUser.email,
        this.props.appState.addUser.password,
        this.state.acceptTerms
        );
    }
  }

  render () {
    const signupPanelTitle = (
      <h2>Sign Up Lord</h2>
    );
    const SignupFormLord = (
      <form>
        <BS.FormGroup controlId="signupFirstName">
          <BS.FormControl
          value={this.props.appState.addUser.firstName}
          onChange={this.signupKeypress.bind(this)}
          name="firstName"
          type="text"
          placeholder="FIRST NAME" />
          <BS.FormControl.Feedback />
        </BS.FormGroup>
        <BS.FormGroup controlId="signupLastName">
          <BS.FormControl
          value={this.props.appState.addUser.lastName}
          onChange={this.signupKeypress.bind(this)}
          name="lastName" type="text"
          placeholder="LAST NAME" />
          <BS.FormControl.Feedback />
        </BS.FormGroup>
        <BS.FormGroup controlId="signupEmail">
          <BS.FormControl
          value={this.props.appState.addUser.email}
          onChange={this.signupKeypress.bind(this)}
          name="email"
          type="email"
          placeholder="EMAIL ADDRESS" />
          <BS.FormControl.Feedback />
        </BS.FormGroup>
        <BS.FormGroup controlId="signupPassword">
          <BS.FormControl
          value={this.props.appState.addUser.password}
          onChange={this.signupKeypress.bind(this)}
          name="password"
          type="password"
          placeholder="PASSWORD" />
          <BS.FormControl.Feedback />
        </BS.FormGroup>
        <BS.FormGroup controlId="signupPasswordConfirm">
          <BS.FormControl
          value={this.props.appState.addUser.confirmPassword}
          onChange={this.signupKeypress.bind(this)}
          name="confirmPassword"
          type="password"
          placeholder="CONFIRM PASSWORD" />
          <BS.FormControl.Feedback />
          <PasswordStrengthMeter
          ref="password"
          password={this.props.appState.addUser.password} />
        </BS.FormGroup>
        <BS.FormGroup>

        </BS.FormGroup>
        <BS.FormGroup controlId="signupType">
          <BS.Radio inline defaultChecked>Tenant</BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup controlId="signupType">
          <BS.Checkbox
          onChange={()=> this.setState({ acceptTerms: !this.state.acceptTerms })}
          value={this.props.appState.addUser.acceptTerms}
          name="acceptTerms" inline>By signing up for Fit 2 Rent, you agree to:<br></br>
            Our <a href="http://www.fit2rent.com/terms" target="_blank">Terms of Service</a> and <a href="http://www.fit2rent.com/privacy" target="_blank">Privacy Policy</a> and our payment provider, Dwolla's, <a href="https://www.dwolla.com/legal/tos/" target="_blank">Terms of Service</a> and <a href="https://www.dwolla.com/legal/privacy/" target="_blank">Privacy Policies</a>.
          </BS.Checkbox>
        </BS.FormGroup>
        <BS.HelpBlock ref="help" className="warn">
          {this.signupHelpMessage()}
        </BS.HelpBlock>



        <SubmitButton
        appState={this.props.appState}
        statusAction="signupSubmit"
        submit={this.submit.bind(this)}
        className="lord_button"
        textLoading="Signing Up Lord">
          Sign Up Lord
        </SubmitButton>
      </form>
    );
    const signupPanel = (
      <BS.Panel className='signup-panel-lord' header={signupPanelTitle} bsStyle="primary">
        {SignupFormLord}
      </BS.Panel>
    );

    return (
      <div className='signup-page-lord'>
        {signupPanel}
      </div>
    );
  }
}

export default SignupFormLord;

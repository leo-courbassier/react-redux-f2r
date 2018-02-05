import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as BS from 'react-bootstrap';

import SubmitButton from './SubmitButton';

const LoginForm = ({updateLoginForm, login, appState, store}) => {
  const loginKeypress = function (e) {
    updateLoginForm(appState, e.target.name, e.target.value);
  };
  const loginHelpMessage = function () {
    let authorized = appState.authorized;
    switch (authorized) {
      case false:
        return 'Incorrect email or password, please try again.';
      default:
        return '';
    }
  };
  const submit = function (e) {
    e.preventDefault();
    login(appState.user.email, appState.user.password);
  };
  const loginPanelTitle = (
    <h3>Log In</h3>
  );
  const loginForm = (
    <form>
      <BS.FormGroup controlId="signupEmail">
        <BS.FormControl value={appState.user.email} onChange={loginKeypress} name="email" type="email" placeholder="EMAIL ADDRESS" />
        <BS.FormControl.Feedback />
      </BS.FormGroup>
      <BS.FormGroup controlId="signupPassword">
        <BS.FormControl value={appState.user.password} onChange={loginKeypress} name="password" type="password" placeholder="PASSWORD" />
        <BS.FormControl.Feedback />
      </BS.FormGroup>
      <BS.HelpBlock className="warn">
        {loginHelpMessage()}
      </BS.HelpBlock>
      <BS.FormControl.Static>
        <Link to="/forgot">Forgot Password</Link>
      </BS.FormControl.Static>
      <SubmitButton
      appState={appState}
      statusAction="loginSubmit"
      submit={submit}
      textLoading="Logging In">
        Log In
      </SubmitButton>
    </form>
  );
  const loginPanel = (
    <BS.Panel className='login-panel' header={loginPanelTitle} bsStyle="primary">
      {loginForm}
    </BS.Panel>
  );
  return (
    <div className='login-page'>
      {loginPanel}
    </div>
  );
};

export default LoginForm;

import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';

import SubmitButton from './SubmitButton';

class ForgotForm extends Component {

  forgotKeypress(e) {
    this.props.updateForgotForm(this.props.appState, e.target.name, e.target.value);
  }
  forgotHelpMessage() {
    let valid = this.props.appState.success;
    switch (valid) {
      case false:
        return <span>{this.props.appState.error}</span>;
      case true:
        return <span className="success">{this.props.appState.error}</span>;
      default:
        return '';
    }
  }
  submit(e) {
    e.preventDefault();
    this.props.forgot(
      this.props.appState.email
    );
  }


  render () {
    const forgotPanelTitle = (
      <h2>Forgot Password</h2>
    );
    const forgotForm = (
      <form>

        <BS.FormGroup controlId="forgotEmail">
          <BS.FormControl
          value={this.props.appState.email}
          onChange={this.forgotKeypress.bind(this)}
          name="email"
          type="email"
          placeholder="EMAIL ADDRESS" />
          <BS.FormControl.Feedback />
        </BS.FormGroup>

        <BS.HelpBlock className="warn">
          {this.forgotHelpMessage()}
        </BS.HelpBlock>





      <SubmitButton
      appState={this.props.appState}
      statusAction="forgotSubmit"
      submit={this.submit.bind(this)}
      textLoading="Requesting">
        Request Password
      </SubmitButton>

      </form>
    );
    const forgotPanel = (
      <BS.Panel className='signup-panel' header={forgotPanelTitle} bsStyle="primary">
        {forgotForm}
      </BS.Panel>
    );

    return (
      <div className='signup-page'>
        {forgotPanel}
      </div>
    );
  }
}

export default ForgotForm;

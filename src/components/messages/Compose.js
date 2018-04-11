import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import TextareaAutosize from 'react-autosize-textarea';
import isEmail from 'validator/lib/isEmail';

import SelectOptions from '../SelectOptions';
import SubmitButton from '../SubmitButton';

import * as api from '../../actions/api';

class Compose extends Component {

  state = {
    submitted: false,
    showEmailField: false
  }

  keypress(e) {
    this.props.keypress(e.target.name, e.target.value);
  }

  handleRecipient(e) {
    if (e.target.value === '') {
      this.props.updateToUserId(null);
      this.setState({showEmailField: false});
      return;
    }

    if (e.target.value === 'OTHER') {
      this.props.updateToUserId(null);
      this.setState({showEmailField: true});
      return;
    }

    this.props.updateToUserId(parseInt(e.target.value));
    this.setState({showEmailField: false});
  }

  updateTo(e) {
    this.props.updateTo(this.parseTo(e.target.value));
  }

  // returns the email between angle brackets
  // http://stackoverflow.com/a/1493071
  parseTo(to) {
    if (!to) return to;
    let matches = to.match(/<(.*?)>/);
    return matches ?  matches[1] : to;
  }

  getValidationState(group = 'all', ignoreSubmitted = false) {
    let groups = {
      all: {valid: true, error: null},
      recipient: {valid: true, error: null},
      to: {valid: true, error: null},
      subject: {valid: true, error: null},
      message: {valid: true, error: null}
    };

    if (!this.state.submitted && !ignoreSubmitted) {
      return {valid: true, error: null};
    }

    const form = this.props.appState.compose;
    const email = this.parseTo(form.to);
    const tenants = this.props.appState.tenants;

    if (!form.to && !form.toUserId) {
      if (this.state.showEmailField || tenants.length < 1) {
        groups.all.valid = false;
        groups.to.valid = false;
        groups.to.error = 'Email is required.';
      } else {
        groups.all.valid = false;
        groups.recipient.valid = false;
        groups.recipient.error = 'Recipient is required.';
      }
    }

    if (form.to && !isEmail(email)) {
      groups.all.valid = false;
      groups.to.valid = false;
      groups.to.error = 'Must be a valid email.';
    }

    if (!form.subject) {
      groups.all.valid = false;
      groups.subject.valid = false;
      groups.subject.error = 'Subject is required.';
    }

    if (!form.message) {
      groups.all.valid = false;
      groups.message.valid = false;
      groups.message.error = 'Message is required.';
    }

    return groups[group];
  }

  submit(e) {
    e.preventDefault();

    this.setState({submitted: true});

    if (!this.getValidationState('all', true).valid) return;

    const {to, toUserId, subject, message} = this.props.appState.compose;

    api.setStatus(this.context.store.dispatch, 'loading', 'composeSubmit', true);

    if (toUserId) {
      let payload = {subject, message, toUserId};

      this.props.send(null, payload, () => {
        this.setState({submitted: false});
        api.setStatus(this.context.store.dispatch, 'loading', 'composeSubmit', false);
      });

      return;
    }

    this.props.updateTo(this.parseTo(to), user => {
      let email = user ? null : this.parseTo(to);
      let payload = {subject, message};
      if (user) payload.toUserId = user.id;

      this.props.send(email, payload, () => {
        this.setState({submitted: false});
        api.setStatus(this.context.store.dispatch, 'loading', 'composeSubmit', false);
      });
    });
  }

  getRecipients() {
    const tenants = this.props.appState.tenants;
    let recipients = {};
    for (let tenant of tenants) {
      recipients[tenant.id] = `${tenant.firstName} ${tenant.lastName}`;
    }
    recipients['OTHER'] = 'Enter an email...';
    return recipients;
  }

  render() {
    const isSending = this.props.appState.status.loading['composeSubmit'] === true;
    const compose = this.props.appState.compose;
    const tenants = this.props.appState.tenants;

    return (
      <div className="compose">
        <form>
          {tenants.length > 0 && (
            <BS.FormGroup controlId="recipient" validationState={!this.getValidationState('recipient').valid ? 'error' : null}>
              <BS.ControlLabel>To</BS.ControlLabel>
              <SelectOptions
                name="recipientsDropdown"
                onChange={this.handleRecipient.bind(this)}
                value="Choose..."
                optionList={this.getRecipients()}
                defaultOption="Choose..."
                defaultOptionName="Choose..."
                keyValue
               />
              <BS.HelpBlock className="text-danger">{this.getValidationState('recipient').error}</BS.HelpBlock>
            </BS.FormGroup>
          )}
          {(this.state.showEmailField || tenants.length < 1) && (
            <BS.FormGroup controlId="to" validationState={!this.getValidationState('to').valid ? 'error' : null}>
              <BS.ControlLabel>Email</BS.ControlLabel>
              <BS.FormControl
                name="to"
                onChange={this.keypress.bind(this)}
                onBlur={this.updateTo.bind(this)}
                type="text"
                placeholder="Recipient's email address"
                value={compose.to}
                autoFocus />
              <BS.HelpBlock className="text-danger">{this.getValidationState('to').error}</BS.HelpBlock>
            </BS.FormGroup>
          )}
          <BS.FormGroup controlId="subject" validationState={!this.getValidationState('subject').valid ? 'error' : null}>
            <BS.ControlLabel>Subject</BS.ControlLabel>
            <BS.FormControl
              name="subject"
              onChange={this.keypress.bind(this)}
              type="text"
              value={compose.subject}
              maxLength={78} />
            <BS.HelpBlock className="text-danger">{this.getValidationState('subject').error}</BS.HelpBlock>
          </BS.FormGroup>
          <BS.FormGroup controlId="message"  validationState={!this.getValidationState('message').valid ? 'error' : null}>
            <BS.ControlLabel>Message</BS.ControlLabel>
            <TextareaAutosize
              className="compose-message form-control"
              name="message"
              onChange={this.keypress.bind(this)}
              value={compose.message}
              />
            <BS.HelpBlock className="text-danger">{this.getValidationState('message').error}</BS.HelpBlock>
          </BS.FormGroup>
          <div className="clearfix">
            <div className="pull-left">
              {compose.success === true && !isSending && (
                <BS.HelpBlock><strong className="text-success">Message sent.</strong></BS.HelpBlock>
              )}
              {compose.success === false && !isSending && (
                <BS.HelpBlock><strong className="text-danger">Sorry, an error occurred.</strong></BS.HelpBlock>
              )}
            </div>
            <div className="pull-right">
              <SubmitButton
                appState={this.props.appState}
                submit={this.submit.bind(this)}
                statusAction="composeSubmit"
                textLoading="Sending">
                Send
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Compose.contextTypes = {
  store: PropTypes.object
};

export default Compose;

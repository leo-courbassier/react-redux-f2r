import React, { Component } from 'react';
import * as BS from 'react-bootstrap';
import TextareaAutosize from 'react-autosize-textarea';
import moment from 'moment';

import SubmitButton from '../SubmitButton';

class ReplyForm extends Component {

  state = {
    submitted: false
  }

  componentWillMount() {
    const message = this.props.message;
    const date = moment(message.tsMessageSent).format('MM/DD/YY');
    const time = moment(message.tsMessageSent).format('h:mma');

    // Prefilled message is stored to later compare against if they changed it
    this.initialPrefilledMessage = `\n\nOn ${date} at ${time} ${message.fromUserFullName} wrote:\n${message.message}`;

    // Prefill
    this.props.keypress('subject', `RE: ${message.subject}`);
    this.props.keypress('message', this.initialPrefilledMessage);
  }

  initialPrefilledMessage: ''

  keypress(e) {
    this.props.keypress(e.target.name, e.target.value);
  }

  getValidationState(group = 'all', ignoreSubmitted = false) {
    let groups = {
      all: {valid: true, error: null},
      subject: {valid: true, error: null},
      message: {valid: true, error: null}
    };

    if (!this.state.submitted && !ignoreSubmitted) {
      return {valid: true, error: null};
    }

    const form = this.props.appState.reply;

    if (!form.subject) {
      groups.all.valid = false;
      groups.subject.valid = false;
      groups.subject.error = 'Subject is required.';
    }

    if (!form.message || (form.message && form.message === this.initialPrefilledMessage)) {
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

    const message = this.props.message;
    const reply = this.props.appState.reply;

    let payload = {
      id: message.id,
      toUserId: message.fromUserId,
      subject: reply.subject,
      message: reply.message
    };

    this.props.send(payload, () => {
      this.setState({submitted: false});
    });
  }

  render() {
    const isSending = this.props.appState.status.loading['replySubmit'] === true;
    const {message} = this.props;
    const reply = this.props.appState.reply;

    return (
      <div className="reply">
        <form>
          <BS.FormGroup controlId="replySubject" validationState={!this.getValidationState('subject').valid ? 'error' : null}>
            <BS.ControlLabel>Subject</BS.ControlLabel>
            <BS.FormControl
              name="subject"
              onChange={this.keypress.bind(this)}
              type="text"
              value={reply.subject}
              maxLength={78} />
            <BS.HelpBlock className="text-danger">{this.getValidationState('subject').error}</BS.HelpBlock>
          </BS.FormGroup>
          <BS.FormGroup controlId="replyMessage"  validationState={!this.getValidationState('message').valid ? 'error' : null}>
            <BS.ControlLabel>Message</BS.ControlLabel>
            <TextareaAutosize
              className="reply-message form-control"
              name="message"
              onChange={this.keypress.bind(this)}
              value={reply.message}
              autoFocus
              />
            <BS.HelpBlock className="text-danger">{this.getValidationState('message').error}</BS.HelpBlock>
          </BS.FormGroup>
          <div className="clearfix">
            <div className="pull-left">
              {reply.success === true && !isSending && (
                <BS.HelpBlock><strong className="text-success">Message sent.</strong></BS.HelpBlock>
              )}
              {reply.success === false && !isSending && (
                <BS.HelpBlock><strong className="text-danger">Sorry, an error occurred.</strong></BS.HelpBlock>
              )}
            </div>
            <div className="pull-right">
              <SubmitButton
                appState={this.props.appState}
                submit={this.submit.bind(this)}
                statusAction="replySubmit"
                textLoading="Sending">
                Send Reply
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    );
  }

}

export default ReplyForm;

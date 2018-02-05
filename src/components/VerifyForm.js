import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link, IndexLink } from 'react-router';
import _ from 'underscore';
import * as BS from 'react-bootstrap';
import StatusBar from '../components/StatusBar';
import SelectOptions from './SelectOptions';
import SubmitButton from './SubmitButton';
import * as api from '../actions/api';
import * as Conversion from '../utils/conversion';

class VerifyForm extends Component {

  verifyKeypress(e) {
    this.props.updateVerifyForm(this.props.appState, e.target.name, e.target.value);
  }

  checkboxKeypress(e) {
    this.props.updateVerifyForm(this.props.appState, e.target.name, e.target.checked ? 'yes' : 'no');
  }

  submit(e) {
    e.preventDefault();
    this.props.sendVerifyForm(this.props.appState);
  }

  render () {
    let prefill = this.props.appState.prefill;
    if (Object.keys(prefill).length) {
      // sets prefill object to real data from API
      // and appends some useful pre-formatted data
      prefill = this.props.appState.prefill;
      prefill.firstNamePosessive = (prefill.firstName.slice(-1) === 's') ? prefill.firstName+"'" : prefill.firstName+"'s";
      prefill.name = prefill.firstName+' '+prefill.lastName;
      // format number with commas: http://stackoverflow.com/a/2901298/4958776
      prefill.salaryFormatted = prefill.salary.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const verifyIntroMessage =
    (
      <div className="intro-message">
        One of your employees, {prefill.name}, has requested you verify his/her employment and salary. Five quick questions will help them find their next great place to live.
      </div>
    );

    const successBlock =
    (
      <BS.HelpBlock bsClass="text-success">
        <div className="help-success">Verification has been submitted successfully.</div>
      </BS.HelpBlock>
    );

    const errorBlock =
    (
      <BS.HelpBlock bsClass="text-warning">
        <div className="help-error">{this.props.appState.error}</div>
      </BS.HelpBlock>
    );

    const submitButtons =
    (
      <BS.FormGroup>
        <div className="submit-buttons">
          <SubmitButton
          appState={this.props.appState}
          statusAction="verifySubmit"
          submit={this.submit.bind(this)}
          textLoading="Sending">
            Submit
          </SubmitButton>
        </div>
      </BS.FormGroup>
    );

    const verifyFormPanel =
    (
      <BS.Panel>
        <div className="section">Employee</div>
        <div className="help-block">
          <div className="row employee-info">
            <BS.Col sm={6}>
              <div className="employee-info-heading">Name</div>
              <div className="employee-info-text">
                {prefill.firstName} {prefill.lastName}
              </div>
              <div className="employee-info-heading">Company</div>
              <div className="employee-info-text">{prefill.companyName}</div>
              <div className="employee-info-heading">Location</div>
              <div className="employee-info-text">{prefill.companyCity}, {prefill.companyState}</div>
              <div className="employee-info-heading">Salary</div>
              <div className="employee-info-text">${prefill.salaryFormatted} per year</div>
            </BS.Col>
            <BS.Col sm={6}>
              {
                prefill.profilePicIUrl ?
                (
                  <div className="profile-image">
                    <BS.Image src={Conversion.urlToHttps(prefill.profilePicIUrl)} width={150} height={150} circle />
                  </div>
                )
                : ''
              }
            </BS.Col>
          </div>
        </div>
        <div className="section">Employer Survey</div>
        <BS.FormGroup>
          <BS.HelpBlock>Can you verify {prefill.firstNamePosessive} employment at the company and location above?</BS.HelpBlock>
          <BS.Radio
            onChange={this.verifyKeypress.bind(this)}
            name="employment"
            value="yes"
            inline>
            Yes
          </BS.Radio>
          <BS.Radio
            onChange={this.verifyKeypress.bind(this)}
            name="employment"
            value="no"
            inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Can you verify the annual salary {prefill.firstName} provided above?</BS.HelpBlock>
          <BS.Radio
            onChange={this.verifyKeypress.bind(this)}
            name="salary"
            value="yes"
            inline>
            Yes
          </BS.Radio>
          <BS.Radio
            onChange={this.verifyKeypress.bind(this)}
            name="salary"
            value="no"
            inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Were any of the following performed as a part of {prefill.firstNamePosessive} hiring process? (Mark all that apply)</BS.HelpBlock>
          <div className="row-switch">
            <BS.Checkbox
              onChange={this.checkboxKeypress.bind(this)}
              name="backgroundCheck"
              value="yes"
              inline>
              Background Check
            </BS.Checkbox>
          </div>
          <div className="row-switch">
            <BS.Checkbox
              onChange={this.checkboxKeypress.bind(this)}
              name="creditCheck"
              value="yes"
              inline>
              Credit Check
            </BS.Checkbox>
          </div>
          <div className="row-switch">
            <BS.Checkbox
              onChange={this.checkboxKeypress.bind(this)}
              name="employmentVerification"
              value="yes"
              inline>
              Employment Verification
            </BS.Checkbox>
          </div>
          <div className="row-switch">
            <BS.Checkbox
              onChange={this.checkboxKeypress.bind(this)}
              name="drugScreening"
              value="yes"
              inline>
              Drug Screening
            </BS.Checkbox>
          </div>
        </BS.FormGroup>
        {/* This feature is not available yet:
        <BS.FormGroup>
          <BS.HelpBlock>If you're an approved Fit to Rent Corporate Partner, please enter your F2R ID in the space below.</BS.HelpBlock>
          <BS.FormControl
            defaultValue={this.props.appState.f2rId}
            onChange={this.verifyKeypress.bind(this)}
            name="f2rId"
            type="text"
            placeholder="F2R ID" />
        </BS.FormGroup>
        */}
        <BS.FormGroup>
          <BS.HelpBlock>If we need additional details or a follow-up phone call to confirm any information we will contact you at the provided email address, or you can provide a different email address below.</BS.HelpBlock>
          <BS.FormControl
            defaultValue={this.props.appState.contactInfo}
            onChange={this.verifyKeypress.bind(this)}
            name="contactInfo"
            type="email"
            placeholder="Email Address" />
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>
            To help us with verification, please provide your LinkedIn profile (if available).<br />
            <b>This is <i>highly</i> recommended, because it may keep us from having to contact you by phone.</b>
          </BS.HelpBlock>
          <BS.FormControl
            defaultValue={this.props.appState.linkedin}
            onChange={this.verifyKeypress.bind(this)}
            name="linkedin"
            type="text"
            placeholder="URL to LinkedIn profile (e.g. https://www.linkedin.com/in/USERNAME)" />
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>That's it! Thanks for your time. We appreciate it, and we know {prefill.firstName} does too.</BS.HelpBlock>
        </BS.FormGroup>
        {this.props.appState.error ? errorBlock : ''}
        {this.props.appState.success ? successBlock : submitButtons}

      </BS.Panel>
    );

    const verifyErrorPanel =
    (
      <BS.Panel>
        <div>Sorry, this URL has expired.</div>
      </BS.Panel>
    );

    return (
      <div>
        <BS.Col xsHidden sm={3} md={3}>
          <div className="sidebar">
            <ul className="menu">
              <li>
                <BS.Glyphicon glyph="comment" /><a href="http://www.fit2rent.com/contact" target="_blank">Contact Us</a>
              </li>
              <li>
                <BS.Glyphicon glyph="question-sign" /><a href="http://www.fit2rent.com/help" target="_blank">Help Center</a>
              </li>
            </ul>
          </div>
        </BS.Col>

        <BS.Col xs={12} sm={9} md={6} className="panels">

          {prefill ? verifyIntroMessage : ''}

          <form>
            <BS.PanelGroup>
              {prefill ? verifyFormPanel : verifyErrorPanel}
            </BS.PanelGroup>
          </form>

        </BS.Col>

        <BS.Col xsHidden smHidden md={3}>
          <div className="f2r-tips">
            <div className="heading">What is Fit to Rent?</div>
            <div className="tip-text">
              We’re a crew of tenants and landlords who believe in the power of a positive rental experience. We’re in the business of:
              <ul>
                <li>Empowering landlords to search for great tenants.</li>
                <li>Allowing tenants to build a strong rental reputation.</li>
                <li>Providing critical transparency to the rental world.</li>
              </ul>
            </div>
          </div>
          <div className="f2r-tips">
            <div className="heading">Did you know?</div>
            <div className="tip-text">
              Employees are renting more and for longer periods of time. Dozens of HR and relocation professionals told us that there isn't a service for renters in the employee benefits space. We are changing that. Contact us to save time and money while increasing productivity for your employees.
            </div>
          </div>
        </BS.Col>

      </div>
    );

  }
}

export default VerifyForm;

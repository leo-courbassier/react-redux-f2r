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

class FeedbackForm extends Component {

  constructor() {
    super();
    this.state = {
      showSubmitButton:true,
      showSubmitAndSignupButton:true
    };
  }

  feedbackKeypress(e) {
    this.props.updateFeedbackForm(this.props.appState, e.target.name, e.target.value);

    if (e.target.name == 'state') {
      this.props.setCitiesList(e.target.value);
    }
  }

  checkboxKeypress(e) {
    this.props.updateFeedbackForm(this.props.appState, e.target.name, e.target.checked ? 'yes' : 'no');
  }

  submit(e) {
    e.preventDefault();
    this.setState({
      showSubmitButton:true,
      showSubmitAndSignupButton:false
    });
    this.props.sendFeedbackForm(this.props.appState, false, () => {
      this.setState({
        showSubmitButton:true,
        showSubmitAndSignupButton:true
      });
    });
  }

  submitAndSignup(e) {
    e.preventDefault();
    this.setState({
      showSubmitButton:false,
      showSubmitAndSignupButton:true
    });
    this.props.sendFeedbackForm(this.props.appState, true, () => {
      this.setState({
        showSubmitButton:true,
        showSubmitAndSignupButton:true
      });
    });
  }

  // used to format lease dates
  // returns an object with full year and month
  parseDate(date) {
    const dateParts = date.split('-');
    const initial = {year: '', month: ''};
    const months = {'01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December'};
    if (!date || !dateParts) return initial;
    return {
      year: dateParts[0],
      month: months[dateParts[1]]
    };
  }

  render () {
    // for the address state dropdown in form
    let prefill = this.props.appState.prefill;
    if (Object.keys(prefill).length) {
      // sets prefill object to real data from API
      // and appends some useful pre-formatted data
      prefill = this.props.appState.prefill;
      prefill.ttFirstNamePosessive = (prefill.ttFirstName.slice(-1) === 's') ? prefill.ttFirstName+"'" : prefill.ttFirstName+"'s";
      prefill.ttName = prefill.ttFirstName+' '+prefill.ttLastName;
      prefill.beginDateFormatted = this.parseDate(prefill.beginDate).month+' '+this.parseDate(prefill.beginDate).year;
      prefill.endDateFormatted = this.parseDate(prefill.endDate).month+' '+this.parseDate(prefill.endDate).year;
    }
    // email newsletter link with prefilled first name and last name
    const signupUrl = 'http://fittorent.us12.list-manage.com/subscribe?u=92bd66b3e9f2542c152506f07&id=4519efce7c&group[5093][2]=checked&MERGE0=&MERGE1='+prefill.llFirstName+'&MERGE2='+prefill.llLastName;

    const feedbackIntroMessage =
    (
      <div className="intro-message">
        One of your former tenants, {prefill.ttName}, has asked for a reference. Please provide us with the following information so we can accurately build their Fit to Rent profile and help them find other great landlords.
      </div>
    );

    const successBlock =
    (
      <BS.HelpBlock bsClass="text-success">
        <div className="help-success">Review has been submitted successfully.</div>
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
          {
            this.state.showSubmitAndSignupButton ?
            (
              <SubmitButton
              appState={this.props.appState}
              statusAction="feedbackSubmit"
              submit={this.submitAndSignup.bind(this)}
              textLoading="Sending">
                Submit and Sign Up
              </SubmitButton>
            )
            : ''
          }
          {
            this.state.showSubmitButton ?
            (
              <SubmitButton
              appState={this.props.appState}
              statusAction="feedbackSubmit"
              submit={this.submit.bind(this)}
              textLoading="Sending"
              bsStyle="default">
                Submit Review
              </SubmitButton>
            )
            : ''
          }
        </div>
      </BS.FormGroup>
    );

    const feedbackFormPanel =
    (
      <BS.Panel>
        <div className="section">Tenant</div>
        <div className="help-block">
          <div className="row tenant-info">
            <BS.Col sm={6}>
              <div className="tenant-info-heading">
                {prefill.ttFirstName} {prefill.ttLastName}
              </div>
              <div className="tenant-info-heading">Term of Lease</div>
              <div className="tenant-info-text">
                Lease Start: {prefill.beginDateFormatted}
                <br />
                Lease End: {prefill.endDateFormatted}
              </div>
              <div className="tenant-info-heading">Rent</div>
              <div className="tenant-info-text">${prefill.rentAmount}</div>
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
        <div className="section">Address</div>
        <BS.FormGroup>
          <BS.ControlLabel>Street Address</BS.ControlLabel>
          <BS.FormControl
              value={this.props.appState.streetAddress}
              onChange={this.feedbackKeypress.bind(this)}
              name="streetAddress"
              placeholder="Street Address"
              type="text" />
        </BS.FormGroup>
        <BS.FormGroup>
          <div className="row">
            <BS.Col sm={4}>
              <BS.ControlLabel>State</BS.ControlLabel>
              <SelectOptions
                defaultValue={this.props.appState.state}
                onChange={this.feedbackKeypress.bind(this)}
                name="state"
                optionList={this.props.appState.statesList}
                defaultOption="State..."
                defaultOptionName="State..."
               />
            </BS.Col>
            <BS.Col sm={4}>
              <BS.ControlLabel>City</BS.ControlLabel>
              <SelectOptions
                defaultValue={this.props.appState.city}
                onChange={this.feedbackKeypress.bind(this)}
                name="city"
                optionList={this.props.appState.citiesList}
                defaultOption="City..."
                defaultOptionName="City..."
               />
            </BS.Col>
            <BS.Col sm={4}>
              <BS.ControlLabel>Zip</BS.ControlLabel>
              <BS.FormControl
                  value={this.props.appState.zip}
                  onChange={this.feedbackKeypress.bind(this)}
                  name="zip"
                  placeholder="Zip"
                  type="text" />
            </BS.Col>
          </div>
        </BS.FormGroup>
        <div className="section">Tenant Survey</div>
        <BS.FormGroup>
          <BS.ControlLabel>Responsibility</BS.ControlLabel>
          <BS.HelpBlock>Did {prefill.ttFirstName} maintain the property in accordance with the provisions of your lease? (e.g., landscaping, snow removal, etc.)</BS.HelpBlock>
          <BS.Radio
            onChange={this.feedbackKeypress.bind(this)}
            name="responsibilityMaintainence"
            value="yes"
            inline>
            Yes
          </BS.Radio>
          <BS.Radio
            onChange={this.feedbackKeypress.bind(this)}
            name="responsibilityMaintainence"
            value="no"
            inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Did {prefill.ttFirstName} alert you of any problems with the property in a timely manner?</BS.HelpBlock>
          <BS.Radio
            onChange={this.feedbackKeypress.bind(this)}
            name="responsibilityAlerts"
            value="yes"
            inline>
            Yes
          </BS.Radio>
          <BS.Radio
            onChange={this.feedbackKeypress.bind(this)}
            name="responsibilityAlerts"
            value="no"
            inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Did {prefill.ttFirstName} perform extra services or exhibit handiness that saved you money?</BS.HelpBlock>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="responsibilityExtra"
          value="yes"
          inline>
            Yes
          </BS.Radio>
          <BS.Radio
            onChange={this.feedbackKeypress.bind(this)}
            name="responsibilityExtra"
            value="no"
            inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Would you deem {prefill.ttFirstName} a responsible pet owner? (Mark "N/A" if not applicable)</BS.HelpBlock>
          <BS.Radio
           onChange={this.feedbackKeypress.bind(this)}
           name="responsibilityPet"
           value="yes"
           inline>
           Yes
          </BS.Radio>
          <BS.Radio
           onChange={this.feedbackKeypress.bind(this)}
           name="responsibilityPet"
           value="no"
           inline>
           No
          </BS.Radio>
          <BS.Radio
           onChange={this.feedbackKeypress.bind(this)}
           name="responsibilityPet"
           value="NOT_APPLICABLE"
           inline>
           N/A
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Was your lease with {prefill.ttFirstName} free from neighborhood and municipal complaints?</BS.HelpBlock>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="responsibilityComplaints"
          value="yes"
          inline>
            Yes
          </BS.Radio>
          <BS.Radio
            onChange={this.feedbackKeypress.bind(this)}
            name="responsibilityComplaints"
            value="no"
            inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.ControlLabel>Reliability</BS.ControlLabel>
          <BS.HelpBlock>How much of {prefill.ttFirstNamePosessive} security deposit did you return at the end of the lease?</BS.HelpBlock>
          <SelectOptions
            defaultValue={this.props.appState.reliabilityPet}
            onChange={this.feedbackKeypress.bind(this)}
            name="reliabilitySecurity"
            optionList={{
              'ALL': 'All',
              'MORE_THAN_HALF': 'More than half',
              'HALF': 'Half',
              'LESS_THAN_HALF': 'Less than half',
              'NOT_APPLICABLE': 'Didn\'t take one',
              'NONE': 'None'
            }}
            defaultOption="Select one..."
            defaultOptionName="Select one..."
            keyValue
           />
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Did {prefill.ttFirstName} pay monthly rent on time?</BS.HelpBlock>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="reliabilityPay"
          value="yes"
          inline>
            Yes
          </BS.Radio>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="reliabilityPay"
          value="no"
          inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Did {prefill.ttFirstName} pay the rent in full?</BS.HelpBlock>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="reliabilityPayFull"
          value="yes"
          inline>
            Yes
          </BS.Radio>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="reliabilityPayFull"
          value="no"
          inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.ControlLabel>Repeatability</BS.ControlLabel>
          <BS.HelpBlock>Did you perform any of the following prior to renting to {prefill.ttFirstName}?</BS.HelpBlock>
          <div className="row-switch">
            <BS.Checkbox
            onChange={this.checkboxKeypress.bind(this)}
            name="repeatabilityBackgroundCheck"
            value="yes"
            inline>
              Background Check
            </BS.Checkbox>
          </div>
          <div className="row-switch">
            <BS.Checkbox
            onChange={this.checkboxKeypress.bind(this)}
            name="repeatabilityCreditCheck"
            value="yes"
            inline>
              Credit Check
            </BS.Checkbox>
          </div>
          <div className="row-switch">
            <BS.Checkbox
            onChange={this.checkboxKeypress.bind(this)}
            name="repeatabilityEmploymentVerification"
            value="yes"
            inline>
              Employment Verification
            </BS.Checkbox>
          </div>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Would you rent to {prefill.ttFirstName} again?</BS.HelpBlock>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="repeatabilityRentAgain"
          value="yes"
          inline>
            Yes
          </BS.Radio>
          <BS.Radio
          onChange={this.feedbackKeypress.bind(this)}
          name="repeatabilityRentAgain"
          value="no"
          inline>
            No
          </BS.Radio>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>On a scale of 1-10, how would you rate {prefill.ttFirstName} as a tenant?</BS.HelpBlock>
          <SelectOptions
            defaultValue={this.props.appState.reliabilityRating}
            onChange={this.feedbackKeypress.bind(this)}
            name="rating"
            optionList={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            defaultOption="Rating..."
            defaultOptionName="Rating..."
           />
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>Is there anything else you would like us to know?</BS.HelpBlock>
          <BS.FormControl
            defaultValue={this.props.appState.thoughts}
            onChange={this.feedbackKeypress.bind(this)}
            name="thoughts"
            componentClass="textarea"
            placeholder="Give us your thoughts..." />
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>If we need additional details or a follow-up phone call to confirm any information we will contact you at the provided email address, or you can provide a different email address below.</BS.HelpBlock>
          <BS.FormControl
            defaultValue={this.props.appState.contactInfo}
            onChange={this.feedbackKeypress.bind(this)}
            name="contactInfo"
            type="email"
            placeholder="Email Address" />
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>That's it! Thanks for your time. We appreciate it, and we know {prefill.ttFirstName} does too.</BS.HelpBlock>
        </BS.FormGroup>
        <BS.FormGroup>
          <BS.HelpBlock>COMING SOON! We've got big plans for Landlords. Get notified of our landlord services by clicking the button on the left. If you aren’t interested in great tenants and profitable properties, choose the button on the right.</BS.HelpBlock>
        </BS.FormGroup>
        {this.props.appState.error ? errorBlock : ''}
        {this.props.appState.success ? successBlock : submitButtons}

      </BS.Panel>
    );

    const feedbackErrorPanel =
    (
      <BS.Panel>
        <div>Sorry, this URL has expired.</div>
      </BS.Panel>
    );

    return (
      <div>
        <BS.Col xsHidden sm={3} md={3}>
          <div className="sidebar">
            <div className="coming-soon">
              <div className="coming-soon-message">Landlord Services are<br />coming soon!</div>
              <div className="coming-soon-cta">
                <BS.Button bsStyle="primary" href={signupUrl} target="_blank">Sign Up to Get Notified</BS.Button>
              </div>
            </div>
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

          {prefill ? feedbackIntroMessage : ''}

          <form>
            <BS.PanelGroup>
              {prefill ? feedbackFormPanel : feedbackErrorPanel}
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
                <li>Providing a management solution for all your properties.</li>
                <li>Creating solutions for on-time rental payments.</li>
              </ul>
            </div>
          </div>
          <div className="f2r-tips">
            <div className="heading">Did you know?</div>
            <div className="tip-text">
              Countless landlords told us that high-quality tenants are the difference in earning a return on their property investment. Join other Fit to Rent landlords who have discovered the secret to rental success and score the right tenant for your property today!
            </div>
          </div>
        </BS.Col>

      </div>
    );

  }
}

export default FeedbackForm;

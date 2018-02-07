import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../SubmitButton';
import _ from 'underscore';
import * as Validation from '../../utils/validation';
import isEmail from 'validator/lib/isEmail';
import InfoTooltip from '../InfoTooltip';

import StripeCheckout from '../Stripe';
import DwollaCheckout from '../Dwolla';

import * as api from '../../actions/api';

const STEP_ID = 3;

class StepFourForm extends Component {


  state = {
    activeKey: '0',
    submitted: false
  }

  componentWillMount() {
    //this.props.load();
  }

  componentWillUnmount () {
    this.props.clear();
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }


  keypress(statusAction, e) {
    this.props.update(this.props.appState, e.target.name, e.target.value, statusAction);
  }

  // a boolean method to check if mandatory fields are not filled
  isMandatoryInvalid(){
    let store = this.props.appState[STEP_ID];

    return false;
  }

  isInvalid() {
    let store = this.props.appState[STEP_ID];
    let invalid = false;

    if (
      store.guarantorFirstName ||
      store.guarantorLastName ||
      store.guarantorEmail ||
      store.guarantorPhone ||
      store.guarantorRelation
      )
    {
      if (store.guarantorPhone && store.guarantorPhone.replace(/\D/g,'').trim().length < 10){
        invalid = 'Guarantor phone must be at least a 10 digit number.'
      }

      if (store.guarantorEmail && !isEmail(store.guarantorEmail)) {
        invalid = 'Guarantor email must be valid.'
      }
      if (
        !store.guarantorFirstName ||
        !store.guarantorLastName ||
        !store.guarantorEmail ||
        !store.guarantorPhone
        )
      {
        invalid = 'Please let us know the guarantor\'s first name, last name, email, and phone.'
      }
    }

    return invalid;
  }

  submit(openNextStep, e) {
    e.preventDefault();
    this.setState({submitted: true});
    if(this.isInvalid()){
      return false;
    }
    let store = this.props.appState[STEP_ID];

    // format phone number before saving to API
    let guarantorPhone = store.guarantorPhone;
    if (store.guarantorPhone && store.guarantorPhone.replace(/\D/g,'').trim().length === 10) {
      let number = store.guarantorPhone.replace(/\D/g,'').trim();
      let parts = [number.substring(0, 3), number.substring(3, 6), number.substring(6, 10)];
      guarantorPhone = `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepFourForm'];
    let allowSave = openNextStep ? isModified : true;

    if (allowSave) {
      this.props.saveGuarantor(
        store.guarantorFirstName,
        store.guarantorLastName,
        store.guarantorEmail,
        guarantorPhone,
        store.guarantorRelation,
        openNextStep,
        this.props.updateOnboardingScore
        );
    } else {
      if (openNextStep) openNextStep();
    }
  }


  render() {

    let store = this.props.appState[STEP_ID];

    const depositTooltip = (
      <span>
        <h7><b>Boost Your F2R Score</b></h7>
        <p>We also take your Security Deposit into consideration when we determine your F2R Score.</p>
        <p>This is your chance to pile up the points!</p>
      </span>
    );


    const postDepositSection = (
      <div>
        <div className="section">Post a Security Deposit<InfoTooltip placement="right" tooltip={depositTooltip} /></div>
        <div className="section-box">
          Why post a security deposit? Show landlords you are a serious renter and have the ability to pay. We keep your money secure and will refund it to you at your request.
        </div>
        <div className="row">
          <div className='item'>
            <BS.HelpBlock>
            <h4>Post a Deposit from your...</h4>
            </BS.HelpBlock>
          </div>
        </div>
        <div className="row">
          <div className='item post-option'>
            <div className="title">
              Bank Account
            </div>
            <div className="icon">
              <BS.Glyphicon glyph="piggy-bank" />
            </div>
            <div className="help">
              <BS.HelpBlock>
              <ol>
                <li>Easy and free of charge</li>
                <li>Same account used for rent</li>
                <li>Simple refund process</li>
              </ol>
              </BS.HelpBlock>
            </div>
            <div className="button">
              <BS.Button
              bsStyle="success"
              className="choose-bank-account"
              onClick={_.partial(this.handleSelect.bind(this), 1)}
              type="submit">
              Post with Bank Account
              </BS.Button>
            </div>
          </div>
          <div className='item post-option'>
            <div className="title">
              Credit / Debit Card
            </div>
            <div className="icon">
              <BS.Glyphicon glyph="credit-card" />
            </div>
            <div className="help">
              <BS.HelpBlock>
              <ol>
                <li>We charge a 4% transaction fee</li>
                <li>Can't be used for rent payments</li>
                <li>Simple refund process</li>
              </ol>
              </BS.HelpBlock>
            </div>
            <div className="button">
              <BS.Button
              bsStyle="success"
              className="choose-credit-card"
              onClick={_.partial(this.handleSelect.bind(this), 2)}
              type="submit">
              Post with a Card
              </BS.Button>
            </div>
          </div>
        </div>
      </div>
    );

    const dwollaCheckout =
      <DwollaCheckout
      load={this.props.loadDwolla}
      save={this.props.saveDwolla}
      keypress={this.keypress}
      update={this.props.update}
      updateOnboardingScore={this.props.updateOnboardingScore}
      appState={this.props.appState} />;
    const stripeCheckout =
      <StripeCheckout
      keypress={this.keypress}
      update={this.props.update}
      saveStripe={this.props.saveStripe}
      updateOnboardingScore={this.props.updateOnboardingScore}
      appState={this.props.appState} />;
    const steps = [postDepositSection, dwollaCheckout, stripeCheckout];
    const panel = steps[this.state.activeKey];

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepFiveForm">
      <div className="step step-four">

        {panel}

        <div className="section">Add a Guarantor</div>
        <div className="section-box">
          Early in your rental journey? No established history as a tenant? Give Landlords a boost of confidence, and gain an edge in the rental market, by adding a Guarantor.<br />
          <i>* Adding a guarantor is not required and incurs an extra cost.</i>
        </div>
        <form>
          <BS.FormGroup controlId="guarantor">
          <div className="row">
            <div className="item">
              <BS.ControlLabel>First Name</BS.ControlLabel>
              <BS.FormControl
              value={store.guarantorFirstName}
              onChange={_.partial(this.keypress.bind(this), 'stepFourForm')}
              name="guarantorFirstName"
              type="text" />
            </div>
            <div className="item">
              <BS.ControlLabel>Last Name</BS.ControlLabel>
              <BS.FormControl
              value={store.guarantorLastName}
              onChange={_.partial(this.keypress.bind(this), 'stepFourForm')}
              name="guarantorLastName"
              type="text" />
            </div>
          </div>
          <div className="row">
            <div className="item">
              <BS.ControlLabel>Email</BS.ControlLabel>
              <BS.FormControl
              value={store.guarantorEmail}
              onChange={_.partial(this.keypress.bind(this), 'stepFourForm')}
              name="guarantorEmail"
              type="text" />
            </div>
            <div className="item">
              <BS.ControlLabel>Phone</BS.ControlLabel>
              <BS.FormControl
              value={store.guarantorPhone}
              onChange={_.partial(this.keypress.bind(this), 'stepFourForm')}
              name="guarantorPhone"
              type="text" />
            </div>
          </div>
          <div className="row">
            <div className="item">
              <BS.ControlLabel>Relation</BS.ControlLabel>
              <BS.FormControl
              value={store.guarantorRelation}
              onChange={_.partial(this.keypress.bind(this), 'stepFourForm')}
              name="guarantorRelation"
              type="text" />
            </div>
          </div>
          </BS.FormGroup>
        </form>

        <br />

        <BS.HelpBlock className="pullLeft warn">
          {this.state.submitted ? this.isInvalid() : ''}
        </BS.HelpBlock>
        <div className="onboarding-submit">
          <SubmitButton
          appState={this.props.appState}
          statusAction="stepFourForm"
          submit={_.partial(this.submit.bind(this), false)}
          textLoading="Saving"
          textModified="Save Changes"
          bsStyle="primary">
            Add Guarantor
          </SubmitButton>
          {this.props.showProceed && (
            <SubmitButton
            appState={this.props.appState}
            statusAction="stepFourFormProceed"
            submit={_.partial(this.submit.bind(this), this.props.openNextStep)}
            disabled={this.isMandatoryInvalid()}
            textLoading="Saving"
            bsStyle="success"
            className="proceed-button">
              Proceed
            </SubmitButton>
          )}
        </div>
      </div>
      </Loader>
    );



  }

}


StepFourForm.contextTypes = {
  store: PropTypes.object
};

export default StepFourForm;

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
import SelectOptions from '../SelectOptions';
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
    this.props.load();
  }

  componentWillUnmount () {
    this.props.clear();
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  getCityList(state, name){
    let store = this.context.store;
    api.getCityList(
      store.dispatch,
      store.getState,
      state,
      name
      );
  }

  stateListKeypress(cityList, e){
    this.props.update(this.props.appState, e.target.name, e.target.value);
    let store = this.context.store;
    this.getCityList(e.target.value, cityList);
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
        invalid = 'Guarantor phone must be at least a 10 digit number.';
      }

      if (store.guarantorEmail && !isEmail(store.guarantorEmail)) {
        invalid = 'Guarantor email must be valid.';
      }
      if (
        !store.guarantorFirstName ||
        !store.guarantorLastName ||
        !store.guarantorEmail ||
        !store.guarantorPhone
        )
      {
        invalid = 'Please let us know the guarantor\'s first name, last name, email, and phone.';
      }
    }

    return invalid;
  }

  submit(openNextStep, e) {
    e.preventDefault();

    this.setState({submitted: true});
    // if(this.isInvalid()){
    //   return false;
    // }
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
        store.firstName,
        store.lastName,
        store.email,
        store.homeAddress,
        store.city,
        store.state,
        store.zipCode,
        store.dateBirth,
        store.ssn,
        openNextStep
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
                <li>Can t be used for rent payments</li>
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

    const dwollaCheckout = (
      <DwollaCheckout
        load={this.props.loadDwolla}
        save={this.props.saveDwolla}
        keypress={this.keypress}
        update={this.props.update}
        updateOnboardingScore={this.props.updateOnboardingScore}
        appState={this.props.appState} />
    );
    const stripeCheckout = (
      <StripeCheckout
        keypress={this.keypress}
        update={this.props.update}
        saveStripe={this.props.saveStripe}
        updateOnboardingScore={this.props.updateOnboardingScore}
        appState={this.props.appState} />
      );
    const steps = [postDepositSection, dwollaCheckout, stripeCheckout];
    const panel = steps[this.state.activeKey];


    return (
    
      <Loader appState={this.props.appState} statusType="loading" statusAction="StepFourForm">
    
      <div className="step step-four">
    {this.props.appState[3].showConnectAccountValue != true && (
      <div>
      <div className="section">Set up your rent collection method</div>
        <div className="section-box">
          Setting up your rent collection method is free, quick, and easy. We don’t store any of your banking information and all transfers are handled through our secure processing technology. The headaches of paper checks are a thing of the past!.<br />
       </div>
          <div className="collectTitle">Collect Rent and Deposits using... Direct Deposit</div>
           <div className="row">          
            <div className="item">
              <div className="icon my_pig">
              <BS.Glyphicon glyph="piggy-bank" />
              </div>
            </div>
          </div>

          <div className="row">          
            <div className="item">
                <ol>
                  <li>$1 fee for every transaction.</li>
                  <li>Notifications and Alerts.</li>
                  <li>Payments come in on-time and worry-free.</li>
               </ol>
            </div>
          </div>

           <div className="row">
              <div className="item">
                     <SubmitButton
                    appState={this.props.appState}
                    statusAction="stepFourFormProceed"
                    submit={_.partial(this.submit.bind(this), this.props.showConnectAccount)}
                    bsStyle="success"
                    className="proceed-button">
                      Connect Your Account
                    </SubmitButton>
              </div>
            </div>
         </div>
       )}
       {this.props.appState[3].showConnectAccountValue == true && (

        <div>
        <div className="section">Add a Guarantor</div>

        <div className="section-box">
          We need the following information so Dwolla, our payment provider, can verify your identity and give you access to the payment system. We don’t store any of this info.<br />
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
           <BS.ControlLabel className="emailGuarantor">Email</BS.ControlLabel>
            <div className="col-md-6">
              <BS.FormControl
              value={store.guarantorEmail}
              onChange={_.partial(this.keypress.bind(this), 'stepFourForm')}
              name="guarantorEmail"
              type="text" />
            </div>
          </div>
          <div className="row">
           <BS.ControlLabel>Home Address</BS.ControlLabel>
            <div className="col-md-6">
              <BS.FormControl
              value={store.homeAddress}
              onChange={_.partial(this.keypress.bind(this), 'homeAddress')}
              name="guarantorEmail"
              type="text" />
            </div>
          </div>
          <div className="row">
           <div className="item">
                <BS.ControlLabel>City</BS.ControlLabel>
                <SelectOptions
                name="city"
                loading={this.props.appState.status.loading['currentCityList']}
                loadingText="Retrieving cities..."
                onChange={this.keypress.bind(this)}
                defaultValue={store.city}
                optionList={this.props.appState.cities['currentCityList']}
                defaultOption
                 />
               </div>
               <div className="item">
                  <BS.ControlLabel>State</BS.ControlLabel>
                  <SelectOptions
                  name="state"
                  onChange={_.partial(this.stateListKeypress.bind(this), 'currentCityList')}
                  defaultValue={store.state}
                  optionList={store.stateList}
                  defaultOption
                   />
              </div>
            <div className="item">
            <BS.ControlLabel>Zip Code</BS.ControlLabel>
              <BS.FormControl
              value={store.zipCode}
              onChange={this.keypress.bind(this)}
              name="zipCode"
              type="text" />
            </div>
          </div>
          <div className="row">

              <div className="col-md-3">
               <BS.ControlLabel>Date Birth</BS.ControlLabel>
              </div>
              <div className="col-md-3">
              <BS.FormControl
              value={store.leaseStartDate}
              name="leaseStartDate"
              placeholder="mm/dd/yyyy"
              onChange={_.partial(this.keypress.bind(this), 'leaseStartDate')}
              type="text" />
              </div>
              <BS.Glyphicon glyph="calendar" />

              <div className="col-md-3">
               <BS.ControlLabel>Last 4 of SSN</BS.ControlLabel>
              </div>
              <div className="col-md-3">
              <BS.FormControl
              value={store.ssn}
              name="ssn"
              onChange={_.partial(this.keypress.bind(this), 'ssn')}
              type="text" />
              </div>
          </div>
          </BS.FormGroup>
        </form>
        <br/>
        <div className="row">
         <div className="col-md-5">
         </div>
         <div className="col-md-6">
          <SubmitButton
              appState={this.props.appState}
              statusAction="stepFourFormSave"
              submit={_.partial(this.submit.bind(this), false)}
              className="save-step4"
              textLoading="Saving"
              textModified="Save Changes"
              disabled={this.isMandatoryInvalid()}
              bsStyle="primary">
                ￼Save 
            </SubmitButton>
          </div>
        
        <div className="onboarding-submit-four">
       
          {this.props.showProceed && (          

            <SubmitButton
            appState={this.props.appState}
            statusAction="stepFourFormProceed"
            submit={_.partial(this.submit.bind(this), this.props.openNextStep)}
            disabled={this.isMandatoryInvalid()}
            
            bsStyle="success"
            className="proceed-button">
              Skip
            </SubmitButton>
        
          )}
           </div>
           </div>
          </div>
         )}
         
        
      </div>
      </Loader>
    );



  }

}


StepFourForm.contextTypes = {
  store: PropTypes.object
};

export default StepFourForm;

import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../SubmitButton';
import SelectOptions from '../SelectOptions';
import Switch from 'react-bootstrap-switch';
import Datetime from 'react-datetime';
import _ from 'underscore';
import * as Validation from '../../utils/validation';
import isEmail from 'validator/lib/isEmail';
import InfoTooltip from '../InfoTooltip';

import * as api from '../../actions/api';

const STEP_ID = 2;
const MAX_LANDLORDS = 10;

class StepThreeForm extends Component {

  state = {
    submitted: false
  }

  componentWillMount() {
    this.props.load();
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  switchKeypress(name, state) {
    this.props.update(this.props.appState, name, state);
  }

  stateListKeypress(cityList, e){
    this.props.update(this.props.appState, e.target.name, e.target.value);
    let store = this.context.store;
    this.getCityList(e.target.value, cityList);
  }

  landlordKeypress(e){
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID];

    api.setStatus(this.context.store.dispatch, 'modified', 'stepThreeForm', true);
    store.dispatch({ type: types.ONBOARDING_STEPTHREE_UPDATE_LANDLORDS, sources });
  }
  addIncomeSource = (e) => {
    debugger;
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepTwoForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].depositList;

    sources.push({"depositAmount":550, "depositType":"SECURITY","depositStatus":"REFUNDABLE"});
    store.dispatch({ type: types.ONBOARDING_STEPTHREE_UPDATE_INCOME_SOURCES, sources });

  }

  renderIncomeSources = (source, i) => {
    debugger;
    let store = this.props.appState[STEP_ID];
    return (
      <div className="your-job">
        Pepe
      </div>
    );

  }
  keypress(e) {
    this.props.update(this.props.appState, e.target.name, e.target.value);
    // console.log(this.props.appState)
  }

  // a boolean method to check if mandatory fields are not filled
  isMandatoryInvalid(){
    return true;
  }

getRecipients() {

      if(!this.props.appState[2].propertyList)return;

      const landlords = this.props.appState[2].propertyList;//this.props.appState[2].propertyList;
      let recipients = {};
      for (let landlord of landlords) {
        recipients[landlord.id] = `${landlord.headline}`;
      }
      return recipients;
    }

    isInvalid() {
      let store = this.props.appState[STEP_ID];
      let invalid = false;

      if (
        store.firstName ||
        store.email ||
        store.phone ||
        store.lastName
        )
      {
        if (store.phone && store.phone.replace(/\D/g,'').trim().length < 10){
          invalid = 'Phone must be at least a 10 digit number.';
        }

        if (store.email && !isEmail(store.email)) {
          invalid = 'Guarantor email must be valid.';
        }
        if (
          !store.firstName ||
          !store.lastName ||
          !store.email ||
          !store.phone
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

    let store = this.props.appState[STEP_ID];

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepThreeForm'];
    let allowSave = openNextStep ? isModified : true;
    store.isMonthToMonth=store.leaseType=='month-to-month'||false;
    // console.log('isMonthToMonth: '+store.isMonthToMonth);

    if (allowSave) {
      this.props.save(
        store.landlordId,
        store.propertyId,
        store.leaseStartDate,
        store.leaseEndDate,
        store.paymentStartDate,
        store.paymentEndDate,
        store.paymentDueDate,
        store.monthlyRent,
        store.isMonthToMonth,
        store.leaseStatus,
        store.renterIds,
        store.depositList,
        openNextStep
        );
    } else {
      if (openNextStep) openNextStep();
    }
  }


  addAnotherDepositFunction = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepThreeForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].deposit;

    if (MAX_LANDLORDS > sources.length){

      sources.push({
        "beginDate": "",
        "email": "",
        "endDate": "",
        "llFirstName": "",
        "llLastName": "",
        "phone": "",
        "rentAmount": ""
      });

      store.dispatch({ type: types.ONBOARDING_STEPTHREE_UPDATE_LANDLORDS, sources });
    }
  }

  removeLandlord = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepThreeForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID];
    sources.pop();
    store.dispatch({ type: types.ONBOARDING_STEPTHREE_UPDATE_LANDLORDS, sources });
  }

  renderLandlords = (source, i) => {
    return (
      <BS.FormGroup controlId="previousLandlords">
      <BS.ControlLabel>Landlord {i + 1}</BS.ControlLabel>
      <div className="row">
        <div className="item">
          <BS.ControlLabel>First Name</BS.ControlLabel>
          <BS.FormControl
          value='FirstName'
          name="firstName"
          onChange={this.keypress.bind(this)}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Last Name</BS.ControlLabel>
          <BS.FormControl
          value={source.lastName}
          name="lastName"
          onChange={this.keypress.bind(this)}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>From</BS.ControlLabel>
          <Datetime
          timeFormat={false}
          dateFormat="YYYY-MM-DD"
          inputProps={{placeholder: 'YYYY-MM-DD'}}
          viewMode="years"
          value={source.leaseStartDate}
          onChange={_.partial(this.keypress.bind(this))}
          closeOnSelect />
        </div>
        <div className="item">
          <BS.ControlLabel>To</BS.ControlLabel>
          <Datetime
          timeFormat={false}
          dateFormat="YYYY-MM-DD"
          inputProps={{placeholder: 'YYYY-MM-DD'}}
          viewMode="years"
          value={source.leaseEndDate}
          onChange={_.partial(this.keypress.bind(this))}
          closeOnSelect />
        </div>
      </div>
      <div className="row">
        <div className="item">
          <BS.ControlLabel>Email</BS.ControlLabel>
          <BS.FormControl
          value={source.email}
          name="email"
          onChange={_.partial(this.keypress.bind(this))}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Phone</BS.ControlLabel>
          <BS.FormControl
          value={source.phone}
          name="phone"
          onChange={_.partial(this.keypress.bind(this))}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Rent Amount</BS.ControlLabel>
          <BS.InputGroup>
            <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
            <BS.FormControl
            value={source.rentAmount}
            name="rentAmount"
            onChange={_.partial(this.keypress.bind(this))}
            type="text" />
          </BS.InputGroup>
        </div>
      </div>
      <div className="row">
        <div className="verification-disclaimer">We will contact this landlord to validate their status as the owner or property manager at the time of your lease period.</div>
      </div>
      <div className="section" />
      </BS.FormGroup>
    );
  }

  render() {

    let store = this.props.appState[STEP_ID];

    let numPropertiesRentedOptionsList = {};
    _.times(15, (n) => {
      if (n !== 14) {
        numPropertiesRentedOptionsList[n + 1] = n + 1;
      } else {
        numPropertiesRentedOptionsList[n + 1] = '15+';
      }
    });

    let yearsAsRenterOptionsList = {};
    _.times(25, (n) => {
      if (n !== 24) {
        yearsAsRenterOptionsList[n + 1] = n + 1;
      } else {
        yearsAsRenterOptionsList[25] = '25+';
      }
    });

    let ownerStatusOptionsList = ['Sold','Occupied','Leased','Forclosed'];

    const propertyTooltip = (
      <span>
        <h7><b>Easy Points</b></h7>
        <p>Property ownership says a lot about you.  Let us know your status and boost your F2R Score.</p>
      </span>
    );
    const propertySele = (
      <SelectOptions
          onChange={this.keypress.bind(this)}
          value="Choose..."
          name="propertyId"
          optionList={this.getRecipients()}
          defaultOption="Choose..."
          defaultOptionName="Choose..."
          keyValue
         />
    );
    const refundableStatus = (
      <select id="property" className="form-control">
          <option value="Refundable">Refundable</option>
          <option value="Nonrefundable">Nonrefundable</option>
      </select>
    );

    const refundable = (
          <select id="property" className="form-control">
              <option value="Yes">Title</option>
          </select>
    );

    const propertySelection = (
      <div className="propertySelection">
        <BS.FormGroup controlId="propertyS">
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-3">
          <BS.ControlLabel>Property Slection</BS.ControlLabel>
          </div>
          <div className="col-md-3">
          {propertySele}
          </div>
          <div className="col-md-3" />
        </div>
        </BS.FormGroup>
      </div>

    );

    const sources = _.map(store.depositList, (source, i) => {
      return this.renderIncomeSources(source, i);
    });



    const incomeSources = (
      <div className="col-md-4">
        <div>
            <BS.Button
            onClick={(e) => this.addIncomeSource(e)}
            className="add-button"
            type="submit"
            bsStyle="success">
              Add Another Property
            </BS.Button>
            {sources.length ? removeButton : null}
        </div>
        <div className="row">
        {sources}
        </div>
      </div>
    );

    const tenantAssignmet = (

        <div className="row">
         <div className="col-md-12">
           <div className="col-md-3">
            <BS.ControlLabel>First Name</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           name="firstName"
           value={store.firstName}
           onChange={this.keypress.bind(this)}
           type="text" />
           </div>
           <div className="col-md-3">
            <BS.ControlLabel>Last Name</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           name="lastName"
           value={store.lastName}
           onChange={this.keypress.bind(this)}
           type="text" />
           </div>
          </div>
          <br />
          <div className="col-md-12">
           <div className="col-md-3">
            <BS.ControlLabel>Email</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.email}
           name="email"
           onChange={this.keypress.bind(this)}
           type="text" />
           </div>
           <div className="col-md-3">
            <BS.ControlLabel>Phone</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.phone}
           name="phone"
           onChange={this.keypress.bind(this)}
           type="text" />
           </div>
          </div>
         </div>
    );

    const leaseType = (

        <div className="row">
          <div className="col-md-12 leaseTypeSection">
            <div className="col-md-5">
            <div className="input-group">
            <label className="radio-inline">
            <input
            value="month-to-month"
            onChange={this.keypress.bind(this)}
            name="leaseType"
            className="input_month"
            type="radio" />
            <BS.ControlLabel className="monthToMonth">Month to Month </BS.ControlLabel>
            </label>
            </div>
            </div>
            <div className="col-md-2">or</div>
            <div className="col-md-5">
            <div className="input-group">
            <label className="radio-inline">
            <input
            value="set-term"
            onChange={this.keypress.bind(this)}
            name="leaseType"
            className="input_month"
            type="radio" />
            <BS.ControlLabel className="setTerm">Set Term </BS.ControlLabel>
            </label>
           </div>
           </div>
          </div>
        </div>
    );

    const collectDeposit = (

        <div className="row">
          <div className="col-md-12 leaseTypeSection">
            <div className="col-md-5">
            <div className="input-group">
            <label className="radio-inline">
            <input
            value="collect-deposit"
            onChange={this.keypress.bind(this)}
            name="collectionTypeState"
            className="input_month"
            type="radio" />
            <BS.ControlLabel className="monthToMonth">Collect Deposits</BS.ControlLabel>
            </label>
            </div>
            </div>
            <div className="col-md-2">or</div>
            <div className="col-md-5">
            <div className="input-group">
            <label className="radio-inline">
            <input
            value="not-necesary"
            onChange={this.keypress.bind(this)}
            name="collectionTypeState"
            className="input_month"
            type="radio" />
            <BS.ControlLabel className="setTerm">Not Necessary</BS.ControlLabel>
            </label>
           </div>
           </div>
          </div>
        </div>
    );



    const { leaseType: leaseTypeState } = this.props.appState[2];

    const detailsPoperty = (
      <BS.Collapse in={leaseTypeState === 'set-term'}>
      <div className="row">

       <div className="col-md-12">
         <div className="col-md-3">
          <BS.ControlLabel>Lease Start Date</BS.ControlLabel>
         </div>
         <div className="col-md-3">
         <BS.FormControl
         value={store.leaseStartDate}
         name="leaseStartDate"
         placeholder="mm/dd/yyyy"
         onChange={_.partial(this.keypress.bind(this))}
         type="text" />
         <BS.Glyphicon glyph="calendar" />
         </div>
         <div className="col-md-3">
          <BS.ControlLabel>Lease End Date</BS.ControlLabel>
         </div>
         <div className="col-md-3">
         <BS.FormControl
         value={store.leaseEndDate}
         name="endDate"
         onChange={_.partial(this.keypress.bind(this))}
         placeholder="mm/dd/yyyy"
         type="text" />
         <BS.Glyphicon glyph="calendar" />
         </div>
        </div>
        <br />
        <div className="col-md-12">
        <div className="col-md-3">
         <BS.ControlLabel>Payment Start Date</BS.ControlLabel>
        </div>
        <div className="col-md-3">
        <BS.FormControl
        value={store.paymentStartDate}
        name="paymentStartDate"
        placeholder="mm/dd/yyyy"
        onChange={_.partial(this.keypress.bind(this))}
        type="text" />
        <BS.Glyphicon glyph="calendar" />
        </div>

        <div className="col-md-3">
         <BS.ControlLabel>Payment End Date</BS.ControlLabel>
        </div>
        <div className="col-md-3">
        <BS.FormControl
        value={store.paymentEndDate}
        name="paymentEndDate"
        placeholder="mm/dd/yyyy"
        onChange={_.partial(this.keypress.bind(this))}
        type="text" />
        <BS.Glyphicon glyph="calendar" />
        </div>
        </div>
           <div className="col-md-12">
            <div className="col-md-3">
              <BS.ControlLabel>Payment Due Date</BS.ControlLabel>
            </div>
            <div className="col-md-3">
              <BS.FormControl
                value={store.paymentDueDate}
                name="paymentDueDate"
                placeholder="xth of month"
                onChange={_.partial(this.keypress.bind(this))}
                type="text" />
              <BS.Glyphicon glyph="calendar" />
            </div>

            <div className="col-md-3">
              <BS.ControlLabel>Monthly Rent</BS.ControlLabel>
            </div>
            <div className="col-md-3">
              <BS.FormControl
                value={store.monthlyRent}
                name="monthlyRent"
                placeholder="$$$$"
                onChange={_.partial(this.keypress.bind(this))}
                type="text" />
            </div>
          </div>
        </div>
      </BS.Collapse>

  );


  const leaseTypeMonthDescription = (
    <BS.Collapse in={leaseTypeState === 'month-to-month'}>
    <div className="row">
     <div className="col-md-12">
       <div className="col-md-3">
        <BS.ControlLabel>Lease Start Date</BS.ControlLabel>
       </div>
       <div className="col-md-3">
       <BS.FormControl
       value={store.leaseStartDate}
       name="leaseStartDate"
       placeholder="mm/dd/yyyy"
       onChange={this.keypress.bind(this)}
       type="text" />
       <BS.Glyphicon glyph="calendar" />
       </div>
       <div className="col-md-3">
        <BS.ControlLabel>Payment Start Date</BS.ControlLabel>
       </div>
       <div className="col-md-3">
       <BS.FormControl
       value={store.paymentStartDate}
       name="paymentStartDate"
       placeholder="mm/dd/yyyy"
       onChange={_.partial(this.keypress.bind(this))}
       type="text" />
       <BS.Glyphicon glyph="calendar" />
       </div>
      </div>
      <br />
         <div className="col-md-12">
          <div className="col-md-3">
            <BS.ControlLabel>Payment Due Date</BS.ControlLabel>
          </div>
          <div className="col-md-3">
            <BS.FormControl
              value={store.paymentDueDate}
              name="paymentDueDate"
              placeholder="xth of month"
              onChange={_.partial(this.keypress.bind(this))}
              type="text" />
            <BS.Glyphicon glyph="calendar" />
          </div>

          <div className="col-md-3">
            <BS.ControlLabel>Monthly Rent</BS.ControlLabel>
          </div>
          <div className="col-md-3">
            <BS.FormControl
              value={store.monthlyRent}
              name="monthlyRent"
              placeholder="$$$$"
              onChange={_.partial(this.keypress.bind(this))}
              type="text" />
          </div>
        </div>
      </div>
    </BS.Collapse>

);


const { collectionTypeState: collectionTypeState } = this.props.appState[2];

  const depositDetail = (
  <BS.Collapse in={collectionTypeState === 'collect-deposit'}>
    <div className="row">
     <div className="col-md-12">
       <div className="col-md-3">
        <BS.ControlLabel>Deposit Type</BS.ControlLabel>
       </div>
       <div className="col-md-3">
       <BS.FormControl
       value={store.depositType}
       name="depositType"
       placeholder="￼e.g. Securi"
       onChange={_.partial(this.keypress.bind(this))}
       type="text" />

       </div>
       <div className="col-md-3">
        <BS.ControlLabel>Deposit Amount</BS.ControlLabel>
       </div>
       <div className="col-md-3">
       <BS.FormControl
       value={store.depositAmount}
       name="depositAmount"
       onChange={_.partial(this.keypress.bind(this))}
       placeholder="$$$$"
       type="text" />
       </div>
      </div>
      <br />
      <div className="col-md-12">
      <div className="col-md-3">
       <BS.ControlLabel>Deposit Due On</BS.ControlLabel>
      </div>
      <div className="col-md-3">
      <BS.FormControl
      value={store.depositDueOn}
      name="depositDueOn"
      placeholder="mm/dd/yyyy"
      onChange={_.partial(this.keypress.bind(this))}
      type="text" />
      <BS.Glyphicon glyph="calendar" />
      </div>

      <div className="col-md-3">
       <BS.ControlLabel>Refundable Status</BS.ControlLabel>
      </div>
      <div className="col-md-3">
      {refundableStatus}
      </div>
      </div>
      <br />
      <div className="row">
      <div className="col-md-8 anotherDeposit">
          <BS.Button
          onClick={(e) => this.addIncomeSource(e)}
          className="add-button-otherDeposit"
          type="submit"
          bsStyle="success">
            {incomeSources}
          </BS.Button>

      </div>
      </div>
     </div>
   </BS.Collapse>
);

    //const landlords = _.map(store.previousLandlords, (source, i) => {return this.Landlords(source, i)});

    const removeButton = (
      <BS.Button
      onClick={this.removeLandlord}
      className="remove-button"
      type="submit"
      bsStyle="success">
        Remove
      </BS.Button>
    );


    const addAnotherDeposit = (
      <div className="addAnotherDeposit">
        {}
          <BS.Button
          onClick={(e) => this.addAnotherDepositFunction(e)}
          className="add-button"
          type="submit"
          bsStyle="success">
            Add Another Deposit
          </BS.Button>

      </div>
    );


    let warn = this.isInvalid() ? (<span className="warn">* <span className="text">{this.state.submitted ? this.isInvalid() : ''}</span></span>) : '';

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepThreeForm">
        <div className="step step-three">
          <form>
            <div className="section">Lease Info{warn}</div>
            {propertySelection}
            <div className="section">Tenant Assignment{warn}</div>
            {tenantAssignmet}
            <div className="section">Lease Type{warn}</div>
            {leaseType}
            <div className="section">Details{warn}</div>
            {detailsPoperty}
            {leaseTypeMonthDescription}
            <div className="section">Deposits{warn} <div className="depositMessage">(Select “Collect Deposits” ONLY IF there are outstanding deposits you’re owed from your tenants)</div></div>
            {collectDeposit}
            <div className="section">Deposit Details{warn}</div>
            {depositDetail}
            <div className="section">Add more leases</div>

          </form>
          <BS.HelpBlock className="pullLeft warn">
            {this.state.submitted ? this.isInvalid() : ''}
          </BS.HelpBlock>

          <div className="row">
          <div className="col-md-3">
          {this.props.showProceed && (
            <SubmitButton
            appState={this.props.appState}
            statusAction="stepTwoFormProceed"
            submit={this.props.openPrevStep}
            textLoading="Loading"
            bsStyle="success"
            className="proceed-button prev-button">
              Previous
            </SubmitButton>
          )}
           </div>
           <div className="col-md-5">
            <SubmitButton
            appState={this.props.appState}
            statusAction="stepThreeForm"
            submit={_.partial(this.submit.bind(this), false)}
            textLoading="Saving"
            textModified="Save Changes"
            bsStyle="primary">
              ￼Save and Setup Another Lease
            </SubmitButton>
            </div>
            <div className="col-md-3">
            {this.props.showProceed && (
              <SubmitButton
              appState={this.props.appState}
              statusAction="stepThreeFormProceed"
              submit={_.partial(this.submit.bind(this), this.props.openNextStep)}
              textLoading="Saving"
              bsStyle="success"
              className="proceed-button">
                Next
              </SubmitButton>
            )}
             </div>
            </div>

        </div>
      </Loader>
    );



  }

}


StepThreeForm.contextTypes = {
  store: PropTypes.object
};

export default StepThreeForm;

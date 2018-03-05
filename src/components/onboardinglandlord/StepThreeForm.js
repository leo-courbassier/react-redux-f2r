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

  getCityList(state, name){
    let store = this.context.store;
    api.getCityList(
      store.dispatch,
      store.getState,
      state,
      name
      );
  }

  keypress(e) {
    this.props.update(this.props.appState, e.target.name, e.target.value);
  }

  switchKeypress(name, state) {
    this.props.update(this.props.appState, name, state);
  }

  stateListKeypress(cityList, e){
    this.props.update(this.props.appState, e.target.name, e.target.value);
    let store = this.context.store;
    this.getCityList(e.target.value, cityList);
  }

  landlordKeypress(i, name, e){
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].previousLandlords;

    if (name == 'beginDate' || name == 'endDate') {
      if (typeof e.format === 'function') {
        sources[i][name] = e.format('YYYY-MM-DD');
      } else {
        sources[i][name] = e;
      }
    }else{
      sources[i][name] = e.target.value;
    }

    api.setStatus(this.context.store.dispatch, 'modified', 'stepThreeForm', true);
    store.dispatch({ type: types.ONBOARDING_STEPTHREE_UPDATE_LANDLORDS, sources });
  }

  // a boolean method to check if mandatory fields are not filled
  isMandatoryInvalid(){
    let store = this.props.appState[STEP_ID];

    if (
      !store.currentState ||
      !store.currentCity
      )
    {
      return true;
    }

    return false;
  }

  isInvalid(){
    let store = this.props.appState[STEP_ID];
    let invalid = false;

    for (let landlord of store.previousLandlords) {
      if (landlord.phone && landlord.phone.replace(/\D/g,'').trim().length < 10){
        invalid = 'Landlord Phone must be at least a 10 digit number.'
      }

      if (landlord.email && !isEmail(landlord.email)) {
        invalid = 'Landlord Email must be a valid email address.'
      }
    }

    if (
      !store.currentState ||
      !store.currentCity
      )
    {
      invalid = 'Please let us know the city and state where you currently reside.'
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

    let previousLandlords = [];
    for (let landlord of store.previousLandlords) {
      let newLandlord = landlord;

      // strip dollar sign and commas before saving to API
      if (landlord.rentAmount) {
        newLandlord.rentAmount = Math.floor(landlord.rentAmount.toString().trim().replace(/\$|,/g, '')).toString();
      }

      // format phone number before saving to API
      if (landlord.phone && landlord.phone.replace(/\D/g,'').trim().length === 10) {
        let number = landlord.phone.replace(/\D/g,'').trim();
        let parts = [number.substring(0, 3), number.substring(3, 6), number.substring(6, 10)];
        newLandlord.phone = `(${parts[0]}) ${parts[1]}-${parts[2]}`;
      }

      previousLandlords.push(newLandlord);
    }

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepThreeForm'];
    let allowSave = openNextStep ? isModified : true;

    if (allowSave) {
      this.props.save(
        store.currentState,
        store.currentCity,
        store.numYearsRenter,
        store.numPropertiesRented,
        store.previousHomeowner,
        store.isLandlord,
        store.ownedAddress,
        store.ownedCity,
        store.ownedState,
        store.ownedZip,
        store.ownerStatus,
        previousLandlords,
        openNextStep,
        this.props.updateOnboardingScore
        );
    } else {
      if (openNextStep) openNextStep();
    }
  }


  addLandlord = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepThreeForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].previousLandlords;

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
    let sources = this.props.appState[STEP_ID].previousLandlords;
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
          value={source.llFirstName}
          name="llFirstName"
          onChange={_.partial(this.landlordKeypress.bind(this), i, 'llFirstName')}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Last Name</BS.ControlLabel>
          <BS.FormControl
          value={source.llLastName}
          name="llLastName"
          onChange={_.partial(this.landlordKeypress.bind(this), i, 'llLastName')}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>From</BS.ControlLabel>
          <Datetime
          timeFormat={false}
          dateFormat="YYYY-MM-DD"
          inputProps={{placeholder: 'YYYY-MM-DD'}}
          viewMode="years"
          value={source.beginDate}
          onChange={_.partial(this.landlordKeypress.bind(this), i, 'beginDate')}
          closeOnSelect />
        </div>
        <div className="item">
          <BS.ControlLabel>To</BS.ControlLabel>
          <Datetime
          timeFormat={false}
          dateFormat="YYYY-MM-DD"
          inputProps={{placeholder: 'YYYY-MM-DD'}}
          viewMode="years"
          value={source.endDate}
          onChange={_.partial(this.landlordKeypress.bind(this), i, 'endDate')}
          closeOnSelect />
        </div>
      </div>
      <div className="row">
        <div className="item">
          <BS.ControlLabel>Email</BS.ControlLabel>
          <BS.FormControl
          value={source.email}
          name="email"
          onChange={_.partial(this.landlordKeypress.bind(this), i, 'email')}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Phone</BS.ControlLabel>
          <BS.FormControl
          value={source.phone}
          name="phone"
          onChange={_.partial(this.landlordKeypress.bind(this), i, 'phone')}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Rent Amount</BS.ControlLabel>
          <BS.InputGroup>
            <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
            <BS.FormControl
            value={source.rentAmount}
            name="rentAmount"
            onChange={_.partial(this.landlordKeypress.bind(this), i, 'rentAmount')}
            type="text" />
          </BS.InputGroup>
        </div>
      </div>
      <div className="row">
        <div className="verification-disclaimer">We will contact this landlord to validate their status as the owner or property manager at the time of your lease period.</div>
      </div>
      <div className="section"></div>
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
          <select id="property" className="form-control">
              <option value="Yes">Refundable</option>
              <option value="Yes">Nonrefundable</option>
          </select>
    )

    const refundable = (
          <select id="property" className="form-control">
              <option value="Yes">Title</option>
          </select>
    )

    const propertySelection = (
      <div className="propertySelection">
        <BS.FormGroup controlId="propertyS">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">
          <BS.ControlLabel>Property Slection</BS.ControlLabel>
          </div>
          <div className="col-md-3">
          {propertySele}
          </div>
          <div className="col-md-3"></div>
        </div>
        </BS.FormGroup>
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
           value={store.firstNameTenantAssignemt}
           name="firstNameTenantAssignemt"
           onChange={_.partial(this.landlordKeypress.bind(this), 'firstNameTenantAssignemt')}
           type="text" />
           </div>
           <div className="col-md-3">
            <BS.ControlLabel>Last Name</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.lastNameTenantAssignemt}
           name="firstNameTenantAssignemt"
           onChange={_.partial(this.landlordKeypress.bind(this), 'lastNameTenantAssignemt')}
           type="text" />
           </div>
          </div>
          <br></br>
          <div className="col-md-12">
           <div className="col-md-3">
            <BS.ControlLabel>Email</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.firstNameTenantAssignemt}
           name="emailTenantAssignemt"
           onChange={_.partial(this.landlordKeypress.bind(this), 'emailTenantAssignemt')}
           type="text" />
           </div>
           <div className="col-md-3">
            <BS.ControlLabel>Phone</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.firstNameTenantAssignemt}
           name="phoneTenantAssignemt"
           onChange={_.partial(this.landlordKeypress.bind(this), 'phoneTenantAssignemt')}
           type="text" />
           </div>
          </div>
         </div>
    )

    const leaseType = (

        <div className="row">
          <div className="col-md-12 leaseTypeSection">
            <div className="col-md-5">
            <div className="input-group">
            <label className="radio-inline">
            <input
            value={store.motnh}
            onChange={this.keypress.bind(this)}
            name="monthToMonth"
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
            value={store.motnh}
            onChange={this.keypress.bind(this)}
            name="monthToMonth"
            className="input_month"
            type="radio" />
            <BS.ControlLabel className="setTerm">Set Term </BS.ControlLabel>
            </label>
           </div>
           </div>
          </div>
        </div>
    )

    const collectDeposit = (

        <div className="row">
          <div className="col-md-12 leaseTypeSection">
            <div className="col-md-5">
            <div className="input-group">
            <label className="radio-inline">
            <input
            value={store.collectDeposits}
            onChange={this.keypress.bind(this)}
            name="monthToMonth"
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
            value={store.notNecesary}
            onChange={this.keypress.bind(this)}
            name="monthToMonth"
            className="input_month"
            type="radio" />
            <BS.ControlLabel className="setTerm">Not Necessary</BS.ControlLabel>
            </label>
           </div>
           </div>
          </div>
        </div>
    )

    const ownedPropertyInfo = (

      <div className="owned-property-info">
        <BS.FormGroup controlId="ownedPropertyInfo">
        <div className="row">
          <div className="item">
            <BS.ControlLabel>Address</BS.ControlLabel>
            <BS.FormControl
            value={store.ownedAddress}
            onChange={this.keypress.bind(this)}
            name="ownedAddress"
            type="text" />
          </div>
          <div className="item">
            <BS.ControlLabel>State</BS.ControlLabel>
            <SelectOptions
              name="ownedState"
              onChange={_.partial(this.stateListKeypress.bind(this), 'ownedCityList')}
              defaultValue={store.ownedState}
              optionList={store.stateList}
              defaultOption
              />
            </div>
          </div>
          <div className="row">
            <div className="item">
              <BS.ControlLabel>City</BS.ControlLabel>
              <SelectOptions
                name="ownedCity"
                disabled={!store.ownedState}
                loading={this.props.appState.status.loading['ownedCityList']}
                loadingText="Retrieving cities..."
                onChange={this.keypress.bind(this)}
                defaultValue={store.ownedCity}
                optionList={this.props.appState.cities['ownedCityList']}
                defaultOption
                />
              </div>
              <div className="item">
                <BS.ControlLabel>Zip</BS.ControlLabel>
                <BS.FormControl
                value={store.ownedZip}
                onChange={this.keypress.bind(this)}
                name="ownedZip"
                type="text" />
              </div>
            </div>
            <div className="row">
              <div className="item">
                <BS.ControlLabel>Status</BS.ControlLabel>
                <SelectOptions
                name="ownerStatus"
                onChange={this.keypress.bind(this)}
                defaultValue={store.ownerStatus}
                optionList={ownerStatusOptionsList}
                valuesToUpper
                  />
                </div>
                <div className="item">
                  <BS.HelpBlock>
                  <ul>
                    <li>Occupied - You’re currently living there</li>
                    <li>Leased - You’re currently leasing it out</li>
                    <li>Selling/Sold - Property sold or currently unoccupied but for sale</li>
                    <li>Foreclosed - Property is foreclosed and will show up on a Credit Report as such</li>
                  </ul>
                  </BS.HelpBlock>
                </div>
              </div>
              <div className="row">
                <div className="item">
                  <BS.ControlLabel>If the home is sold, were you ever a Landlord while you owned it?</BS.ControlLabel>
                  <Switch
                  onColor="success"
                  offColor="success"
                  onText="Yes"
                  offText="No"
                  size="mini"
                  onChange={_.partial(this.switchKeypress.bind(this), 'isLandlord')}
                  state={store.isLandlord} />
                </div>
              </div>
              </BS.FormGroup>
            </div>
    );


    const detailsPoperty = (
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
         onChange={_.partial(this.landlordKeypress.bind(this), 'leaseStartDate')}
         type="text" />
         <BS.Glyphicon glyph="calendar" />
         </div>
         <div className="col-md-3">
          <BS.ControlLabel>Lease End Date</BS.ControlLabel>
         </div>
         <div className="col-md-3">
         <BS.FormControl
         value={store.leaseEndDate}
         name="leaseEndDate"
         onChange={_.partial(this.landlordKeypress.bind(this), 'leaseEndDate')}
         placeholder="mm/dd/yyyy"
         type="text" />
         <BS.Glyphicon glyph="calendar" />
         </div>
        </div>
        <br></br>
        <div className="col-md-12">
        <div className="col-md-3">
         <BS.ControlLabel>Payment Start Date</BS.ControlLabel>
        </div>
        <div className="col-md-3">
        <BS.FormControl
        value={store.paymentStartDate}
        name="paymentStartDate"
        placeholder="mm/dd/yyyy"
        onChange={_.partial(this.landlordKeypress.bind(this), 'paymentStartDate')}
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
        onChange={_.partial(this.landlordKeypress.bind(this), 'paymentEndDate')}
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
        onChange={_.partial(this.landlordKeypress.bind(this), 'paymentDueDate')}
        type="text" />
        <BS.Glyphicon glyph="calendar" />
        </div>

        <div className="col-md-3">
         <BS.ControlLabel>Monthly Rent</BS.ControlLabel>
        </div>
        <div className="col-md-3">
        <BS.FormControl
        value={store.paymentEndDate}
        name="monthlyRent"
        placeholder="$$$$"
        onChange={_.partial(this.landlordKeypress.bind(this), 'monthlyRent')}
        type="text" />

        </div>

        </div>


       </div>
  )



  const depositDetail = (
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
       onChange={_.partial(this.landlordKeypress.bind(this), 'depositType')}
       type="text" />

       </div>
       <div className="col-md-3">
        <BS.ControlLabel>Deposit Amount</BS.ControlLabel>
       </div>
       <div className="col-md-3">
       <BS.FormControl
       value={store.depositAmount}
       name="depositAmount"
       onChange={_.partial(this.landlordKeypress.bind(this), 'depositAmount')}
       placeholder="$$$$"
       type="text" />
       </div>
      </div>
      <br></br>
      <div className="col-md-12">
      <div className="col-md-3">
       <BS.ControlLabel>Deposit Due On</BS.ControlLabel>
      </div>
      <div className="col-md-3">
      <BS.FormControl
      value={store.depositDueOn}
      name="depositDueOn"
      placeholder="mm/dd/yyyy"
      onChange={_.partial(this.landlordKeypress.bind(this), 'depositDueOn')}
      type="text" />
      <BS.Glyphicon glyph="calendar" />
      </div>

      <div className="col-md-3">
       <BS.ControlLabel>Refundable Status</BS.ControlLabel>
      </div>
      <div className="col-md-3">
      {propertySele}
      </div>
      </div>
      <br></br>
      <div className="row">
      <div className="col-md-8 anotherDeposit">
          <BS.Button
          onClick={(e) => this.addAnotherDeposit(e)}
          className="add-button-otherDeposit"
          type="submit"
          bsStyle="success">
            Add Another Deposit
          </BS.Button>
      </div>
      </div>
     </div>
)

    const landlords = _.map(store.previousLandlords, (source, i) => {return this.renderLandlords(source, i)});

    const removeButton = (
      <BS.Button
      onClick={this.removeLandlord}
      className="remove-button"
      type="submit"
      bsStyle="success">
        Remove
      </BS.Button>
    );

    const previousLandlords = (
      <div className="previous-landlords">
        {landlords}
          <BS.Button
          onClick={(e) => this.addLandlord(e)}
          className="add-button"
          type="submit"
          bsStyle="success">
            Add
          </BS.Button>
          {landlords.length ? removeButton : null}
      </div>
    );

    const addAnotherDeposit = (
      <div className="addAnotherDeposit">
        {landlords}
          <BS.Button
          onClick={(e) => this.addAnotherDeposit(e)}
          className="add-button"
          type="submit"
          bsStyle="success">
            Add Another Deposit
          </BS.Button>
          {landlords.length ? removeButton : null}
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
            submit={_.partial(this.submit.bind(this), this.props.openPrevStep)}
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
              disabled={this.isMandatoryInvalid()}
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

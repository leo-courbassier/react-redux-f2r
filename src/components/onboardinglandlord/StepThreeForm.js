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

  keypress(e) {
    this.props.update(this.props.appState, e.target.name, e.target.value);
  }

  // a boolean method to check if mandatory fields are not filled
  isMandatoryInvalid(){
    return true;
  }

  isInvalid(){
  return true;
  }

  submit(openNextStep, e) {
    debugger;
    e.preventDefault();
    this.setState({submitted: true});

    let store = this.props.appState[STEP_ID];

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepThreeForm'];
    let allowSave = openNextStep ? isModified : true;

    if (allowSave) {
      this.props.save(
        store.landlordId,
        store.propertyId,
        store.leaseStartDate,
        store.leaseEndDate,
        store.rentAmount,
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
    console.log(source)
    return (
      <BS.FormGroup controlId="previousLandlords">
      <BS.ControlLabel>Landlord {i + 1}</BS.ControlLabel>
      <div className="row">
        <div className="item">
          <BS.ControlLabel>First Name</BS.ControlLabel>
          <BS.FormControl
          value='FirstName'
          name=""
          onChange={this.keypress.bind(this)}
          type="text" />
        </div>
        <div className="item">
          <BS.ControlLabel>Last Name</BS.ControlLabel>
          <BS.FormControl
          value={source.lastName}
          name=""
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
              <option value="Refundable">Refundable</option>
              <option value="Nonrefundable">Nonrefundable</option>
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
           value=''
           name="firstNameTenantAssignemt"

           type="text" />
           </div>
           <div className="col-md-3">
            <BS.ControlLabel>Last Name</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.lastNameTenantAssignemt}
           name="firstNameTenantAssignemt"

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
           value={store.email}
           name="email"
           onChange={_.partial(this.keypress.bind(this))}
           type="text" />
           </div>
           <div className="col-md-3">
            <BS.ControlLabel>Phone</BS.ControlLabel>
           </div>
           <div className="col-md-3">
           <BS.FormControl
           value={store.phone}
           name="phoneTenantAssignemt"
           onChange={_.partial(this.keypress.bind(this))}
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
    )

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
    )

    // const ownedPropertyInfo = (
    //
    //   <div className="owned-property-info">
    //     <BS.FormGroup controlId="ownedPropertyInfo">
    //     <div className="row">
    //       <div className="item">
    //         <BS.ControlLabel>Address</BS.ControlLabel>
    //         <BS.FormControl
    //         value={store.ownedAddress}
    //         onChange={this.keypress.bind(this)}
    //         name="ownedAddress"
    //         type="text" />
    //       </div>
    //       <div className="item">
    //         <BS.ControlLabel>State</BS.ControlLabel>
    //         <SelectOptions
    //           name="ownedState"
    //           onChange={_.partial(this.stateListKeypress.bind(this), 'ownedCityList')}
    //           defaultValue={store.ownedState}
    //           optionList={store.stateList}
    //           defaultOption
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="item">
    //           <BS.ControlLabel>City</BS.ControlLabel>
    //           <SelectOptions
    //             name="ownedCity"
    //             disabled={!store.ownedState}
    //             loading={this.props.appState.status.loading['ownedCityList']}
    //             loadingText="Retrieving cities..."
    //             onChange={this.keypress.bind(this)}
    //             defaultValue={store.ownedCity}
    //             optionList={this.props.appState.cities['ownedCityList']}
    //             defaultOption
    //             />
    //           </div>
    //           <div className="item">
    //             <BS.ControlLabel>Zip</BS.ControlLabel>
    //             <BS.FormControl
    //             value={store.ownedZip}
    //             onChange={this.keypress.bind(this)}
    //             name="ownedZip"
    //             type="text" />
    //           </div>
    //         </div>
    //         <div className="row">
    //           <div className="item">
    //             <BS.ControlLabel>Status</BS.ControlLabel>
    //             <SelectOptions
    //             name="ownerStatus"
    //             onChange={this.keypress.bind(this)}
    //             defaultValue={store.ownerStatus}
    //             optionList={ownerStatusOptionsList}
    //             valuesToUpper
    //               />
    //             </div>
    //             <div className="item">
    //               <BS.HelpBlock>
    //               <ul>
    //                 <li>Occupied - You’re currently living there</li>
    //                 <li>Leased - You’re currently leasing it out</li>
    //                 <li>Selling/Sold - Property sold or currently unoccupied but for sale</li>
    //                 <li>Foreclosed - Property is foreclosed and will show up on a Credit Report as such</li>
    //               </ul>
    //               </BS.HelpBlock>
    //             </div>
    //           </div>
    //           <div className="row">
    //             <div className="item">
    //               <BS.ControlLabel>If the home is sold, were you ever a Landlord while you owned it?</BS.ControlLabel>
    //               <Switch
    //               onColor="success"
    //               offColor="success"
    //               onText="Yes"
    //               offText="No"
    //               size="mini"
    //               onChange={_.partial(this.switchKeypress.bind(this), 'isLandlord')}
    //               state={store.isLandlord} />
    //             </div>
    //           </div>
    //           </BS.FormGroup>
    //         </div>
    // );

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

  )


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
      <br></br>
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

)


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
      onChange={_.partial(this.keypress.bind(this))}
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
   </BS.Collapse>
)

    //const landlords = _.map(store.previousLandlords, (source, i) => {return this.renderLandlords(source, i)});

    const removeButton = (
      <BS.Button
      onClick={this.removeLandlord}
      className="remove-button"
      type="submit"
      bsStyle="success">
        Remove
      </BS.Button>
    );

    // const previousLandlords = (
    //   <div className="previous-landlords">
    //     {landlords}
    //       <BS.Button
    //       onClick={(e) => this.addLandlord(e)}
    //       className="add-button"
    //       type="submit"
    //       bsStyle="success">
    //         Add
    //       </BS.Button>
    //       {landlords.length ? removeButton : null}
    //   </div>
    // );

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

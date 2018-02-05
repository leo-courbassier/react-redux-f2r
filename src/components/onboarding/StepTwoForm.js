import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../SubmitButton';
import SelectOptions from '../SelectOptions';
import _ from 'underscore';
import * as Validation from '../../utils/validation';
import isEmail from 'validator/lib/isEmail';
import isCurrency from 'validator/lib/isCurrency';

import * as api from '../../actions/api';


const STEP_ID = 1;
const MAX_INCOME_SOURCES = 10;

class StepTwoForm extends Component {

  state = {
    submitted: false
  }


  componentWillMount() {
    this.props.load();
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


  stateListKeypress(cityList, e){
    this.props.update(this.props.appState, e.target.name, e.target.value);
    let store = this.context.store;
    this.getCityList(e.target.value, cityList);
  }

  incomeKeypress(i, e){
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].incomeSources;

    if (e.target.name == 'amount') {
      sources[i].amount = e.target.value;
    }else{
      sources[i].type = e.target.value;
    }

    api.setStatus(this.context.store.dispatch, 'modified', 'stepTwoForm', true);
    store.dispatch({ type: types.ONBOARDING_STEPTWO_UPDATE_INCOME_SOURCES, sources });
  }

  handleFileChange(statusAction, sourceIndex, e, results){
    let sources = this.props.appState[STEP_ID].incomeSources;
    results.forEach(result => {
      const [e, file] = result;
      this.props.upload(file, statusAction, sources, sourceIndex);
    });
  }

  // a boolean method to check if mandatory fields are not filled
  isMandatoryInvalid(){
    let store = this.props.appState[STEP_ID];

    if (
      !store.employerFirstName ||
      !store.employerLastName ||
      !store.employerPhone ||
      !store.employerEmail
      )
    {
      return true;
    }

    if (
      !store.jobTitle ||
      !store.jobSalary ||
      !store.jobEmployer ||
      !store.jobCity ||
      !store.jobState
      )
    {
      return true;
    }

    return false;
  }

  isInvalid(){
    let store = this.props.appState[STEP_ID];
    let invalid = false;
    let currencyOptions = {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'};

    for (let source of store.incomeSources) {
      let keyExists = source && source.hasOwnProperty('documentationProvided');
      if (!keyExists || (keyExists && !source.documentationProvided)) {
        invalid = 'Other Income must have an uploaded document.'
      }

      if (source && source.amount) {
        let amount = source.amount.toString().trim().replace(/\$|,/g, '');
        if (!isCurrency(amount, currencyOptions)) {
          invalid = 'Other Income Amount must be in 0.00 format.'
        }
      } else {
        invalid = 'Other Income must have an amount.'
      }
    }

    if (store.employerPhone && store.employerPhone.replace(/\D/g,'').trim().length < 10){
      invalid = 'Employer Phone must be at least a 10 digit number.'
    }

    if (store.employerEmail && !isEmail(store.employerEmail)) {
      invalid = 'Employer Email must be a valid email address.'
    }

    if (
      !store.employerFirstName ||
      !store.employerLastName ||
      !store.employerPhone ||
      !store.employerEmail
      )
    {
      invalid = 'Please provide your employer information.'
    }

    if (
      !store.jobTitle ||
      !store.jobSalary ||
      !store.jobEmployer ||
      !store.jobCity ||
      !store.jobState
      )
    {
      invalid = 'Please provide your job information.'
    }

    let jobSalary = store.jobSalary ? store.jobSalary.toString().trim().replace(/\$|,/g, '') : store.jobSalary;
    if (store.jobSalary && !isCurrency(jobSalary, currencyOptions)) {
      invalid = 'Job Salary must be in 0.00 format.'
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

    // strip dollar sign, commas, and decimals
    let jobSalary = store.jobSalary && Math.floor(store.jobSalary.toString().trim().replace(/\$|,/g, '')).toString();
    let incomeSources = [];
    for (let source of store.incomeSources) {
      if (source) {
        let newSource = source;
        newSource.amount = Math.floor(source.amount.toString().trim().replace(/\$|,/g, ''));
        incomeSources.push(newSource);
      }
    }

    // format phone number before saving to API
    let employerPhone = store.employerPhone;
    if (employerPhone && employerPhone.replace(/\D/g,'').trim().length === 10) {
      let number = employerPhone.replace(/\D/g,'').trim();
      let parts = [number.substring(0, 3), number.substring(3, 6), number.substring(6, 10)];
      employerPhone = `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepTwoForm'];
    let allowSave = openNextStep ? isModified : true;

    if (allowSave) {
      this.props.save(
        store.jobTitle,
        jobSalary,
        store.jobEmployer,
        store.jobCity,
        store.jobState,

        store.employerId,
        store.employerFirstName,
        store.employerLastName,
        employerPhone,
        store.employerEmail,
        incomeSources,
        openNextStep,
        this.props.updateOnboardingScore
        );
    } else {
      if (openNextStep) openNextStep();
    }
  }

  addIncomeSource = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepTwoForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].incomeSources;

    if (MAX_INCOME_SOURCES > sources.length){
      sources.push({amount: null, type: "0", id:_.uniqueId(), documentationProvided: false});
      store.dispatch({ type: types.ONBOARDING_STEPTWO_UPDATE_INCOME_SOURCES, sources });
    }
  }

  removeIncomeSource = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepTwoForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].incomeSources;
    sources.pop();
    delete this.props.appState.status.uploading[`incomeUpload${sources.length}`];
    store.dispatch({ type: types.ONBOARDING_STEPTWO_UPDATE_INCOME_SOURCES, sources });
  }

  renderIncomeSources = (source, i) => {
    let store = this.props.appState[STEP_ID];
    let statusAction = `incomeUpload${i}`;
    let docId = `income-${i}`;
    let docCss = `document-upload ${docId}`;
    let selected = (source.type == this.value) ? 'selected' : '';

    let typeOptions = {0:'Disability', 1:'Pension', 2:'Social Security', 3:'Side-Business / Second Job'};
    let defaultValue = source.type;
    let uploadComplete = this.props.appState.status.uploading[statusAction] == false;

    return (
      <BS.FormGroup controlId="profileImage">
          <div className="row">
            <div className="item">
              <BS.ControlLabel>Type</BS.ControlLabel>



            <SelectOptions
            name="type"
            onChange={_.partial(this.incomeKeypress.bind(this), i)}
            defaultValue={defaultValue}
            optionList={typeOptions}
            keyValue
             />



            </div>
            <div className="item">
              <BS.ControlLabel>Amount</BS.ControlLabel>
              <BS.InputGroup>
                <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                <BS.FormControl
                className="amount"
                name="amount"
                onChange={_.partial(this.incomeKeypress.bind(this), i)}
                componentClass="textarea">
                {source.amount}
                </BS.FormControl>
              </BS.InputGroup>
            </div>
            <div className="item upload">
              <BS.ControlLabel
              title="Upload Supporting Documentation"
              className="upload-label">Upload Supporting Documentation</BS.ControlLabel>
              <FileReaderInput
              name={docId}
              as="url"
              id={docCss}
              onChange={_.partial(this.handleFileChange.bind(this), statusAction, i)}>

                <SubmitButton
                className="upload-button"
                appState={this.props.appState}
                statusAction={statusAction}
                textLoading="Uploading">
                  Upload Document
                </SubmitButton>
                <BS.HelpBlock>
                  {uploadComplete ? 'Upload complete.' : ''}
                </BS.HelpBlock>
              </FileReaderInput>
            </div>
          </div>

      </BS.FormGroup>
    );
  }





  render() {

    let store = this.props.appState[STEP_ID];


    const yourJob = (
      <div className="your-job">
        <BS.FormGroup controlId="yourJob">
          <div className="row">
            <div className="item">
            <BS.ControlLabel>Title</BS.ControlLabel>
            <BS.FormControl
            value={store.jobTitle}
            onChange={this.keypress.bind(this)}
            name="jobTitle"
            type="text" />
            </div>
            <div className="item">
            <BS.ControlLabel>Annual Salary</BS.ControlLabel>
            <BS.InputGroup>
              <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
              <BS.FormControl
              value={store.jobSalary}
              onChange={this.keypress.bind(this)}
              name="jobSalary"
              type="text" />
            </BS.InputGroup>
            </div>
          </div>
          <div className="row">
            <div className="item">
            <BS.ControlLabel>Employer</BS.ControlLabel>
            <BS.FormControl
            value={store.jobEmployer}
            onChange={this.keypress.bind(this)}
            name="jobEmployer"
            type="text" />
            </div>

            <div className="item">

            <BS.ControlLabel>State</BS.ControlLabel>


            <SelectOptions
            name="jobState"
            onChange={_.partial(this.stateListKeypress.bind(this), 'jobCityList')}
            defaultValue={store.jobState}
            optionList={store.stateList}
            defaultOption
             />


            </div>




            <div className="item">
            <BS.ControlLabel>City</BS.ControlLabel>


            <SelectOptions
            name="jobCity"
            disabled={!store.jobState}
            loading={this.props.appState.status.loading['jobCityList']}
            loadingText="Retrieving cities..."
            onChange={this.keypress.bind(this)}
            defaultValue={store.jobCity}
            optionList={this.props.appState.cities['jobCityList']}
            defaultOption
             />


            </div>



          </div>
        </BS.FormGroup>
      </div>
    );

    const employerContact = (
      <div className="employer-contact">
        <BS.FormGroup controlId="employerContact">
          <div className="row">
            <div className="item">
            <BS.ControlLabel>First Name</BS.ControlLabel>
            <BS.FormControl
            value={store.employerFirstName}
            onChange={this.keypress.bind(this)}
            name="employerFirstName"
            type="text" />
            </div>
            <div className="item">
            <BS.ControlLabel>Last Name</BS.ControlLabel>
            <BS.FormControl
            value={store.employerLastName}
            onChange={this.keypress.bind(this)}
            name="employerLastName"
            type="text" />
            </div>
          </div>
          <div className="row">
            <div className="item">
            <BS.ControlLabel>Phone</BS.ControlLabel>
            <BS.FormControl
            value={store.employerPhone}
            onChange={this.keypress.bind(this)}
            name="employerPhone"
            type="text" />
            </div>
            <div className="item">
            <BS.ControlLabel>Email</BS.ControlLabel>
            <BS.FormControl
            value={store.employerEmail}
            onChange={this.keypress.bind(this)}
            name="employerEmail"
            type="text" />
            </div>
          </div>
        </BS.FormGroup>
      </div>
    );


    const sources = _.map(store.incomeSources, (source, i) => {return this.renderIncomeSources(source, i)});

    const removeButton = (
      <BS.Button
      onClick={this.removeIncomeSource}
      className="remove-button"
      type="submit"
      bsStyle="success">
        Remove
      </BS.Button>
    );

    const incomeSources = (
      <div className="income-sources">
        {sources}
          <BS.Button
          onClick={(e) => this.addIncomeSource(e)}
          className="add-button"
          type="submit"
          bsStyle="success">
            Add
          </BS.Button>
          {sources.length ? removeButton : null}
      </div>
    );

    let warn = this.isInvalid() ? (<span className="warn">* <span className="text">{this.state.submitted ? this.isInvalid() : ''}</span></span>) : '';
    let jobWarn = '';
    let employerWarn = '';
    if(this.isInvalid() && this.isInvalid().indexOf('employer') > -1){
      employerWarn = warn;
      jobWarn = '';
    }else{
      jobWarn = warn;
      employerWarn = '';
    }



    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepTwoForm">
        <div className="step step-two">
          <form>
            <div className="section">Your Job{jobWarn}</div>
            {yourJob}
            <div className="section">Your Employer Contact{employerWarn}</div>
            <BS.HelpBlock>
              Please provide contact information for a manager or HR personnel that can verify your employment and salary.
            </BS.HelpBlock>
            {employerContact}
            <div className="section">Other Sources of Income</div>
            <BS.HelpBlock>
              Do you have additional sources of income such as a side business or retirement? Add the income type, amount, and any supporting documentation for verification. We keep all this information confidential and don’t store it after it’s verified in order to protect you.
            </BS.HelpBlock>
            {incomeSources}
          </form>
          <BS.HelpBlock className="pullLeft warn">
            {this.state.submitted ? this.isInvalid() : ''}
          </BS.HelpBlock>


          <div className="onboarding-submit">
            <SubmitButton
            appState={this.props.appState}
            statusAction="stepTwoForm"
            submit={_.partial(this.submit.bind(this), false)}
            textLoading="Saving"
            textModified="Save Changes"
            bsStyle="primary">
              Save
            </SubmitButton>
            {this.props.showProceed && (
              <SubmitButton
              appState={this.props.appState}
              statusAction="stepTwoFormProceed"
              submit={_.partial(this.submit.bind(this), this.props.openNextStep)}
              textLoading="Saving"
              disabled={this.isMandatoryInvalid()}
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


StepTwoForm.contextTypes = {
  store: PropTypes.object
};

export default StepTwoForm;

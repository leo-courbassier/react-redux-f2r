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
    debugger;
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

  // propertyTypeListKeypress(propertyTypeList, e){
  //   this.props.update(this.props.appState, e.target.name, e.target.value);
  //   let store = this.context.store;
  //   this.getCityList(e.target.value, propertyTypeList);
  // }


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

    // if (
    //   !store.employerFirstName ||
    //   !store.employerLastName ||
    //   !store.employerPhone ||
    //   !store.employerEmail
    //   )
    // {
    //   return true;
    // }

    // if (
    //   !store.jobTitle ||
    //   !store.jobSalary ||
    //   !store.jobEmployer ||
    //   !store.jobCity ||
    //   !store.jobState
    //   )
    // {
    //   return true;
    // }

    //return false;
  }



  submit(openNextStep, e) {
    e.preventDefault();
    this.setState({submitted: true});

    let store = this.props.appState[STEP_ID];

    // strip dollar sign, commas, and decimals
    //let jobSalary = store.jobSalary && Math.floor(store.jobSalary.toString().trim().replace(/\$|,/g, '')).toString();
    let incomeSources = [];
    if( store.incomeSources ){
      for (let source of store.incomeSources) {
        if (source) {
          let newSource = source;
          //newSource.amount = Math.floor(source.amount.toString().trim().replace(/\$|,/g, ''));
          incomeSources.push(newSource);
        }
      }
    }


    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepTwoForm'];
    let allowSave = openNextStep ? isModified : true;

    if (allowSave) {
      this.props.save(
        store.landlordId,
        store.propertyTitle,
        store.address1,
        store.address2,
        store.city,
        store.state,
        store.zipCode,
        store.propertyClass,
        store.propertyStatus,
        store.numBeds,
        store.numBaths,
        store.rent,
        store.headline,
        store.sqft,
        store.beganRentingDate,
        store.amenityList,
        openNextStep,
        store.incomeSources
        );
    } else {
      if (openNextStep) this.props.openNextStep();
    }
  }

  addIncomeSource = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepTwoForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].incomeSources;

    if (sources && MAX_INCOME_SOURCES > sources.length || !this.props.appState[STEP_ID].incomeSources){
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
    const MyPropertyTypeList = (
      <select className="form-control">
          <option value=""></option>
          <option value="APT">Apartment</option>
          <option value="SFM">Single Family Home</option>
          <option value="CONDO">Condo</option>
          <option value="DUPLEX">Duplex</option>
          <option value="MOBILE_HOME">Mobile Home</option>
          <option value="TOWNHOUSE">Town Home</option>
      </select>
  )

  const bedDropdown = (
        <select id="bed" className="form-control">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
  )

  const bathDropdown = (
        <select id="bath" className="form-control">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
  )


    return (
      <div className="your-job">
        <BS.FormGroup controlId="yourJob">
          <div className="row">
          <div className='col-md-4 buttonStep2'>

            <FileReaderInput
            name="profilePic"
            as="url"
            id="profile-pic-upload"
            onChange={this.handleFileChange.bind(this)}>

              <SubmitButton
              className="upload-button"
              appState={this.props.appState}

              statusAction="profilePicUpload"
              textLoading="Uploading">
              <BS.Glyphicon glyph="upload" />
                Upload Cover Photo
              </SubmitButton>
              <BS.HelpBlock className="text-center">
                <span className="text-success">
                  {uploadComplete ? 'Profile image updated.' : ''}
                </span>
              </BS.HelpBlock>

            </FileReaderInput>
          </div>
            <div className='col-md-4'>
            <BS.ControlLabel>Property Title</BS.ControlLabel>
            <BS.FormControl
            value={store.propertyTitle}
            onChange={this.keypress.bind(this)}
            name="propertyTitle"
            id="propertyTitle"
            type="text" />
            </div>
            <div className='col-md-4'>
            <BS.ControlLabel>Property Type</BS.ControlLabel>
             {MyPropertyTypeList}
            </div>
          </div>
            <div className="row">
            <BS.ControlLabel>Address 1</BS.ControlLabel>
              <div className="item">
                <BS.FormControl
                 value={store.address1}
                 onChange={this.keypress.bind(this)}
                 name="address1"
                 type="text" />
              </div>
            </div>
            <div className="row">
             <BS.ControlLabel>Address 2</BS.ControlLabel>
              <div className="item">
              <BS.FormControl
              value={store.address2}
              onChange={this.keypress.bind(this)}
              name="address2"
              type="text" />
              </div>
            </div>
            <div className="row">
             <div className="item">
                <BS.ControlLabel>City</BS.ControlLabel>
                <SelectOptions
                name="city"
                loading={this.props.appState.status.loading['cityList']}
                loadingText="Retrieving cities..."
                onChange={this.keypress.bind(this)}
                defaultValue={store.city}
                optionList={this.props.appState.cities['cityList']}
                defaultOption
                 />
               </div>
               <div className="item">
                  <BS.ControlLabel>State</BS.ControlLabel>
                  <SelectOptions
                  name="stateList"
                  onChange={this.keypress.bind(this)}
                  defaultValue={store.state}
                  optionList={store.stateList}
                  defaultOption
                   />
              </div>
              <div className="item">
              <BS.ControlLabel>Zip Code</BS.ControlLabel>
                <BS.FormControl
                defaultValue={store.zipCode}
                onChange={this.keypress.bind(this)}
                name="zipCode"
                type="text" />
              </div>
            </div>
            <div className="row">
              <div className='item '>
               <BS.ControlLabel>Sq Ft</BS.ControlLabel>
               <BS.FormControl
               defaultValue={store.sqft}
               onChange={this.keypress.bind(this)}
               name="sqft"
               type="text" />
               </div>
               <div className='item'>
               <BS.ControlLabel>Bed</BS.ControlLabel>
               {bedDropdown}
               </div>
               <div className='item'>
                <BS.ControlLabel>Bath</BS.ControlLabel>
               {bathDropdown}
               </div>
              </div>

        </BS.FormGroup>
      </div>
    );
  }


  render() {

    let store = this.props.appState[STEP_ID];
    let uploadComplete = this.props.appState.status.uploading['profilePicUpload'] == false;

    const yourPropertyInfo = (
      <div className="info-property">
      <b>Here you’ll enter your property information. We ll need this info so we can track your tenants and payments against</b><br></br>
      <b>specific properties and report that information to you in the My Payments section of your dashboard.</b>
      </div>
    )


    const bedDropdown = (
          <select id="bed" className="form-control">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
          </select>
    )

    const bathDropdown = (
          <select id="bath" className="form-control">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
          </select>
    )


     const MyPropertyTypeList = (
       <select className="form-control">
           <option value=""></option>
           <option value="APT">Apartment</option>
           <option value="SFM">Single Family Home</option>
           <option value="CONDO">Condo</option>
           <option value="DUPLEX">Duplex</option>
           <option value="MOBILE_HOME">Mobile Home</option>
           <option value="TOWNHOUSE">Town Home</option>
       </select>
   )

   console.log(this.props.appState)

    const yourPropertyData = (
      <div className="your-job">
        <BS.FormGroup controlId="yourJob">
          <div className="row">
          <div className='col-md-4 buttonStep2'>

            <FileReaderInput
            name="profilePic"
            as="url"
            id="profile-pic-upload"
            onChange={this.handleFileChange.bind(this)}>

              <SubmitButton
              className="upload-button"
              appState={this.props.appState}

              statusAction="profilePicUpload"
              textLoading="Uploading">
              <BS.Glyphicon glyph="upload" />
                Upload Cover Photo
              </SubmitButton>
              <BS.HelpBlock className="text-center">
                <span className="text-success">
                  {uploadComplete ? 'Profile image updated.' : ''}
                </span>
              </BS.HelpBlock>

            </FileReaderInput>
          </div>
            <div className='col-md-4'>
            <BS.ControlLabel>Property Title</BS.ControlLabel>
            <BS.FormControl
            value={store.propertyTitle}
            onChange={this.keypress.bind(this)}
            name="propertyTitle"
            id="propertyTitle"
            type="text" />
            </div>
            <div className='col-md-4'>
            <BS.ControlLabel>Property Type</BS.ControlLabel>
             {MyPropertyTypeList}
            </div>
          </div>
            <div className="row">
            <BS.ControlLabel>Address 1</BS.ControlLabel>
              <div className="item">
                <BS.FormControl
                 value={store.address1}
                 onChange={this.keypress.bind(this)}
                 name="address1"
                 type="text" />
              </div>
            </div>
            <div className="row">
             <BS.ControlLabel>Address 2</BS.ControlLabel>
              <div className="item">
              <BS.FormControl
              value={store.address2}
              onChange={this.keypress.bind(this)}
              name="address2"
              type="text" />
              </div>
            </div>
            <div className="row">
             <div className="item">
                <BS.ControlLabel>City</BS.ControlLabel>
                <SelectOptions
                name="city"
                loading={this.props.appState.status.loading['cityList']}
                loadingText="Retrieving cities..."
                onChange={this.keypress.bind(this)}
                defaultValue={store.city}
                optionList={this.props.appState.cities['cityList']}
                defaultOption
                 />
               </div>
               <div className="item">
                  <BS.ControlLabel>State</BS.ControlLabel>
                  <SelectOptions
                  name="stateList"
                  onChange={this.keypress.bind(this)}
                  defaultValue={store.state}
                  optionList={store.stateList}
                  defaultOption
                   />
              </div>
              <div className="item">
              <BS.ControlLabel>Zip Code</BS.ControlLabel>
                <BS.FormControl
                defaultValue={store.zipCode}
                onChange={this.keypress.bind(this)}
                name="zipCode"
                type="text" />
              </div>
            </div>
            <div className="row">
              <div className='item '>
               <BS.ControlLabel>Sq Ft</BS.ControlLabel>
               <BS.FormControl
               defaultValue={store.sqft}
               onChange={this.keypress.bind(this)}
               name="sqft"
               type="text" />
               </div>
               <div className='item'>
               <BS.ControlLabel>Bed</BS.ControlLabel>
               {bedDropdown}
               </div>
               <div className='item'>
                <BS.ControlLabel>Bath</BS.ControlLabel>
               {bathDropdown}
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
      <div>
        <div className="col-md-4">
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

    let warn = (<span className="warn">* <span className="text">{this.state.submitted}</span></span>);
    let jobWarn = '';
    let employerWarn = '';




    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepTwoForm">
        <div className="step step-two">

          <form>
            <div className="section">Property Info{jobWarn}</div>
            {yourPropertyInfo}
            <div className="section">Property #1{jobWarn}</div>
            {yourPropertyData}
            <div className="section"></div>
            <div className="row">
           <div className="col-md-4">
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
              <BS.HelpBlock className="pullLeft warn">
                {this.state.submitted}
              </BS.HelpBlock>
            </div>
            {incomeSources}
            <div className="col-md-4">
                <div className="onboarding-submit">
                        <SubmitButton
                        appState={this.props.appState}
                        statusAction="stepTwoForm"
                        submit={_.partial(this.submit.bind(this), false)}
                        textLoading=""
                        textModified="Save Changes"
                        bsStyle="primary">
                          Next
                        </SubmitButton>
                  </div>
              </div>
            </div>
         </form>
        </div>
      </Loader>
    );



  }

}


StepTwoForm.contextTypes = {
  store: PropTypes.object
};

export default StepTwoForm;

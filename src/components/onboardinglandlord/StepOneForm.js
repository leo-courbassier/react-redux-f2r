import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SelectOptions from '../SelectOptions';
import SubmitButton from '../SubmitButton';
import _ from 'underscore';

import InfoTooltip from '../InfoTooltip';

import * as Conversion from '../../utils/conversion';
import isEmail from 'validator/lib/isEmail';

import * as services from '../../constants/Services';

const STEP_ID = 0;

class StepOneForm extends Component {

  state = {
    submitted: false
  }

  componentWillMount() {
    this.props.load();
  }

  componentWillUnmount(){
    delete this.props.appState.status.uploading['profilePicUpload'];
  }

  keypress(e) {
    this.props.update(this.props.appState, e.target.name, e.target.value);
  }

  handleFileChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      this.props.upload(file);
    });
  }

  handleLinkedinAuthorization() {
    let store = this.props.appState[STEP_ID];
    window.open(services.LINKEDIN_AUTHORIZE+'?token='+encodeURIComponent(store.facebookToken));
  }

  handleFacebookAuthorization() {
    let store = this.props.appState[STEP_ID];
    window.open(services.FACEBOOK_AUTHORIZE+'?token='+encodeURIComponent(store.facebookToken));
  }

  petOptions(i, store, total, type){
    let count = store[type];
    let selected = (i == count) ? 'selected' : '';
    let bookend = (i == (total - 1)) ? ' or more' : '';
    return (
      <option selected={selected} value={i}>{i}{bookend}</option>
    );
  }

  // a boolean method to check if mandatory fields are not filled
  isMandatoryInvalid(){
    let store = this.props.appState[STEP_ID];

    if(!store.dobMonth || !store.dobDay || !store.dobYear){
      return true;
    }

    return false;
  }

  isInvalid(){

    let store = this.props.appState[STEP_ID];

    // if(!store.dobMonth || !store.dobDay || !store.dobYear){
    //   return 'Please provide your date of birth.';
    // }

    // const alternativeEmailExt = store.alternativeEmail ? store.alternativeEmail.substr(store.alternativeEmail.length - 4) : store.alternativeEmail;
    // if(store.alternativeEmail && (!isEmail(store.alternativeEmail) || alternativeEmailExt !== '.mil')) {
    //   return 'Please provide a valid military email address.';
    // }

    return true;
  }

  submit(openNextStep, e) {
    e.preventDefault();
    this.setState({submitted: true});

    // if(this.isInvalid()){
    //   //return false;
    // }

    let store = this.props.appState[STEP_ID];
    let isActiveDutyMilitary = store.alternativeEmail ? true : false;

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepOneForm'];
    let allowSave = openNextStep ? isModified : true;
     openNextStep=true;
    if (allowSave) {
      this.props.save(
        store.description,
        // store.dobMonth,
        // store.dobDay,
        // store.dobYear,
        store.dogs,
        store.cats,
        store.other,
        // store.alternativeEmail,
        // isActiveDutyMilitary,
        openNextStep,
        this.props.updateOnboardingScore,
        this.props.openNextStep
        );
    } else {
      if (openNextStep) this.props.openNextStep();
    }
  }


  render() {

    let store = this.props.appState[STEP_ID];

    const imageURL = this.props.userInfo.profilePicURL ? Conversion.urlToHttps(this.props.userInfo.profilePicURL) : '';

    let petOptions = [0,1,2,3,4];

    let dogs = _.map(petOptions, (i) => {
      return this.petOptions(i, store, petOptions.length, 'dogs');
    });
    let cats = _.map(petOptions, (i) => {
      return this.petOptions(i, store, petOptions.length, 'cats');
    });
    let other = _.map(petOptions, (i) => {
      return this.petOptions(i, store, petOptions.length, 'other');
    });

    let months = {1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'};
    let days = [];
    let years = [];

    for (let day = 1; day <= 31; day++) {
      day < 10 ? days.push('0'+day) : days.push(day);
    }

    for (let year = new Date().getFullYear(); year >= 1900; year--) {
      years.push(year);
    }

    let isFacebookLinked = false;
    let isLinkedinLinked = false;
    let facebookUsername = null;
    let linkedinUsername = null;

    if (store.linkedAccounts) {
      for (let acct of store.linkedAccounts) {
        if (acct.indexOf('linkedin') !== -1) {
          isLinkedinLinked = true;
          linkedinUsername = acct.split('|')[1];
        }

        if (acct.indexOf('facebook') !== -1) {
          isFacebookLinked = true;
          facebookUsername = acct.split('|')[1];
        }
      }
    }

    let uploadComplete = this.props.appState.status.uploading['profilePicUpload'] == false;

    let warn = this.isInvalid() ? (<span className="warn">* <span className="text">{this.state.submitted ? this.isInvalid() : ''}</span></span>) : '';

    const profileImage = (
      <div className="profile-image">

        <BS.FormGroup controlId="profileImage">

          <div className="row">

            <div className='item'>
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
                  Upload
                </SubmitButton>
                <BS.HelpBlock className="text-center">
                  <span className="text-success">
                    {uploadComplete ? 'Profile image updated.' : ''}
                  </span>
                </BS.HelpBlock>


              </FileReaderInput>
            </div>

            <div className='item'>
              <BS.Image src={imageURL} circle />
            </div>

          </div>

        </BS.FormGroup>
      </div>
    );

    const personalDescription = (
      <BS.FormGroup controlId="personalDescription">
        <BS.FormControl name="description"
          onChange={this.keypress.bind(this)}
          componentClass="textarea"
          value={store.description} />
      </BS.FormGroup>
    );

    const dateOfBirth = (
      <BS.FormGroup controlId="dateOfBirth">
        <div className="date-of-birth">
          <div className="row">
            <div className="item">
              <BS.ControlLabel>Month</BS.ControlLabel>
              <SelectOptions
                onChange={this.keypress.bind(this)}
                name="dobMonth"
                optionList={months}
                defaultOption="Month..."
                defaultOptionName="Month..."
                defaultValue={store.dobMonth}
                keyValue
               />
            </div>
            <div className="item">
              <BS.ControlLabel>Day</BS.ControlLabel>
              <SelectOptions
                onChange={this.keypress.bind(this)}
                name="dobDay"
                optionList={days}
                defaultOption="Day..."
                defaultOptionName="Day..."
                defaultValue={store.dobDay}
               />
            </div>
            <div className="item">
              <BS.ControlLabel>Year</BS.ControlLabel>
              <SelectOptions
                onChange={this.keypress.bind(this)}
                name="dobYear"
                optionList={years}
                defaultOption="Year..."
                defaultOptionName="Year..."
                defaultValue={store.dobYear}
               />
            </div>
          </div>
        </div>
      </BS.FormGroup>
    );

    const pets = (
      <BS.FormGroup controlId="pets">
        <div className="pets">
          <div className="row">
            <div className="item">
              <BS.ControlLabel>Dogs</BS.ControlLabel>
              <BS.FormControl name="dogs"
              onChange={this.keypress.bind(this)}
              componentClass="select">
                {dogs}
              </BS.FormControl>
            </div>
            <div className="item">
              <BS.ControlLabel>Cats</BS.ControlLabel>
              <BS.FormControl name="cats"
              onChange={this.keypress.bind(this)}
              componentClass="select">
                {cats}
              </BS.FormControl>
            </div>
            <div className="item">
              <BS.ControlLabel>Other</BS.ControlLabel>
              <BS.FormControl name="other"
              onChange={this.keypress.bind(this)}
              componentClass="select">
                {other}
              </BS.FormControl>
            </div>
          </div>
        </div>
      </BS.FormGroup>
    );

    const linkFacebook = (
      <a onClick={this.handleFacebookAuthorization.bind(this)}>
        <div className="data-uri facebook" />
      </a>
    );

    const linkedFacebook = facebookUsername ? (
      <div className="facebook linked">Facebook account "{facebookUsername}" linked successfully.</div>
    ) : (
      <div className="facebook linked">You have successfully linked Facebook.</div>
    );

    const linkLinkedin = (
      <a onClick={this.handleLinkedinAuthorization.bind(this)}>
        <div className="data-uri linkedin"><span className="warn">*</span></div>
      </a>
    );

    const linkedLinkedin = linkedinUsername ? (
      <div className="linkedin linked">LinkedIn account "{linkedinUsername}" linked successfully.</div>
    ) : (
      <div className="linkedin linked">You have successfully linked LinkedIn.</div>
    );

    const socialTooltip = (
      <span>
        <h7><b>Easy Points</b></h7>
        <p>Watch your F2R score grow by linking your Facebook and LinkedIn accounts.</p>
      </span>
    );

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepOneForm">
        <div className="step step-one">
          <form>
            <div className="section">Profile Pic</div>
            <BS.HelpBlock>
              No one will see your profile pic unless you want them to. But having one will help everyone know that you’re real.
            </BS.HelpBlock>
            {profileImage}
            <div className="section">Personal Description</div>
            <BS.HelpBlock>
              Tell us and prospective tenants about yourself, your properties, your family, your interests, or anything else.
            </BS.HelpBlock>
            {personalDescription}

          </form>
          <BS.HelpBlock className="pullLeft warn">
            {this.state.submitted}
          </BS.HelpBlock>
            <div className="landlord-previous">
                   {this.props.showProceed && (
                      <SubmitButton
                      appState={this.props.appState}

                      submit={_.partial(this.props.openPreviousStep)}
                      disabled={this.isMandatoryInvalid()}
                      bsStyle="success"
                      className="prev-button">
                        Previous
                      </SubmitButton>
                    )}
        </div>

         <div className="landlord-skyp">
                   {this.props.showProceed && (
                      <SubmitButton
                      appState={this.props.appState}

                      submit={_.partial(this.props.openNextStep)}
                      bsStyle="success"
                      className="skyp-button">
                        Skip
                      </SubmitButton>
                    )}
          </div>
          <div className="onboarding-submit">
            <SubmitButton
            appState={this.props.appState}
            statusAction="stepOneFormProceed"
            submit={_.partial(this.submit.bind(this), false)}
            textLoading="Saving"
            textModified="Next"
            bsStyle="primary">
              Next
            </SubmitButton>
          </div>

        </div>
      </Loader>
    );



  }

}


StepOneForm.contextTypes = {
  store: PropTypes.object
};

export default StepOneForm;

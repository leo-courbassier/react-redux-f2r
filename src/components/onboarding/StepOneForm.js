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

    if(!store.dobMonth || !store.dobDay || !store.dobYear){
      return 'Please provide your date of birth.';
    }

    const alternativeEmailExt = store.alternativeEmail ? store.alternativeEmail.substr(store.alternativeEmail.length - 4) : store.alternativeEmail;
    if(store.alternativeEmail && (!isEmail(store.alternativeEmail) || alternativeEmailExt !== '.mil')) {
      return 'Please provide a valid military email address.';
    }

    return false;
  }

  submit(openNextStep, e) {
    e.preventDefault();
    this.setState({submitted: true});
    if(this.isInvalid()){
      return false;
    }

    let store = this.props.appState[STEP_ID];
    let isActiveDutyMilitary = store.alternativeEmail ? true : false;

    // if proceed button is clicked, only save if form has been modified
    // otherwise, save button will always trigger a save
    let isModified = this.props.appState.status['modified']['stepOneForm'];
    let allowSave = openNextStep ? isModified : true;

    if (allowSave) {
      this.props.save(
        store.description,
        store.dobMonth,
        store.dobDay,
        store.dobYear,
        store.dogs,
        store.cats,
        store.other,
        store.alternativeEmail,
        isActiveDutyMilitary,
        openNextStep,
        this.props.updateOnboardingScore
        );
    } else {
      if (openNextStep) openNextStep();
    }
  }


  render() {

    let store = this.props.appState[STEP_ID];

    const imageURL = this.props.userInfo.profilePicURL ? Conversion.urlToHttps(this.props.userInfo.profilePicURL) : '';

    let petOptions = [0,1,2,3,4];

    let dogs = _.map(petOptions, (i) => {return this.petOptions(i, store, petOptions.length, 'dogs')});
    let cats = _.map(petOptions, (i) => {return this.petOptions(i, store, petOptions.length, 'cats')});
    let other = _.map(petOptions, (i) => {return this.petOptions(i, store, petOptions.length, 'other')});

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
                  Select an Image
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
        value={store.description}>
        </BS.FormControl>
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
        <div className="data-uri facebook"></div>
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
            <div className="section">Profile Image</div>
            <BS.HelpBlock>
              Smile! Select your favorite photo for your profile. You will receive an Anonymous Rent Mandate as well as a Personalized Rent Mandate, complete with your picture and personal description. You have the power to choose how much information to share with unknown landlords.
            </BS.HelpBlock>
            {profileImage}
            <div className="section">Personal Description</div>
            <BS.HelpBlock>
              Tell us and prospective landlords about yourself, your family, and/or your interests.
            </BS.HelpBlock>
            {personalDescription}
            <div className="section">Date of Birth{warn}</div>
            <BS.HelpBlock>
              Please tell us your birthday! (We’ll eat cake that day.)
            </BS.HelpBlock>
            {dateOfBirth}
            <div className="section">Pets</div>
            <BS.HelpBlock>
              We love our pets, too. Tell us about your furry friends so prospective landlords know that you’re a proud pet owner.
            </BS.HelpBlock>
            {pets}
            <div className="section">Link Social<InfoTooltip placement="right" tooltip={socialTooltip} /></div>
            <BS.HelpBlock>
              Linking your social accounts lends insight into who you are and what you've accomplished. Your LinkedIn and Facebook accounts contribute to your F2R Score. We will <strong>never</strong> share this info with anyone!
            </BS.HelpBlock>
            {(!isLinkedinLinked && !isFacebookLinked) && (
              <BS.HelpBlock>
                When you click the buttons below, a new browser tab will open. Please log in to your social account and give permissions to the Fit to Rent application. You will receive a message stating you have successfully linked your account. If you encounter an issue, simply try clicking the button again.
              </BS.HelpBlock>
            )}
            <div className="social-links">
              {isLinkedinLinked ? linkedLinkedin : linkLinkedin}
              {isFacebookLinked ? linkedFacebook : linkFacebook}
            </div>
            <BS.HelpBlock>
              Are you an Active Duty member of the U.S. Armed Forces? If so, provide us with your military email below so we can verify your employment status.  You can provide this in lieu of connecting with LinkedIn, but remember, connecting your LinkedIn gets you more points.  We’ll use this information ONLY to verify the information you provide in Step 2, we’ll NEVER email or share it.
            </BS.HelpBlock>
            <div className="military-email">


              <BS.FormGroup controlId="alternativeEmail">
                <div className="row">
                  <div className="item">
                    <BS.ControlLabel>Military Email with .mil domain</BS.ControlLabel>
                    <BS.FormControl
                    value={store.alternativeEmail}
                    onChange={this.keypress.bind(this)}
                    name="alternativeEmail"
                    type="text" />
                  </div>
                </div>
              </BS.FormGroup>

            </div>
          </form>
          <BS.HelpBlock className="pullLeft warn">
            {this.state.submitted ? this.isInvalid() : ''}
          </BS.HelpBlock>

          <div className="onboarding-submit">
            <SubmitButton
            appState={this.props.appState}
            statusAction="stepOneForm"
            submit={_.partial(this.submit.bind(this), false)}
            textLoading="Saving"
            textModified="Save Changes"
            bsStyle="primary">
              Save
            </SubmitButton>
            {this.props.showProceed && (
              <SubmitButton
              appState={this.props.appState}
              statusAction="stepOneFormProceed"
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


StepOneForm.contextTypes = {
  store: PropTypes.object
};

export default StepOneForm;

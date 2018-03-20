import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import _ from 'underscore';
import FileReaderInput from 'react-file-reader-input';

import * as api from '../../../actions/api';
import * as Conversion from '../../../utils/conversion';

import Loader from '../../Loader';
import SelectOptions from '../../SelectOptions';
import SubmitButton from '../../SubmitButton';
import SubmitFooter from '../SubmitFooter';

class ProfileForm extends Component {
  state = {
    submitted: false,
    complete: false
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
  get months() {
    return {'01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December'};
  }
  get days() {
    let days = [];
    for (let day = 1; day <= 31; day++) {
      day < 10 ? days.push('0'+day) : days.push(day);
    }
    return days;
  }

  get years() {
    let years = [];
    for (let year = new Date().getFullYear(); year >= 1900; year--) {
      years.push(year);
    }
    return years;
  }

  getValidationState(group = 'all', ignoreSubmitted = false) {
    let groups = {
      all: {valid: true, error: null},
      fullname: {valid: true, error: null},
      phoneNumber: {valid: true, error: null}
    };

    if (!this.state.submitted && !ignoreSubmitted) {
      return {valid: true, error: null};
    }

    const form = this.props.appState.accountProfileForm;

    if (!form.firstName || !form.lastName) {
      groups.all.valid = false;
      groups.fullname.valid = false;
      groups.fullname.error = 'First and Last Name is required.';
    }

    if (form.phoneNumber) {
      if (form.phoneNumber && form.phoneNumber.replace(/\D/g,'').trim().length < 10) {
        groups.all.valid = false;
        groups.phoneNumber.valid = false;
        groups.phoneNumber.error = 'Phone number must be at least 10 digits.';
      }
    }

    return groups[group];
  }

  render() {
    const { appState } = this.props;
    const { profile, status } = appState;
    const user = profile;

    const imageURL = user.profilePicURL ? Conversion.urlToHttps(user.profilePicURL) : '';
    const uploadComplete = status.uploading['profilePicUpload'] == false;

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

            {imageURL && (
              <div className='item'>
                <BS.Image src={imageURL} circle />
              </div>
            )}

          </div>

        </BS.FormGroup>
      </div>
    );

    const fullName = (
      <BS.FormGroup controlId="firstName" validationState={!this.getValidationState('fullname').valid ? 'error' : null}>
        <div className="fullname">
          <div className="row">
            <div className="item">
              <BS.ControlLabel>First Name</BS.ControlLabel>
              <BS.FormControl
                name="firstName"
                onChange={this.keypress.bind(this)}
                type="text"
                value={profile.firstName}>
              </BS.FormControl>
            </div>
            <div className="item">
              <BS.ControlLabel>Last Name</BS.ControlLabel>
              <BS.FormControl
                name="lastName"
                onChange={this.keypress.bind(this)}
                type="text"
                value={profile.lastName}>
              </BS.FormControl>
            </div>
          </div>
        </div>
        <BS.HelpBlock className="text-danger">{this.getValidationState('fullname').error}</BS.HelpBlock>
      </BS.FormGroup>
    );

    const personalDescription = (
      <BS.FormGroup controlId="personalDescription">
        <BS.FormControl
          name="description"
          onChange={this.keypress.bind(this)}
          componentClass="textarea"
          value={profile.description}>
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
                optionList={this.months}
                defaultOption="Month..."
                defaultOptionName="Month..."
                defaultValue={profile.dobMonth}
                keyValue
               />
            </div>
            <div className="item">
              <BS.ControlLabel>Day</BS.ControlLabel>
              <SelectOptions
                onChange={this.keypress.bind(this)}
                name="dobDay"
                optionList={this.days}
                defaultOption="Day..."
                defaultOptionName="Day..."
                defaultValue={profile.dobDay}
               />
            </div>
            <div className="item">
              <BS.ControlLabel>Year</BS.ControlLabel>
              <SelectOptions
                onChange={this.keypress.bind(this)}
                name="dobYear"
                optionList={this.years}
                defaultOption="Year..."
                defaultOptionName="Year..."
                defaultValue={profile.dobYear}
               />
            </div>
          </div>
        </div>
      </BS.FormGroup>
    );

    const phoneNumber = (
      <BS.FormGroup controlId="phoneNumber" validationState={!this.getValidationState('phoneNumber').valid ? 'error' : null}>
        <BS.FormControl
          name="phoneNumber"
          onChange={this.keypress.bind(this)}
          type="text"
          placeholder="ex: (555) 555 5555"
          value={profile.phoneNumber}>
        </BS.FormControl>
        <BS.HelpBlock>{this.getValidationState('phoneNumber').error}</BS.HelpBlock>
      </BS.FormGroup>
    );

    return (
      <div className="profileform-panel">
        <form>
          <div className="section section-padded">Profile Image</div>
          {profileImage}
          <div className="section section-padded">Name</div>
          {fullName}
          <div className="section section-padded">Personal Description</div>
          {personalDescription}
          <div className="section section-padded">Date of Birth</div>
          {dateOfBirth}
          <div className="section section-padded">Phone Number</div>
          {phoneNumber}
        </form>
      </div>
    );
  }

}

ProfileForm.contextTypes = {
  store: PropTypes.object
};

export default ProfileForm;

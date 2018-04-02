import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import _ from 'underscore';
import FileReaderInput from 'react-file-reader-input';
import { Field } from 'redux-form';
import * as api from '../../../actions/api';
import * as Conversion from '../../../utils/conversion';

import Loader from '../../Loader';
import ButtonSpinner from '../../ButtonSpinner';
import SubmitButton from '../../SubmitButton';
import SubmitFooter from '../SubmitFooter';
import { renderInput, DateInput } from '../../ReduxFormFields';


class ProfileForm extends Component {
  componentWillUnmount(){
    delete this.props.appState.status.uploading['profilePicUpload'];
  }

  handleFileChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      this.props.upload(file);
    });
  }

  handleFormSubmit = (values) => {
    const { saveUserDetails } = this.props;
    saveUserDetails(values);
  }

  renderFooter() {
    const { submitting, errors, submitSucceeded } = this.props;
    return (
      <div className="account-submit">
        <div className="account-submit-message">
          {errors && (
            <BS.HelpBlock>
              <span className="text-danger">{errors}</span>
            </BS.HelpBlock>
          )}
          {submitSucceeded && (
            <BS.HelpBlock>
              <span className="text-success">Changes saved successfully.</span>
            </BS.HelpBlock>
          )}
        </div>
        <div className="account-submit-button">
          <BS.Button
            className="submit-button"
            bsStyle="success"
            disabled={submitting}
            type="submit">
            {submitting && <div className="spinner"><ButtonSpinner /></div>}
            <div className="text">Save</div>
          </BS.Button>
        </div>
      </div>
    );
  }

  render() {
    const { appState, handleSubmit } = this.props;
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
      <div className="fullname">
        <div className="row">
          <div className="item">
            <Field name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
              component={renderInput} />
          </div>
          <div className="item">
            <Field name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
              component={renderInput} />
          </div>
        </div>
      </div>
    );

    const email = (
      <Field
        name="email"
        type="email"
        placeholder="example@email.com"
        component={renderInput} />
    );

    const personalDescription = (
      <Field name="userDetails.description"
        label="Description"
        type="textarea"
        component={renderInput} />
    );

    const dateOfBirth = (
      <Field name="userDetails.dateOfBirth" component={DateInput} />
    );

    const phoneNumber = (
      <Field
        name="userDetails.phoneNumber"
        type="text"
        placeholder="ex: (555) 555 5555"
        component={renderInput} />
    );

    const address = (
      <div className="address">
        <div className="row">
          <div className="item">
            <Field
              name="userDetails.address"
              label="Address"
              type="text"
              placeholder="Address"
              component={renderInput} />
          </div>
          <div className="item">
            <Field
              name="userDetails.city"
              label="City"
              type="text"
              placeholder="City"
              component={renderInput} />
          </div>
        </div>
        <div className="row">
          <div className="item">
            <Field
              name="userDetails.state"
              label="State"
              type="text"
              placeholder="State"
              component={renderInput} />
          </div>
          <div className="item">
            <Field
              name="userDetails.zipCode"
              label="Zip Code"
              type="text"
              placeholder="Zip Code"
              component={renderInput} />
          </div>
        </div>
      </div>
    );

    const backupInfo = (
      <div className="row">
        <div className="item">
          <Field
            name="userDetails.alternativeEmail"
            label="Backup Email"
            type="email"
            placeholder="example@email.com"
            component={renderInput} />
        </div>
        <div className="item">
          <Field
            name="userDetails.alternativePhone"
            label="Backup Phone"
            type="text"
            placeholder="ex: (555) 555 5555"
            component={renderInput} />
        </div>
      </div>
    );

    return (
      <div className="profileform-panel">
        <BS.Form onSubmit={handleSubmit(this.handleFormSubmit)}>
          <div className="section section-padded">Profile Image</div>
          {profileImage}
          <div className="section section-padded">Name</div>
          {fullName}
          <div className="section section-padded">Email</div>
          {email}
          <div className="section section-padded">Personal Description</div>
          {personalDescription}
          <div className="section section-padded">Date of Birth</div>
          {dateOfBirth}
          <div className="section section-padded">Phone Number</div>
          {phoneNumber}
          <div className="section section-padded">Address</div>
          {address}
          <div className="section section-padded">Backup Info</div>
          {backupInfo}
          {this.renderFooter()}
        </BS.Form>
      </div>
    );
  }

}

ProfileForm.contextTypes = {
  store: PropTypes.object
};

export default ProfileForm;

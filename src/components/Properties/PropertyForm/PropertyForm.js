import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import _ from 'lodash';
import FileReaderInput from 'react-file-reader-input';
import { Field } from 'redux-form';
import { Link } from 'react-router';
import ButtonSpinner from '../../ButtonSpinner';
import SubmitButton from '../../SubmitButton';
import { getLastPropertyImageURL } from '../../../utils/property';
import { AmenityListInput, renderInput, renderSelect, renderTextarea, SelectInput, DateInput } from '../../ReduxFormFields';

export default class PropertyForm extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    geoState: PropTypes.object.isRequired,
    geoActions: PropTypes.object.isRequired,
    savePropertyDetails: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired,
    stateCode: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {
    const { geoActions, stateCode } = nextProps;
    if (this.props.stateCode !== stateCode) {
      geoActions.loadCityList(stateCode);
    }
  }

  handleFileChange(e, results) {
    const { propertyId } = this.props;
    results.forEach(result => {
      const [e, file] = result;
      this.props.upload(propertyId, file);
    });
  }

  handleStateChange = (value) => {
    // const { geoActions } = this.props;
    // geoActions.loadCityList(value);
  }

  handleFormSubmit = (values) => {
    const { propertyId } = this.props;
    const { savePropertyDetails } = this.props;
    savePropertyDetails(_.merge({}, values, {
      id: propertyId
    }));
  }

  renderFooter() {
    const { appState: { status }, errors, submitSucceeded } = this.props;
    const submitting = status.saving['propertyProfile'];
    return (
      <div className="property-submit">
        <div className="property-submit-message">
          {errors && (
            <BS.HelpBlock>
              <span className="text-danger">{errors}</span>
            </BS.HelpBlock>
          )}
          {submitSucceeded && !submitting && (
            <BS.HelpBlock>
              <span className="text-success">Changes saved successfully.</span>
            </BS.HelpBlock>
          )}
        </div>
        <div className="property-submit-button">
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

  renderUploader() {
    const { appState, params } = this.props;
    const { status, propertyProfile: property } = appState;
    const imageURL = getLastPropertyImageURL(property);
    
    const uploadComplete = status.uploading['propertyPicUpload'] == false;
    return (
      <div className="property-image">
        <div className="section section-padded">Profile Image</div>
        <BS.FormGroup controlId="propertyImage">

          <BS.Row className="v-align-middle">

            <BS.Col xs={6} className="text-center">
              <FileReaderInput
              name="propertyPic"
              as="url"
              id="property-pic-upload"
              onChange={this.handleFileChange.bind(this)}>
                <SubmitButton
                className="upload-button"
                appState={appState}

                statusAction="propertyPicUpload"
                textLoading="Uploading">
                  Upload Cover Photo
                </SubmitButton>
                <BS.HelpBlock className="text-center">
                  <span className="text-success">
                    {uploadComplete ? 'Cover Photo updated.' : ''}
                  </span>
                </BS.HelpBlock>

              </FileReaderInput>
            </BS.Col>

            {imageURL && (
              <BS.Col xs={6}>
                <BS.Image src={imageURL} />
              </BS.Col>
            )}

          </BS.Row>

        </BS.FormGroup>
      </div>
    );
  }

  renderFormFields() {
    const { geoState, stateCode } = this.props;
    const title = (
      <BS.Row className="row-narrow">
        <BS.Col xs={12}>
          <Field
            name="headline"
            label="Title"
            type="text"
            placeholder="Address"
            component={renderInput} />
        </BS.Col>
      </BS.Row>
    );

    const address = (
      <div className="address">
        <BS.Row className="row-narrow">
          <BS.Col xs={6}>
            <Field
              name="address"
              label="Address"
              type="text"
              placeholder="Address"
              component={renderInput} />
          </BS.Col>
          <BS.Col xs={6}>
            <Field
              name="secondLineAddress"
              label="Address 2"
              type="text"
              placeholder="Address 2"
              component={renderInput} />
          </BS.Col>
        </BS.Row>
        <BS.Row className="row-narrow">
          <BS.Col xs={4}>
            <Field
              name="state"
              label="State"
              disabled={!geoState.states}
              loading={geoState.status.loading['states']}
              loadingText="Retrieving states..."
              defaultOptionName="State..."
              optionList={geoState.states}
              component={SelectInput}
              onValueChange={this.handleStateChange}
            />
          </BS.Col>
          <BS.Col xs={4}>
            <Field
              name="city"
              label="City"
              disabled={!geoState.cities[stateCode]}
              loading={geoState.status.loading['cities']}
              loadingText="Retrieving cities..."
              defaultOptionName="City..."
              optionList={geoState.cities[stateCode]}
              component={SelectInput}
            />
          </BS.Col>
          <BS.Col xs={4}>
            <Field
              name="zipCode"
              label="Zip Code"
              type="text"
              placeholder="Zip Code"
              component={renderInput} />
          </BS.Col>
        </BS.Row>
      </div>
    );

    const propertyType = (
      <Field
        name="propertyType"
        label="Property Type"
        component={renderSelect}
      >
        <option value="- Select -" />
        <option value="APT">Apartment</option>
        <option value="SFM">Single Family Home</option>
        <option value="CONDO">Condo</option>
        <option value="DUPLEX">Duplex</option>
        <option value="MOBILE_HOME">Mobile Home</option>
        <option value="TOWNHOUSE">Town Home</option>
      </Field>
    );

    const sqft = (
      <Field
        name="sqft"
        label="Sq Ft"
        type="text"
        placeholder="Sq Ft."
        component={renderInput}
      />
    );

    const numBeds = (
      <Field
        name="numBeds"
        label="No. of Beds"
        type="number"
        placeholder="Beds"
        component={renderInput}
      />
    );

    const numBaths = (
      <Field
        name="numBaths"
        label="No. of Baths"
        type="number"
        placeholder="Baths"
        component={renderInput}
      />
    );

    const description = (
      <div>
        <div className="text-center">
          <sup>Tell us and prospective tenants about yourself, your properties, your family, your interests, or anything else.</sup>
        </div>
        <Field
          name="description"
          type="textarea"
          placeholder="Start typing here..."
          rows={3}
          component={renderTextarea}
        />
      </div>
    );

    const amenityList = (
      <Field
        name="amenityList"
        placeholder="Baths"
        component={AmenityListInput}
      />
    );

    return (
      <div>
        <div className="section section-padded">Property Details</div>
        {title}
        {address}
        <BS.Row className="row-narrow">
          <BS.Col xs={6} md={3}>
            {propertyType}
          </BS.Col>
          <BS.Col xs={6} md={3}>
            {sqft}
          </BS.Col>
          <BS.Col xs={6} md={3}>
            {numBeds}
          </BS.Col>
          <BS.Col xs={6} md={3}>
            {numBaths}
          </BS.Col>
        </BS.Row>
        <div className="section section-padded">Description</div>
        {description}
        <div className="section section-padded">Amenities</div>
        {amenityList}
      </div>
    );
  }

  render() {
    const { handleSubmit, propertyId } = this.props;
    return (
      <div className="propertyform-panel">
        <BS.Form onSubmit={handleSubmit(this.handleFormSubmit)}>
          {propertyId && this.renderUploader()}
          {this.renderFormFields()}
          {this.renderFooter()}
        </BS.Form>
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import _ from 'lodash';
import FileReaderInput from 'react-file-reader-input';
import { Field } from 'redux-form';
import { Link } from 'react-router';
import ButtonSpinner from '../../ButtonSpinner';
import SubmitButton from '../../SubmitButton';
import { getLastPropertyImageURL } from '../../../utils/property';
import { DepositListInput, renderDatePicker, renderInput, renderRadio, renderSelect,
  SelectInput, TenantListInput } from '../../ReduxFormFields';

export default class LeaseForm extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    leaseId: PropTypes.number.isRequired,
    saveLeaseDetails: PropTypes.func.isRequired,
    monthToMonth: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { collectionType: 'collect-deposits' };
  }

  handleCollectionTypeChange = (event) => {
    this.setState({ collectionType: event.target.value });
  }

  handleFormSubmit = (values) => {
    const { leaseId, saveLeaseDetails } = this.props;
    saveLeaseDetails(_.merge({}, values, {
      id: leaseId
    }));
  }

  get propertiesOptions() {
    const { appState: { propertiesList } } = this.props;
    return _.reduce(propertiesList, (options, property) => (_.merge(options, {
      [property.propertyId]: property.propertyName
    })), {});
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

  renderFormFields() {
    const { monthToMonth } = this.props;
    const propertySelection = (
      <div className="form-horizontal">
        <BS.Row>
          <BS.Col sm={8} smOffset={2}>
            <Field
              name="propertyId"
              label="Property Selection"
              optionList={this.propertiesOptions}
              component={SelectInput}
              keyValue
              inline
              defaultOptionName="Choose a property ..."
            />
          </BS.Col>
        </BS.Row>
      </div>
    );

    const tenantsSection = (
      <Field
        name="renterList"
        component={TenantListInput}
      />
    );

    const leaseTypeSection = (
      <BS.Row className="leaseTypeSection text-center">
        <BS.Col md={4} mdOffset={1} sm={5}>
          <Field
            name="monthToMonth"
            label="Month to Month"
            staticValue
            component={renderRadio}
          />
        </BS.Col>
        <BS.Col sm={2}>OR</BS.Col>
        <BS.Col md={4} sm={5}>
          <Field
            name="monthToMonth"
            label="Set Term"
            staticValue={false}
            component={renderRadio}
          />
        </BS.Col>
      </BS.Row>
    );

    const leaseDetails = (
      <BS.Collapse in={monthToMonth}>
        <div>
          <BS.Row>
            <BS.Col xs={12}>
              <div className="section section-padded">Details {warn}</div>
            </BS.Col>
          </BS.Row>
          <BS.Row>
            <BS.Col sm={6}>
              <Field name="startDate"
                type="text"
                label="Lease Start Date"
                inline
                component={renderDatePicker} />
            </BS.Col>
            <BS.Col sm={6}>
              <Field name="endDate"
                type="text"
                label="Lease End Date"
                inline
                component={renderDatePicker} />
            </BS.Col>
          </BS.Row>
          <BS.Row>
            <BS.Col sm={6}>
              <Field name="paymentStartDate"
                type="text"
                label="Payment Start Date"
                inline
                component={renderDatePicker} />
            </BS.Col>
            <BS.Col sm={6}>
              <Field name="paymentEndDate"
                type="text"
                label="Payment End Date"
                inline
                component={renderDatePicker} />
            </BS.Col>
          </BS.Row>
          <BS.Row>
            <BS.Col sm={6}>
              <Field name="rentDueDate"
                type="text"
                label="Payment Due Date"
                inline
                component={renderDatePicker} />
            </BS.Col>
            <BS.Col sm={6}>
              <Field name="rentAmount"
                type="text"
                label="Monthly Rent"
                placeholder="$$$$"
                inline
                component={renderInput} />
            </BS.Col>
          </BS.Row>
        </div>
      </BS.Collapse>
    );

    const { collectionType } = this.state;
    const depositListSection = (
      <div>
        <BS.Row className="collectionTypeSection text-center">
          <BS.Col md={4} mdOffset={1} sm={5}>
            <BS.Radio inline checked={collectionType === 'collect-deposits'}
              value="collect-deposits"
              onChange={this.handleCollectionTypeChange}>
              Collect Deposits
            </BS.Radio>
          </BS.Col>
          <BS.Col sm={2}>OR</BS.Col>
          <BS.Col md={4} sm={5}>
            <BS.Radio inline checked={collectionType === 'not-necessary'}
              value="not-necessary"
              onChange={this.handleCollectionTypeChange}>
              Not Necessary
            </BS.Radio>
          </BS.Col>
        </BS.Row>
        <BS.Row>
          <BS.Collapse in={this.state.collectionType === 'collect-deposits'}>
            <BS.Col sm={12}>
              <Field
                name="depositList"
                component={DepositListInput}
              />
            </BS.Col>
          </BS.Collapse>
        </BS.Row>
      </div>
    );

    const warn = <span className="text-danger"> *</span>;

    return (
      <div>
        <div className="section section-padded">Lease Info {warn}</div>
        {propertySelection}
        <div className="section section-padded">Tenant Assignment {warn}</div>
        {tenantsSection}
        <div className="section section-padded">Lease Type {warn}</div>
        {leaseTypeSection}
        {leaseDetails}
        <div className="section section-padded">
          Deposits {warn}
          <sub>(Select “Collect Deposits” ONLY IF there are outstanding deposits you’re owed from your tenants)</sub>
        </div>
        {depositListSection}
      </div>
    );
  }

  render() {
    const { handleSubmit, propertyId } = this.props;
    return (
      <div className="lease-form-panel">
        <BS.Form onSubmit={handleSubmit(this.handleFormSubmit)}>
          {propertyId && this.renderUploader()}
          {this.renderFormFields()}
          {this.renderFooter()}
        </BS.Form>
      </div>
    );
  }
}

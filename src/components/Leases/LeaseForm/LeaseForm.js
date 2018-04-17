import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import _ from 'lodash';
import FileReaderInput from 'react-file-reader-input';
import { Field } from 'redux-form';
import { Link } from 'react-router';
import { getLastPropertyImageURL } from '../../../utils/property';
import { DepositListInput, renderDatePicker, renderInput, renderRadio, renderSelect,
  SelectInput, SubmitFooter, TenantListInput } from '../../ReduxFormFields';
import { reduxFormProps } from '../../../utils/form';

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
    const finalValues = leaseId
      ? _.merge({}, values, {
        id: leaseId
      })
      : values;

    saveLeaseDetails(finalValues);
  }

  get propertiesOptions() {
    const { appState: { propertiesList } } = this.props;
    return _.reduce(propertiesList, (options, property) => (_.merge(options, {
      [property.propertyId]: property.propertyName
    })), {});
  }

  get depositListTable() {
    const { appState: { leaseDetails } } = this.props;
    const { depositList } = leaseDetails;
    return (
      <div>
        <h6 className="depositListTitle">On File</h6>
        {(depositList && depositList.length > 0)
          ? <BS.Table responsive className="depositListTable">
            <tbody>
              {_.map(depositList, (item, index) => (
                <tr key={index}>
                  <td className="tdDepositAmount">
                    {item.depositType}: {item.depositAmount}
                  </td>
                  <td className="tdDepositPet">Pet: N/A</td>
                  <td className="tdDepositOther">Other: {item.depositStatus}</td>
                </tr>
              ))}
            </tbody>
          </BS.Table>
          : <p className="text-center"> Not Available </p>
        }
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
        name="tenants"
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

    const leaseDetailsMonthToMonth = (
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
              <Field name="paymentStartDate"
                type="text"
                label="Payment Start Date"
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

    const leaseDetailsSetTerm = (
      <BS.Collapse in={!monthToMonth}>
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
        {this.depositListTable}
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
        {leaseDetailsMonthToMonth}
        {leaseDetailsSetTerm}
        <div className="section section-padded">
          Deposits {warn}
          <sub>(Select “Collect Deposits” ONLY IF there are outstanding deposits you’re owed from your tenants)</sub>
        </div>
        {depositListSection}
      </div>
    );
  }

  render() {
    const { handleSubmit, propertyId, appState } = this.props;
    const submitting = _.get(appState, ['status', 'saving', 'leaseDetails']);
    return (
      <div className="lease-form-panel">
        <BS.Form onSubmit={handleSubmit(this.handleFormSubmit)}>
          {propertyId && this.renderUploader()}
          {this.renderFormFields()}
          <SubmitFooter submitting={submitting} {...reduxFormProps(this.props)} />
        </BS.Form>
      </div>
    );
  }
}

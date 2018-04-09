import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
import LeaseForm from '../../components/Leases/LeaseForm';

const validate = values => {
  const errors = {};
  return errors;
};

const INITIAL_VALUES = {
  renterList: [{ userDetails:{} }],
  depositList: [{
    depositAmount: 550,
    depositType: 'SECURITY',
    depositStatus: 'REFUNDABLE'
  }],
  leaseStatus: "ACTIVE",
  monthToMonth: true
};

const landlordIdSelector = (state) =>
  _.get(state, ['accountAppState', 'userInfo', 'id'], 0);

const selector = formValueSelector('leaseForm');

export default connect(
  (state, props) => ({
    initialValues: props.leaseId
      ? state.leasesAppState.leaseDetails
      : _.merge(INITIAL_VALUES, {
        landlordId: landlordIdSelector(state)
      }),
    monthToMonth: selector(state, 'monthToMonth')
  })
)(reduxForm({
  form: 'leaseForm',
  validate,
  enableReinitialize: true
})(LeaseForm));

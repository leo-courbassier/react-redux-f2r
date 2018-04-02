import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PropertyForm from '../../components/Properties/PropertyForm';

const validate = values => {
  const errors = {};
  const { headline, propertyType, sqft, numBeds, numBaths } = values;
  if (!headline) {
    errors.headline = 'Property Title is required.';
  }
  if (!propertyType) {
    errors.propertyType = 'Property Type is required.';
  }
  if (!sqft) {
    errors.sqft = 'Sq Ft is required';
  }
  if (!numBeds) {
    errors.numBeds = 'No. of Beds is required.';
  }
  if (!numBaths) {
    errors.numBaths = 'No. of Baths is required.';
  }
  return errors;
};

const selector = formValueSelector('propertyForm');

export default connect(
  (state, props) => ({
    initialValues: props.propertyId ? state.propertiesAppState.propertyProfile : {},
    stateCode: selector(state, 'state')
  })
)(reduxForm({
  form: 'propertyForm',
  validate,
  enableReinitialize: true
})(PropertyForm));

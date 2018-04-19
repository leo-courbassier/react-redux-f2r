import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPropertyLocalPic } from '../../actions/propertyActions';
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
  if (numBeds * 10 % 10 !== 0) {
    errors.numBeds = 'Only whole numbers are accepted.'
  }
  if (!numBaths) {
    errors.numBaths = 'No. of Baths is required.';
  }
  if (numBaths * 100 % 50 !== 0) {
    errors.numBaths = 'Only whole numbers and halves are accepted.';
  }
  return errors;
};

const selector = formValueSelector('propertyForm');

const mapDispatchToProps = (dispatch) => ({
  setPropertyLocalPic: bindActionCreators(setPropertyLocalPic, dispatch)
});

export default connect(
  (state, props) => ({
    initialValues: props.propertyId ? state.propertiesAppState.propertyProfile : {},
    stateCode: selector(state, 'state'),
    propertyLocalPic: state.propertiesAppState.propertyLocalPic
  }),
  mapDispatchToProps
)(reduxForm({
  form: 'propertyForm',
  validate,
  enableReinitialize: true
})(PropertyForm));

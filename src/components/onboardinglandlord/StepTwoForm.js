import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../SubmitButton';
import SelectOptions from '../SelectOptions';
import _ from 'underscore';
import * as Validation from '../../utils/validation';
import isEmail from 'validator/lib/isEmail';
import isCurrency from 'validator/lib/isCurrency';

import * as api from '../../actions/api';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import * as geoActions from '../../actions/geoActions';
import * as propertyActions from '../../actions/propertyActions';
import PropertyForm from '../../containers/Properties/PropertyFormContainer';


const STEP_ID = 1;
const MAX_INCOME_SOURCES = 10;

class StepTwoForm extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    geoActions: PropTypes.object.isRequired,
    geoState: PropTypes.object.isRequired,
    propertyActions: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { geoActions } = this.props;
    geoActions.loadStateList();
  }

  componentWillUnmount(){

  }

  handleSavePropertyDetails = (values) => {
    const { propertyActions, goTo } = this.props;
    propertyActions.addPropertyDetails(values, (property) => {});
  }

  handleAddAnother = () => {
    const { resetForm } = this.props;
    resetForm('propertyForm');
    this.refs.propertyForm.setState({ imageURL: null });
  }

  renderFooter() {
    const { appState, openNextStep, openPrevStep, propertyActions } = this.props;
    return (
      <div>
        <hr />
        <BS.Row>
          <BS.Col md={4}>
            {this.props.showProceed && (
              <SubmitButton
                appState={appState}
                statusAction="stepTwoFormPrevious"
                submit={openPrevStep}
                textLoading=""
                bsStyle="success"
                className="proceed-button prev-button"
              >
                Previous
              </SubmitButton>
            )}
          </BS.Col>
          <BS.Col md={4} className="text-center">
            <BS.Button bsStyle="warning"
              onClick={this.handleAddAnother}>
              Add Another Property
            </BS.Button>
          </BS.Col>
          <BS.Col md={4}>
            <div className="onboarding-submit">
              <SubmitButton
                appState={appState}
                statusAction="stepTwoForm"
                textLoading="Next"
                textModified="Next"
                submit={openNextStep}
                className="proceed-button next-button"
                bsStyle="primary"
              >
                Next
              </SubmitButton>
            </div>
          </BS.Col>
        </BS.Row>
      </div>
    );
  }

  render() {
    const { appState, geoState, geoActions, propertyActions } = this.props;

    return (
      <Loader appState={appState} statusType="loading" statusAction="stepTwoForm">
        <div className="step step-two">

        <PropertyForm appState={appState} geoState={geoState}
          savePropertyDetails={this.handleSavePropertyDetails}
          geoActions={geoActions} ref="propertyForm"/>
        </div>
        {this.renderFooter()}
      </Loader>
    );

  }
}


StepTwoForm.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    geoState: state.geoAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    propertyActions: bindActionCreators(propertyActions, dispatch),
    geoActions: bindActionCreators(geoActions, dispatch),
    resetForm: bindActionCreators(reset, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepTwoForm);

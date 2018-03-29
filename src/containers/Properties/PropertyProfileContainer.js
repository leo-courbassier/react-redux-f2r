import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as propertyActions from '../../actions/propertyActions';

import PropertyProfile from '../../components/Properties/PropertyProfile';
import PageTitle from '../../components/PageTitle';

function mapStateToProps(state) {
  return {
    appState: state.propertiesAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(propertyActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyProfile);

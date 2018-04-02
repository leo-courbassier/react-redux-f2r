import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as geoActions from '../../actions/geoActions';
import * as propertyActions from '../../actions/propertyActions';
import PropertyProfile from '../../components/Properties/PropertyProfile';
import { goTo } from '../../actions/routerActions';

function mapStateToProps(state) {
  return {
    appState: state.propertiesAppState,
    geoState: state.geoAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(propertyActions, dispatch),
    goTo: bindActionCreators(goTo, dispatch),
    geoActions: bindActionCreators(geoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyProfile);

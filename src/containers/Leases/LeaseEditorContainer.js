import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as leasesActions from '../../actions/leasesActions';
import * as propertyActions from '../../actions/propertyActions';
import LeaseEditor from '../../components/Leases/LeaseEditor';
import { goTo } from '../../actions/routerActions';

function mapStateToProps(state) {
  return {
    appState: state.leasesAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(leasesActions, dispatch),
    goTo: bindActionCreators(goTo, dispatch),
    propertyActions: bindActionCreators(propertyActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaseEditor);

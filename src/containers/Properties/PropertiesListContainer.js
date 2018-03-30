import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as propertyActions from '../../actions/propertyActions';
import { goTo } from '../../actions/routerActions';
import Loader from '../../components/Loader';
import PropertiesList from '../../components/Properties/PropertiesList';
import PageTitle from '../../components/PageTitle';

class PropertiesListContainer extends Component {
  componentWillMount() {
    this.props.actions.loadPropertiesList();
  }
  render() {
    const { appState, actions, goTo } = this.props;

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="propertiesList">
        <PropertiesList properties={appState.propertiesList[0]} goTo={goTo} />
      </Loader>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.propertiesAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(propertyActions, dispatch),
    goTo: bindActionCreators(goTo, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesListContainer);

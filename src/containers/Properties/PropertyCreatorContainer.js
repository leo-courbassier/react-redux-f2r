import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as propertyActions from '../../actions/propertyActions';

import Loader from '../../components/Loader';
import PropertyCreator from '../../components/Properties/PropertyCreator';
import PageTitle from '../../components/PageTitle';

class PropertyCreatorContainer extends Component {
  componentWillMount() {
  }
  render() {
    const { appState, actions, params } = this.props;

    return (
      <div>
        <PageTitle>My Properties > Create a New Property</PageTitle>
        <PropertyCreator property={appState.property} params={params}/>
      </div>
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
    actions: bindActionCreators(propertyActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyCreatorContainer);

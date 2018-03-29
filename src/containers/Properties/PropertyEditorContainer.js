import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as propertyActions from '../../actions/propertyActions';

import Loader from '../../components/Loader';
import PropertyEditor from '../../components/Properties/PropertyEditor';
import PageTitle from '../../components/PageTitle';

class PropertyEditorContainer extends Component {
  componentWillMount() {
    // this.props.actions.loadPropertiesList();
  }
  render() {
    const { appState, actions, params } = this.props;

    return (
      <div>
        <PageTitle>My Properties > Property Profile</PageTitle>
        <Loader appState={this.props.appState} statusType="loading" statusAction="propertiesList">
          <PropertyEditor property={appState.property} params={params}/>
        </Loader>
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
)(PropertyEditorContainer);

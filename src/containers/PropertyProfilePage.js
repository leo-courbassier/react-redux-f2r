import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import * as actions from '../actions/accountActions';
import HighLightsColumn from '../components/account/HighLightsColumn';
import PageTitle from '../components/PageTitle';
import PropertyProfile from './Properties/PropertyProfileContainer';

class PropertyProfilePage extends Component {
  render() {
    let {children, accountState, params} = this.props;

    return (
      <BS.Row className="property-page">

        <BS.Col xs={12} sm={12} md={8} className="panels">
          <PageTitle>My Properties > Property Profile</PageTitle>
          <PropertyProfile propertyId={params.id} />
        </BS.Col>

        <BS.Col xsHidden smHidden md={4}>
          <HighLightsColumn accountState={accountState} />
        </BS.Col>

      </BS.Row>
    );
  }
}

PropertyProfilePage.propTypes = {
  actions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    accountState: state.accountAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyProfilePage);

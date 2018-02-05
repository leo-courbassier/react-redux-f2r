import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import SideBar from '../components/SideBar';
import StatusBar from '../components/StatusBar';

import * as actions from '../actions/dashboardActions';


class DashboardPage extends Component {
  render() {

    return (
      <div className="dashboard-page">
        <BS.Col xsHidden sm={3} md={3} className="sidebar">
          <SideBar />
        </BS.Col>
        <BS.Col xs={12} sm={9} md={6} className="panels">
          content
        </BS.Col>
        <BS.Col xsHidden smHidden md={3} className="statusbar">

        </BS.Col>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

DashboardPage.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    appState: state.dashboardAppState
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
)(DashboardPage);

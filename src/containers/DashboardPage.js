import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import SideBar from '../components/SideBar';
import * as sidebarActions from '../actions/sidebarActions';


class DashboardPage extends Component {
  render() {
    let {children, sidebarActions, sidebarState} = this.props;

    return (
      <div className="new-dashboard-page">
        <BS.Col xsHidden sm={3} md={3} className="sidebar-content">
          <SideBar sidebarActions={sidebarActions} sidebarState={sidebarState} />
        </BS.Col>
        <BS.Col xs={9} sm={9} md={9} className="page-content">
          {children}
        </BS.Col>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  sidebarActions: PropTypes.object.isRequired,
  sidebarState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    sidebarState: state.sidebarState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sidebarActions: bindActionCreators(sidebarActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPage);

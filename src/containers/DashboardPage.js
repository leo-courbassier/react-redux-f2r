import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as BS from 'react-bootstrap';

import SidebarContainer from './SidebarContainer';



class DashboardPage extends Component {
  render() {
    let {children} = this.props;

    return (
      <div className="new-dashboard-page">
        <BS.Col xsHidden sm={3} md={3} className="sidebar-content">
          <SidebarContainer />
        </BS.Col>
        <BS.Col xs={9} sm={9} md={9} className="page-content">
          {children}
        </BS.Col>
      </div>
    );
  }
}

DashboardPage.propTypes = {
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPage);

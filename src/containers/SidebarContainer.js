import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as sidebarActions from '../actions/sidebarActions';
import Sidebar from '../components/SideBar';

class SidebarContainer extends Component {
  render() {
    return <Sidebar {...this.props} />
  }
}

SidebarContainer.propTypes = {
  sidebarActions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
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
)(SidebarContainer);

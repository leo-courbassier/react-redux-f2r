import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/account/PageTitle';
import ProfileInfoContainer from '../containers/account/ProfileInfoContainer';

class AccountProfilePage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Account > Profile</PageTitle>

        <ProfileInfoContainer />

      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountProfilePage);

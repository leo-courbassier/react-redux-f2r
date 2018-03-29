import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PasswordInfoContainer from '../containers/account/PasswordInfoContainer';

class AccountPasswordPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Account > Login/Password</PageTitle>

        <PasswordInfoContainer />

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
)(AccountPasswordPage);

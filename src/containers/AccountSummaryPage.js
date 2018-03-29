import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PasswordInfoContainer from '../containers/account/PasswordInfoContainer';
import DocumentsInfoContainer from '../containers/account/DocumentsInfoContainer';
import ProfileInfoContainer from '../containers/account/ProfileInfoContainer';

class AccountSummaryPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Account > Summary</PageTitle>

        <ProfileInfoContainer />

        <DocumentsInfoContainer />

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
)(AccountSummaryPage);

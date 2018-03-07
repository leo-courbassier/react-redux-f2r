import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/account/PageTitle';
import DocumentsInfoContainer from '../containers/account/DocumentsInfoContainer';

class AccountDocumentsPage extends Component {
  render() {
    return (
      <div>
        <PageTitle>My Account > Documents</PageTitle>

        <DocumentsInfoContainer />

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
)(AccountDocumentsPage);

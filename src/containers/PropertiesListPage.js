import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PropertiesListContainer from '../containers/Properties/PropertiesListContainer';

class PropertiesListPage extends Component {
  render() {
    return (
      <div className="properties-page">
        <PageTitle>My Properties > Summary</PageTitle>

        <PropertiesListContainer />

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
)(PropertiesListPage);

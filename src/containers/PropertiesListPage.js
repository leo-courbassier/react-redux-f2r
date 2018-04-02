import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PageTitle from '../components/PageTitle';
import PropertiesListContainer from '../containers/Properties/PropertiesListContainer';

export default class PropertiesListPage extends Component {
  render() {
    return (
      <div className="properties-page">
        <PageTitle>My Properties {'>'} Summary</PageTitle>

        <PropertiesListContainer />

      </div>
    );
  }
}
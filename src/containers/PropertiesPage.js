import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PropertiesListContainer from '../containers/Properties/PropertiesListContainer';

class PropertiesPage extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
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
)(PropertiesPage);

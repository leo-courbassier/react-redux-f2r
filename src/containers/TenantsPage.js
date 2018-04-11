import React, { Component, PropTypes } from 'react';

export default class TenantsPage extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }
  render() {
    const { children } = this.props;
    return (
      <div className="tenantsPage">
        {children}
      </div>
    );
  }
}

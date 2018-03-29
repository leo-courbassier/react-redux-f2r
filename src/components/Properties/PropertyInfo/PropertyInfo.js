import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table } from 'react-bootstrap';
import _ from 'lodash';

export default class PropertyInfo extends Component {
  static propTypes = {
    property: PropTypes.object
  };

  render(){
    const { properties, params } = this.props;
    return (
      <div>TODO: Implement property info</div>
    );
  }
}

import React, { Component } from 'react';
import * as BS from 'react-bootstrap';

export default class Panel extends Component {

  render(){
    let {title, children} = this.props;

    return (
      <div className="editable-panel">
        <div className="header">
          <h5>{title}</h5>
        </div>
        <div className="body">
          {children}
        </div>
      </div>
    );
  }
}

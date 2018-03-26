import React from 'react';
let {Component} = React;

import * as BS from 'react-bootstrap';

export default class PasswordInfo extends Component{
  render(){
    let {userInfo} = this.props;

    return (
      <div>
        <div className="heading">
          Login
        </div>
        <div>
          {userInfo.email}
        </div>
        <div className="heading">
          Password
        </div>
        <div>
          *********
        </div>
      </div>
    );
  }
}

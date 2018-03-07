import React from 'react';
let {Component} = React;

export default class PasswordInfo extends Component{
  render(){
    let {editMode} = this.props;
    return (
      <div className="password-info">
        password info - {editMode ? 1 : 0}
      </div>
    );
  }
}

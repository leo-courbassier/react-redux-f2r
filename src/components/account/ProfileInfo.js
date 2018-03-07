import React from 'react';
let {Component} = React;

export default class ProfileInfo extends Component{
  render(){
    let {editMode} = this.props;
    return (
      <div className="profile-info">
        profile info - {editMode ? 1 : 0}
      </div>
    );
  }
}

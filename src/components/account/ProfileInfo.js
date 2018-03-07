import React from 'react';
let {Component} = React;

import {Col} from 'react-bootstrap';

export default class ProfileInfo extends Component{
  render(){
    let {editMode} = this.props;
    return (
      <div className="profile-info">
        {editMode ? this.renderEdit() : this.renderView()}
      </div>
    );
  }

  renderView(){
    let {userInfo} = this.props;
    return (
      <div>
        <div className="row">
          <Col xs={6} sm={6} md={6}>
            <div className="user-name">{userInfo.firstName} {userInfo.lastName}</div>
            <a href={'mailto:' + userInfo.email}>{userInfo.email}</a>
            <br/>
            {userInfo.phone || 'phone'}
            <br/>
            {userInfo.birthDate || 'birthDate'}

          </Col>
          <Col xs={6} sm={6} md={6} className="right-column">
            <img src={userInfo.profilePicURL} />
          </Col>
        </div>
        <div className="section">About</div>
        <div>
          description
        </div>
        <div className="section">Contact Information</div>
        <div className="row contact-info">
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Mailing Address</div>
            <div className="value">address</div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Backup Email</div>
            <div className="value">email</div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Alternate Phone</div>
            <div className="value">&nbsp;</div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Alternate Contact</div>
            <div className="value">Some name</div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Backup Email</div>
            <div className="value">Some email</div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Phone</div>
            <div className="value">Some phone</div>
          </Col>
        </div>
      </div>
    );
  }

  renderEdit(){
    return (
      <div>Edit mode</div>
    );
  }
}

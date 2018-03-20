import React, { Component, PropTypes } from 'react';
import { Col, Glyphicon } from 'react-bootstrap';
import UserRating from '../UserRating';
import _ from 'lodash';

export default class ProfileInfo extends Component {
  static propTypes = {
    profile: PropTypes.object
  };
  static defaultProps = {
    profile: {}
  }
  renderView(){
    const { profile } = this.props;
    const userDetails = _.get(profile, 'userDetails', {});
    return (
      <div>
        <div className="row">
          <Col xs={6} sm={5} md={6}>
            <div className="user-name">{profile.firstName} {profile.lastName}</div>
            <a href={'mailto:' + profile.email}>{profile.email}</a>
            <br/>
            {profile.phone || 'No phone number provided.'}
            <br/>
            {profile.birthDate || 'No date of birth provided'}
          </Col>
          <Col xs={6} sm={3} md={3} className="right-column">
            <UserRating userInfo={profile} />
          </Col>
          <Col xs={6} sm={3} md={3} className="right-column">
            <img src={profile.profilePicURL} />
          </Col>
        </div>
        <div className="section">About</div>
        <div>
          {profile.userDetails.description || 'Not provided.'}
        </div>
        <div className="section">Contact Information</div>
        <div className="row contact-info">
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Mailing Address</div>
            <div className="value">address</div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Backup Email</div>
            <div className="value">
              {profile.userDetails.alternativeEmail || 'Not provided'}
            </div>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <div className="sub-heading">Alternate Phone</div>
            <div className="value">
              {profile.userDetails.alternativePhone || 'Not provided'}
            </div>
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

  render(){
    let {editMode} = this.props;
    return (
      <div className="profile-info">
        {this.renderView()}
      </div>
    );
  }
}

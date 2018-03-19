import React, { Component } from 'react';
import { Col, Glyphicon } from 'react-bootstrap';
import UserRating from '../UserRating';

// import greyStar from 'url?mimetype=image/jpeg!/rating-stars/star-grey.jpg';
// import blueStar from 'url?mimetype=image/jpeg!/rating-stars/star-blue.jpg';

export default class ProfileInfo extends Component {
  renderRatings() {
    const { userInfo } = this.props;
    const ratingPercent = userInfo.f2rScore * 100 / 5;
    // const wrapperStyles = {
    //   backgroundImage: `url(${greyStar})`
    // };
    const innerStyles = {
      // backgroundImage: `url(${blueStar})`,
      width: `${ratingPercent}%`
    };
    const stars = Array(5).map((item, index) => (
      <Glyphicon glyph="star" key={index} />
    ));
    return (
      <div className="rating-info">
        <div className="rating-title">F2R Rating</div>
        <div className="rating-value">{userInfo.f2rScore}</div>
        <div className="rating-stars">
          {stars}
          <div className="rating-stars-percent" style={innerStyles}>
            {stars}
          </div>
        </div>
      </div>
    );
  }

  renderView(){
    const {userInfo} = this.props;
    return (
      <div>
        <div className="row">
          <Col xs={6} sm={5} md={6}>
            <div className="user-name">{userInfo.firstName} {userInfo.lastName}</div>
            <a href={'mailto:' + userInfo.email}>{userInfo.email}</a>
            <br/>
            {userInfo.phone || 'phone'}
            <br/>
            {userInfo.birthDate || 'birthDate'}
          </Col>
          <Col xs={6} sm={3} md={3} className="right-column">
            <UserRating userInfo={userInfo} />
          </Col>
          <Col xs={6} sm={3} md={3} className="right-column">
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

  render(){
    let {editMode} = this.props;
    return (
      <div className="profile-info">
        {editMode ? this.renderEdit() : this.renderView()}
      </div>
    );
  }
}

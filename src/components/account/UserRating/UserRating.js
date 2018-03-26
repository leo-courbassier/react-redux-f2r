import React, { Component, PropTypes } from 'react';
import { Col, Glyphicon } from 'react-bootstrap';
import classNames from 'classnames';
import _ from 'lodash';

// import classes from './UserRating.scss';

export default class UserRating extends Component {
  static PropTypes = {
    userInfo: PropTypes.object
  };

  renderStars() {
    const stars = (new Array(5).fill(0)).map((item, index) => (
      <Glyphicon glyph="star" key={index} />
    ));
    return (
      <div className="stars-wrapper">
        {stars}
      </div>
    );
  }
  renderScores() {
    const { userInfo } = this.props;
    const valueClass = classNames({
      'rating-value': true,
      'isNull' : _.isNull(userInfo.f2rScore)
    });
    return (
      <div className={valueClass}>
        {userInfo.f2rScore || 'No feedback yet'}
      </div>
    );
  }
  renderRatings() {
    const { userInfo } = this.props;
    const ratingPercent = userInfo.f2rScore * 100 / 5;
    const percentStyles = {
      width: `${ratingPercent}%`
    };
    return userInfo.f2rScore ? (
      <div className="rating-stars">
        {this.renderStars()}
        <div className="rating-stars-percent" style={percentStyles}>
          {this.renderStars()}
        </div>
      </div>
    ) : false;
  }
  renderDescr() {
    const { userInfo } = this.props;
    return userInfo.f2rScore ? (
      <div className="rating-stars-descr">
        All Star
      </div>
    ) : false;
  }
  render() {
    const { userInfo } = this.props;

    return (
      <div className="rating-info">
        <div className="rating-title">F2R Rating</div>
        {this.renderScores()}
        {this.renderRatings()}
        {this.renderDescr()}
      </div>
    );
  }
}

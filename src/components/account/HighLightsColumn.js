import React from 'react';
import moment from 'moment';
let {Component} = React;

export default class HighLightsColumn extends Component{
  render(){
    let {userInfo, highlights} = this.props.accountState;
    return (
      <div className="high-lights-column">
        <div className="date">{moment().format("dddd, MMMM Do, YYYY")}</div>
        <div className="welcome">Welcome, {userInfo.firstName}</div>
        <div className="avatar">
          <img src={userInfo.profilePicURL} />
        </div>
        <div className="message">You're looking sharp today!</div>
        <div className="high-lights">
          <h6>My Highlights</h6>
          <div className="item">
            <label>Properties Owned</label>
            <span>{highlights.propOwned}</span>
          </div>
          <div className="item">
            <label>Total Number of Tenants Served</label>
            <span>{highlights.tenantsServed}</span>
          </div>
          <div className="item">
            <label>Rental Payments Received</label>
            <span>{highlights.paymentsReceived}</span>
          </div>
          <div className="item">
            <label>Total Funds Received</label>
            <span>${highlights.fundsReceived}</span>
          </div>
          <div className="item">
            <label>Years a Member</label>
            <span>{highlights.memberAge}</span>
          </div>
        </div>
      </div>
    );
  }
}

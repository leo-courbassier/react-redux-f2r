import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';

class SideBar extends Component {

  render() {

    let {
      sidebarState: {
        accountSubMenu,
        paymentSubMenu
      },
      sidebarActions
    } = this.props;

    let updateAccount = () => sidebarActions.updateSubMenu('account', !accountSubMenu);
    let updatePayment = () => sidebarActions.updateSubMenu('payment', !paymentSubMenu);

    return (

      <div className="sidebar">
        <ul className="menu">
          <li>
            <BS.Glyphicon glyph="user" /><IndexLink to="/dashboard/account" onClick={updateAccount}>My Account</IndexLink>
            <ul className={'sub-menu ' + (accountSubMenu ? 'show' : '')}>
              <li><Link to="/dashboard/account/profile">My Profile</Link></li>
              <li><Link to="/dashboard/account/documents">My Documents</Link></li>
              <li><Link to="/dashboard/account/password">Login/Password</Link></li>
            </ul>
          </li>
          <li>
            <BS.Glyphicon glyph="home" /><Link to="/dashboard/properties" onClick={sidebarActions.hideSubMenus}>My Properties</Link>
          </li>
          <li>
            <BS.Glyphicon glyph="file" /><Link to="/dashboard/leases" onClick={sidebarActions.hideSubMenus}>My Leases</Link>
          </li>
          <li>
            <BS.Glyphicon glyph="user" /><Link to="/dashboard/tenants" onClick={sidebarActions.hideSubMenus}>My Tenants</Link>
          </li>
          <li>
            <BS.Glyphicon glyph="usd" /><IndexLink to="/dashboard/payments" onClick={updatePayment}>My Payments</IndexLink>
            <ul className={'sub-menu ' + (paymentSubMenu ? 'show' : '')}>
              <li><Link to="/dashboard/payments/methods">Payment Methods</Link></li>
              <li><Link to="/dashboard/payments/center">Payment Center</Link></li>
              <li><Link to="/dashboard/payments/recurring">Recurring Payments</Link></li>
            </ul>
          </li>
          <li>
            <BS.Glyphicon glyph="comment" /><a href="http://www.fit2rent.com/contact" target="_blank">Contact Us</a>
          </li>
          <li>
            <BS.Glyphicon glyph="question-sign" /><a href="http://www.fit2rent.com/help" target="_blank">Help Center</a>
          </li>
          {this.props.showCheckout && (
            <li>
              <div className="checkout">
                <Link to="/checkout">
                  <BS.Button bsStyle="success">Checkout</BS.Button>
                </Link>
              </div>
            </li>
          )}
          <li>
            <div className="mandatory-legend">
              * - indicates mandatory profile fields
            </div>
          </li>
        </ul>
      </div>

    );
  }
}

SideBar.propTypes = {
  sidebarActions: PropTypes.object.isRequired,
  sidebarState: PropTypes.object.isRequired
};

export default SideBar;

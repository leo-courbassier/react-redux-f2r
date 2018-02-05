import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';

class SideBar extends Component {

  state = {
    open: false
  }

  render() {


    const tempFullMenuHidden = (
      <div className="sidebar">
        <ul className="menu">
          <li>
            <BS.Glyphicon glyph="user" />My Account
          </li>
          <li>
            <BS.Glyphicon glyph="credit-card" />My Payments
          </li>
          <li onClick={ ()=> this.setState({ open: !this.state.open })}>
            <BS.Glyphicon glyph="flag" />My Mandates
          </li>
          <BS.Panel collapsible expanded={this.state.open}>
          <li>Active Mandates</li>
          <li>Past Mandates</li>
          </BS.Panel>
          <li>
            <BS.Glyphicon glyph="comment" />Contact Us
          </li>
          <li>
            <BS.Glyphicon glyph="question-sign" />Help Center
          </li>
        </ul>
      </div>
    );


    return (

      <div className="sidebar">
        <ul className="menu">
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
            <div className="example-mandate-callout">
              <div className="heading">See What You're Getting:</div>
              <div className="content anonymous">
                <BS.Button
                href="http://www.fit2rent.com/pdf/anonymous_mandate_report.pdf"
                bsStyle="primary"
                target="_blank">
                Anonymous Rent Mandate
                </BS.Button>
              </div>
              <div className="content personal">
                <BS.Button
                href="http://www.fit2rent.com/pdf/personal_mandate_report.pdf"
                bsStyle="primary"
                target="_blank">
                Personal Rent Mandate
                </BS.Button>
              </div>
            </div>
          </li>
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

export default SideBar;

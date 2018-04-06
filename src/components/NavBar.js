import React, { Component, PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import * as BS from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import * as types from '../constants/ActionTypes';
import Logo from './Logo';

class NavBar extends Component {

  state = {
    expanded: false
  }

  isLoggedIn() {
    return this.props.loginState.authorized;
  }

  isOnboardingUser() {
    if (!this.isLoggedIn()) return false;
    // TODO: Implement logic for deciding whether user has completed onboarding steps
    // Example: Check this.props.loginState.userInfo.onboardingStatus (not set at the moment)
    return true;
  }

  isDashboardUser() {
    if (!this.isLoggedIn()) return false;
    return !this.isOnboardingUser();
  }

  setLoginState(e) {
    e.preventDefault();
    if (this.isLoggedIn()) {
      this.props.store.dispatch(this.props.logout);
    } else {
      browserHistory.push('/');
    }
  }

  handleToggle() {
    this.setState({expanded: !this.state.expanded});
  }

  handleClick() {
    this.setState({expanded: false});
  }

  render() {
    const signUp = (
      <LinkContainer to={{ pathname: '/signup' }}>
        <BS.NavItem eventKey={2} onClick={this.handleClick.bind(this)} href="#">
          Sign Up
        </BS.NavItem>
      </LinkContainer>
    );

    const myDashboard = (
      <LinkContainer to={{ pathname: '/dashboard/account' }}>
        <BS.NavItem eventKey={2} onClick={this.handleClick.bind(this)} href="#">
          <BS.Glyphicon glyph="user" /> Account
        </BS.NavItem>
      </LinkContainer>
    );

    const myMail = (
      <LinkContainer to={{ pathname: '/messages' }}>
        <BS.NavItem eventKey={1} onClick={this.handleClick.bind(this)} href="#">
          <BS.Glyphicon glyph="envelope" /> Mail
          {this.props.unreadMessages > 0 && (
            <span className="unread">
              <BS.Label>{this.props.unreadMessages} Unread</BS.Label>
            </span>
          )}
        </BS.NavItem>
      </LinkContainer>
    );

    const checkout = (
      <LinkContainer to={{ pathname: '/checkout' }}>
        <BS.NavItem className='sidebar-item' eventKey={2} href="#">
          Checkout
        </BS.NavItem>
      </LinkContainer>
    );

    const myAccount = (
      <LinkContainer to={{ pathname: '/dashboard/account' }}>
        <BS.NavItem className='sidebar-item' eventKey={4} onClick={this.handleClick.bind(this)} href="#">
          My Account
        </BS.NavItem>
      </LinkContainer>
    );

    const myPayments = (
      <LinkContainer to={{ pathname: '/dashboard/payments' }}>
        <BS.NavItem className='sidebar-item' eventKey={4} onClick={this.handleClick.bind(this)} href="#">
          My Payments
        </BS.NavItem>
      </LinkContainer>
    );

    const myMandates = (
      <LinkContainer to={{ pathname: '/dashboard/mandates' }}>
        <BS.NavItem className='sidebar-item' eventKey={4} onClick={this.handleClick.bind(this)} href="#">
          My Mandates
        </BS.NavItem>
      </LinkContainer>
    );

    const exampleMandate = (
      <BS.NavItem className='sidebar-item' eventKey={4} href="http://www.fit2rent.com/pdf/anonymous_mandate_report.pdf" target="_blank">
        Example Mandate
      </BS.NavItem>
    );

    const contactUs = (
      <BS.NavItem className='sidebar-item' eventKey={4} href="http://www.fit2rent.com/contact" target="_blank">
        Contact Us
      </BS.NavItem>
    );

    const helpCenter = (
      <BS.NavItem className='sidebar-item' eventKey={4} href="http://www.fit2rent.com/help" target="_blank">
        Help Center
      </BS.NavItem>
    );

    const navItems = (
      <BS.Navbar.Collapse>
        <BS.Nav pullRight>
          {this.isLoggedIn() ? myMail : null}
          {this.isDashboardUser() ? myDashboard : null}
          {this.isLoggedIn() ? null : signUp}
          {this.isLoggedIn() ? contactUs : null}
          {this.isLoggedIn() ? helpCenter : null}
          {this.isLoggedIn() ? exampleMandate : null}
          {this.isLoggedIn() ? checkout : null }
          <LinkContainer onClick={this.setLoginState.bind(this)} to={{ pathname: '/' }}>
            <BS.NavItem eventKey={1} onClick={this.handleClick.bind(this)} href="#">
              {this.isLoggedIn() ? 'Log Out' : 'Log In'}
            </BS.NavItem>
          </LinkContainer>
        </BS.Nav>
      </BS.Navbar.Collapse>
    );

    return (
      <BS.Navbar
        expanded={this.state.expanded}
        onToggle={this.handleToggle.bind(this)}
        fixedTop
        fluid>
        <BS.Navbar.Header>
          <BS.Navbar.Brand>
            <IndexLink to={this.isOnboardingUser() ? '/onboarding' : '/dashboard/account'}>
              <Logo />
            </IndexLink>
          </BS.Navbar.Brand>
          <BS.Navbar.Toggle />
        </BS.Navbar.Header>
        {navItems}
      </BS.Navbar>
    );
  }

}

export default NavBar;

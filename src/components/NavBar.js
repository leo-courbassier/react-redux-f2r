import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import * as BS from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import * as types from '../constants/ActionTypes';
import Logo from './Logo';

const NavBar = ({store, logout}) => {
  const isLoggedIn = function () {
    let state = store.getState();
    return state.loginAppState.authorized;
  };
  const setLoginState = function (e) {
    e.preventDefault();
    if (isLoggedIn()){
      store.dispatch(logout);
    }else{
      browserHistory.push('/');
    }
  };
  const signUp = (
    <LinkContainer to={{ pathname: '/signup' }}>
      <BS.NavItem eventKey={2} href="#">
        Sign Up
      </BS.NavItem>
    </LinkContainer>
  );

  const signUpLord = (
    <LinkContainer to={{ pathname: '/signupLord' }}>
      <BS.NavItem eventKey={2} href="#">
        Sign Up Lord
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
    <BS.NavItem className='sidebar-item' eventKey={4} href="#">
      My Account
    </BS.NavItem>
  );
  const myPayments = (
    <BS.NavItem className='sidebar-item' eventKey={4} href="#">
      My Payments
    </BS.NavItem>
  );
  const myMandates = (
    <BS.NavItem className='sidebar-item' eventKey={4} href="#">
      My Mandates
    </BS.NavItem>
  );
  const exampleMandate = (
    <BS.NavItem className='sidebar-item' eventKey={4} href="http://www.fit2rent.com/pdf/anonymous_mandate_report.pdf" target="_blank">
      Example Rent Mandate
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
        <LinkContainer onClick={setLoginState} to={{ pathname: '/' }}>
          <BS.NavItem eventKey={1} href="#">
            {isLoggedIn() ? 'Log Out' : 'Log In'}
          </BS.NavItem>
        </LinkContainer>
        {isLoggedIn() ? null : signUp }
        {isLoggedIn() ? null : signUpLord }
        {isLoggedIn() ? contactUs : null }
        {isLoggedIn() ? helpCenter : null }
        {isLoggedIn() ? exampleMandate : null }
        {isLoggedIn() ? checkout : null }

      </BS.Nav>
    </BS.Navbar.Collapse>
  );
  return (
    <BS.Navbar fixedTop fluid>
      <BS.Navbar.Header>
        <BS.Navbar.Brand>
          <IndexLink to="/onboarding">
            <Logo />
          </IndexLink>
        </BS.Navbar.Brand>
        <BS.Navbar.Toggle />
      </BS.Navbar.Header>
      {navItems}
    </BS.Navbar>
  );
};

export default NavBar;

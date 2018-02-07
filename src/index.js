/*eslint-disable import/default*/

import Promise from 'es6-promise';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, IndexRedirect } from 'react-router';
import ReactGA from 'react-ga';

import configureStore from './store/configureStore';

import './styles/styles.scss'; // imports all stylesheets

import App from './components/App';
import OnboardingPage from './containers/OnboardingPage';
import DashboardPage from './containers/DashboardPage';
import CheckoutPage from './containers/CheckoutPage';
import LandingPage from './components/LandingPage.js';
import LoginPage from './containers/LoginPage.js';
import SignupPage from './containers/SignupPage.js';
import SignupPageLandLord from './containers/SignupPageLandLord.js';
import ForgotPage from './containers/ForgotPage.js';
import ResetPage from './containers/ResetPage.js';
import FeedbackPage from './containers/FeedbackPage.js';
import VerifyPage from './containers/VerifyPage.js';
import NotFoundPage from './components/NotFoundPage.js';


const store = configureStore();


function requireAuth(nextState, replace) {
  let state = store.getState();
  let loggedIn = state.loginAppState.authorized;
  if (loggedIn != true) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

// Google Analytics
ReactGA.initialize('UA-71626991-3');
function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

render(
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={logPageView}>
      <Route path="/" component={App}>
        <IndexRoute component={LoginPage} />

        <Route path="login" component={LoginPage} />
        <Route path="signup" component={SignupPage} />
        <Route path="signuplandlord" component={SignupPageLandLord} />
        <Route path="forgot" component={ForgotPage} />
        <Route path="reset/:token" component={ResetPage} />

        <Route onEnter={requireAuth} path="onboarding" component={OnboardingPage}/>
        <Route onEnter={requireAuth} path="dashboard" component={DashboardPage}/>
        <Route onEnter={requireAuth} path="checkout" component={CheckoutPage}/>

        <Route path="feedback/:token" component={FeedbackPage} />
        <Route path="ve/:token" component={VerifyPage} />

        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>, document.getElementById('app')
);

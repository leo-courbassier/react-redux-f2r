/*eslint-disable import/default*/

import Promise from 'es6-promise';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, IndexRedirect } from 'react-router';
import ReactGA from 'react-ga';

import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

import './styles/styles.scss'; // imports all stylesheets

import App from './components/App';
import OnboardingLandlordPage from './containers/OnboardingLandlordPage';
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
import AccountPage from './containers/AccountPage.js';
import AccountSummaryPage from './containers/AccountSummaryPage';
import AccountDocumentsPage from './containers/AccountDocumentsPage';
import AccountPasswordPage from './containers/AccountPasswordPage';
import AccountProfilePage from './containers/AccountProfilePage';
import PropertiesPage from './containers/PropertiesPage';
import PropertiesListPage from './containers/PropertiesListPage';
import PropertyProfilePage from './containers/PropertyProfilePage';
import PropertyCreatorPage from './containers/PropertyCreatorPage';
import LeasesPage from './containers/LeasesPage';
import LeasesSummaryPage from './containers/LeasesSummaryPage';
import LeaseEditorPage from './containers/LeaseEditorPage';
import LeaseCreatorPage from './containers/LeaseCreatorPage';
import TenantsPage from './containers/TenantsPage';
import TenantsSummaryPage from './containers/TenantsSummaryPage';
import MessagesPage from './containers/MessagesPage';
import PaymentsPage from './containers/PaymentsPage';
import PaymentsSummaryPage from './containers/PaymentsSummaryPage';
import PaymentsMethodsPage from './containers/PaymentsMethodsPage';
import PaymentsCenterPage from './containers/PaymentsCenterPage';

let NotImplemented = () => <div>Not Implemented</div>;

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

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} onUpdate={logPageView}>
      <Route path="/" component={App}>
        <IndexRoute component={LoginPage} />

        <Route path="login" component={LoginPage} />
        <Route path="signup" component={SignupPage} />
        <Route path="signuplandlord" component={SignupPageLandLord} />
        <Route path="forgot" component={ForgotPage} />
        <Route path="reset/:token" component={ResetPage} />

        <Route onEnter={requireAuth} path="onboardinglandlord" component={OnboardingLandlordPage}/>
        <Route onEnter={requireAuth} path="checkout" component={CheckoutPage}/>
        <Route onEnter={requireAuth} path="dashboard" component={DashboardPage}>
          <Route onEnter={requireAuth} path="account" component={AccountPage}>
            <IndexRoute component={AccountSummaryPage} />
            <Route path="profile" component={AccountProfilePage} />
            <Route path="documents" component={AccountDocumentsPage} />
            <Route path="password" component={AccountPasswordPage} />
          </Route>
          <Route path="properties" component={PropertiesPage}>
            <IndexRoute component={PropertiesListPage} />
            <Route path="new" component={PropertyCreatorPage} />
            <Route path=":id" component={PropertyProfilePage} />
          </Route>
          <Route path="leases" component={LeasesPage}>
            <IndexRoute component={LeasesSummaryPage} />
            <Route path="new" component={LeaseCreatorPage} />
            <Route path=":id" component={LeaseEditorPage} />
          </Route>
          <Route path="tenants" component={TenantsPage}>
            <IndexRoute component={TenantsSummaryPage} />
          </Route>
          <Route path="payments" component={PaymentsPage}>
            <IndexRoute component={PaymentsSummaryPage} />
            <Route path="methods" component={PaymentsMethodsPage} />
            <Route path="center" component={PaymentsCenterPage} />
          </Route>
        </Route>
        <Route onEnter={requireAuth} path="messages(/:folder)(/:id)" component={MessagesPage}/>

        <Route path="feedback/:token" component={FeedbackPage} />
        <Route path="ve/:token" component={VerifyPage} />

        <Route path="*" component={NotFoundPage} />
      </Route>
    </Router>
  </Provider>, document.getElementById('app')
);

import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import accountAppState from './account';
import checkoutAppState from './checkout';
import feedbackAppState from './feedback';
import forgotAppState from './forgot';
import geoAppState from './geo';
import loginAppState from './login';
import onboardingAppState from './onboardinglandlord';
import propertiesAppState from './properties';
import leasesAppState from './leases';
import messagesAppState from './messages';
import resetAppState from './reset';
import sidebarState from './sidebar';
import signupAppState from './signup';
import verifyAppState from './verify';
import notificationAppState from './notification';
import dwollaAppState from './dwolla';
import stripeAppState from './stripe';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  loginAppState,
  signupAppState,
  forgotAppState,
  resetAppState,
  onboardingAppState,
  feedbackAppState,
  checkoutAppState,
  verifyAppState,
  accountAppState,
  sidebarState,
  propertiesAppState,
  leasesAppState,
  messagesAppState,
  notificationAppState,
  geoAppState,
  dwollaAppState,
  stripeAppState,
  form: formReducer,
  routing: routerReducer
});

export default rootReducer;

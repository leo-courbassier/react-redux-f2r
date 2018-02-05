import { combineReducers } from 'redux';

import loginAppState from './login';
import signupAppState from './signup';
import forgotAppState from './forgot';
import resetAppState from './reset';
import dashboardAppState from './dashboard';
import onboardingAppState from './onboarding';
import feedbackAppState from './feedback';
import checkoutAppState from './checkout';
import verifyAppState from './verify';

const rootReducer = combineReducers({
  loginAppState,
  signupAppState,
  forgotAppState,
  resetAppState,
  dashboardAppState,
  onboardingAppState,
  feedbackAppState,
  checkoutAppState,
  verifyAppState
});

export default rootReducer;

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
import accountAppState from './account';
import sidebarState from './sidebar';

const rootReducer = combineReducers({
  loginAppState,
  signupAppState,
  forgotAppState,
  resetAppState,
  dashboardAppState,
  onboardingAppState,
  feedbackAppState,
  checkoutAppState,
  verifyAppState,
  accountAppState,
  sidebarState
});

export default rootReducer;

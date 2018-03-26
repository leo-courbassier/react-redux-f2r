import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import loginAppState from './login';
import signupAppState from './signup';
import forgotAppState from './forgot';
import resetAppState from './reset';
import dashboardAppState from './dashboard';
import onboardingAppState from './onboardinglandlord';
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
  sidebarState,
  form: formReducer
});

export default rootReducer;

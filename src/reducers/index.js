import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import loginAppState from './login';
import signupAppState from './signup';
import forgotAppState from './forgot';
import resetAppState from './reset';
import onboardingAppState from './onboardinglandlord';
import feedbackAppState from './feedback';
import checkoutAppState from './checkout';
import verifyAppState from './verify';
import accountAppState from './account';
import sidebarState from './sidebar';
import propertiesAppState from './properties';
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
  form: formReducer,
  routing: routerReducer
});

export default rootReducer;

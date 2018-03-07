import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {
  accountSubMenu: false,
  paymentSubMenu: false
};


export default function sidebarState(state = initialState, action) {
  switch (action.type) {

    case types.SIDEBAR_MENU_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState.accountSubMenu = false;
      newState.paymentSubMenu = false;
      newState[action.subMenuName + 'SubMenu'] = action.value;
      return newState;
    }

    case types.SIDEBAR_MENU_HIDE:
    {
      let newState = objectAssign({}, state);
      newState.accountSubMenu = false;
      newState.paymentSubMenu = false;
      return newState;
    }

    default:
      return state;
  }
}

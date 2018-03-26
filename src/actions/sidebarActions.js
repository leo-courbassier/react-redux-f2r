import * as types from '../constants/ActionTypes';
import 'isomorphic-fetch';

export function updateSubMenu(subMenuName, value) {
 return {
   type: types.SIDEBAR_MENU_UPDATE,
   subMenuName,
   value
 };
}

export function hideSubMenus() {
  return {
    type: types.SIDEBAR_MENU_HIDE
  };
}

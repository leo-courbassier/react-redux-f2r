import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';

const initialState = {

  status: {
    loading: {},
    uploading: {},
    saving: {},
    modified: {}
  },

  editMode:{
    methods: false,
    center: false
  },

  fundingSources: [],
  creditCards: [],

  stateList: [],
  cityList: [],

  loaded: false

};

export default function paymentsAppState(state = initialState, action) {
  switch (action.type) {

    /* STATUS_UPDATE required in each appState to track status events */

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.PAYMENTS_EDIT_MODE:
    {
      let newState = objectAssign({}, state);
      newState.editMode[action.panelName] = action.value;
      return newState;
    }

    case types.PAYMENTS_METHODS_LOAD:
    {
      let newState = objectAssign({}, state);
      newState.fundingSources = action.fundingSources;
      newState.creditCards = action.creditCards;
      newState.stateList = action.stateList;
      newState.loaded = true;
      return newState;
    }

    case types.PAYMENTS_METHODS_CITIES_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState.cityList = action.cityList;
      return newState;
    }

    default:
      return state;
  }
}

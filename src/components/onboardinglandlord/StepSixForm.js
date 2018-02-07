import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../SubmitButton';
import SelectOptions from '../SelectOptions';
import Switch from 'react-bootstrap-switch';
import _ from 'underscore';
import * as Validation from '../../utils/validation';
import isCurrency from 'validator/lib/isCurrency';

import * as api from '../../actions/api';
import * as conversion from '../../utils/conversion';

import Chooser from './StepSixPanels/Chooser';
import Renter from './StepSixPanels/Renter';
import RenterRoommate from './StepSixPanels/RenterRoommate';
import FamilySingleIncome from './StepSixPanels/FamilySingleIncome';
import FamilyDualIncome from './StepSixPanels/FamilyDualIncome';

const STEP_ID = 5;

const MANDATE_TYPES = {1:'SINGLE', 2:'SHARED', 3:'HEAD_OF_HOUSEHOLD', 4:'JOINT'};

class StepSixForm extends Component {

  state = {
    activeKey: '0',
    submitted: false
  }

  componentWillMount() {
    this.props.load((data) => {
      if (data.mandate) {
        // load city list if mandate already exists
        // this is needed to show the saved city
        if (data.mandate.state) {
          this.getCityList(data.mandate.state, 'mandateCityList');
        }

        // display the appropriate mandate type
        // instead of showing the "Chooser"
        if (data.mandate.mandateType) {
          let mandate = data.mandate.mandateType;
          let activeKey = '0';
          switch (data.mandate.mandateType) {
            case 'SINGLE':            activeKey = '1'; break;
            case 'SHARED':            activeKey = '2'; break;
            case 'HEAD_OF_HOUSEHOLD': activeKey = '3'; break;
            case 'JOINT':             activeKey = '4'; break;
          }
          this.setState({ activeKey });
        }
      }
    });
  }

  componentDidMount() {

  }

  getCityList(state, name){
    let store = this.context.store;
    api.getCityList(
      store.dispatch,
      store.getState,
      state,
      name
      );
  }

  keypress(e) {
    this.props.update(this.props.appState, e.target.name, e.target.value);
  }

  dateKeypress(name, e) {
    let value = e;
    if (typeof e.format === 'function') {
      value = e.format('YYYY-MM-DD');
    }
    this.props.update(this.props.appState, name, value);
  }

  switchKeypress(name, state) {
    this.props.update(this.props.appState, name, state);
  }

  stateListKeypress(cityList, e){
    this.props.update(this.props.appState, e.target.name, e.target.value);
    let store = this.context.store;
    this.getCityList(e.target.value, cityList);
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
    let mandate = MANDATE_TYPES[activeKey];
    this.context.store.dispatch({ type: types.ONBOARDING_STEPSIX_UPDATE_MANDATE_TYPE, mandate });
  }

  isInvalid(){
    let store = this.props.appState[STEP_ID];
    let invalid = false;
    let currencyOptions = {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'};

    if (
      (store.minBedrooms && !Validation.isWhole(store.minBedrooms)) ||
      (store.maxBedrooms && !Validation.isWhole(store.maxBedrooms))
      )
    {
      invalid = 'Minimum and maximum bedrooms must be numbers.'
    }

    if (
      (store.minBathrooms && !Validation.isWholeOrHalf(store.minBathrooms)) ||
      (store.maxBathrooms && !Validation.isWholeOrHalf(store.maxBathrooms))
      )
    {
      invalid = 'Minimum and maximum bathrooms must only be whole or half numbers.'
    }

    if (
      (store.minBathrooms && !Validation.isNumeric(store.minBathrooms)) ||
      (store.maxBathrooms && !Validation.isNumeric(store.maxBathrooms))
      )
    {
      invalid = 'Minimum and maximum bathrooms must be numbers.'
    }

    let minRent = store.minRent ? store.minRent.toString().trim().replace(/\$|,/g, '') : store.minRent;
    let maxRent = store.maxRent ? store.maxRent.toString().trim().replace(/\$|,/g, '') : store.maxRent;
    if (
      (minRent && !isCurrency(minRent)) ||
      (maxRent && !isCurrency(maxRent))
      )
    {
      invalid = 'Min and Max Rent must be in 0.00 format.'
    }

    if (
      (store.minSqft && !Validation.isWhole(store.minSqft)) ||
      (store.maxSqft && !Validation.isWhole(store.maxSqft))
      )
    {
      invalid = 'Minimum and maximum square feet must be numbers.'
    }

    if (
      !store.minBedrooms || store.minBedrooms < 0 ||
      !store.maxBedrooms || store.maxBedrooms < 0
      )
    {
      invalid = 'Please specify minimum and maximum bedrooms.'
    }

    if (
      !store.minBathrooms || store.minBathrooms < 0 ||
      !store.maxBathrooms || store.maxBathrooms < 0
      )
    {
      invalid = 'Please specify minimum and maximum bathrooms.'
    }

    if (
      !store.minRent || store.minRent < 0 ||
      !store.maxRent || store.maxRent < 0
      )
    {
      invalid = 'Please specify minimum and maximum rent.'
    }

    if (
      !store.minSqft || store.minSqft < 0 ||
      !store.maxSqft || store.maxSqft < 0
      )
    {
      invalid = 'Please specify minimum and maximum square feet.'
    }

    if (
      !store.zipCode ||
      !store.city ||
      !store.state
      )
    {
      invalid = 'Please provide a desired city, state and zip code.'
    }

    if (
      !store.moveInDate
      )
    {
      invalid = 'Please provide a desired move in date.'
    }

    if (
      !store.leaseLength
      )
    {
      invalid = 'Please provide a desired lease duration.'
    }

    if(store.mandateType == 'SHARED'){
      if(store.roommates.length == 0 || (store.roommates.length > 0 && !store.roommates[0].email)){
        invalid = 'Please provide at least one roommate.'
      }
    }

    if(store.mandateType == 'HEAD_OF_HOUSEHOLD'){
      if(!store.familyAges){
        invalid = 'Please provide your family member ages.'
      }
    }

    if(store.mandateType == 'JOINT'){
      if(!store.familyAges){
        invalid = 'Please provide your family member ages.'
      }
      if(!store.spouseEmail){
        invalid = 'Please provide an email for your spouse / partner.'
      }
    }

    return invalid;
  }

  submit(e) {
    e.preventDefault();
    this.setState({submitted: true});
    if(this.isInvalid()){
      return false;
    }
    let store = this.props.appState[STEP_ID];

    let minRent = store.minRent ? Math.floor(store.minRent.toString().trim().replace(/\$|,/g, '')).toString() : store.minRent;
    let maxRent = store.maxRent ? Math.floor(store.maxRent.toString().trim().replace(/\$|,/g, '')).toString() : store.maxRent;

    let saveCallback = () => {
      window.scrollTo(0, 0);
      this.props.updateOnboardingScore();
    }

    this.props.save(
      store.mandateType,

      store.minBedrooms,
      store.maxBedrooms,

      store.minBathrooms,
      store.maxBathrooms,

      minRent,
      maxRent,

      store.minSqft,
      store.maxSqft,

      store.zipCode,
      store.moveInDate,
      store.city,
      store.state,
      store.leaseLength,
      store.typeSFH,
      store.typeAPT,
      store.typeCONDO,
      store.typeTH,

      store.roommates,
      store.spouseEmail,
      store.familyAges,

      store.id,

      saveCallback
      );
  }



render(){

  let store = this.props.appState[STEP_ID];

  const chooser = (
    <Chooser
    handleSelect={this.handleSelect.bind(this)}
    appState={this.props.appState}
    store={store} />
    );

  const renter = (
    <Renter
    isInvalid={this.isInvalid.bind(this)}
    submitted={this.state.submitted}
    appState={this.props.appState}
    store={store}
    load={this.props.load}
    submit={this.submit.bind(this)}
    update={this.props.update}
    keypress={this.keypress.bind(this)}
    dateKeypress={this.dateKeypress.bind(this)}
    switchKeypress={this.switchKeypress.bind(this)}
    stateListKeypress={this.stateListKeypress.bind(this)}
     />

    );
  const renterRoommate = (
    <RenterRoommate
    isInvalid={this.isInvalid.bind(this)}
    submitted={this.state.submitted}
    appState={this.props.appState}
    store={store}
    load={this.props.load}
    submit={this.submit.bind(this)}
    update={this.props.update}
    keypress={this.keypress.bind(this)}
    dateKeypress={this.dateKeypress.bind(this)}
    switchKeypress={this.switchKeypress.bind(this)}
    stateListKeypress={this.stateListKeypress.bind(this)}
    />
    );
  const familySingleIncome = (
    <FamilySingleIncome
    isInvalid={this.isInvalid.bind(this)}
    submitted={this.state.submitted}
    appState={this.props.appState}
    store={store}
    load={this.props.load}
    submit={this.submit.bind(this)}
    update={this.props.update}
    keypress={this.keypress.bind(this)}
    dateKeypress={this.dateKeypress.bind(this)}
    switchKeypress={this.switchKeypress.bind(this)}
    stateListKeypress={this.stateListKeypress.bind(this)}
    />

    );
  const familyDualIncome = (
    <FamilyDualIncome
    isInvalid={this.isInvalid.bind(this)}
    submitted={this.state.submitted}
    appState={this.props.appState}
    store={store}
    load={this.props.load}
    submit={this.submit.bind(this)}
    update={this.props.update}
    keypress={this.keypress.bind(this)}
    dateKeypress={this.dateKeypress.bind(this)}
    switchKeypress={this.switchKeypress.bind(this)}
    stateListKeypress={this.stateListKeypress.bind(this)}
    />

);



  const steps = [chooser,renter,renterRoommate,familySingleIncome,familyDualIncome];
  const panel = steps[this.state.activeKey];

  return (
    <Loader appState={this.props.appState} statusType="loading" statusAction="stepSixForm">
    <div>
      {panel}
    </div>
    </Loader>
  );

}



}




StepSixForm.contextTypes = {
  store: PropTypes.object
};

export default StepSixForm;

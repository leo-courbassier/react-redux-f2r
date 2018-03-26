import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../../SubmitButton';
import SelectOptions from '../../SelectOptions';
import Switch from 'react-bootstrap-switch';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'underscore';
import * as Validation from '../../../utils/validation';

import * as api from '../../../actions/api';

import RenterForm from './RenterForm';

const STEP_ID = 5;

const MAX_ROOMMATES = 10;

class RenterRoommate extends Component {

  roommatesKeypress(i, name, e){
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].roommates;

    sources[i][name] = e.target.value;

    api.setStatus(this.context.store.dispatch, 'modified', 'stepSixForm', true);
    store.dispatch({ type: types.ONBOARDING_STEPSIX_UPDATE_ROOMMATES, sources });
  }




  addRoommate = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepSixForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].roommates;

    if (MAX_ROOMMATES > sources.length){

      sources.push({email: null});

      store.dispatch({ type: types.ONBOARDING_STEPSIX_UPDATE_ROOMMATES, sources });
    }
  }

  removeRoommate = (e) => {
    e.preventDefault();
    api.setStatus(this.context.store.dispatch, 'modified', 'stepSixForm', true);
    let store = this.context.store;
    let sources = this.props.appState[STEP_ID].roommates;
    sources.pop();
    store.dispatch({ type: types.ONBOARDING_STEPSIX_UPDATE_ROOMMATES, sources });
  }

  renderRoommates = (source, i) => {
    return (
      <BS.FormGroup controlId="renterRoommates">
      <BS.ControlLabel>Roommate {i + 1}</BS.ControlLabel>

      <div className="row">
        <div className="item">
          <BS.ControlLabel>Email</BS.ControlLabel>
          <BS.FormControl
          value={source.email}
          onChange={_.partial(this.roommatesKeypress.bind(this), i, 'email')}
          name="email"
          type="text" />
        </div>

      </div>
      <div className="section" />
      </BS.FormGroup>
    );
  }



  render(){

    let store = this.props.appState[STEP_ID];

    const roommates = _.map(store.roommates, (source, i) => {
      return this.renderRoommates(source, i);
    });

    const removeButton = (
      <BS.Button
      onClick={this.removeRoommate}
      className="remove-button"
      type="submit"
      bsStyle="success">
        Remove
      </BS.Button>
    );



    const renterRoommates = (
      <div className="add-roommates">
        {roommates}
          <BS.Button
          onClick={(e) => this.addRoommate(e)}
          className="add-button"
          type="submit"
          bsStyle="success">
            Add
          </BS.Button>
          {roommates.length ? removeButton : null}
      </div>
    );



    let warn = this.props.isInvalid() ? (<span className="warn">* <span className="text">{this.props.submitted ? this.props.isInvalid() : ''}</span></span>) : '';

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepSixForm">
        <div className="step step-six form renter-roommate">
          <form>
          <div className="section">Renter with Roommate(s){warn}</div>

          <RenterForm
          store={this.props.store}
          appState={this.props.appState}
          keypress={this.props.keypress.bind(this)}
          dateKeypress={this.props.dateKeypress.bind(this)}
          stateListKeypress={this.props.stateListKeypress.bind(this)}
          switchKeypress={this.props.switchKeypress.bind(this)}
          update={this.props.update}
          />
          <div className="section">Add Roommates</div>
          {renterRoommates}

          </form>
          <br />
          <BS.HelpBlock className="pullLeft warn">
            {this.props.submitted ? this.props.isInvalid() : ''}
          </BS.HelpBlock>
            <SubmitButton
            className="onboarding-submit"
            appState={this.props.appState}
            statusAction="stepSixForm"
            submit={this.props.submit.bind(this)}
            textLoading="Saving"
            textModified="Save Changes">
            Save
            </SubmitButton>
        </div>
      </Loader>
    );

  }
}




RenterRoommate.contextTypes = {
  store: PropTypes.object
};

export default RenterRoommate;

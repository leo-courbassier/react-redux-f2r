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
import FamilyForm from './FamilyForm';

const STEP_ID = 5;

class FamilyDualIncome extends Component {






render(){

let store = this.props.appState[STEP_ID];

let warn = this.props.isInvalid() ? (<span className="warn">* <span className="text">{this.props.submitted ? this.props.isInvalid() : ''}</span></span>) : '';

const spouseForm = (
  <div className="spouse">

      <BS.FormGroup controlId="spouse">

      <div className="row">
        <div className="item">
          <BS.ControlLabel>Invite your Spouse / Partner</BS.ControlLabel>
          <BS.FormControl
          value={store.spouseEmail}
          onChange={this.props.keypress.bind(this)}
          name="spouseEmail"
          type="text" />
        </div>


      </div>

      </BS.FormGroup>

  </div>

);



  return (
    <Loader appState={this.props.appState} statusType="loading" statusAction="stepSixForm">
      <div className="step step-six form family-dual">
        <form>
        <div className="section">Family with Dual Incomes{warn}</div>

        <RenterForm
        store={this.props.store}
        appState={this.props.appState}
        keypress={this.props.keypress.bind(this)}
        dateKeypress={this.props.dateKeypress.bind(this)}
        stateListKeypress={this.props.stateListKeypress.bind(this)}
        switchKeypress={this.props.switchKeypress.bind(this)}
        update={this.props.update}
        />
        <FamilyForm
        store={this.props.store}
        appState={this.props.appState}
        keypress={this.props.keypress.bind(this)}
        />
        {spouseForm}
        </form>
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




FamilyDualIncome.contextTypes = {
  store: PropTypes.object
};

export default FamilyDualIncome;

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



const FamilyForm = ({appState, store, keypress}) => {






  const familyMembers = (

  <div className="family-members">

      <BS.FormGroup controlId="familyMembers">

      <div className="row">
        <div className="item">
          <BS.ControlLabel>Family Member Ages</BS.ControlLabel>
          <BS.HelpBlock>
            Please list the ages of your family members, <b>(do not include yourself)</b> separated by commas.
          </BS.HelpBlock>
          <BS.FormControl
          value={store.familyAges}
          onChange={keypress.bind(this)}
          name="familyAges"
          type="text" />
        </div>


      </div>

      </BS.FormGroup>

  </div>
  );



  return (
    <div>
    {familyMembers}
    </div>
  );



};




export default FamilyForm;

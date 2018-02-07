import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../../SubmitButton';
import SelectOptions from '../../SelectOptions';
import Switch from 'react-bootstrap-switch';
import Datetime from 'react-datetime';
import _ from 'underscore';
import * as Validation from '../../../utils/validation';
import InfoTooltip from '../../InfoTooltip';

import * as api from '../../../actions/api';



const RenterForm = ({appState, store, keypress, dateKeypress, stateListKeypress, switchKeypress}) => {

  const durationList = [1, 3, 6, 9, 12, 15, 18, 24, 36];

  const durationTooltip = (
    <span>
      <h7><b>How long you stay matters</b></h7>
      <p>Landlords care about how long you plan on renting. Sometimes it can even impact the rental rate. Help us find a perfect match by including an estimate of your desired lease length.</p>
    </span>
  );

  const renterForm = (
    <div className="renter-form">
      <BS.FormGroup controlId="renterForm">
      <div className="row">
        <div className="item">
          <BS.ControlLabel>Desired Move-in Date</BS.ControlLabel>
          <Datetime
          timeFormat={false}
          dateFormat="YYYY-MM-DD"
          inputProps={{placeholder: 'YYYY-MM-DD'}}
          viewMode="days"
          value={store.moveInDate}
          onChange={_.partial(dateKeypress.bind(this), 'moveInDate')}
          closeOnSelect />
        </div>
        <div className="item">
          <BS.ControlLabel>State</BS.ControlLabel>
            <SelectOptions
              name="state"
              onChange={_.partial(stateListKeypress.bind(this), 'mandateCityList')}
              defaultValue={store.state}
              optionList={store.stateList}
              defaultOption
              />
          </div>
        </div>

        <div className="row">
          <div className="item">
            <BS.ControlLabel>City</BS.ControlLabel>
              <SelectOptions
                name="city"
                disabled={!store.state}
                loading={appState.status.loading['mandateCityList']}
                loadingText="Retrieving cities..."
                onChange={keypress.bind(this)}
                defaultValue={store.city}
                optionList={appState.cities['mandateCityList']}
                defaultOption
                />
            </div>
            <div className="item">
              <BS.ControlLabel>Zip</BS.ControlLabel>
              <BS.FormControl
              value={store.zipCode}
              onChange={keypress.bind(this)}
              name="zipCode"
              type="text" />
            </div>
          </div>

          <div className="row switches">

            <div className="item">
               <BS.ControlLabel>Property Preferences</BS.ControlLabel>
              <div className="row">
                <div className="item">
                  <BS.ControlLabel>Single Family Home</BS.ControlLabel>
                  <Switch
                  onColor="success"
                  offColor="success"
                  onText="Yes"
                  offText="No"
                  size="mini"
                  onChange={_.partial(switchKeypress.bind(this), 'typeSFH')}
                  state={store.typeSFH} />
                </div>

              </div>


              <div className="row">
                <div className="item">
                  <BS.ControlLabel>Apartment</BS.ControlLabel>
                  <Switch
                  onColor="success"
                  offColor="success"
                  onText="Yes"
                  offText="No"
                  size="mini"
                  onChange={_.partial(switchKeypress.bind(this), 'typeAPT')}
                  state={store.typeAPT} />
                </div>
              </div>

              <div className="row">
                <div className="item">
                  <BS.ControlLabel>Condo</BS.ControlLabel>
                  <Switch
                  onColor="success"
                  offColor="success"
                  onText="Yes"
                  offText="No"
                  size="mini"
                  onChange={_.partial(switchKeypress.bind(this), 'typeCONDO')}
                  state={store.typeCONDO}  />
                </div>
              </div>

              <div className="row">
                <div className="item">
                  <BS.ControlLabel>Townhome</BS.ControlLabel>
                  <Switch
                  onColor="success"
                  offColor="success"
                  onText="Yes"
                  offText="No"
                  size="mini"
                  onChange={_.partial(switchKeypress.bind(this), 'typeTH')}
                  state={store.typeTH} />
                </div>
              </div>

            </div>
          </div>

          <div className="row">
            <div className="item">
              <BS.ControlLabel>Bed Min</BS.ControlLabel>
              <BS.FormControl
              value={store.minBedrooms}
              onChange={keypress.bind(this)}
              name="minBedrooms"
              type="text" />
              <BS.ControlLabel>Bed Max</BS.ControlLabel>
              <BS.FormControl
              value={store.maxBedrooms}
              onChange={keypress.bind(this)}
              name="maxBedrooms"
              type="text" />
            </div>
            <div className="item">
              <BS.ControlLabel>Bath Min</BS.ControlLabel>
              <BS.FormControl
              value={store.minBathrooms}
              onChange={keypress.bind(this)}
              name="minBathrooms"
              type="text" />
              <BS.ControlLabel>Bath Max</BS.ControlLabel>
              <BS.FormControl
              value={store.maxBathrooms}
              onChange={keypress.bind(this)}
              name="maxBathrooms"
              type="text" />
            </div>
          </div>

          <div className="row">
            <div className="item">
              <BS.ControlLabel>Rent Min</BS.ControlLabel>
              <BS.InputGroup>
                <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                <BS.FormControl
                value={store.minRent}
                onChange={keypress.bind(this)}
                name="minRent"
                type="text" />
              </BS.InputGroup>
              <BS.ControlLabel>Rent Max</BS.ControlLabel>
              <BS.InputGroup>
                <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                <BS.FormControl
                value={store.maxRent}
                onChange={keypress.bind(this)}
                name="maxRent"
                type="text" />
              </BS.InputGroup>
            </div>
            <div className="item">
              <BS.ControlLabel>Sqft Min</BS.ControlLabel>
              <BS.FormControl
              value={store.minSqft}
              onChange={keypress.bind(this)}
              name="minSqft"
              type="text" />
              <BS.ControlLabel>Sqft Max</BS.ControlLabel>
              <BS.FormControl
              value={store.maxSqft}
              onChange={keypress.bind(this)}
              name="maxSqft"
              type="text" />
            </div>
          </div>

          <div className="row">
            <div className="item">
              <BS.ControlLabel>Duration<InfoTooltip placement="top" tooltip={durationTooltip} /></BS.ControlLabel>
              <SelectOptions
                name="leaseLength"
                onChange={keypress.bind(this)}
                defaultValue={store.leaseLength}
                optionList={durationList}
                suffix={['month','months']}
                defaultOption
                />
              </div>
            </div>
            </BS.FormGroup>
          </div>

  );



  return (
    <div>
    {renterForm}
    </div>
  );



};




export default RenterForm;

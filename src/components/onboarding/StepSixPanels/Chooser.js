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

const STEP_ID = 5;



class Chooser extends Component {



  componentWillMount() {
    //this.props.load();
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

  switchKeypress(name, collapsible, state) {
    this.props.update(this.props.appState, name, state);
    if(collapsible){
      this.state[collapsible] = state;
      this.setState();
    }
  }

  stateListKeypress(cityList, e){
    this.props.update(this.props.appState, e.target.name, e.target.value);
    let store = this.context.store;
    this.getCityList(e.target.value, cityList);
  }






  submit(e) {
    e.preventDefault();

    api.setStatus(this.context.store.dispatch, 'loading', 'stepSixForm', true);
    //this.setState({submitted: true});
    let store = this.props.appState[STEP_ID];
    // this.props.save(
    //   store.jobTitle,
    //   store.jobSalary,
    //   store.jobEmployer
    //   );
  }



render(){

  let store = this.props.appState[STEP_ID];

  const messageIfInvited = (
    <div className="section-box">
      This step is optional since you have already been added to a rent mandate by invitation.
      Continuing with this step will create a new mandate and remove you from the previous one.
    </div>
  );

  return (
    <div className="step step-six chooser">

      {store.inviteStatus ? messageIfInvited : null}

      <div className="row">
          <div className='item'>
            <BS.HelpBlock>
              <h4>I'm A...</h4>
            </BS.HelpBlock>
          </div>
        </div>
      <div className="row">
        <div className="item">
          <BS.Button
          bsStyle="success"
          onClick={_.partial(this.props.handleSelect.bind(this), 1)}
          type="submit">
          Single Renter
          </BS.Button>
        </div>
        <div className="item">
          <BS.Button
          bsStyle="success"
          onClick={_.partial(this.props.handleSelect.bind(this), 3)}
          type="submit">
          Family w/ Single Income
          </BS.Button>
        </div>
      </div>
      <div className="row">
        <div className="item">
          <BS.Button
          bsStyle="success"
          onClick={_.partial(this.props.handleSelect.bind(this), 2)}
          type="submit">
          Renter w/ Roommate(s)
          </BS.Button>
        </div>
        <div className="item">
          <BS.Button
          bsStyle="success"
          onClick={_.partial(this.props.handleSelect.bind(this), 4)}
          type="submit">
          Family w/ Dual Incomes
          </BS.Button>
        </div>
      </div>
    </div>
  );

}



}




Chooser.contextTypes = {
  store: PropTypes.object
};

export default Chooser;

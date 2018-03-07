import React from 'react';
let {Component} = React;

import * as BS from 'react-bootstrap';

export default class PasswordInfo extends Component{

  constructor(props){
    super(props);

    this.state = {
      currentPassword: '',
      newPassword: '',
      newPassword2: ''
    }
  }

  render(){
    let {editMode} = this.props;
    return (
      <div className="password-info">
        {editMode ? this.renderEdit() : this.renderView()}
      </div>
    );
  }

  propUpdate(key, event){
    let obj = {};
    obj[key] = event.target.value;
    this.setState(obj);
  }

  renderEdit(){
    let {onSubmit} = this.props;
    let {currentPassword, newPassword, newPassword2} = this.state;
    let onSubmitEvent = (event) => {
      event.preventDefault();
      onSubmit(this.state);
    };

    return (
      <form onSubmit={onSubmitEvent}>
        <div className="section">
          Change Password
        </div>

        <BS.FormGroup controlId="currentPassword">
          <BS.ControlLabel>Current Password</BS.ControlLabel>
          <BS.FormControl type="password" value={currentPassword} onChange={this.propUpdate.bind(this, 'currentPassword')}/>
          <BS.FormControl.Feedback />
        </BS.FormGroup>

        <BS.FormGroup controlId="newPassword">
          <BS.ControlLabel>New Password</BS.ControlLabel>
          <BS.FormControl type="password" value={newPassword} onChange={this.propUpdate.bind(this, 'newPassword')}/>
          <BS.FormControl.Feedback />
        </BS.FormGroup>

        <BS.FormGroup controlId="newPassword2">
          <BS.ControlLabel>New Password (Confirm)</BS.ControlLabel>
          <BS.FormControl type="password" value={newPassword2} onChange={this.propUpdate.bind(this, 'newPassword2')}/>
          <BS.FormControl.Feedback />
        </BS.FormGroup>

        <BS.Button bsStyle="success" className="pull-right" type="submit">
          Save
        </BS.Button>
      </form>
    );
  }

  renderView(){
    let {userInfo} = this.props;

    return (
      <div>
        <div className="heading">
          Login
        </div>
        <div>
          {userInfo.email}
        </div>
        <div className="heading">
          Password
        </div>
        <div>
          *********
        </div>
      </div>
    );
  }
}

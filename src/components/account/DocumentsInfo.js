import React from 'react';
let {Component} = React;

import {Button} from 'react-bootstrap';

export default class DocumentsInfo extends Component{
  render(){
    return (
      <div className="documents-info">
        {this.renderStorageInvite()}
      </div>
    );
  }
  renderStorageInvite(){
    return (
      <div className="storage-invite">
        <b>
          Our Server Storage Costs require that we $2.99 per month to use this feature.
          <br/>
          Would you like to sign up?
        </b>
        <Button bsStyle="primary" onClick={()=>alert('not implemented!')}>Heck Yeah!</Button>
      </div>
    );
  }
}

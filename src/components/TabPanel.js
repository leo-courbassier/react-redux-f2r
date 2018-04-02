import React, { Component } from 'react';
import * as BS from 'react-bootstrap';

export default class TabPanel extends Component {
  componentWillUnmount(){
    if(this.props.editMode){
      this.changeEditMode();
    }
  }
  changeEditMode(){
    let {editMode, onClick} = this.props;
    onClick(!editMode);
  }

  render(){
    let {title, children, editMode} = this.props;

    return (
      <div className="editable-panel">
        <div className="header">
          <h5>{title}</h5>
          <span className="empty-space" />
        </div>
        <div className="body">
          {children}
        </div>
      </div>
    );
  }
}

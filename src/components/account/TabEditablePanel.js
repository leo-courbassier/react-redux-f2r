import React from 'react';
let {Component} = React;
import * as BS from 'react-bootstrap';

export default class TabEditablePanel extends Component{
  render(){
    let {title, children, editMode, onClick} = this.props;
    let onButtonClick = () => onClick(!editMode);
    return (
      <div className="editable-panel">
        <div className="header">
          <h5>{title}</h5>
          <span className="empty-space" />
          <BS.Button bsSize="sm" onClick={onButtonClick} active={editMode}>
            <BS.Glyphicon glyph="pencil" />
            {editMode ? 'Cancel' : 'Edit'}
          </BS.Button>
        </div>
        <div className="body">
          {children}
        </div>
      </div>
    );
  }
}

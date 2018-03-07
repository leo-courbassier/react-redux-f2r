import React from 'react';
let {Component} = React;

export default class DocumentsInfo extends Component{
  render(){
    let {editMode} = this.props;
    return (
      <div className="documents-info">
        documents info - {editMode ? 1 : 0}
      </div>
    );
  }
}

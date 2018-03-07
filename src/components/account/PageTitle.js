import React from 'react';
let {Component} = React;

export default class PageTitle extends Component{
  render(){
    let {children} = this.props;
    return (
      <h1 className="page-title">{children}</h1>
    );
  }
}

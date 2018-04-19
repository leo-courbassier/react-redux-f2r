import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import ButtonSpinner from './ButtonSpinner';


class SubmitButton extends Component {

  isLoading() {
    return this.props.appState.status['loading'][this.props.statusAction];
  }

  isSaving() {
    return this.props.appState.status['saving'][this.props.statusAction];
  }

  isModified() {
    return this.props.appState.status['modified'][this.props.statusAction];
  }

  isUploading() {
    return this.props.appState.status['uploading'][this.props.statusAction];
  }

  isActive() {
    if(this.isLoading() || this.isSaving() || this.isUploading()){
      return true;
    }else{
      return false;
    }
  }



  noClick(e){
    e.preventDefault();
  }


  render() {
    let buttonText;
    if (this.isActive()){
      buttonText = this.props.textLoading;
    }else{
      if (this.isModified()){
        buttonText = this.props.textModified;
      }else{
        buttonText = this.props.children;
      }
    }
    let buttonStyle;
    if (this.isModified()){
      buttonStyle = 'warning';
    }else if (this.props.bsStyle){
      buttonStyle = this.props.bsStyle;
    }else{
      buttonStyle = 'success';
    }

    let buttonClass = `submit-button ${this.props.className}`;

    return (
      <BS.Button
      className={buttonClass}
      bsStyle={buttonStyle}
      onClick={this.props.submit ? this.props.submit : this.noClick}
      disabled={this.isActive() || this.props.disabled}
      type="submit">
        <div className="spinner">{this.isActive() ? <ButtonSpinner /> : null}</div>
        <div className="text">{buttonText}</div>
      </BS.Button>
    );
  }

}

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
  appState: PropTypes.object.isRequired,
  textLoading: PropTypes.string.isRequired,
  textModified: PropTypes.string,
  submit: PropTypes.func
};

SubmitButton.contextTypes = {
  store: PropTypes.object
};

export default SubmitButton;

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as BS from 'react-bootstrap';
import _ from 'underscore';


class SelectOptions extends Component {


  renderOptions(item, key, selectedItem, i) {
    let value;
    if(this.props.keyValue){
      value = key;
    }else{
      value = item;
    }
    if(this.props.valuesToUpper){
      value = value.toUpperCase();
    }
    let bookend;
    if(this.props.bookend){
      bookend = (i == (this.props.optionList.length - 1)) ? ` ${this.props.bookend}` : '';
    }
    if(this.props.suffix){
      bookend = (i == 0) ? ` ${this.props.suffix[0]}` : ` ${this.props.suffix[1]}`;
    }
    return (
      <option value={value} key={key}>{item}{bookend}</option>
    );
  }


  render() {
    let options = _.map(this.props.optionList, (item, key, i) => {
      return this.renderOptions(item, key, this.props.defaultValue, i);
    });
    let defaultOptionValue = this.props.defaultOptionValue ? this.props.defaultOptionValue : '';
    let defaultOptionName = this.props.defaultOptionName ? this.props.defaultOptionName : '';
    let defaultOption = this.props.defaultOption ? <option value={defaultOptionValue}>{defaultOptionName}</option> : null;
    defaultOption = this.props.loading ? <option value={defaultOptionValue}>{this.props.loadingText}</option> : defaultOption;
    options = this.props.loading ? null : options;
    return (
      <BS.FormControl
      disabled={this.props.disabled}
      name={this.props.name}
      className={this.props.className}
      value={this.props.defaultValue}
      onChange={this.props.onChange}
      componentClass="select">
        {defaultOption}
        {options}
      </BS.FormControl>
    );
  }

}

SelectOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  className: PropTypes.string,
  optionList: PropTypes.array,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string
};

SelectOptions.defaultProps = {
  optionList: []
};

SelectOptions.contextTypes = {
  store: PropTypes.object
};

export default SelectOptions;

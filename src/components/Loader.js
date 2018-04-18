import React, { Component, PropTypes } from 'react';
import Spinner from './Spinner';


class Loader extends Component {

  isLoading() {
    return this.props.appState.status[this.props.statusType][this.props.statusAction];
  }

  render() {
    return (
      <div>
        {this.isLoading() ? <Spinner /> : this.props.children}
      </div>
    );
  }

}

Loader.propTypes = {
  children: PropTypes.node
};

Loader.contextTypes = {
  store: PropTypes.object
};

export default Loader;

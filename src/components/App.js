import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';

import NavBarContainer from '../containers/NavBar';

import * as actions from '../actions/loginActions';

class App extends Component {
  render() {
    return (
      <div>
        <NavBarContainer />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

App.contextTypes = {
  store: PropTypes.object
};

export default App;

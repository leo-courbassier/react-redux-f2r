import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';

import NavBar from '../components/NavBar';

import * as actions from '../actions/loginActions';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar
        logout={actions.logout()}
        store={this.context.store} />
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

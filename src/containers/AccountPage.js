import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import * as actions from '../actions/accountActions';
import HighLightsColumn from '../components/account/HighLightsColumn';

class AccountPage extends Component {
  constructor(props){
    super(...arguments);
    props.actions.loadAccountInfo();
  }
  render() {
    let {children, accountState} = this.props;

    return (
      <div className="account-page row">

        <BS.Col xs={12} sm={12} md={8} className="panels">

          {children}

        </BS.Col>

        <BS.Col xsHidden smHidden md={4}>
          <HighLightsColumn accountState={accountState} />
        </BS.Col>

      </div>
    );
  }
}

AccountPage.propTypes = {
  actions: PropTypes.object.isRequired,
  accountState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    accountState: state.accountAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage);

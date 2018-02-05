import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import Loader from '../components/Loader';
import SideBar from '../components/SideBar';
import CheckoutForm from '../components/CheckoutForm';

import * as actions from '../actions/checkoutActions';


class CheckoutPage extends Component {
  componentDidMount(){
    this.props.actions.loadCheckout();
  }

  render() {
    return (
      <div className="checkout-page">
        <Loader
          appState={this.props.appState}
          statusType="loading"
          statusAction="checkoutPage"
        >
          <div>
            <BS.Col xsHidden sm={3} md={3} className="sidebar">
              <SideBar />
            </BS.Col>
            <BS.Col xs={12} sm={9} md={6} className="panels">
              <CheckoutForm
                appState={this.props.appState}
                updateCheckoutForm={this.props.actions.updateCheckoutForm}
                clearCheckoutForm={this.props.actions.clearCheckoutForm}
                checkDiscountCode={this.props.actions.checkDiscountCode}
                removeService={this.props.actions.removeService}
                sendPayment={this.props.actions.sendPayment}
                store={this.context.store.getState().checkoutAppState}
              />
            </BS.Col>
            <BS.Col xsHidden smHidden md={3}>

            </BS.Col>
          </div>
        </Loader>
      </div>
    );
  }
}

CheckoutPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

CheckoutPage.contextTypes = {
  store: PropTypes.object
};

function mapStateToProps(state) {
  return {
    appState: state.checkoutAppState,
    userState: state.loginAppState
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
)(CheckoutPage);

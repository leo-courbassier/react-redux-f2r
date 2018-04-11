/**
 * DwollaPayment Component
 *
 * This component is meant to be generic so it is not coupled to a certain
 * part of the app. It currently handles deposits only but can be made
 * even more generic when needed (such as for Dashboard Payments section).
 *
 * Usage: <DwollaPayment type="deposit" />
 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SubmitButton from './SubmitButton';
import reactMixin from 'react-mixin';
import {ReactScriptLoaderMixin} from 'react-script-loader';
import * as BS from 'react-bootstrap';
import Loader from './Loader';
import Validator from 'validator';
import * as types from '../constants/ActionTypes';
import SelectOptions from './SelectOptions';
import _ from 'underscore';
import * as api from '../actions/api';
import * as actions from '../actions/dwollaActions';
import * as services from '../constants/Services';

class DwollaPayment extends Component {

  state = {
    missingAmount: false,
    ageVerified: false
  }

  componentWillMount() {
    let setup = this.props.type === 'setup';
    this.props.actions.loadDwolla(setup);
  }

  componentWillUnmount() {
    let token = null;
    this.context.store.dispatch({type: types.DWOLLA_PAYMENT_TOKEN, token});
    this.context.store.dispatch({type: types.DWOLLA_PAYMENT_FORM_RESET});
  }

  keypress(statusAction, e) {
    api.setStatus(this.context.store.dispatch, 'modified', statusAction, true);
    this.context.store.dispatch({
      type: types.DWOLLA_PAYMENT_FORM_UPDATE,
      name: e.target.name,
      value: e.target.value
    });
  }

  getScriptURL() {
    return 'https://cdn.dwolla.com/1/dwolla.js';
  }

  onScriptLoaded() {
    let store = this.props.appState;
    let dwolla = window.dwolla;
    if (services.DWOLLA_ENV === 'sandbox') dwolla.configure('sandbox');
    let self = this;
    this.dwollaWaitStart(self);
  }

  dwollaWaitStart(self) {
    // dwolla does not know about ReactDOM, so timeout until #dwolla-ui element renders && token received
    let store = self.props.appState;
    let dwolla = window.dwolla;
    let dwollaNode = ReactDOM.findDOMNode(self.refs.dwolla);
    if (store.dwollaToken == null || dwollaNode == null) {
      setTimeout(self.dwollaWaitStart, 500, self);
    } else {
      dwolla.iav.start(store.dwollaToken, {
        container: 'dwolla-ui',
        fallbackToMicrodeposits: false
      }, function(err, res) {
        if (!err) self.dwollaFinished();
      });
    }
  }

  dwollaFinished() {
    if (this.props.dwollaCallback) this.props.dwollaCallback();

    api.verifyFundingSources(this.context.store.dispatch, this.context.store.getState, (accounts) => {
      this.context.store.dispatch({
        type: types.DWOLLA_PAYMENT_LOAD_ACCOUNT_LIST,
        accounts
      });
    });

    this.context.store.dispatch({
      type: types.DWOLLA_PAYMENT_VERIFIED_STATUS,
      verified: true
    });
  }

  onScriptError() {

  }

  amountInvalid() {
    let store = this.props.appState;
    let dwollaAmount = store.dwollaAmount;
    if (this.props.type !== 'deposit') return false;
    if (dwollaAmount != null) {
      dwollaAmount = store.dwollaAmount.toString().trim().replace(/\$|,/g, '');
    }
    return store.dwollaAmount != null && !Validator.isCurrency(dwollaAmount, {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'});
  }

  showDwollaStatus() {
    let store = this.props.appState;
    if (this.amountInvalid()) {
      return <div>Amount must be in 0.00 format</div>;
    }
    else if (this.state.missingAmount){
      return <div>Amount is required.</div>;
    }
    else if (!this.state.ageVerified){
      return <div>Please verify your age.</div>;
    }
    else if (store.dwollaTransactionStatus) {
      return <div>{store.dwollaTransactionStatus}</div>;
    } else {
      return null;
    }
  }

  getHeadingText() {
    let text = '';
    switch (this.props.type) {
      case 'deposit': {
        text = 'Post with a Bank Account';
        break;
      }
      case 'setup': {
        text = 'Setup a new Bank Account';
        break;
      }
    }
    return text;
  }

  getSubmitButtonText(state) {
    let text = '';
    switch (state) {
      case 'loading': {
        text = this.props.type === 'setup' ? 'Adding' : 'Submitting';
        break;
      }
      case 'modified': {
        switch (this.props.type) {
          case 'deposit': {
            text = 'Submit Deposit';
            break;
          }
          case 'setup': {
            text = 'Add Bank Account';
            break;
          }
        }
        break;
      }
      default: {
        switch (this.props.type) {
          case 'deposit': {
            text = 'Submit Deposit';
            break;
          }
          case 'setup': {
            text = 'Add Bank Account';
            break;
          }
        }
      }
    }
    return text;
  }

  submit(e) {
    e.preventDefault();

    let store = this.props.appState;
    let amountRequired = this.props.type === 'deposit';
    let dwollaAmount = store.dwollaAmount;

    if (!this.amountInvalid()) {

      if (amountRequired && store.dwollaAmount == null) {
        this.setState({missingAmount: true});
        return false;
      } else if (amountRequired) {
        dwollaAmount = store.dwollaAmount.toString().trim().replace(/\$|,/g, '');
        this.setState({missingAmount: false});
      } else {
        this.setState({missingAmount: false});
      }

      if (!this.state.ageVerified) return false;

      api.setStatus(this.context.store.dispatch, 'saving', 'dwollaForm', true);

      let account = _.findWhere(store.dwollaAccountList, {id: store.dwollaSelectedAccount});
      let userId = this.context.store.getState().loginAppState.userInfo.id;

      if (this.props.type === 'deposit') {
        let payload = {
          "currency": "USD",
          "value": dwollaAmount,
          "acct_id": account.id,
          "acct_name": account.name,
          "acct_type": "checking",
          "paymentType": "TT_PAY_F2R_SEC_DEPOSIT"
        };

        this.props.actions.saveDwollaDeposit(
          payload, userId, this.props.callback
        );
      } else {
        if (this.props.callback) this.props.callback();
      }

    }

  }

  renderDwollaUI() {
    return (
      <div ref="dwolla" id="dwolla-ui" />
    );
  }

  renderPaymentForm() {
    let store = this.props.appState;

    let accountList =
      _.reduce(store.dwollaAccountList, function(o, v){
        o[v.id] = v.name;
        return o;
      }, {});

    return (
        <div>
        <form>
          <BS.FormGroup controlId="dwolla">
          <div className="row">
            <div className="item account">
              <BS.ControlLabel>Account</BS.ControlLabel>
              <SelectOptions
                name="dwollaSelectedAccount"
                value={store.dwollaSelectedAccount}
                onChange={_.partial(this.keypress.bind(this), 'dwollaForm')}
                optionList={accountList}
                keyValue
                />
            </div>
            {this.props.type === 'deposit' && (
              <div className="item amount">
                <BS.ControlLabel>Amount (USD $)</BS.ControlLabel>
                <BS.InputGroup>
                  <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                  <BS.FormControl
                  onChange={_.partial(this.keypress.bind(this), 'dwollaForm')}
                  placeholder="0.00"
                  value={store.dwollaAmount}
                  name="dwollaAmount"
                  type="text" />
                </BS.InputGroup>
              </div>
            )}
          </div>

          <div className="row">
            <div className="item">


          <BS.Checkbox
          onClick={(e)=> this.setState({ ageVerified: !this.state.ageVerified })}
          value={this.state.ageVerified}
          name="ageVerified" inline>Please confirm you are 18 years or older</BS.Checkbox>
            </div>
          </div>

          </BS.FormGroup>
        </form>

        {this.props.appState.dwollaTransactionStatus == 'ACH Payment transfer delivered successfully.' ? (
          <BS.HelpBlock>
            <div className="dwolla-success-message text-success text-center">
              <strong>{this.showDwollaStatus()}</strong>
            </div>
          </BS.HelpBlock>
        ) : (
          <BS.HelpBlock className="text-center">
            {this.showDwollaStatus()}
          </BS.HelpBlock>
        )}

        <div className="pull-right">
          {this.props.altButton}
          {' '}
          <SubmitButton
          className="dwolla-submit"
          appState={this.props.appState}
          statusAction="dwollaForm"
          submit={this.submit.bind(this)}
          textLoading={this.getSubmitButtonText('loading')}
          textModified={this.getSubmitButtonText('modified')}>
            {this.getSubmitButtonText()}
          </SubmitButton>
        </div>

        </div>
    );
  }


  render() {
    let store = this.props.appState;
    let ui = store.dwollaVerifiedStatus ? this.renderPaymentForm() : this.renderDwollaUI();

    if (this.props.type === 'setup') {
      ui = this.renderDwollaUI();
    }

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="dwollaForm">
        <div className="dwolla-payment-container clearfix">
          <div className="section">{this.getHeadingText()}</div>
          {this.props.helpBlock}
          {ui}
        </div>
      </Loader>
    );
  }

}

reactMixin(DwollaPayment.prototype, ReactScriptLoaderMixin);

DwollaPayment.propTypes = {
  type: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  children: PropTypes.element
};

DwollaPayment.contextTypes = {
  store: PropTypes.object,
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    appState: state.dwollaAppState,
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
)(DwollaPayment);

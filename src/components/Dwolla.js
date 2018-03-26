import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import SubmitButton from './SubmitButton';
import reactMixin from 'react-mixin';
import {ReactScriptLoaderMixin} from 'react-script-loader';
import * as BS from 'react-bootstrap';
import Loader from './Loader';
import Validator from 'validator';
import Spinner from './Spinner';
import * as types from '../constants/ActionTypes';
import SelectOptions from './SelectOptions';
import _ from 'underscore';
import * as api from '../actions/api';


const STEP_ID = 3;

class DwollaCheckout extends Component {


  state = {
    missingAmount: false,
    ageVerified: false
  }

  componentWillMount() {
    this.props.load();
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    let token = null;
    this.context.store.dispatch({type: types.DWOLLA_TOKEN, token});
  }

  getScriptURL() {
    return 'https://cdn.dwolla.com/1/dwolla.js';
  }

  onScriptLoaded() {
    let store = this.props.appState[STEP_ID];
    let dwolla = window.dwolla;
    // dwolla.configure('sandbox');
    let self = this;
    this.dwollaWaitStart(self);

  }

  dwollaWaitStart(self) {
    // dwolla does not know about ReactDOM, so timeout until #dwolla-ui element renders && token received
    let store = self.props.appState[STEP_ID];
    let dwolla = window.dwolla;
    let dwollaNode = ReactDOM.findDOMNode(self.refs.dwolla);
    if(store.dwollaToken == null || dwollaNode == null){
      setTimeout(self.dwollaWaitStart, 500, self);
    }else{
      dwolla.iav.start(store.dwollaToken, {
          container: 'dwolla-ui',
          fallbackToMicrodeposits: false
        }, function(err, res) {
          if (err){
            console.log('Error: ' + JSON.stringify(err) + ' -- Response: ' + JSON.stringify(res)) // eslint-disable-line
          } else {
            self.dwollaFinished();
          }
      });
    }
  }

  dwollaFinished(){

    api.verifyFundingSources(this.context.store.dispatch, this.context.store.getState, (json) =>{
      let accounts = json;
      this.context.store.dispatch({type: types.DWOLLA_LOAD_ACCOUNT_LIST, accounts});
    });

    let verified = true;
    this.context.store.dispatch({type: types.DWOLLA_VERIFIED_STATUS, verified});
  }

  onScriptError() {

  }

  amountInvalid() {
    let store = this.props.appState[STEP_ID];
    let dwollaAmount = store.dwollaAmount;
    if (dwollaAmount != null) {
      dwollaAmount = store.dwollaAmount.toString().trim().replace(/\$|,/g, '');
    }
    return store.dwollaAmount != null && !Validator.isCurrency(dwollaAmount, {allow_negatives: false, thousands_separator: '.', decimal_separator: '.'});
  }

  showDwollaStatus(){
    let store = this.props.appState[STEP_ID];
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



  submit(e) {
    e.preventDefault();

    let store = this.props.appState[STEP_ID];
    let dwollaAmount = store.dwollaAmount;

    if (!this.amountInvalid()){

      if(store.dwollaAmount == null){
        this.setState({missingAmount: true});
        return false;
      }else{
        dwollaAmount = store.dwollaAmount.toString().trim().replace(/\$|,/g, '');
        this.setState({missingAmount: false});
      }

      if(!this.state.ageVerified){
        return false;
      }

      api.setStatus(this.context.store.dispatch, 'saving', 'dwollaForm', true);


      let account = _.findWhere(store.dwollaAccountList, {id: store.dwollaSelectedAccount});

      let payload = {
        "currency":"USD",
        "value": dwollaAmount,
        "acct_id": account.id,
        "acct_name": account.name,
        "acct_type": "checking",
        "paymentType": "TT_PAY_F2R_SEC_DEPOSIT"
      };

      let userId = this.context.store.getState().loginAppState.userInfo.id;

      this.props.save(
        payload, userId, this.props.updateOnboardingScore
      );

    }

  }

  renderDwollaUI() {
    return (
      <div ref="dwolla" id="dwolla-ui" />
    );
  }

  renderPaymentForm() {
    let store = this.props.appState[STEP_ID];

    let accountList =
      _.reduce(store.dwollaAccountList, function(o, v){
        o[v.id] = v.name;
        return o;
      }, {});


    return (
        <div>
        <form>
          <BS.FormGroup controlId="guarantor">
          <div className="row">
            <div className="item account">
              <BS.ControlLabel>Account</BS.ControlLabel>
              <SelectOptions
                name="dwollaSelectedAccount"
                value={store.dwollaSelectedAccount}
                onChange={_.partial(this.props.keypress.bind(this), 'dwollaForm')}
                optionList={accountList}
                keyValue
                />
            </div>
            <div className="item amount">
              <BS.ControlLabel>Amount (USD $)</BS.ControlLabel>
              <BS.InputGroup>
                <BS.InputGroup.Addon>$</BS.InputGroup.Addon>
                <BS.FormControl
                onChange={_.partial(this.props.keypress.bind(this), 'dwollaForm')}
                placeholder="0.00"
                value={store.dwollaAmount}
                name="dwollaAmount"
                type="text" />
              </BS.InputGroup>
            </div>
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

        {this.props.appState[STEP_ID].dwollaTransactionStatus == 'ACH Payment transfer delivered successfully.' ? (
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

        <br />

          <SubmitButton
          className="dwolla-submit pullRight"
          appState={this.props.appState}
          statusAction="dwollaForm"
          submit={this.submit.bind(this)}
          textLoading="Submitting"
          textModified="Submit Deposit">
            Submit Deposit
          </SubmitButton>

        </div>
    );
  }


  render() {

    let store = this.props.appState[STEP_ID];

    let checkout = store.dwollaVerifiedStatus ? this.renderPaymentForm() : this.renderDwollaUI();

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="dwollaForm">
        <div className="dwolla-checkout-container">
        <div className="section">Post with a Bank Account</div>
          {checkout}
        </div>
      </Loader>
    );
  }

}

reactMixin(DwollaCheckout.prototype, ReactScriptLoaderMixin);

DwollaCheckout.propTypes = {
  children: PropTypes.element
};

DwollaCheckout.contextTypes = {
  store: PropTypes.object
};

export default DwollaCheckout;

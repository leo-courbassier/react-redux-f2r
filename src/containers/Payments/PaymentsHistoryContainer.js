import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import smoothScroll from 'smooth-scroll';

import * as actions from '../../actions/paymentsActions';
import Loader from '../../components/Loader';
import Panel from '../../components/Payments/Panel';
import PaymentsHistory from '../../components/Payments/History';

class PaymentsHistoryContainer extends Component {

  prevPage() {
    const page = this.props.appState.historyPage - 1;
    const statusAction = 'paymentsHistoryPrev';
    this.props.actions.loadPaymentsHistory(page, statusAction, () => {
      smoothScroll.animateScroll(ReactDOM.findDOMNode(this.refs.history).offsetTop);
    });
  }

  nextPage() {
    const page = this.props.appState.historyPage + 1;
    const statusAction = 'paymentsHistoryNext';
    this.props.actions.loadPaymentsHistory(page, statusAction, () => {
      smoothScroll.animateScroll(ReactDOM.findDOMNode(this.refs.history).offsetTop);
    });
  }

  render() {
    const {appState, actions} = this.props;
    const editMode = appState.editMode.recurring;
    const toggleEditMode = () => actions.editModeUpdate('recurring', !editMode);

    return (
      <Panel title="Past Payments">
        <PaymentsHistory
          ref="history"
          appState={appState}
          load={actions.loadPaymentsHistory}
          prevPage={this.prevPage.bind(this)}
          nextPage={this.nextPage.bind(this)}
        />
      </Panel>
    );
  }

}

function mapStateToProps(state) {
  return {
    appState: state.paymentsAppState
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
)(PaymentsHistoryContainer);

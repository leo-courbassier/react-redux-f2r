import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import moment from 'moment';

import { PAYMENT_HISTORY_PAGE_SIZE } from '../../constants/App';

import Loader from '../Loader';
import SubmitButton from '../SubmitButton';

class PaymentsHistory extends Component {

  componentWillMount() {
    if (!this.props.appState.historyPaymentLoaded) {
      this.props.load();
    }
  }

  formatMoney(amount) {
    if (!amount) return 0.00;
    return parseFloat(amount).toFixed(2);
  }

  getItemDescription(item) {
    let description = item.description;
    switch (description) {
      default:
        description = item.description || 'no description available';
    }
    return description;
  }

  render() {
    const { appState, prevPage, nextPage } = this.props;
    const { history, historyPage } = appState;
    const hasHistory = history.length > 0 && history[historyPage] && history[historyPage].items.length > 0;
    const noMoreItems = history.length > 0 && historyPage !== 0 && !history[historyPage];
    const hasNext = history.length > 0 && history[historyPage] && history[historyPage].items.length === PAYMENT_HISTORY_PAGE_SIZE;

    return (
      <Loader appState={appState} statusType="loading" statusAction="paymentHistory">
        <div className="paymenthistory-panel">
          {!hasHistory && historyPage === 0 && (
            <div>No payments made yet.</div>
          )}
          {noMoreItems && (
            <div>No more payments to show.</div>
          )}
          {hasHistory && (
            <BS.Table className="data-table" striped bordered responsive>
              <thead>
                <tr>
                  <td>Item</td>
                  <td>Date</td>
                  <td>Amount</td>
                </tr>
              </thead>
              <tbody>
                {history[historyPage].items.map(item => (
                  <tr key={item.id}>
                    <td>{this.getItemDescription(item)}</td>
                    <td>{moment(item.paymentDate).format('MM/DD/YYYY')}</td>
                    <td>${this.formatMoney(item.paymentAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </BS.Table>
          )}
          {history.length > 0 && (
            <div className="row history-pagination">
              <div className="item">
                <div>
                  {historyPage === 0 ? (
                    <BS.Button bsStyle="success" disabled>
                      <BS.Glyphicon glyph="chevron-left" /> Prev
                    </BS.Button>
                  ) : (
                    <SubmitButton
                      appState={appState}
                      statusAction="paymentsHistoryPrev"
                      textLoading="Loading"
                      submit={prevPage}
                      bsStyle="success">
                      <BS.Glyphicon glyph="chevron-left" /> Prev
                    </SubmitButton>
                  )}
                </div>
              </div>
              <div className="item">
                <div className="text-center text-muted">
                  Page {historyPage + 1}
                </div>
              </div>
              <div className="item">
                <div className="text-right">
                  {hasNext ? (
                    <SubmitButton
                      appState={appState}
                      statusAction="paymentsHistoryNext"
                      textLoading="Loading"
                      submit={nextPage}
                      bsStyle="success">
                      Next <BS.Glyphicon glyph="chevron-right" />
                    </SubmitButton>
                  ) : (
                    <BS.Button bsStyle="success" disabled>
                      Next <BS.Glyphicon glyph="chevron-right" />
                    </BS.Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Loader>
    );
  }

}

export default PaymentsHistory;

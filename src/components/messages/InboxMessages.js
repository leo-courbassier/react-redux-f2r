import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import * as BS from 'react-bootstrap';
import moment from 'moment';
import classNames from 'classnames';

import Loader from '../Loader';
import SubmitButton from '../SubmitButton';
import * as DATE from '../../utils/date';

const getTime = (date) => {
  return moment(date).format(
    DATE.isToday(date) ? 'h:mma' : 'MM/DD/YY'
  );
};

class InboxMessages extends Component {

  state = {
    showConfirmDeleteModal: false
  }

  componentWillMount() {
    const {appState, folder, load, newInboxMessages} = this.props;
    const newSentMessages = folder === 'sent' && appState.newSentMessages;
    if (!appState[`${folder}Loaded`] || newInboxMessages || newSentMessages) {
      load(folder, false, () => {
        // new messages loaded, so make sure inbox is not reloaded
        // unless another new message comes in
        this.props.updateNewMessages(false);
      });
    }
  }

  openMessage(folder, message) {
    browserHistory.push(`/messages/${folder}/${message.id}`);
  }

  selectMessage(folder, message, selected, e) {
    this.props.selectMessage(folder, message.id, selected);
  }

  selectMessages(folder, which) {
    let selected = (which === 'all') ? true  : false;
    this.props.selectMessage(folder, null, selected);
  }

  deleteMessages() {
    this.props.deleteMessages(this.props.folder, this.props.appState[`${this.props.folder}SelectedMessages`], () => {
      let onlyMessages = true;
      this.props.load(this.props.folder, onlyMessages);
      this.props.updateUnreadCount();
      this.closeConfirmDeleteModal();
    });
  }

  openConfirmDeleteModal() {
    this.setState({showConfirmDeleteModal: true});
  }

  closeConfirmDeleteModal() {
    this.setState({showConfirmDeleteModal: false});
  }

  render() {
    const {
      appState,
      folder,
      current,
      messages,
      prevPage,
      nextPage
    } = this.props;
    const selectedMessages = appState[`${folder}SelectedMessages`][current] ? appState[`${folder}SelectedMessages`][current] : [];
    const hasMessages = messages[current] && messages[current].items.length > 0;
    const selectedMessagesNumText = `${selectedMessages.length} Message${selectedMessages.length !== 1 ? 's' : ''}`;

    const deleteMessagesModal = (
      <div className="delete-messages-modal">
        <BS.Modal
          show={this.state.showConfirmDeleteModal}
          onHide={this.closeConfirmDeleteModal.bind(this)}
          backdrop='static'>
          <BS.Modal.Header>
            <BS.Modal.Title>{`Delete ${selectedMessagesNumText}`}</BS.Modal.Title>
          </BS.Modal.Header>
          <BS.Modal.Body>
            <p>Clicking "Delete {selectedMessagesNumText}" will <strong>permanently</strong> {`delete the selected message(s).`}</p>
          </BS.Modal.Body>
          <BS.Modal.Footer className="clearfix">
            <div className="pull-left">
              <BS.Button
                onClick={this.closeConfirmDeleteModal.bind(this)}>
                Close
              </BS.Button>
            </div>
            <div className="pull-right">
              <SubmitButton
                submit={this.deleteMessages.bind(this)}
                appState={appState}
                statusAction="deleteMessages"
                textLoading="Deleting"
                bsStyle="danger">
                Delete {selectedMessagesNumText}
              </SubmitButton>
            </div>
          </BS.Modal.Footer>
        </BS.Modal>
      </div>
    );

    return (
      <Loader appState={appState} statusType="loading" statusAction={folder}>
        <div className="inbox-messages">
          {!hasMessages && (
            <div className="inbox-messages-empty">
              <p>{folder === 'inbox' ? `You haven't received any messages yet.` : `You haven't sent any messages yet.`}</p>
            </div>
          )}
          {hasMessages && (
            <div className="inbox-messages-actions">
              <BS.ButtonGroup>
                <BS.DropdownButton
                  title={selectedMessages.length ? `${selectedMessages.length} Selected` : 'Select'}
                  id="dropdown-select-messages">
                  <BS.MenuItem
                    eventKey="1"
                    onClick={this.selectMessages.bind(this, folder, 'all')}>
                    All
                  </BS.MenuItem>
                  <BS.MenuItem
                    eventKey="1"
                    onClick={this.selectMessages.bind(this, folder, 'none')}>
                    None
                  </BS.MenuItem>
                </BS.DropdownButton>
                {selectedMessages.length > 0  && (
                  <BS.Button
                    bsStyle="danger"
                    onClick={this.openConfirmDeleteModal.bind(this)}>
                    Delete
                  </BS.Button>
                )}
              </BS.ButtonGroup>
            </div>
          )}
          {hasMessages && (
            <BS.Table responsive>
              <thead>
                <tr>
                  <th><span className="sr-only">Select</span></th>
                  <th>{folder === 'inbox' ? 'From' : 'To'}</th>
                  <th>Subject</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {messages[current].items.map((message, i) => {
                  const selected = selectedMessages.indexOf(message.id) !== -1;
                  return (
                    <tr
                      key={i}
                      className={classNames({
                        unread: message.newMessageFlag,
                        active: selected
                      })}>
                      <td className="checkbox-column">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={this.selectMessage.bind(this, folder, message, !selected)}
                            />
                          <span className="sr-only">Select message: {message.subject}</span>
                        </label>
                      </td>
                      <td onClick={this.openMessage.bind(this, folder, message)}>
                        {folder === 'inbox' ? message.fromUserFullName : message.toUserFullName}
                      </td>
                      <td onClick={this.openMessage.bind(this, folder, message)}>
                        {message.subject}
                      </td>
                      <td onClick={this.openMessage.bind(this, folder, message)}>
                        {getTime(message.tsMessageSent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </BS.Table>
          )}
          {hasMessages && (
            <div className="row inbox-pagination">
              <div className="item">
                <div>
                  {current === 0 ? (
                    <BS.Button bsStyle="success" disabled>
                      <BS.Glyphicon glyph="chevron-left" /> Prev
                    </BS.Button>
                  ) : (
                    <SubmitButton
                      appState={appState}
                      statusAction="inboxPrev"
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
                  Page {current + 1}
                </div>
              </div>
              <div className="item">
                <div className="text-right">
                  {messages[current].hasNext ? (
                    <BS.Button bsStyle="success" disabled>
                      Next <BS.Glyphicon glyph="chevron-right" />
                    </BS.Button>
                  ) : (
                    <SubmitButton
                      appState={appState}
                      statusAction="inboxNext"
                      textLoading="Loading"
                      submit={nextPage}
                      bsStyle="success">
                      Next <BS.Glyphicon glyph="chevron-right" />
                    </SubmitButton>
                  )}
                </div>
              </div>
            </div>
          )}
          {deleteMessagesModal}
        </div>
      </Loader>
    );
  }
}

export default InboxMessages;

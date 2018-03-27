import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import _ from 'underscore';
import FileReaderInput from 'react-file-reader-input';
import FaFile from 'react-icons/lib/fa/file';
import FaPdf from 'react-icons/lib/fa/file-pdf-o';
import FaWord from 'react-icons/lib/fa/file-word-o';

import * as api from '../../../actions/api';
import * as services from '../../../constants/Services';

import Loader from '../../Loader';
import SubmitButton from '../../SubmitButton';
import SubmitFooter from '../SubmitFooter';

class DocumentsForm extends Component {

  state = {
    submitted: false,
    complete: false
  }

  componentWillMount() {
    this.props.load(this.props.appState.accountDocuments);
  }

  componentWillUnmount() {
    delete this.props.appState.status.uploading['uploadFile'];
  }

  keypress(e) {
    this.props.update(this.props.appState, e.target.name, e.target.value);
  }

  confirmDeleteFile(file, i, e) {
    e.preventDefault();
    if (window.confirm('This file will be permanently deleted. Are you sure?')) {
      this.deleteFile(file, i);
    }
  }

  deleteFile(file, i) {
    this.props.delete(file, i);
  }

  handleFileChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      this.props.upload(file);
    });
  }

  getValidationState(group = 'all', ignoreSubmitted = false) {
    let groups = {
      all: {valid: true, error: null}
    };

    if (!this.state.submitted && !ignoreSubmitted) {
      return {valid: true, error: null};
    }

    const form = this.props.appState.accountDocumentsForm;

    return groups[group];
  }

  getChanges() {
    let queue = [];

    const documents = this.props.appState.accountDocuments;
    const documentsForm = this.props.appState.accountDocumentsForm;

    return queue;
  }

  submit(e) {
    e.preventDefault();

    this.setState({submitted: true, complete: false});

    if (!this.getValidationState('all', true).valid) return;

    const userInfo = this.props.store.loginAppState.userInfo;
    const documents = this.props.appState.accountDocuments;
    const documentsForm = this.props.appState.accountDocumentsForm;

    let queue = this.getChanges();

    // no data changed
    if (queue.length === 0) {
      return;
    }

    // queue each request one after the other
    // it is important that data is NOT saved in parallel

    let queueIndex = 0;

    const save = (request, callback) => {
      queueIndex++;

      if (queueIndex > queue.length) {
        if (callback) callback();
        return;
      }

      const nextRequest = _.partial(save, queue[queueIndex], callback);

      switch (request) {

        case 'example': {
          // this.props.save(payload, nextRequest);
          break;
        }

      }
    };

    // show loading indicator
    api.setStatus(this.context.store.dispatch, 'loading', 'dashboardAccountDocumentsSubmit', true);

    save(queue[0], () => {
      this.setState({complete: true});

      // hide loading indicator
      api.setStatus(this.context.store.dispatch, 'loading', 'dashboardAccountDocumentsSubmit', false);

      this.props.updateF2RScore();
    });

  }

  render() {
    const store = this.props.appState;
    const user = this.props.appState.user;
    const documents = this.props.appState.accountDocumentsForm;

    let uploadComplete = this.props.appState.status.uploading['uploadFile'] == false;

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="dashboardAccountDocuments">
        <div className="documentsform-panel">
          <form>
            <div className="section">Files</div>
            {documents.files.length < 1 && (
              <div>No files uploaded.</div>
            )}
            {documents.files && documents.files.map((file, i) => {
              let fileIcon;
              switch (file.extension) {
                case 'pdf': fileIcon = (<FaPdf />); break;
                case 'doc': case 'docx': fileIcon = (<FaWord />); break;
                default: fileIcon = (<FaFile />);
              }
              return (
                <div key={i} className="file-row clearfix">
                  <div className="file-item file-item-title">
                    {i === 0 && (<h3 className="heading">Title</h3>)}
                    <div className="filename">{file.name}</div>
                  </div>
                  <div className="file-item file-item-icon">
                    {i === 0 && (<h3 className="heading">File</h3>)}
                    <div className="fileicon">
                      <a
                        href="#0"
                        onClick={(e) => { e.preventDefault(); this.props.openFile(file.itemPath); }}
                        bsStyle="link">
                        {fileIcon}
                      </a>
                    </div>
                  </div>
                  <div className="file-item file-item-delete">
                    {i === 0 && (<h3 className="heading">Actions</h3>)}
                    <SubmitButton
                      submit={this.confirmDeleteFile.bind(this, file, i)}
                      bsSize="small"
                      bsStyle="danger"
                      appState={this.props.appState}
                      statusAction={'deleteFile'+i}
                      textLoading="Deleting">
                      <BS.Glyphicon glyph="trash" /> Delete
                    </SubmitButton>
                  </div>
                </div>
              );
            })}
            <div className="file-upload">
              <FileReaderInput
                name="fileUpload"
                as="url"
                id="file-upload"
                onChange={this.handleFileChange.bind(this)}>
                  <div className="row">
                    <div className="item">
                      <BS.HelpBlock>
                        <span className="text-success">
                          <b>{uploadComplete ? 'Upload complete.' : ''}</b>
                        </span>
                      </BS.HelpBlock>
                    </div>
                    <div className="item text-right">
                      <SubmitButton
                        className="upload-button"
                        appState={this.props.appState}
                        statusAction="uploadFile"
                        textLoading="Uploading">
                        Upload a New File
                      </SubmitButton>
                    </div>
                  </div>
              </FileReaderInput>
            </div>
            {/*<SubmitFooter
              getValidationState={this.getValidationState.bind(this)}
              getChanges={this.getChanges.bind(this)}
              submitted={this.state.submitted}
              complete={this.state.complete}
              appState={this.props.appState}
              statusAction="dashboardAccountDocumentsSubmit"
              submit={this.submit.bind(this)}
              />*/}
          </form>
        </div>
      </Loader>
    );
  }

}

DocumentsForm.contextTypes = {
  store: PropTypes.object
};

export default DocumentsForm;

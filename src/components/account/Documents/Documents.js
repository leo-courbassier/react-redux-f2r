import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import FaFile from 'react-icons/lib/fa/file';
import FaPdf from 'react-icons/lib/fa/file-pdf-o';
import FaWord from 'react-icons/lib/fa/file-word-o';

import * as services from '../../../constants/Services';

import Loader from '../../Loader';

class Documents extends Component {

  componentDidMount() {
    if (!this.props.appState.accountDocuments.loaded) {
      this.props.load(() => {
        // this.props.showEditButton('documents');
        this.props.onPanelLoaded('documents');
      });
    } else {
      // this.props.showEditButton('documents');
    }
  }

  render() {
    const documents = this.props.appState.accountDocuments;

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="dashboardAccountDocuments">
        <div id={this.props.id} className="documents-panel">
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
              <div className="file-row clearfix" key={i}>
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
              </div>
            );
          })}
        </div>
      </Loader>
    );
  }

}

export default Documents;

import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as types from '../../constants/ActionTypes';
import * as BS from 'react-bootstrap';
import Loader from '../Loader';
import FileReaderInput from 'react-file-reader-input';
import SubmitButton from '../SubmitButton';
import _ from 'underscore';
import * as Validation from '../../utils/validation';
import InfoTooltip from '../InfoTooltip';

const STEP_ID = 4;

class StepFiveForm extends Component {


  componentWillMount() {
    this.props.load();
  }


  componentWillUnmount(){
    delete this.props.appState.status.uploading['uploadCredit'];
    delete this.props.appState.status.uploading['uploadDoc'];
  }


  handleCreditFileChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      this.props.uploadCreditReport(file, this.props.updateOnboardingScore);
    });
  }


  handleSupportingFileChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      this.props.uploadSupportingDoc(file, this.props.updateOnboardingScore);
    });
  }





  render() {

    let store = this.props.appState[STEP_ID];


    let uploadCreditComplete = this.props.appState.status.uploading['uploadCredit'] == false;
    let uploadDocComplete = this.props.appState.status.uploading['uploadDoc'] == false;


    const creditTooltip = (
      <span>
        <h7><b>Your Credit Report</b></h7>
        <p>The Federal Government requires each of the three credit bureaus to provide you with an annual free credit report. Visit the Annual Credit Report and download any of the three reports for use in generating your F2R score.</p>
      </span>
    );

    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepFiveForm">
        <div className="step step-five">

          <div className="section">Upload your Credit Report<InfoTooltip placement="right" tooltip={creditTooltip} /></div>
          <div className="section-box">
            The Federal Government requires each of the three credit bureaus to provide you with an annual free credit report. Visit the Annual Credit Report and download any of the three reports for use in generating your F2R score.
          </div>


          <div className="row">
            <div className='item'>
            <h4>
              <BS.Button bsStyle="warning" href="http://www.annualcreditreport.com" target="_blank">
                Get your FREE Credit Report HERE
              </BS.Button>
            </h4>
            </div>
          </div>
          <div className="row">
            <div className='item'>
              <FileReaderInput
              name="creditUpload"
              as="url"
              id="credit-upload"
              onChange={this.handleCreditFileChange.bind(this)}>
                <SubmitButton
                className="upload-button"
                appState={this.props.appState}
                statusAction="uploadCredit"
                textLoading="Uploading">
                  Upload your Credit Report
                </SubmitButton>
                <BS.HelpBlock className="text-center">
                  <span className="text-success">
                    <b>{uploadCreditComplete ? 'Upload complete.' : this.props.appState[STEP_ID].hasCreditReport && 'Your credit report is uploaded.'}</b>
                  </span>
                </BS.HelpBlock>
              </FileReaderInput>
            </div>
          </div>


          <div className="section">Upload Supporting Documents</div>
          <div className="section-box">
            It’s time to show off! By providing additional information, you become a more desirable tenant in a competitive rental market.
          </div>
          <div className="row">
            <div className='item'>
              <BS.HelpBlock>
                <h5>Recommended Documents:</h5>
                <ul>
                  <li>Proof of additional income</li>
                  <li>Landlord letters of reference</li>
                </ul>
              </BS.HelpBlock>
            </div>
          </div>


          <div className="row">
            <div className='item'>
              <FileReaderInput
              name="supportingUpload"
              as="url"
              id="supporting-upload"
              onChange={this.handleSupportingFileChange.bind(this)}>
                <SubmitButton
                className="upload-button"
                appState={this.props.appState}
                statusAction="uploadDoc"
                textLoading="Uploading">
                  Upload a Supporting Document
                </SubmitButton>
                <BS.HelpBlock className="text-center">
                  <span className="text-success">
                    {uploadDocComplete ? 'Upload complete.' : ''}
                  </span>
                </BS.HelpBlock>
              </FileReaderInput>
            </div>
          </div>

          <div className="onboarding-submit">
            {/* There is no data that is submitted by a save or proceed button
                on this step. Proceed simply takes user to the next step. */}
            {this.props.showProceed && (
              <SubmitButton
              appState={this.props.appState}
              statusAction="stepFiveFormProceed"
              submit={this.props.openNextStep}
              textLoading="Saving"
              bsStyle="success"
              className="proceed-button">
                Proceed
              </SubmitButton>
            )}
          </div>

        </div>
      </Loader>
    );



  }

}


StepFiveForm.contextTypes = {
  store: PropTypes.object
};

export default StepFiveForm;

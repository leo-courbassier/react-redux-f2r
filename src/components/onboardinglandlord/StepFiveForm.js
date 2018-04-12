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


    return (
      <Loader appState={this.props.appState} statusType="loading" statusAction="stepFiveForm">
        <div className="step step-five">    


          <div className="row">
            <div className='item'>
            <div className="img_congrats_content"><img className="img_congrats" src="/onboarding/dog_congrats.png"/></div>
            </div>
          </div>
          <div className="row">
            <div className='section'>
            <p>Congratulations! You’ve completed setting up your account and are ready to start managing all your tenants and properties</p>
            <p>Renting empowerment is just a click away!</p>
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
                Access my Dshboard
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

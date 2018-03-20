import React from 'react';
import * as BS from 'react-bootstrap';
import SubmitButton from '../../SubmitButton';

const SubmitFooter = ({
  getValidationState, getChanges, submitted, complete,
  appState, statusAction, submit,
  error
}) => (
  <div className="dashboard-submit">
    <div className="dashboard-submit-message">
      {error && (
        <BS.HelpBlock>
          <span className="text-danger">{error}</span>
        </BS.HelpBlock>
      )}
      {!getValidationState().valid && (
        <BS.HelpBlock>
          <span className="text-danger">Please fix errors in the form.</span>
        </BS.HelpBlock>
      )}
      {!getChanges().length && getValidationState().valid && submitted && !complete && (
        <BS.HelpBlock>
          <span className="text-warning">No changes to save.</span>
        </BS.HelpBlock>
      )}
      {!error && getValidationState().valid && complete && (
        <BS.HelpBlock>
          <span className="text-success">Changes saved successfully.</span>
        </BS.HelpBlock>
      )}
    </div>
    <div className="dashboard-submit-button">
      <SubmitButton
        appState={appState}
        statusAction={statusAction}
        submit={submit}
        textLoading="Saving"
        textModified="Save Changes"
        bsStyle="success">
        Save
      </SubmitButton>
    </div>
  </div>
);

export default SubmitFooter;

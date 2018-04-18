import React, { Component, PropTypes } from 'react';
import * as BS from 'react-bootstrap';
import ButtonSpinner from '../ButtonSpinner';

export default class SubmitFooter extends Component {
  static propTypes = {
    dirty: PropTypes.bool,
    invalid: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  static defaultProps = {
    submitting: false
  }

  render() {
    const { submitting, dirty, invalid, submitSucceeded } = this.props;
    return (
      <div className="reduxFormSubmit">
        <div className="reduxFormSubmitMessage">
          {dirty && invalid && (
            <BS.HelpBlock>
              <span className="text-danger">Please fix errors in the form.</span>
            </BS.HelpBlock>
          )}
          {submitSucceeded && !submitting && (
            <BS.HelpBlock>
              <span className="text-success">Changes saved successfully.</span>
            </BS.HelpBlock>
          )}
        </div>
        <div className="reduxFormSubmitButton">
          <BS.Button
            className="submit-button"
            bsStyle="success"
            disabled={submitting}
            textLoading="Saving..."
            type="submit">
            {submitting && <div className="spinner"><ButtonSpinner /></div>}
            <div className="text">Save</div>
          </BS.Button>
        </div>
      </div>
    );
  }
}

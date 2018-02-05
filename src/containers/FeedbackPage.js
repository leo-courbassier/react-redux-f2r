import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as BS from 'react-bootstrap';

import FeedbackForm from '../components/FeedbackForm';
import Loader from '../components/Loader';

import * as actions from '../actions/feedbackActions';


class FeedbackPage extends Component {

  componentDidMount(){
    this.props.actions.decryptToken(this.props.routeParams.token);
  }

  componentWillUnmount () {

  }

  render() {
    return (
      <div className="feedback-page">
        <Loader
          appState={this.props.appState}
          statusType="loading"
          statusAction="feedbackPage"
        >
          <FeedbackForm
            token={this.props.routeParams.token}
            updateFeedbackForm={this.props.actions.updateFeedbackForm}
            sendFeedbackForm={this.props.actions.sendFeedbackForm}
            setCitiesList={this.props.actions.setCitiesList}
            appState={this.props.appState}
            store={this.context.store.getState().feedbackAppState}
          />
        </Loader>
      </div>
    );
  }
}

FeedbackPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired
};

FeedbackPage.contextTypes = {
  store: PropTypes.object
};


function mapStateToProps(state) {
  return {
    appState: state.feedbackAppState
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
)(FeedbackPage);

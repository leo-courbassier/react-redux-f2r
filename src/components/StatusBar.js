import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import * as BS from 'react-bootstrap';
import GeminiScrollbar from 'react-gemini-scrollbar';

// import ScoreDial from './ScoreDial';

const StatusBar = ({appState, store, tip, showMargin}) => {
    const getTopItem = function () {
      if (store.onboardingAppState.score == null || store.onboardingAppState.score == undefined) {
        return (
          <div className="f2r-tips">
            <div className="heading">Did you know?</div>
            <div className="tip-text">
              Countless landlords have told us that your job says more about you than any other attribute of
              your rental application. F2R captures that and more in six easy steps to set you up for success in your
              search. Better yet, we provide everything you’ll need to enhance your reputation for the remainder of your
              rental lifetime.
            </div>
          </div>
        );
      }else{
        return (
          <div>
            <div className="f2r-score">
              <div className="score-heading">Your Potential F2R Score</div>
              <div className="score-description">
                Subject to information validation and confirmation
              </div>
              {/* <ScoreDial score={store.onboardingAppState.score} /> */}
            </div>
            <div className="f2r-legend">
              <ul className="spectrum">
                <li>
                  <span className="range-word">Poor</span>
                  <br />
                  <span className="range-number">0-240</span>
                </li>
                <li>
                  <span className="range-word">Low</span>
                  <br />
                  <span className="range-number">241-480</span>
                </li>
                <li>
                  <span className="range-word">Safe</span>
                  <br />
                  <span className="range-number">481-720</span>
                </li>
                <li>
                  <span className="range-word">Sure</span>
                  <br />
                  <span className="range-number">721-960</span>
                </li>
                <li>
                  <span className="range-word">Certain</span>
                  <br />
                  <span className="range-number">961-1200</span>
                </li>
              </ul>
            </div>
          </div>
        );
      }
    };
    return (
      <div className="statusbar">
        <div className={showMargin ? 'content has-margin' : 'content'}>
          <GeminiScrollbar autoshow forceGemini>
            {getTopItem()}
            <div className="f2r-tips">
              <div className="heading">{tip.heading}</div>
              <div className="tip-text">{tip.text}</div>
            </div>
          </GeminiScrollbar>
        </div>
      </div>
    );
};

export default StatusBar;

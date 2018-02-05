import React, { Component, PropTypes } from 'react';

import ReactDial from 'react-dial';


class ScoreDial extends Component {

  componentDidMount() {

  }

  render() {
    let score = this.props.score;
    let              color = '#FF3100'; // poor
    if (score > 240) color = '#FF9400'; // low
    if (score > 480) color = '#ebe90f'; // safe
    if (score > 720) color = '#A0CF00'; // sure
    if (score > 960) color = '#259200'; // certain

    return (
      <div className="score-dial">
        <ReactDial
        min="0"
        max="1200"
        readOnly={true}
        thickness={1.4}
        fgColor={color}
        textColor="#000"
        angleOffset={-90}
        value={score} />
      </div>
    );
  }

}

ScoreDial.propTypes = {
  children: PropTypes.element
};

ScoreDial.contextTypes = {
  store: PropTypes.object
};

export default ScoreDial;

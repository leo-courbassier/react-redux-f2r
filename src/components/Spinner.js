import React, { PropTypes } from 'react';

// width / height are inline here for ie10, ie11, edge

const Spinner = () => {
    return (
      <span className="spinner">
        <div id="floatingCirclesG">
          <div className="f_circleG" id="frotateG_01" />
          <div className="f_circleG" id="frotateG_02" />
          <div className="f_circleG" id="frotateG_03" />
          <div className="f_circleG" id="frotateG_04" />
          <div className="f_circleG" id="frotateG_05" />
          <div className="f_circleG" id="frotateG_06" />
          <div className="f_circleG" id="frotateG_07" />
          <div className="f_circleG" id="frotateG_08" />
        </div>
      </span>
    );
};

export default Spinner;

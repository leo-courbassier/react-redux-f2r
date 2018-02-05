import React, { Component, PropTypes } from 'react';

import * as BS from 'react-bootstrap';

class InfoTooltip extends Component {



  render() {


    let tooltip = (<BS.Tooltip id="onboarding-header-tooltip"><span>{this.props.tooltip}</span></BS.Tooltip>);


    return (
      <BS.OverlayTrigger
      placement={this.props.placement}
      overlay={tooltip}>
        <span className="inline-tooltip-icon">
          <BS.Glyphicon glyph="info-sign" />
        </span>
      </BS.OverlayTrigger>
    );
  }

}

InfoTooltip.propTypes = {
  children: PropTypes.element
};

InfoTooltip.contextTypes = {
  store: PropTypes.object
};

export default InfoTooltip;

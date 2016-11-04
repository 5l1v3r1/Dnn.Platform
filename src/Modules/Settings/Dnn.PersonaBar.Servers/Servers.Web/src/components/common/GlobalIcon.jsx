import React, { Component, PropTypes } from "react";
import Tooltip from "dnn-tooltip";
import localization from "../../localization";

const normalMargin = "-3px 0 0 5px";
const switchMargin = "5px 0 0 5px";

export default class GlobalIcon extends Component {

    render() {
        const margin = this.props.isSwitch ? switchMargin : normalMargin;
        return <Tooltip type="global"
            messages={[localization.get("GlobalSettings")]}
            style={{ float: "left", height: "20", position: "static", margin: margin }} />;
    }
}

GlobalIcon.propTypes = {    
    isSwitch: PropTypes.bool.isRequired  
};

GlobalIcon.defaultProps = {
    isSwitch: false
};
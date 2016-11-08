import React, {Component, PropTypes } from "react";
import Label from "dnn-label";
import InputGroup from "dnn-input-group";
import Dropdown from "dnn-dropdown";
import GlobalIcon from "./GlobalIcon";

export default class DropdownBlock extends Component {
    
    render() {
        const {props} = this;

        return <InputGroup>
            <Label className="title"
                tooltipMessage={props.tooltip}
                label={props.label} style={{width: "auto"}} />
            {props.isGlobal && <GlobalIcon /> }
            <Dropdown style={{width:"80%"}}
                    options={props.options}
                    value={props.value}
                    onSelect={props.onSelect}
                    />
        </InputGroup>;
    }
}

DropdownBlock.propTypes = {
    label: PropTypes.string,
    tooltip: PropTypes.string,
    options: PropTypes.array.isRequired,
    value: PropTypes.string,
    isGlobal: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
};

DropdownBlock.defaultProps = {
    isGlobal: false
};
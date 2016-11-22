import React, {Component, PropTypes } from "react";
import GridCell from "dnn-grid-cell";
import ExtensionHeader from "../common/ExtensionHeader";
import ExtensionDetailRow from "../common/ExtensionDetailRow";
import "./style.less";

class ExtensionList extends Component {
    constructor() {
        super();
    }
    render() {
        const {props, state} = this;

        return (
            <GridCell  style={{ padding: "5px 20px" }}>
                <ExtensionHeader />
                {props.packages.map((_package, index) => {
                    return <ExtensionDetailRow
                        _package={_package}
                        type={props.type}
                        onInstall={props.onInstall.bind(this)}
                        onDeploy={props.onDeploy.bind(this, index)}
                        />;
                }) }
            </GridCell>
        );
    }
}

ExtensionList.propTypes = {
    label: PropTypes.string,
    packages: PropTypes.array,
    collapsed: PropTypes.bool,
    onChange: PropTypes.func,
    type: PropTypes.string,
    onDownload: PropTypes.func,
    onInstall: PropTypes.func,
    onDeploy: PropTypes.func
};


export default ExtensionList;
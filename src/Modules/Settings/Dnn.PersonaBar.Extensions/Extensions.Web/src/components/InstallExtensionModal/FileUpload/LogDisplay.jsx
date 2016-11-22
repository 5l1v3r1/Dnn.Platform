import React, { PropTypes, Component } from "react";
import GridCell from "dnn-grid-cell";
import { Scrollbars } from "react-custom-scrollbars";
import Button from "dnn-button";
import Localization from "localization";
import "./style.less";

const licenseBoxStyle = {
    border: "1px solid #c8c8c8",
    marginBottom: 25,
    height: 175,
    width: "100%"
};

class LogDisplay extends Component {
    render() {
        const {props} = this;
        /* eslint-disable react/no-danger */
        return (
            <GridCell style={{ padding: 0 }} className="install-failure-logs">
                <Scrollbars style={licenseBoxStyle}>
                    <div className="package-installation-report">
                        {props.logs && props.logs.map((log) => {
                            return <p className={log.Type.toLowerCase()}>{log.Type + " " + log.Description}</p>;
                        })}
                        {!props.logs && <p className="logs-unknown-error" dangerouslySetInnerHTML={{ __html: Localization.get("InstallExtension_UploadFailedUnknownLogs") }}></p>}
                    </div>
                </Scrollbars>
            </GridCell >
        );
    }
}

LogDisplay.PropTypes = {
    onDone: PropTypes.func,
    logs: PropTypes.array
};

export default LogDisplay;
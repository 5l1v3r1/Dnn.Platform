import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
    pagination as PaginationActions,
    security as SecurityActions
} from "../../actions";
import "./style.less";
import util from "../../utils";
import resx from "../../resources";
import styles from "./style.less";

class AuditCheckPanelBody extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        const {props} = this;
        if (props.auditCheckResults) {
            return;
        }
        props.dispatch(SecurityActions.getAuditCheckResults((data) => {
        }));
    }

    renderHeader() {
        const tableFields = [
            { "name": resx.get("SecurityCheck"), "id": "SecurityCheck" },
            { "name": resx.get("Result"), "id": "Result" },
            { "name": resx.get("Notes"), "id": "Notes" }
        ];
        const {props} = this;
        let tableHeaders = tableFields.map((field) => {
            let className = "auditCheckHeader auditCheckHeader-" + field.id;
            return <div className={className}>
                <span>{field.name}</span>
            </div>;
        });

        return <div className="auditCheckHeader-wrapper">{tableHeaders}</div>;
    }

    getResultDisplay(severity, successText, failureText) {
        switch (severity) {
            case 0:
                return (
                    <div className="label-result-severity">
                        <div className="label-result-severity-pass">
                            {resx.get("Pass")}
                        </div>
                        <div>
                            {successText}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="label-result-severity">
                        <div className="label-result-severity-alert">
                            {resx.get("Alert")}
                        </div>
                        <div>
                            {failureText}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="label-result-severity">
                        <div className="label-result-severity-fail">
                            {resx.get("Fail")}
                        </div>
                        <div>
                            {failureText}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="label-result-severity">
                        <div className="label-result-severity-pass">
                            {resx.get("Pass")}
                        </div>
                        <div>
                            {successText}
                        </div>
                    </div>
                );
        }
    }

    /* eslint-disable react/no-danger */
    getNotesDisplay(notes) {
        if (notes && notes.length > 0) {
            return <div className="log-detail" dangerouslySetInnerHTML={{ __html: notes }}></div>;
        }
        else {
            return "N/A";
        }
    }

    renderedList() {
        const {props} = this;
        return props.auditCheckResults.map((term, index) => {
            return (
                <div className="auditCheckItem">
                    <div className="label-name">
                        <div className="label-wrapper">
                            <span>{term.CheckNameText}&nbsp; </span>
                        </div>
                    </div>
                    <div className="label-result">
                        <div className="label-wrapper">
                            <span>{this.getResultDisplay(term.Severity, term.SuccessText, term.FailureText)}&nbsp; </span>
                        </div>
                    </div>
                    <div className="label-notes">
                        <div className="label-wrapper">
                            <span>{this.getNotesDisplay(term.Notes)}&nbsp; </span>
                        </div>
                    </div>
                </div>
            );
        });
    }

    /* eslint-disable react/no-danger */
    render() {
        const {props, state} = this;
        if (props.auditCheckResults) {
            return (
                <div className={styles.auditCheckResults}>
                    <div className="auditcheck-topbar">
                        {resx.get("AuditExplanation")}
                    </div>
                    <div className="auditCheckItems">
                        {this.renderHeader()}
                        {this.renderedList()}
                    </div>
                </div>
            );
        }
        else return <div />;
    }
}

AuditCheckPanelBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    auditCheckResults: PropTypes.object
};

function mapStateToProps(state) {
    return {
        tabIndex: state.pagination.tabIndex,
        auditCheckResults: state.security.auditCheckResults
    };
}

export default connect(mapStateToProps)(AuditCheckPanelBody);
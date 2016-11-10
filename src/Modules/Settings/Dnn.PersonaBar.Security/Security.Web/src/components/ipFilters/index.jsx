import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
    pagination as PaginationActions,
    security as SecurityActions
} from "../../actions";
import IpFilterRow from "./ipFilterRow";
import IpFilterEditor from "./ipfilterEditor";
import "./style.less";
import util from "../../utils";
import resx from "../../resources";
import { AddIcon } from "dnn-svg-icons";
import Collapse from "react-collapse";

const warningIcon = require(`!raw!./../svg/error.svg`);

let tableFields = [];

class IpFiltersPanelBody extends Component {
    constructor() {
        super();
        this.state = {
            openId: ""
        };
    }

    componentWillMount() {
        const {props} = this;
        props.dispatch(SecurityActions.getIpFilters());

        tableFields = [];
        tableFields.push({ "name": resx.get("FilterType.Header"), "id": "RuleType" });
        tableFields.push({ "name": resx.get("IpAddress.Header"), "id": "IPAddress" });
    }

    renderHeader() {
        let tableHeaders = tableFields.map((field) => {
            let className = "ip-filter-items header-" + field.id;
            return <div className={className} key={"header-" + field.id}>
                <span>{field.name}</span>
            </div>;
        });
        return <div className="header-row">{tableHeaders}</div>;
    }

    onEnter(key) {
        const { state } = this;
        alert("You pressed enter! My value is: " + state[key]);
    }

    uncollapse(id) {
        setTimeout(() => {
            this.setState({
                openId: id
            });
        }, this.timeout);
    }
    collapse() {
        if (this.state.openId !== "") {
            this.setState({
                openId: ""
            });
        }
    }
    toggle(openId) {
        if (openId !== "") {
            this.uncollapse(openId);
        } else {
            this.collapse();
        }
    }

    onUpdateIpFilter(ipFilter) {
        const {props, state} = this;

        props.dispatch(SecurityActions.updateIpFilter(ipFilter, (data) => {
            util.utilities.notify(resx.get("IpFilterUpdateSuccess"));
            this.collapse();
            props.dispatch(SecurityActions.getIpFilters());
        }, (error) => {
            util.utilities.notifyError(resx.get("IpFilterUpdateError"));
        }));
    }

    onDeleteIpFilter(ipFilterId) {
        const {props, state} = this;
        util.utilities.confirm(resx.get("IpFilterDeletedWarning"), resx.get("Yes"), resx.get("No"), () => {
            const itemList = props.ipFilters.filter((item) => item.IPFilterID !== ipFilterId);
            props.dispatch(SecurityActions.deleteIpFilter(ipFilterId, itemList, () => {
                util.utilities.notify(resx.get("DeleteSuccess"));
                this.collapse();
            }, (error) => {
                util.utilities.notifyError(resx.get("DeleteError"));
            }));
        });
    }

    /* eslint-disable react/no-danger */
    renderedIpFilters() {
        let i = 0;
        return this.props.ipFilters.map((item, index) => {
            let id = "row-" + i++;
            return (
                <IpFilterRow
                    ipFilterId={item.IPFilterID}
                    ruleType={item.RuleType}
                    ipFilter={item.IPFilter}
                    index={index}
                    key={"ipFilter-" + index}
                    closeOnClick={true}
                    openId={this.state.openId}
                    OpenCollapse={this.toggle.bind(this)}
                    Collapse={this.collapse.bind(this)}
                    onDelete={this.onDeleteIpFilter.bind(this, item.IPFilterID)}
                    id={id}>
                    <IpFilterEditor
                        ipFilterId={item.IPFilterID}
                        Collapse={this.collapse.bind(this)}
                        onUpdate={this.onUpdateIpFilter.bind(this)}
                        id={id}
                        openId={this.state.openId} />
                </IpFilterRow>
            );
        });
    }

    render() {
        let opened = (this.state.openId === "add");
        if (this.props.ipFilters) {
            return (
                <div>
                    <div className="ip-filter-items">
                        <div className="ip-filter-topbar">
                            {!this.state.enableIPChecking &&
                                <div className="warning-container">
                                    <div className="warning-icon" dangerouslySetInnerHTML={{ __html: warningIcon }} />
                                    {resx.get("IPFiltersDisabled")}
                                </div>
                            }
                            <div className="AddItemRow">
                                <div className={opened ? "AddItemBox-active" : "AddItemBox"} onClick={this.toggle.bind(this, opened ? "" : "add")}>
                                    <div className="add-icon" dangerouslySetInnerHTML={{ __html: AddIcon }}>
                                    </div> {resx.get("cmdAdd")}
                            </div>
                            </div>
                        </div>
                        <div className="ip-filter-items-grid">
                            {this.renderHeader()}
                            <div className="add-setting-editor">
                                <IpFilterRow
                                    ipFilterId={"-"}
                                    ruleType={"-"}
                                    ipFilter={"-"}
                                    index={"add"}
                                    key={"ipFilter-add"}
                                    closeOnClick={true}
                                    openId={this.state.openId}
                                    OpenCollapse={this.toggle.bind(this)}
                                    Collapse={this.collapse.bind(this)}
                                    onDelete={this.onDeleteIpFilter.bind(this)}
                                    id={"add"}
                                    visible={opened}>
                                    <IpFilterEditor
                                        Collapse={this.collapse.bind(this)}
                                        onUpdate={this.onUpdateIpFilter.bind(this)}
                                        id={"add"}
                                        openId={this.state.openId} />
                                </IpFilterRow>
                            </div>
                            {this.renderedIpFilters()}
                        </div>
                    </div>

                </div >
            );
        }
        else return <div />;
    }
}

IpFiltersPanelBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    ipFilters: PropTypes.array,
    enableIPChecking: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        tabIndex: state.pagination.tabIndex,
        ipFilters: state.security.ipFilters,
        enableIPChecking: state.security.enableIPChecking
    };
}

export default connect(mapStateToProps)(IpFiltersPanelBody);
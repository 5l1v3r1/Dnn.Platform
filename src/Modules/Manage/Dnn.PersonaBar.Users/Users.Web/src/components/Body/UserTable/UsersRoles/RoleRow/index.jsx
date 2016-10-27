import React, {Component, PropTypes } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import "./style.less";
import GridCell from "dnn-grid-cell";
import util from "../../../../../utils";
import Localization from "localization";
import DatePicker from "dnn-date-picker";
import {
    users as UserActions
} from "../../../../../actions";
import { XIcon } from "dnn-svg-icons";

class RoleRow extends Component {
    constructor() {
        super();
        this.state = {
            editIndex: -1,
            editCommand: "",
            isCalendarVisible: false
        };
    }
    formateDate(dateValue) {
        let date = new Date(dateValue);

        let dayValue = date.getDate(),
            monthValue = date.getMonth() + 1,
            yearValue = date.getFullYear();

        if (yearValue < 1900) {
            return "-";
        }

        return monthValue + "/" + dayValue + "/" + yearValue;
    }
    onStartTimeClick(userRole, index) {
        this.setState({ editIndex: index, editCommand: "startTime", isCalendarVisible: true });
    }

    onExpiresTimeClick(userRole, index) {
        this.setState({ editIndex: index, editCommand: "expiresTime", isCalendarVisible: true });
    }

    onDeleteClick(userRole) {
        const {props} = this;
        util.utilities.confirm(Localization.get("deleteRoleRole.Confirm"), Localization.get("Delete"), Localization.get("Cancel"), () => {
            props.dispatch(UserActions.removeUserRole(userRole, (data) => {
                //props.deleteRole(data.RoleId);
            }));
        });
    }
    onTimeClick(userRole, index) {

    }
    isEmptyDate(date) {
        return !date || new Date(date).getFullYear() < 1970;
    }

    onChange(userRole, command, FirstDate, SecondDate, cancel) {
        const {state} = this;
        state.editIndex = -1;
        state.editCommand = "";
        let startTime = command === "startTime" ? FirstDate : userRole.startTime;
        let expiresTime = command === "expiresTime" ? FirstDate : userRole.expiresTime;

        this.props.saveRole(userRole.roleId, startTime, expiresTime);
        this.setState({ isCalendarVisible: false });
    }
    getBoundDate(userRole, command) {
        if (command === "startTime") {
            let maxValue = new Date(2049, 11, 31);
            if (!this.isEmptyDate(userRole.expiresTime)) {
                maxValue = new Date(new Date().setTime(new Date(userRole.expiresTime).getTime() - 1 * 86400000));
            }
            return maxValue;
        } else if (command === "expiresTime") {
            let minValue = new Date(1970, 0, 1);
            if (!this.isEmptyDate(userRole.startTime)) {
                minValue = new Date(new Date().setTime(new Date(userRole.startTime).getTime() + 1 * 86400000));
            }
            return minValue;
        }
    }
    getDate(roleDetails, command) {
        let dateValue = new Date();
        if (command === "startTime") {
            if (!this.isEmptyDate(roleDetails.startTime)) {
                dateValue = new Date(roleDetails.startTime);
            }

        } else if (command === "expiresTime") {
            if (!this.isEmptyDate(roleDetails.expiresTime)) {
                dateValue = new Date(roleDetails.expiresTime);
            }
        }
        return dateValue;
    }
    /* eslint-disable react/no-danger */
    createRoleActions() {
        const {props, state} = this;

        let startTimeAction = props.roleDetails.allowExpired ? <span>
            <DatePicker  date={this.getDate(props.roleDetails, "startTime") } maxDate={this.getBoundDate(props.roleDetails, "startTime") }
                updateDate={this.onChange.bind(this, props.roleDetails, "startTime") } mode={"start"} applyButtonText={Localization.get("Apply") }
                showIcon={true} showInput={false}
                onIconClick={this.onStartTimeClick.bind(this, props.roleDetails, props.index) }             />
        </span> : null;
        let expiresTimeAction = props.roleDetails.allowExpired ? <span>
            <DatePicker  date={this.getDate(props.roleDetails, "expiresTime") } minDate={this.getBoundDate(props.roleDetails, "expiresTime") }
                updateDate={this.onChange.bind(this, props.roleDetails, "expiresTime") } mode={"end"} applyButtonText={Localization.get("Apply") }
                showIcon={true} showInput={false}
                onIconClick={this.onExpiresTimeClick.bind(this, props.roleDetails, props.index) }             />
        </span> : null;
        let deleteAction = props.roleDetails.allowDelete ?
            <a className={"extension-action"} dangerouslySetInnerHTML={{ __html: XIcon }} onClick={this.onDeleteClick.bind(this, props.roleDetails, props.index) }></a>
            : null;
        return <div className={state.editIndex === props.index ? "edit-row" : null}>
            {startTimeAction}
            {expiresTimeAction}
            {deleteAction}
        </div>;
    }
    render() {
        const {props} = this;
        return (
            <div className="user-role-row">
                <GridCell title={props.roleDetails.roleName} columnSize={25} >
                    {props.roleDetails.roleName}</GridCell>
                <GridCell  columnSize={20} >
                    {this.formateDate(props.roleDetails.startTime) }</GridCell>
                <GridCell  columnSize={20} >
                    {this.formateDate(props.roleDetails.expiresTime) }</GridCell>
                <GridCell  columnSize={35} >
                    <div className="actions">
                        {this.createRoleActions() }
                    </div>
                </GridCell>
            </div>
        );
    }
}
RoleRow.propTypes = {
    dispatch: PropTypes.func.isRequired,
    roleDetails: PropTypes.object.isRequired,
    index: PropTypes.number,
    saveRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired
};
function mapStateToProps(state) {
    return {
    };
}


export default connect(mapStateToProps)(RoleRow);
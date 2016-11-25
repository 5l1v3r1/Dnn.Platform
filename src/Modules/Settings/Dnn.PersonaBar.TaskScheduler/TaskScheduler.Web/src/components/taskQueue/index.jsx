import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import TaskStatusItemRow from "./taskStatusItemRow";
import "./style.less";
import resx from "../../resources";

class TaskQueuePanelBody extends Component {
    constructor() {
        super();
    }

    /* eslint-disable react/no-danger */
    renderedTaskStatusList() {
        const {props} = this;
        return props.taskStatusList.map((term, index) => {
            return (
                <TaskStatusItemRow
                    scheduleId={term.ScheduleID}
                    friendlyName={term.FriendlyName}
                    overdue={term.Overdue}
                    remainingTime={term.RemainingTime}
                    nextStart={term.NextStart}
                    objectDependencies={term.ObjectDependencies}
                    scheduleSource={term.ScheduleSource}
                    threadId={term.ThreadID}
                    servers={term.Servers}
                    key={"taskStatusItem-" + index}
                    closeOnClick={true}>
                </TaskStatusItemRow>
            );
        });
    }

    renderedTaskProcessingList() {
        const {props} = this;
        if (props.taskProcessingList) {
            return props.taskProcessingList.map((term, index) => {
                return (
                    <TaskStatusItemRow
                        scheduleId={term.ScheduleID}
                        friendlyName={term.TypeFullName}
                        elapsedTime={term.ElapsedTime}
                        startDate={term.StartDate}
                        objectDependencies={term.ObjectDependencies}
                        scheduleSource={term.ScheduleSource}
                        threadId={term.ThreadID}
                        servers={term.Servers}
                        key={"taskStatusItem-" + index}
                        closeOnClick={true}>
                    </TaskStatusItemRow>
                );
            });
        }
    }

    /*eslint-disable eqeqeq*/
    render() {
        const {props} = this;
        return (
            <div>
                <div>
                    {((props.taskStatusList && props.taskStatusList.length > 0) || (props.taskProcessingList && props.taskProcessingList.length > 0)) &&
                        <div className={props.schedulingEnabled === "True" ? "taskStatusList-title" : "taskStatusList-disabled"}>
                            {props.schedulingEnabled === "True" ? resx.get("TaskQueueTitle") : resx.get("DisabledMessage")}
                        </div>
                    }
                    {props.taskStatusList && props.taskStatusList.length == 0 && props.taskProcessingList && props.taskProcessingList.length == 0 &&
                        <div className="noTasks">{resx.get("NoTasks")}</div>
                    }
                    {this.renderedTaskProcessingList()}
                    {this.renderedTaskStatusList()}
                </div>
            </div>
        );
    }
}

TaskQueuePanelBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    schedulingEnabled: PropTypes.string,
    taskStatusList: PropTypes.array,
    taskProcessingList: PropTypes.array
};

function mapStateToProps(state) {
    return {
        schedulingEnabled: state.task.schedulingEnabled,
        taskStatusList: state.task.taskStatusList,
        taskProcessingList: state.task.taskProcessingList,
        tabIndex: state.pagination.tabIndex
    };
}

export default connect(mapStateToProps)(TaskQueuePanelBody);
import React, {Component, PropTypes} from "react";
import { connect } from "react-redux";
import Button from "dnn-button";
import PersonaBarPageHeader from "dnn-persona-bar-page-header";
import Body from "./body";
import PersonaBarPage from "dnn-persona-bar-page";
import resx from "../resources";
require('es6-object-assign').polyfill();
require('array.prototype.find').shim();
require('array.prototype.findindex').shim();

class App extends Component {
    constructor() {
        super();
    }
    
    render() {
        const {props} = this;
        return (
            <div className="taskScheduler-app">
                <PersonaBarPage isOpen={props.selectedPage === 0}>
                    <PersonaBarPageHeader title={resx.get("nav_TaskScheduler")}>
                    </PersonaBarPageHeader>
                    <Body />
                </PersonaBarPage>
            </div>
        );
    }
}

App.PropTypes = {
    dispatch: PropTypes.func.isRequired,
    selectedPage: PropTypes.number
};


function mapStateToProps(state) {
    return {
        selectedPage: state.visiblePanel.selectedPage,
        selectedPageVisibleIndex: state.visiblePanel.selectedPageVisibleIndex
    };
}


export default connect(mapStateToProps)(App);
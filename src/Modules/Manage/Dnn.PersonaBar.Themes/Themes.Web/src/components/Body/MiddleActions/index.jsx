import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Localization from "localization";
import GridCell from "dnn-grid-cell";
import SearchBox from "dnn-search-box";

import RestoreTheme from "./RestoreTheme";

import "./style.less";

class MiddleActions extends Component {
    constructor() {
        super();
        this.state = {};
    }

    onKeywordChanged(value) {
        const {props} = this;

        props.onSearch.call(this, value);
    }


    render() {
        return (
            <GridCell className="middle-actions">
                <GridCell columnSize="70">
                    <RestoreTheme />
                </GridCell>
                <GridCell columnSize="30">
                    <div className="search-filter">
                        {
                            <SearchBox placeholder={Localization.get("SearchPlaceHolder")} onSearch={this.onKeywordChanged.bind(this)} maxLength={50} />
                        }
                        <div className="clear"></div>
                    </div>
                </GridCell>
            </GridCell>
        );
    }
}

MiddleActions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
};

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(MiddleActions);
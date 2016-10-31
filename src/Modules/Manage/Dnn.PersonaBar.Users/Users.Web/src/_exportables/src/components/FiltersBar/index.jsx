import React, {Component, PropTypes } from "react";
import "./style.less";
import DropDown from "dnn-dropdown";
import Localization from "localization";
import SearchBox from "dnn-search-box";
import GridCell from "dnn-grid-cell";

class FiltersBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUserFilter: {
                label: Localization.get("All"),
                value: 0
            },
            searchText: ""
        };
    }
    onSelect(option) {
        let { label} = option;
        let { value} = option;
        let {selectedUserFilter} = this.state;
        if (value !== selectedUserFilter.value) {
            selectedUserFilter.label = label;
            selectedUserFilter.value = value;
            this.setState({
                selectedUserFilter
            }, () => { this.props.onChange(option, this.state.searchText); });
        }
    }

    onKeywordChanged(text) {
        this.setState({
            searchText: text
        }, () => {
            this.props.onChange(this.state.selectedUserFilter, text);
        });
    }

    BuildUserFiltersOptions() {
        let {userFilters} = this.props;
        let userFiltersOptions = [];
        userFiltersOptions = userFilters.map((userFilter) => {
            return { label: userFilter.Key, value: userFilter.Value };
        });
        return userFiltersOptions;
    }

    render() {
        let userFiltersOptions = this.BuildUserFiltersOptions();
        return <div className="users-filter-container">
            <GridCell columnSize={35} >
                {
                    userFiltersOptions.length > 0 &&
                    <div className="user-filters-filter">
                        <DropDown  style={{ width: "100%" }}
                            withBorder={false}
                            options={userFiltersOptions}
                            label={this.state.selectedUserFilter.label }
                            onSelect={this.onSelect.bind(this) }
                            ref="userFiltersDropdown"
                            />
                        <div className="clear">
                        </div>
                    </div>
                }
            </GridCell>
            <GridCell columnSize={30} >
                <div>&nbsp; </div></GridCell>
            <GridCell columnSize={35} >
                <div className="search-filter">
                    {
                        this.state.selectedUserFilter.value === 0 &&
                        <SearchBox placeholder={Localization.get("SearchPlaceHolder") } onSearch={this.onKeywordChanged.bind(this) } maxLength={50} />
                    }
                    <div className="clear"></div>
                </div>
            </GridCell>
        </div>;
    }
}
FiltersBar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    userFilters: PropTypes.array.isRequired
};
export default (FiltersBar);
import React, {Component, PropTypes} from "react";
import PagePicker from "dnn-page-picker";
import Label from "dnn-label";
import Localization from "../../localization";
import utils from "../../utils";

const PageToTestParameters = {
    portalId: -2,
    cultureCode: "",
    isMultiLanguage: false,
    excludeAdminTabs: false,
    disabledNotSelectable: false,
    roles: "0",
    sortOrder: 0
};

class BranchParent extends Component {

    render() {
        const {props} = this;
        const noneSpecifiedText = utils.getPortalName();
        return <div className="input-group">
            <Label
                label={Localization.get("BranchParent")} />
            <PagePicker
                serviceFramework={utils.getServiceFramework()}
                style={{ width: "100%", zIndex: 2 }}
                OnSelect={(value) => props.onChangeValue("parentId", value)}
                defaultLabel={noneSpecifiedText}
                noneSpecifiedText={noneSpecifiedText}
                CountText={"{0} Results"}
                PortalTabsParameters={PageToTestParameters}
                selectedTabId={props.parentId || -1} />
        </div>;
    }
}

BranchParent.propTypes = {
    parentId: PropTypes.number.isRequired,
    onChangeValue: PropTypes.func.isRequired
};

export default BranchParent;
import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import DropdownWithError from "dnn-dropdown-with-error";
import GridCell from "dnn-grid-cell";
import GridSystem from "dnn-grid-system";
import SingleLineInputWithError from "dnn-single-line-input-with-error";
import SocialPanelHeader from "dnn-social-panel-header";
import SocialPanelBody from "dnn-social-panel-body";
import Localization from "localization";
import Dropdown from "dnn-dropdown";
import MultiLineInputWithError from "dnn-multi-line-input-with-error";
import Button from "dnn-button";
import { getVersionDropdownValues, formatVersionNumber } from "utils/helperFunctions";
import styles from "./style.less";

const inputStyle = { width: "100%" };

const BasicPackageInformation = ({disabled, validationMapped, installedPackageTypes, extensionData, onVersionChange, onChange, triedToSave, version}) => (
    <GridSystem className={styles.basicPackageInformation + " with-right-border top-half"}>
        <div>
            <DropdownWithError
                className="extension-type"
                options={installedPackageTypes && installedPackageTypes.map((_package) => {
                    return {
                        label: _package.Type.split("_").join("").split(/(?=[A-Z])/).join(" "),
                        value: _package.Type
                    };
                })}
                enabled={!disabled}
                tooltipMessage={Localization.get("EditExtension_PackageType.HelpText")}
                label="Extension Type"
                defaultDropdownValue={!validationMapped ? extensionData.packageType : extensionData.packageType.value}
                style={inputStyle}
                />
            <SingleLineInputWithError
                label={Localization.get("EditExtension_PackageName.Label")}
                tooltipMessage={Localization.get("EditExtension_PackageName.HelpText")}
                style={inputStyle}
                enabled={false}
                className="extension-package-name"
                value={!validationMapped ? extensionData.name : extensionData.name.value} />
            <SingleLineInputWithError
                label={Localization.get("EditExtension_PackageFriendlyName.Label") + "*"}
                tooltipMessage={Localization.get("EditExtension_PackageFriendlyName.HelpText")}
                value={!validationMapped ? extensionData.friendlyName : extensionData.friendlyName.value}
                style={inputStyle}
                className="extension-package-friendly-name"
                error={extensionData.friendlyName.error && triedToSave}
                enabled={!disabled}
                onChange={onChange && onChange.bind(this, "friendlyName")} />
        </div>
        <div>
            <MultiLineInputWithError
                label={Localization.get("EditExtension_PackageDescription.Label")}
                tooltipMessage={Localization.get("EditExtension_PackageDescription.HelpText")}
                style={inputStyle}
                className="extension-description"
                inputStyle={{ marginBottom: 28, height: 123 }}
                value={!validationMapped ? extensionData.description : extensionData.description.value}
                enabled={!disabled}
                onChange={onChange && onChange.bind(this, "description")} />
            <DropdownWithError
                options={getVersionDropdownValues()}
                label={Localization.get("EditExtension_PackageVersion.Label")}
                tooltipMessage={Localization.get("EditExtension_PackageVersion.HelpText")}
                enabled={!disabled}
                defaultDropdownValue={formatVersionNumber(version[0])}
                onSelect={onVersionChange && onVersionChange.bind(this, 0)}
                className="version-dropdown"
                />
            <Dropdown
                options={getVersionDropdownValues()}
                className="version-dropdown"
                label={formatVersionNumber(version[1])}
                onSelect={onVersionChange && onVersionChange.bind(this, 1)}
                enabled={!disabled}
                />
            <Dropdown
                options={getVersionDropdownValues()}
                label={formatVersionNumber(version[2])}
                className="version-dropdown"
                onSelect={onVersionChange && onVersionChange.bind(this, 2)}
                enabled={!disabled}
                />
        </div>
    </GridSystem>
);

BasicPackageInformation.propTypes = {
    disabled: PropTypes.bool,
    validationMapped: PropTypes.bool,
    installedPackageTypes: PropTypes.array,
    extensionData: PropTypes.object,
    onVersionChange: PropTypes.func,
    onChange: PropTypes.func,
    triedToSave: PropTypes.bool,
    version: PropTypes.array
};

export default BasicPackageInformation;
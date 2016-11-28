import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
    siteInfo as SiteInfoActions
} from "../../actions";
import InputGroup from "dnn-input-group";
import SingleLineInputWithError from "dnn-single-line-input-with-error";
import MultiLineInputWithError from "dnn-multi-line-input-with-error";
import Grid from "dnn-grid-system";
import Dropdown from "dnn-dropdown";
import FileUpload from "dnn-file-upload";
import Label from "dnn-label";
import Button from "dnn-button";
import "./style.less";
import util from "../../utils";
import resx from "../../resources";
import styles from "./style.less";

class BasicSettingsPanelBody extends Component {
    constructor() {
        super();
        this.state = {
            basicSettings: undefined,
            error: {
                title: false
            },
            triedToSubmit: false
        };
    }

    loadData() {
        const {props} = this;
        if (props.basicSettings) {
            if (props.portalId === undefined || props.basicSettings.PortalId === props.portalId) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }

    componentWillMount() {
        const {props} = this;
        if (!this.loadData()) {
            this.setState({
                basicSettings: props.basicSettings
            });
            return;
        }
        props.dispatch(SiteInfoActions.getPortalSettings(props.portalId, props.cultureCode, (data) => {
            this.setState({
                basicSettings: Object.assign({}, data.Settings)
            });
        }));
    }

    componentWillReceiveProps(props) {
        let {state} = this;

        let title = props.basicSettings["PortalName"];
        if (title === "") {
            state.error["title"] = true;
        }
        else if (title !== "") {
            state.error["title"] = false;
        }

        this.setState({
            basicSettings: Object.assign({}, props.basicSettings),
            error: state.error,
            triedToSubmit: false
        });
    }

    onSettingChange(key, event) {
        let {state, props} = this;
        let basicSettings = Object.assign({}, state.basicSettings);

        if (key === "LogoFile" || key === "FavIcon") {
            basicSettings[key] = event;
        }
        else if (key === "TimeZone" || key === "IconSets") {
            basicSettings[key] = event.value;
        }
        else {
            basicSettings[key] = typeof (event) === "object" ? event.target.value : event;
        }

        if (basicSettings[key] === "" && key === "PortalName") {
            state.error["title"] = true;
        }
        else if (basicSettings[key] !== "" && key === "PortalName") {
            state.error["title"] = false;
        }

        this.setState({
            basicSettings: basicSettings,
            error: state.error,
            triedToSubmit: false
        });

        props.dispatch(SiteInfoActions.portalSettingsClientModified(basicSettings));
    }

    getTimeZoneOptions() {
        let options = [];
        if (this.props.timeZones !== undefined) {
            options = this.props.timeZones.map((item) => {
                return { label: item.DisplayName, value: item.Id };
            });
        }
        return options;
    }

    getIconSetOptions() {
        let options = [];
        if (this.props.iconSets !== undefined) {
            options = this.props.iconSets.map((item) => {
                return { label: item, value: item };
            });
        }
        return options;
    }

    onUpdate(event) {
        event.preventDefault();
        const {props, state} = this;
        this.setState({
            triedToSubmit: true
        });

        if (state.error.title) {
            return;
        }

        props.dispatch(SiteInfoActions.updatePortalSettings(state.basicSettings, () => {
            util.utilities.notify(resx.get("SettingsUpdateSuccess"));
        }, () => {
            util.utilities.notifyError(resx.get("SettingsError"));
        }));
    }

    onCancel() {
        const {props} = this;
        util.utilities.confirm(resx.get("SettingsRestoreWarning"), resx.get("Yes"), resx.get("No"), () => {
            props.dispatch(SiteInfoActions.getPortalSettings((data) => {
                this.setState({
                    basicSettings: Object.assign({}, data.Settings)
                });
            }));
        });
    }

    /* eslint-disable react/no-danger */
    render() {
        const {state} = this;
        if (state.basicSettings) {
            const columnOne = <div className="left-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plDescription.Help")}
                        label={resx.get("plDescription")}
                        />
                    <MultiLineInputWithError
                        value={state.basicSettings.Description}
                        onChange={this.onSettingChange.bind(this, "Description")}
                        />
                </InputGroup>
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plTimeZone.Help")}
                        label={resx.get("plTimeZone")}
                        />
                    <Dropdown
                        options={this.getTimeZoneOptions()}
                        value={state.basicSettings.TimeZone}
                        onSelect={this.onSettingChange.bind(this, "TimeZone")}
                        />
                </InputGroup>
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plFooterText.Help")}
                        label={resx.get("plFooterText")}
                        />
                    <SingleLineInputWithError
                        inputStyle={{ margin: "0" }}
                        withLabel={false}
                        error={false}
                        value={state.basicSettings.FooterText}
                        onChange={this.onSettingChange.bind(this, "FooterText")}
                        style={{ width: "100%" }}
                        />
                </InputGroup>
            </div>;
            const columnTwo = <div className="right-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plKeyWords.Help")}
                        label={resx.get("plKeyWords")}
                        />
                    <MultiLineInputWithError                        
                        value={state.basicSettings.KeyWords}
                        onChange={this.onSettingChange.bind(this, "KeyWords")} />
                </InputGroup>
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plGUID.Help")}
                        label={resx.get("plGUID")}
                        />
                    <SingleLineInputWithError
                        inputStyle={{ margin: "0" }}
                        withLabel={false}
                        error={false}
                        value={state.basicSettings.GUID}
                        style={{ width: "100%" }}
                        enabled={false}
                        />
                </InputGroup>
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plHomeDirectory.Help")}
                        label={resx.get("plHomeDirectory")}
                        />
                    <SingleLineInputWithError
                        inputStyle={{ margin: "0" }}
                        withLabel={false}
                        error={false}
                        value={state.basicSettings.HomeDirectory}
                        style={{ width: "100%" }}
                        enabled={false}
                        />
                </InputGroup>
            </div>;
            const columnThree = <div className="left-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plLogo.Help")}
                        label={resx.get("plLogo")}
                        />
                    <FileUpload
                        utils={util}
                        selectedFile={state.basicSettings.LogoFile}
                        folderName={state.basicSettings.LogoFile ? state.basicSettings.LogoFile.FolderName : null}
                        onSelectFile={this.onSettingChange.bind(this, "LogoFile")}
                        fileFormats={["image/png", "image/jpg", "image/jpeg", "image/bmp", "image/gif", "image/jpeg"]}
                        />
                </InputGroup>
            </div>;
            const columnFour = <div className="right-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("plFavIcon.Help")}
                        label={resx.get("plFavIcon")}
                        />
                    <FileUpload
                        utils={util}
                        selectedFile={state.basicSettings.FavIcon}
                        folderName={state.basicSettings.FavIcon ? state.basicSettings.FavIcon.FolderName : null}
                        onSelectFile={this.onSettingChange.bind(this, "FavIcon")}
                        fileFormats={["image/x-icon"]}
                        />
                </InputGroup>
            </div>;

            return (
                <div className={styles.basicSettings}>
                    <InputGroup>
                        <Label
                            tooltipMessage={resx.get("plPortalName.Help")}
                            label={resx.get("plPortalName")}
                            />
                        <SingleLineInputWithError
                            inputStyle={{ margin: "0" }}
                            withLabel={false}
                            error={this.state.error.title && this.state.triedToSubmit}
                            errorMessage={resx.get("valPortalName.ErrorMessage")}
                            value={state.basicSettings.PortalName}
                            onChange={this.onSettingChange.bind(this, "PortalName")}
                            style={{ width: "100%" }}
                            />
                    </InputGroup>
                    <Grid children={[columnOne, columnTwo]} numberOfColumns={2} />
                    <InputGroup>
                        <Label
                            className={"sectionLabel"}
                            label={resx.get("plLogoIcon")}
                            />
                    </InputGroup>
                    <Grid children={[columnThree, columnFour]} numberOfColumns={2} />
                    <InputGroup style={{ paddingTop: "10px" }}>
                        <Label
                            tooltipMessage={resx.get("plIconSet.Help")}
                            label={resx.get("plIconSet")}
                            />
                        <Dropdown
                            options={this.getIconSetOptions()}
                            value={state.basicSettings.IconSet}
                            onSelect={this.onSettingChange.bind(this, "IconSets")}
                            />
                    </InputGroup>
                    <div className="buttons-box">
                        <Button
                            disabled={!this.props.clientModified}
                            type="secondary"
                            onClick={this.onCancel.bind(this)}>
                            {resx.get("Cancel")}
                        </Button>
                        <Button
                            disabled={!this.props.clientModified}
                            type="primary"
                            onClick={this.onUpdate.bind(this)}>
                            {resx.get("Save")}
                        </Button>
                    </div>
                </div>
            );
        }
        else return <div />;
    }
}

BasicSettingsPanelBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    basicSettings: PropTypes.object,
    timeZones: PropTypes.array,
    iconSets: PropTypes.array,
    clientModified: PropTypes.bool,
    portalId: PropTypes.number,
    cultureCode: PropTypes.string
};

function mapStateToProps(state) {
    return {
        tabIndex: state.pagination.tabIndex,
        basicSettings: state.siteInfo.settings,
        timeZones: state.siteInfo.timeZones,
        iconSets: state.siteInfo.iconSets,
        clientModified: state.siteInfo.clientModified
    };
}

export default connect(mapStateToProps)(BasicSettingsPanelBody);
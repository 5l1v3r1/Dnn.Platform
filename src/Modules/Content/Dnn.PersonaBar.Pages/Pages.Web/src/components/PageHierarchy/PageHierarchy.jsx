import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import {pageHierarchyManager} from "./pages.pageHierarchy";
import utils from "../../utils";
import "./css/pages-hierarchy.css";

class PageHierarchy extends Component {
    componentDidMount() {
        const {itemTemplate, searchKeyword} = this.props;

        this.node = ReactDOM.findDOMNode(this);
        pageHierarchyManager.utility = utils.getUtilities();
        pageHierarchyManager.resx = pageHierarchyManager.utility.resx.Pages;
        pageHierarchyManager._viewModel = {};
        pageHierarchyManager.callPageSettings = this.callPageSettings.bind(this);
        pageHierarchyManager.init(this.node, this.initCallback.bind(this));
        pageHierarchyManager.setItemTemplate(itemTemplate);
        pageHierarchyManager.setSearchKeyword(searchKeyword);   
        pageHierarchyManager.setCurrentTabIdAndSiteRoot(utils.getCurrentPageId(), utils.getSiteRoot());
    }

    componentWillReceiveProps(nextProps) {
        const {itemTemplate, searchKeyword} = this.props;
        if (itemTemplate !== nextProps.itemTemplate) {
            pageHierarchyManager.setItemTemplate(nextProps.itemTemplate);
        }    

        if (searchKeyword !== nextProps.searchKeyword) {
            pageHierarchyManager.setSearchKeyword(nextProps.searchKeyword);
        }
    }
    
    initCallback() {
        const {createdPage} = this.props;

        if (createdPage !== null) {
            pageHierarchyManager.addPage(createdPage);
        }
    }

    callPageSettings(action, params) {
        const pageId = params[0];
        this.props.onPageSettings(pageId);
    }
    
    render() {
        const html = require("raw!./pages.html");
        return <div dangerouslySetInnerHTML={{__html: html}} />; // eslint-disable-line react/no-danger
    }
} 

PageHierarchy.propTypes = {
    itemTemplate: PropTypes.string.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    onPageSettings: PropTypes.func.isRequired,
    createdPage: PropTypes.object
};

PageHierarchy.defaultProps = {
    itemTemplate: "pages-list-item-template"
};

export default PageHierarchy; 

import ActionTypes from "../constants/actionTypes/pageActionTypes";
import responseStatus from "../constants/responseStatus";
import PagesService from "../services/pageService";
import utils from "../utils";
import Localization from "../localization";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";
import securityService from "../services/securityService";

function updateUrlPreview(value, dispatch) {
    PagesService.getPageUrlPreview(value).then(response => {
        dispatch({
            type: ActionTypes.CHANGE_FIELD_VALUE,
            urlPreviewChange: true,
            field: "url",
            value: response.Url
        });
    }).catch(() => {
        dispatch({
            type: ActionTypes.ERROR_LOADING_PAGE
        });
    });
}

const debouncedUpdateUrlPreview = debounce(updateUrlPreview, 500);

const loadPage = function (dispatch, pageId) {
    dispatch({
        type: ActionTypes.LOAD_PAGE
    });

    PagesService.getPage(pageId).then(response => {
        dispatch({
            type: ActionTypes.LOADED_PAGE,
            data: {
                page: response
            }
        });
    }).catch((error) => {
        dispatch({
            type: ActionTypes.ERROR_LOADING_PAGE,
            data: { error }
        });
    });
} ;
const pageActions = {
    selectPageSettingTab(selectedPageSettingTab) {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.SELECT_PAGE_SETTING_TAB,
                selectedPageSettingTab
            });
        };
    },
    loadPage(pageId) {
        return (dispatch) => {
            loadPage(dispatch, pageId);
        };
    },

    duplicatePage() {
        return (dispatch, getState) => {
            const {pages} = getState();
            const duplicatedPage = cloneDeep(pages.selectedPage);

            dispatch({
                type: ActionTypes.LOAD_PAGE
            });

            duplicatedPage.templateTabId = duplicatedPage.tabId;
            duplicatedPage.tabId = 0;
            duplicatedPage.name = "";
            duplicatedPage.url = "";

            dispatch({
                type: ActionTypes.LOADED_PAGE,
                data: {
                    page: duplicatedPage
                }
            });
        };
    },

    addPage() {
        return (dispatch, getState) => {
            const {pages} = getState();
            const previousPage = pages.selectedPage;
            dispatch({
                type: ActionTypes.LOAD_PAGE
            });

            PagesService.getNewPage().then(page => {
                if (previousPage && !securityService.isSuperUser()) {
                    page.permissions = cloneDeep(previousPage.permissions);
                }
                
                dispatch({
                    type: ActionTypes.LOADED_PAGE,
                    data: { page }
                });
            });
        };
    },

    cancelPage() {
        return (dispatch) => {
            if (!securityService.isSuperUser()) {
                utils.getUtilities().closePersonaBar(function () {
                    loadPage(dispatch, utils.getCurrentPageId());
                });
                
                return;    
            }
            
            dispatch({
                type: ActionTypes.CANCEL_PAGE,
                data: {}
            });
        };
    },
    deletePage(page) {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.DELETE_PAGE
            });

            PagesService.deletePage(page).then(response => {

                if (response.Status === responseStatus.ERROR) {
                    utils.notifyError(Localization.get("Error_" + response.Message), 3000);
                    return;
                }
                
                if (page.tabId === 0 && !securityService.isSuperUser()) {
                    utils.getUtilities().closePersonaBar();
                }
                
                dispatch({
                    type: ActionTypes.DELETED_PAGE
                });
            }).catch((error) => {
                dispatch({
                    type: ActionTypes.ERROR_DELETING_PAGE,
                    data: { error }
                });
            });
        };
    },
    savePage(page) {
        return (dispatch) => {
            dispatch({
                type: ActionTypes.SAVE_PAGE
            });

            PagesService.savePage(page).then(response => {

                if (response.Status === responseStatus.ERROR) {
                    utils.notifyError(Localization.get("Error_" + response.Message), 3000);
                    return;
                }
                
                if (page.tabId === 0 && !securityService.isSuperUser()) {
                    PagesService.openPageInEditMode(response.Page.id, response.Page.url);
                    return;    
                }
                
                dispatch({
                    type: ActionTypes.SAVED_PAGE,
                    data: {
                        createdPage: page.tabId === 0 ? response.Page : null
                    }
                });
            }).catch((error) => {
                dispatch({
                    type: ActionTypes.ERROR_SAVING_PAGE,
                    data: { error }
                });
            });
        };
    },

    changePageField(key, value) {
        return (dispatch, getState) => {
            const {pages} = getState();
            dispatch({
                type: ActionTypes.CHANGE_FIELD_VALUE,
                field: key,
                value
            });

            if (key === "name" &&
                pages.selectedPage.tabId === 0 &&
                !pages.urlChanged &&
                pages.selectedPage.pageType === "normal") {
                debouncedUpdateUrlPreview(value, dispatch);
            }
        };
    },

    changePageType(value) {
        return {
            type: ActionTypes.CHANGE_FIELD_VALUE,
            field: "pageType",
            value
        };
    },

    changePermissions(permissions) {
        return {
            type: ActionTypes.CHANGE_PERMISSIONS,
            permissions
        };
    },

    fetchCacheProviderList() {
        return (dispatch, getState) => {
            if (!getState().pages.cacheProviderList) {
                dispatch({
                    type: ActionTypes.FETCH_CACHE_PROVIDER_LIST
                });

                PagesService.getCacheProviderList().then(cacheProviderList => {
                    dispatch({
                        type: ActionTypes.FETCHED_CACHE_PROVIDER_LIST,
                        data: { cacheProviderList }
                    });
                }).catch((error) => {
                    dispatch({
                        type: ActionTypes.ERROR_FETCHING_CACHE_PROVIDER_LIST,
                        data: { error }
                    });
                });
            }
        };
    },

    deletePageModule(module) {
        return (dispatch, getState) => {
            dispatch({
                type: ActionTypes.DELETING_PAGE_MODULE
            });

            const pageId = getState().pages.selectedPage.tabId;
            const moduleToDelete = {
                moduleId: module.id,
                pageId
            };
            PagesService.deletePageModule(moduleToDelete).then(() => {
                utils.notify(Localization.get("DeletePageModuleSuccess").replace("[MODULETITLE]", module.title));
                dispatch({
                    type: ActionTypes.DELETED_PAGE_MODULE,
                    data: { module }
                });
            }).catch((error) => {
                dispatch({
                    type: ActionTypes.ERROR_DELETING_PAGE_MODULE,
                    data: { error }
                });
            });
        };
    },

    editingPageModule(module) {
        return {
            type: ActionTypes.EDITING_PAGE_MODULE,
            data: { module }
        };
    },

    cancelEditingPageModule() {
        return {
            type: ActionTypes.CANCEL_EDITING_PAGE_MODULE,
            data: {}
        };
    },

    copyAppearanceToDescendantPages() {
        return (dispatch, getState) => {
            dispatch({
                type: ActionTypes.COPYING_APPEARANCE_TO_DESCENDANT_PAGES
            });

            const state = getState();
            const page = state.pages.selectedPage;
            const { defaultPortalLayout, defaultPortalContainer } = state.theme;
            const theme = {
                skinSrc: page.skinSrc || defaultPortalLayout,
                containerSrc: page.containerSrc || defaultPortalContainer
            };

            if (!theme.skinSrc || !theme.containerSrc) {
                utils.notifyError(Localization.get("PleaseSelectLayoutContainer"));
                return;
            }

            PagesService.copyAppearanceToDescendantPages(page.tabId, theme).then(() => {
                utils.notify(Localization.get("CopyAppearanceToDescendantPagesSuccess"));
                dispatch({
                    type: ActionTypes.COPIED_APPEARANCE_TO_DESCENDANT_PAGES,
                    data: {}
                });
            }).catch((error) => {
                dispatch({
                    type: ActionTypes.ERROR_COPYING_APPEARANCE_TO_DESCENDANT_PAGES,
                    data: { error }
                });
            });
        };
    },

    copyPermissionsToDescendantPages() {
        return (dispatch, getState) => {
            dispatch({
                type: ActionTypes.COPYING_PERMISSIONS_TO_DESCENDANT_PAGES
            });

            const page = getState().pages.selectedPage;
            PagesService.copyPermissionsToDescendantPages(page.tabId).then(() => {
                utils.notify(Localization.get("CopyPermissionsToDescendantPagesSuccess"));
                dispatch({
                    type: ActionTypes.COPIED_PERMISSIONS_TO_DESCENDANT_PAGES,
                    data: {}
                });
            }).catch((error) => {
                dispatch({
                    type: ActionTypes.ERROR_COPYING_PERMISSIONS_TO_DESCENDANT_PAGES,
                    data: { error }
                });
            });
        };
    }
};

export default pageActions;
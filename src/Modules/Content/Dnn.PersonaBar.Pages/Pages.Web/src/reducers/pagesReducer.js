import ActionTypes from "../constants/actionTypes/pageActionTypes";
import SeoActionTypes from "../constants/actionTypes/pageSeoTypes";
import validateFields from "../validation";

export default function pagesReducer(state = {
    selectedPage: null,
    errors: {},
    cacheProviderList: null,
    editingSettingModuleId: null,
    urlChanged: false,
    dirtyPage: false
}, action) {    

    const changeField = function changeField(field, value) {
        const newSelectedPage = {
            ...state.selectedPage
        };  
        newSelectedPage[field] = value;
        
        return newSelectedPage;
    };

    const hasChangeUrl = function hasChangeUrl(action) {
        return state.urlChanged || (!action.urlPreviewChange && action.field === "url");
    };

    switch (action.type) {
        case ActionTypes.LOAD_PAGE:
            return { ...state,                
                selectedPage: null,
                editingSettingModuleId: null
            };

        case ActionTypes.LOADED_PAGE:
            return { ...state,
                selectedPage: action.data.page,
                errors: {},
                urlChanged: false,
                dirtyPage: false
            };
        
        case ActionTypes.CHANGE_FIELD_VALUE:
            return { ...state,
                selectedPage: changeField(action.field, action.value), 
                errors: {
                    ...(state.errors),
                    ...validateFields(action.field, action.value)
                },
                urlChanged: hasChangeUrl(action),
                dirtyPage: true           
            };

        case ActionTypes.CHANGE_PERMISSIONS:
            return { ...state,
                selectedPage: { ...state.selectedPage,
                    permissions: action.permissions
                },
                dirtyPage: true           
            };

        case ActionTypes.FETCH_CACHE_PROVIDER_LIST:
            return state;
            
        case ActionTypes.FETCHED_CACHE_PROVIDER_LIST:
            return { ...state,
                cacheProviderList: action.data.cacheProviderList                           
            };

        case ActionTypes.ERROR_FETCHING_CACHE_PROVIDER_LIST:
            return state;
        
        case ActionTypes.TOGGLE_EDIT_PAGE_MODULE: {
            const editingSettingModuleId = state.editingSettingModuleId !== action.data.module.id ? action.data.module.id : null;
            return { ...state,
                editingSettingModuleId
            };
        }

        case ActionTypes.DELETED_PAGE_MODULE: {
            const modules = [...state.selectedPage.modules.filter(f => f.id !== action.data.module.id)];
            return { ...state,
                selectedPage: {
                    ...state.selectedPage, 
                    modules
                }
            };
        }      
        
        case ActionTypes.ADD_CUSTOM_URL: {
            const pageUrls = [...state.selectedPage.pageUrls];
            pageUrls.push(action.payload.newUrl);
            
            return { ...state,
                selectedPage: {
                    ...state.selectedPage, 
                    pageUrls
                }
            };
        }

        default:
            return state;
    }
}
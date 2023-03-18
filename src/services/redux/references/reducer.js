import {
    GET_PROJECT_START,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_FAIL,
    ADD_PROJECT_SUCCESS,
    UPDATE_PROJECT_SUCCESS,
    RESET_ADD_UPDATE_PROJECT_REDUCER,
    GET_TENDER_START,
    GET_TENDER_SUCCESS,
    GET_TENDER_FAIL,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
    switch(action.type) {
        case GET_PROJECT_START:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case GET_TENDER_START:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case GET_PROJECT_SUCCESS:
            return {
                ...state,
                isLoading: true,
                isError: false,
                data: action.data,
            };
        case GET_TENDER_SUCCESS:
            return {
                ...state,
                isLoading: true,
                isError: false,
                data: action.data,
            };
        case ADD_PROJECT_SUCCESS:
            let addNewList = [...state.data.items, action.data];
            let addNewObj = {
                ...state.data,
                items: addNewList,
            };

            return {
                ...state,
                isLoading: false,
                isNewData: true,
                data: addNewObj,
            };
        case ADD_TENDER_SUCCESS:
            let addTenderList = [...state.data.items, action.data];
            let addTenderObj = {
                ...state.data,
                items: addTenderList,
            };

            return {
                ...state,
                isLoading: false,
                isNewData: true,
                data: addTenderObj,
            };
        case UPDATE_PROJECT_SUCCESS:
            let tempList = state.data.items.map((item) => {
                if(item.id === action.data.id) {
                    item = action.data;
                }
                return item;
            });
            let tempObj = {
                ...state.data,
                items: tempList,
            };

            return {
                ...state,
                isLoading: false,
                data: tempObj,
                updated: true,
            };
        case UPDATE_TENDER_SUCCESS:
            let tenderTempList = state.data.items.map((item) => {
                if(item.id === action.data.id) {
                    item = action.data;
                }
                return item;
            });
            let tempObj = {
                ...state.data,
                items: tempList,
            };

            return {
                ...state,
                isLoading: false,
                data: tempObj,
                updated: true,
            };
        case RESET_ADD_UPDATE_PROJECT_REDUCER:
            return {
                ...state,
                isNewData: false,
                updated: false,
            };
        case RESET_ADD_UPDATE_TENDER_REDUCER:
            return {
                ...state,
                isNewData: false,
                updated: false,
            };
        case GET_PROJECT_FAIL:
            return {
                ...state,
                isLoading: true,
                isError: false,
                errorMessage: action.errorMessage,
            };
        case GET_TENDER_FAIL:
            return {
                ...state,
                isLoading: true,
                isError: false,
                errorMessage: action.errorMessage,
            };
        case UPDATE_TENDER_SUCCESS:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case UPDATE_PROJECT_SUCCESS: 
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        default:
            return state;
    }
};
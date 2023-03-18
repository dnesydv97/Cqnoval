import {
  GET_GUEST_START,
  GET_GUEST_SUCCESS,
  UPDATE_GUEST_SUCCESS,
  GET_GUEST_FAIL,
  ADD_GUEST_SUCCESS,
  CLEAR_GUEST_REDUCER,
  RESET_ADD_UPDATE_GUEST_REDUCER,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GUEST_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_GUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case ADD_GUEST_SUCCESS:
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
    case UPDATE_GUEST_SUCCESS:
      let tempList = state.data.items.map((item) => {
        if (item.id === action.data.id) {
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
    case RESET_ADD_UPDATE_GUEST_REDUCER:
      return {
        ...state,
        isNewData: false,
        updated: false,
      };
    case CLEAR_GUEST_REDUCER:
      return initialState;
    case GET_GUEST_FAIL:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
};

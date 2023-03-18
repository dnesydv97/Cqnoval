import {
  UPDATE_TODO_SUCCESS,
  ADD_TODO_SUCCESS,
  GET_TODO_START,
  RESET_ADD_UPDATE_TODO_REDUCER,
  CLEAR_TODO_REDUCER,
  GET_TODO_FAIL,
  GET_TODO_SUCCESS,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TODO_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_TODO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };

    case ADD_TODO_SUCCESS:
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
    case UPDATE_TODO_SUCCESS:
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
    case RESET_ADD_UPDATE_TODO_REDUCER:
      return {
        ...state,
        isNewData: false,
        updated: false,
      };
    case CLEAR_TODO_REDUCER:
      return initialState;
    case GET_TODO_FAIL:
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

import {
  GET_MEETING_START,
  GET_MEETING_SUCCESS,
  GET_MEETING_FAIL,
  ADD_MEETING_SUCCESS,
  UPDATE_MEETING_SUCCESS,
  CLEAR_MEETING_REDUCER,
  RESET_ADD_UPDATE_MEETING_REDUCER,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MEETING_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_MEETING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };

    case ADD_MEETING_SUCCESS:
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
    case UPDATE_MEETING_SUCCESS:
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
    case RESET_ADD_UPDATE_MEETING_REDUCER:
      return {
        ...state,
        isNewData: false,
        updated: false,
      };
    case CLEAR_MEETING_REDUCER:
      return initialState;
    case GET_MEETING_FAIL:
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

import {
  GET_APPOINTMENT_START,
  GET_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT_SUCCESS,
  GET_APPOINTMENT_FAIL,
  CLEAR_APPOINTMENT_REDUCER,
  RESET_ADD_UPDATE_APPOINTMENT_REDUCER,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_APPOINTMENT_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_APPOINTMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };

    case ADD_APPOINTMENT_SUCCESS:
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
    case UPDATE_APPOINTMENT_SUCCESS:
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
    case RESET_ADD_UPDATE_APPOINTMENT_REDUCER:
      console.log('inside RESET_ADD_UPDATE_APPOINTMENT_REDUCER ');
      return {
        ...state,
        isNewData: false,
        updated: false,
      };
    case CLEAR_APPOINTMENT_REDUCER:
      return initialState;
    case GET_APPOINTMENT_FAIL:
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

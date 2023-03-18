import {
  GET_TO_MAIL_START,
  GET_TO_MAIL_SUCCESS,
  GET_TO_MAIL_FAIL,
  ADD_NEW_TO_MAIL,
  DELETE_TO_MAIL,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TO_MAIL_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_TO_MAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_TO_MAIL_FAIL:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.errorMessage,
      };
    case ADD_NEW_TO_MAIL:
      const updatedList = state.data ? [...state.data] : [];
      updatedList.push(action.item);
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: updatedList,
      };
    case DELETE_TO_MAIL:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.data,
      };
    default:
      return state;
  }
};

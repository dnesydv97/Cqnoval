import {
  GET_SENT_MAIL_START,
  GET_SENT_MAIL_SUCCESS,
  GET_SENT_MAIL_FAIL,
  ADD_NEW_SENT_MAIL,
  ADD_NEW_LIST_SENT_MAIL,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SENT_MAIL_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_SENT_MAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_SENT_MAIL_FAIL:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.errorMessage,
      };
    case ADD_NEW_SENT_MAIL:
      const updatedList = state.data ? [...state.data] : [];
      updatedList.push(action.item);
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: updatedList,
      };
    case ADD_NEW_LIST_SENT_MAIL:
      const outboxMails = action.data || [];
      const helperList = state.data ? [...state.data, ...outboxMails] : [];
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: helperList,
      };
    default:
      return state;
  }
};

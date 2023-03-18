import {LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case LOGIN_FAIL:
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

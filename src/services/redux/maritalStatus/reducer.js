import {
  GET_MARITAL_STATUS_START,
  GET_MARITAL_STATUS_SUCCESS,
  GET_MARITAL_STATUS_FAIL,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MARITAL_STATUS_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_MARITAL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_MARITAL_STATUS_FAIL:
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

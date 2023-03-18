import {
  GET_GENDER_START,
  GET_GENDER_SUCCESS,
  GET_GENDER_FAIL,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GENDER_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_GENDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_GENDER_FAIL:
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

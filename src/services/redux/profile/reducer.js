import {
  GET_PROFILE_START,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  UPDATE_PROFILE,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_PROFILE_FAIL:
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

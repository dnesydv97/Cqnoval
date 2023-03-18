import {
  GET_EMPLOYEE_START,
  GET_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_FAIL,
  GET_EMPLOYEE_SUCCESS_PAGE,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EMPLOYEE_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_EMPLOYEE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_EMPLOYEE_SUCCESS_PAGE:
      const tempList = [...state.data.items, ...action.data.items];
      return {
        ...state,
        isLoading: false,
        data: {totalCount: action.data.totalCount, items: tempList},
      };
    case GET_EMPLOYEE_FAIL:
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

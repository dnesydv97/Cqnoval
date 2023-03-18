import {
  GET_OUT_BOX_START,
  GET_OUT_BOX_SUCCESS,
  GET_OUT_BOX_FAIL,
  ADD_NEW_OUTBOX_MAIL,
  DELETE_OUTBOX_MAIL,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_OUT_BOX_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_OUT_BOX_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case GET_OUT_BOX_FAIL:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.errorMessage,
      };
    case ADD_NEW_OUTBOX_MAIL:
      const updatedList = state.data ? [...state.data] : [];
      updatedList.push(action.item);
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: updatedList,
      };
    case DELETE_OUTBOX_MAIL:
      const updatedListAfterDel = state.data.filter(
        (item) => item.id != action.id,
      );
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: updatedListAfterDel,
      };
    default:
      return state;
  }
};

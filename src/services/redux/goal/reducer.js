import {
  GET_GOAL_START, 
  GET_GOAL_SUCCESS, 
  GET_GOAL_FAIL,
  ADD_GOAL_SUCCESS,
  UPDATE_GOAL_SUCCESS,
  CLEAR_GOAL_REDUCER,
  RESET_ADD_UPDATE_GOAL_REDUCER,
} from './constant';
import {initialState} from 'constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GOAL_START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_GOAL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case ADD_GOAL_SUCCESS:
      let addNewList = [...state.data.items, action.data]
      let addNewObj = {
        ...state.data,
        items: addNewList,
      };
      return {
        ...state,
        isLoading: false,
        isNewData: true,
        data: addNewObj
      };
    case UPDATE_GOAL_SUCCESS:
      console.log('UPDATE_GOAL-SUCCESS', state);
      let tempList = state.data.items.map((item) => {
        if(item.id === action.data.id){
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
    case RESET_ADD_UPDATE_GOAL_REDUCER:
      return {
        ...state,
        isNewData: false,
        updated: false,
      };
    case CLEAR_GOAL_REDUCER:
      return initialState;
    case GET_GOAL_FAIL:
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

import {getGoals} from 'services';
import { updateGoal } from 'services/remote/api';
import {onError} from 'utils';
import {
  GET_GOAL_START,
  GET_GOAL_SUCCESS, 
  GET_GOAL_FAIL,
  ADD_GOAL_SUCCESS,
  UPDATE_GOAL_SUCCESS,
  CLEAR_GOAL_REDUCER,
  RESET_ADD_UPDATE_GOAL_REDUCER,
} from './constant';

export function fetchGoals(
  skipCount,
  guestLabelId,
  SearchDateFrom,
  SearchDateTo,
) {
  return (dispatch) => {
    dispatch(getGoalsStart());
    getGoals()
      .then((response) => {
        console.log('Get Goals Response ', response);
        if (response.status === 200) dispatch(getGoalsSuccess(response.data));
        else dispatch(getGoalsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getGoalsFail(error.message));
      });
  };
}

export function addNewGoal(goal){
  return(dispatch) => {
    dispatch(getGoalsStart());
    addGoal(goal)
      .then((response) => {
        console.log('Add Goal Response', response);
        if(response.status === 200) {
          dispatch(addGoalsSuccess(response.data));
        } else dispatch(getGoalsFail(response.message));
      });
  };
}

export function updateGoalDetail(goal){
  return (dispatch) => {
    dispatch(getGoalsStart());
    updateGoal(goal, goal.id)
      .then((response) =>{
        console.log('Update Goal Response', response);
        if(response.status === 200){
          dispatch(updateGoalsSuccess(response.data));
        } else dispatch(getGoalsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getGoalsFail(error.message));
      });
  };
}

export function clearGoalReducer() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_GOAL_REDUCER,
    });
  };
}

export function resetAddUpdateGoalReducer() {
  return (dispatch) => {
    dispatch({
      type: RESET_ADD_UPDATE_GOAL_REDUCER,
    });
  };
}

const getGoalsStart = () => {
  return {
    type: GET_GOAL_START,
  };
};

const getGoalsSuccess = (data) => {
  return {
    type: GET_GOAL_SUCCESS,
    data,
  };
};

const addGoalsSuccess = (data) => {
  return {
    type: ADD_GOAL_SUCCESS,
    data,
  };
};

const updateGoalsSuccess = (data) => {
  return {
    type: UPDATE_GOAL_SUCCESS,
    data,
  };
};

const getGoalsFail = (errorMessage) => {
  return {
    type: GET_GOAL_FAIL,
    errorMessage,
  };
};

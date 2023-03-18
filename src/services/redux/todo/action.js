import {addTodo, getTodoList, updateTodo} from 'services/remote/api';
import {onError} from 'utils';
import {
  UPDATE_TODO_SUCCESS,
  ADD_TODO_SUCCESS,
  GET_TODO_START,
  RESET_ADD_UPDATE_TODO_REDUCER,
  CLEAR_TODO_REDUCER,
  GET_TODO_FAIL,
  GET_TODO_SUCCESS,
} from './constant';

export function fetchTodos(
  SkipCount,
  ActiveStatuses,
  PriorityStatuses,
  TodoStatuses,
  AssignedStatus,
  LabelStatuses,
  Sorting,
) {
  return (dispatch) => {
    dispatch(getTodosStart());
    getTodoList(
      SkipCount,
      ActiveStatuses,
      PriorityStatuses,
      TodoStatuses,
      AssignedStatus,
      LabelStatuses,
      Sorting,
    )
      .then((response) => {
        console.log('Get Todo Response ', response);
        if (response.status === 200) dispatch(getTodosSuccess(response.data));
        else dispatch(getTodosFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getTodosFail(error.message));
      });
  };
}

export function addNewTodo(todo) {
  return (dispatch) => {
    dispatch(getTodosStart());
    addTodo(todo)
      .then((response) => {
        console.log('Add Todo Response ', response);
        if (response.status === 200) {
          dispatch(addTodosSuccess(response.data));
        } else dispatch(getTodosFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getTodosFail(error.message));
      });
  };
}

export function updateTodoDetail(todo) {
  return (dispatch) => {
    dispatch(getTodosStart());
    updateTodo(todo, todo.id)
      .then((response) => {
        console.log('Update Todos Response ', response);
        if (response.status === 200) {
          dispatch(updateTodosSuccess(response.data));
        } else dispatch(getTodosFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getTodosFail(error.message));
      });
  };
}

export function clearTodoReducer() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_TODO_REDUCER,
    });
  };
}

export function resetAddUpdateTodoReducer() {
  return (dispatch) => {
    dispatch({
      type: RESET_ADD_UPDATE_TODO_REDUCER,
    });
  };
}

const getTodosStart = () => {
  return {
    type: GET_TODO_START,
  };
};

const getTodosSuccess = (data) => {
  return {
    type: GET_TODO_SUCCESS,
    data,
  };
};
const addTodosSuccess = (data) => {
  return {
    type: ADD_TODO_SUCCESS,
    data,
  };
};

const updateTodosSuccess = (data) => {
  return {
    type: UPDATE_TODO_SUCCESS,
    data,
  };
};

const getTodosFail = (errorMessage) => {
  return {
    type: GET_TODO_FAIL,
    errorMessage,
  };
};

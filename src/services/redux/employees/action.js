import {getAllUsers} from 'services';
import {onError} from 'utils';
import {
  GET_EMPLOYEE_START,
  GET_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_FAIL,
  GET_EMPLOYEE_SUCCESS_PAGE,
} from './constant';

export function fetchAllUsers(skipCount) {
  return (dispatch) => {
    dispatch(getEmployeesStart());
    getAllUsers(skipCount)
      .then((response) => {
        console.log('Get Employees Response ', response);
        if (response.status === 200)
          dispatch(
            skipCount
              ? getEmployeesSuccessPage(response.data)
              : getEmployeesSuccess(response.data),
          );
        else dispatch(getEmployeesFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getEmployeesFail(error.message));
      });
  };
}

const getEmployeesStart = () => {
  return {
    type: GET_EMPLOYEE_START,
  };
};

const getEmployeesSuccess = (data) => {
  return {
    type: GET_EMPLOYEE_SUCCESS,
    data,
  };
};

const getEmployeesSuccessPage = (data) => {
  return {
    type: GET_EMPLOYEE_SUCCESS_PAGE,
    data,
  };
};

const getEmployeesFail = (errorMessage) => {
  return {
    type: GET_EMPLOYEE_FAIL,
    errorMessage,
  };
};

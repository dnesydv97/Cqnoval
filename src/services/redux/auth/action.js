import {LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL} from './constant';

export function userLogin(credential) {
  return (dispatch, getState) => {
    dispatch(loginSuccess(credential));
  };
}

const loginStart = () => {
  return {
    type: LOGIN_START,
  };
};

const loginSuccess = (data) => {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
};

const loginFail = (errorMessage) => {
  return {
    type: LOGIN_FAIL,
    errorMessage,
  };
};

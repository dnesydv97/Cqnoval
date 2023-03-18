import {getAllMaritalStatus} from 'services';
import {onError} from 'utils';
import {
  GET_MARITAL_STATUS_START,
  GET_MARITAL_STATUS_SUCCESS,
  GET_MARITAL_STATUS_FAIL,
} from './constant';

export function fetchMaritalStatus() {
  return (dispatch) => {
    dispatch(getMaritalStatusStart());
    getAllMaritalStatus()
      .then((response) => {
        // console.log('All Marital Status Response ', response);
        if (response.status === 200)
          dispatch(getMaritalStatusSuccess(response.data));
        else dispatch(getMaritalStatusFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getMaritalStatusFail(error.message));
      });
  };
}

const getMaritalStatusStart = () => {
  return {
    type: GET_MARITAL_STATUS_START,
  };
};

const getMaritalStatusSuccess = (data) => {
  return {
    type: GET_MARITAL_STATUS_SUCCESS,
    data,
  };
};

const getMaritalStatusFail = (errorMessage) => {
  return {
    type: GET_MARITAL_STATUS_FAIL,
    errorMessage,
  };
};

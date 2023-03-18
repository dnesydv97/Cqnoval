import {getAllGenders} from 'services';
import {onError} from 'utils';
import {
  GET_GENDER_START,
  GET_GENDER_SUCCESS,
  GET_GENDER_FAIL,
} from './constant';

export function fetchGenders() {
  return (dispatch) => {
    dispatch(getGendersStart());
    getAllGenders()
      .then((response) => {
        // console.log('Get Genders Response ', response);
        if (response.status === 200) dispatch(getGendersSuccess(response.data));
        else dispatch(getGendersFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getGendersFail(error.message));
      });
  };
}

const getGendersStart = () => {
  return {
    type: GET_GENDER_START,
  };
};

const getGendersSuccess = (data) => {
  return {
    type: GET_GENDER_SUCCESS,
    data,
  };
};

const getGendersFail = (errorMessage) => {
  return {
    type: GET_GENDER_FAIL,
    errorMessage,
  };
};

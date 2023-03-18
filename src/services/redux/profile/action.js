import {getMyProfile} from 'services/remote/api';
import {onError} from 'utils';
import {
  GET_PROFILE_START,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
} from './constant';

export function fetchMyProfile() {
  return (dispatch) => {
    dispatch(getProfileStart());
    getMyProfile()
      .then((response) => {
        console.log('Profile Response action ', response);
        if (response.status === 200) dispatch(getProfileSuccess(response.data));
        else dispatch(getProfileFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getProfileFail(error.message));
      });
  };
}

export function updateProfile(key, newProfile) {
  return (dispatch, getState) => {
    const state = getState();
    const profile = Object.assign(state.data);
    profile[key] = newProfile;
    dispatch({
      type: UPDATE_PROFILE,
      data: profile,
    });
  };
}

export function updateCompany(key, newCompanyDetail) {
  return (dispatch, getState) => {
    const state = getState();
    const company = Object.assign(state.data);
    company[key] = newCompanyDetail;
    dispatch({
      type: UPDATE_COMPANY,
      data: company,
    });
  };
}

const getProfileStart = () => {
  return {
    type: GET_PROFILE_START,
  };
};

const getProfileSuccess = (data) => {
  return {
    type: GET_PROFILE_SUCCESS,
    data,
  };
};

const getProfileFail = (errorMessage) => {
  return {
    type: GET_PROFILE_FAIL,
    errorMessage,
  };
};

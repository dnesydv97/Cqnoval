import {getGuests} from 'services';
import {addGuest, updateGuest} from 'services/remote/api';
import {onError} from 'utils';
import {
  GET_GUEST_START,
  GET_GUEST_SUCCESS,
  ADD_GUEST_SUCCESS,
  UPDATE_GUEST_SUCCESS,
  GET_GUEST_FAIL,
  CLEAR_GUEST_REDUCER,
  RESET_ADD_UPDATE_GUEST_REDUCER,
} from './constant';

export function fetchGuests(
  skipCount,
  guestLabelId,
  SearchDateFrom,
  SearchDateTo,
) {
  return (dispatch) => {
    dispatch(getGuestsStart());
    getGuests(skipCount, guestLabelId, SearchDateFrom, SearchDateTo)
      .then((response) => {
        console.log('Get Guests Response ', response);
        if (response.status === 200) dispatch(getGuestsSuccess(response.data));
        else dispatch(getGuestsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getGuestsFail(error.message));
      });
  };
}

export function addNewGuest(guest) {
  return (dispatch) => {
    dispatch(getGuestsStart());
    addGuest(guest)
      .then((response) => {
        console.log('Add Guest Response ', response);
        if (response.status === 200) {
          dispatch(addGuestsSuccess(response.data));
        } else dispatch(getGuestsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getGuestsFail(error.message));
      });
  };
}

export function updateGuestDetail(guest) {
  return (dispatch) => {
    dispatch(getGuestsStart());
    updateGuest(guest, guest.id)
      .then((response) => {
        console.log('Update Guests Response ', response);
        if (response.status === 200) {
          dispatch(updateGuestsSuccess(response.data));
        } else dispatch(getGuestsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getGuestsFail(error.message));
      });
  };
}

export function clearGuestReducer() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_GUEST_REDUCER,
    });
  };
}

export function resetAddUpdateGuestReducer() {
  return (dispatch) => {
    dispatch({
      type: RESET_ADD_UPDATE_GUEST_REDUCER,
    });
  };
}

const getGuestsStart = () => {
  return {
    type: GET_GUEST_START,
  };
};

const getGuestsSuccess = (data) => {
  return {
    type: GET_GUEST_SUCCESS,
    data,
  };
};
const addGuestsSuccess = (data) => {
  return {
    type: ADD_GUEST_SUCCESS,
    data,
  };
};

const updateGuestsSuccess = (data) => {
  return {
    type: UPDATE_GUEST_SUCCESS,
    data,
  };
};

const getGuestsFail = (errorMessage) => {
  return {
    type: GET_GUEST_FAIL,
    errorMessage,
  };
};

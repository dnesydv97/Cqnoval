import {
  GET_OUT_BOX_START,
  GET_OUT_BOX_SUCCESS,
  GET_OUT_BOX_FAIL,
  ADD_NEW_OUTBOX_MAIL,
  DELETE_OUTBOX_MAIL,
} from './constant';

export function getOutBoxMail() {
  return (dispatch, getState) => {
    dispatch(outBoxSuccess([]));
  };
}

export function addOutboxMail(newMail) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_NEW_OUTBOX_MAIL,
      item: newMail,
    });
  };
}

export function deleteOutboxMail(id) {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_OUTBOX_MAIL,
      id,
    });
  };
}

const outBoxStart = () => {
  return {
    type: GET_OUT_BOX_START,
  };
};

const outBoxSuccess = (data) => {
  return {
    type: GET_OUT_BOX_SUCCESS,
    data,
  };
};

const outBoxFail = (errorMessage) => {
  return {
    type: GET_OUT_BOX_FAIL,
    errorMessage,
  };
};

import {
  GET_SENT_MAIL_START,
  GET_SENT_MAIL_SUCCESS,
  GET_SENT_MAIL_FAIL,
  ADD_NEW_SENT_MAIL,
  ADD_NEW_LIST_SENT_MAIL,
} from './constant';

export function getSentMail() {
  return (dispatch, getState) => {
    dispatch(setnMailSuccess([]));
  };
}

export function addNewSentMail(newMail) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_NEW_SENT_MAIL,
      item: newMail,
    });
  };
}

export function syncOutboxToSentMail(outboxList) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_NEW_LIST_SENT_MAIL,
      data: outboxList,
    });
  };
}

const setnMailStart = () => {
  return {
    type: GET_SENT_MAIL_START,
  };
};

const setnMailSuccess = (data) => {
  return {
    type: GET_SENT_MAIL_SUCCESS,
    data,
  };
};

const setnMailFail = (errorMessage) => {
  return {
    type: GET_SENT_MAIL_FAIL,
    errorMessage,
  };
};

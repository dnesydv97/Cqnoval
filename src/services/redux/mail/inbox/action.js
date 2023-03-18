import {getInboxMails} from 'services/remote/api';
import {onError} from 'utils';
import {
  GET_TO_MAIL_START,
  GET_TO_MAIL_SUCCESS,
  GET_TO_MAIL_FAIL,
  CHANGE_STATUS_MAIL,
  ADD_NEW_TO_MAIL,
  DELETE_TO_MAIL,
} from './constant';

export function getInboxMessages(
  applicationType,
  mailType,
  subMailType,
  SkipCount,
) {
  // console.log('mail type in action ', mailType);
  return (dispatch, getState) => {
    dispatch(toMailStart());
    let type = subMailType === 'All' ? mailType : subMailType;

    getInboxMails(null, type, SkipCount)
      .then((response) => {
        console.log('Inbox response ', response);
        if (response.status === 200) {
          if (SkipCount > 0) {
            let state = getState();
            let newData = [
              ...(state.inboxMailReducer?.data[mailType][subMailType]?.items ||
                []),
              ...response.data.items,
            ];
            dispatch(
              toMailSuccess(
                {items: newData, totalCount: response.data.totalCount},
                mailType,
                subMailType,
              ),
            );
          } else dispatch(toMailSuccess(response.data, mailType, subMailType));
        }
      })
      .catch((error) => {
        onError(error);
        dispatch(toMailFailed(error.message));
      });
  };
}

export function addToMail(newMail) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_NEW_TO_MAIL,
      item: newMail,
    });
  };
}

export function deleteToMail(id, mailType, subMailType) {
  return (dispatch, getState) => {
    let state = getState();
    let currentList =
      state.inboxMailReducer?.data[mailType][subMailType]?.items || [];
    let newList = currentList.filter((item) => item.id !== id);
    dispatch({
      type: DELETE_TO_MAIL,
      data: {
        ...state.inboxMailReducer.data[mailType][subMailType],
        items: newList,
      },
    });
  };
}

const toMailStart = () => {
  return {
    type: GET_TO_MAIL_START,
  };
};

const toMailSuccess = (data, mailType, subMailType) => {
  console.log('Data in tomail success ', data);
  return {
    type: GET_TO_MAIL_SUCCESS,
    data: {
      [mailType]: {
        [subMailType]: data,
      },
    },
  };
};

const toMailFailed = (errorMessage) => {
  return {
    type: GET_TO_MAIL_FAIL,
    errorMessage,
  };
};

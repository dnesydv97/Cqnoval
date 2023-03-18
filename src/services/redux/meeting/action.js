import {
  addMeeting,
  getMeetings,
  markMeetingCompleted,
  updateMeeting,
} from 'services/remote/api';
import {onError} from 'utils';
import {
  GET_MEETING_START,
  GET_MEETING_SUCCESS,
  GET_MEETING_FAIL,
  ADD_MEETING_SUCCESS,
  UPDATE_MEETING_SUCCESS,
  CLEAR_MEETING_REDUCER,
  RESET_ADD_UPDATE_MEETING_REDUCER,
} from './constant';

export function fetchMeetings(SkipCount, SearchKeyword, Sorting) {
  return (dispatch) => {
    dispatch(getMeetingStart());
    getMeetings(SkipCount, SearchKeyword, Sorting)
      .then((response) => {
        console.log('Get Meetings Response ', response);
        if (response.status === 200) dispatch(getMeetingSuccess(response.data));
        else dispatch(getMeetingFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getMeetingFail(error.message));
      });
  };
}

export function addNewMeeting(meeting) {
  return (dispatch) => {
    dispatch(getMeetingStart());
    addMeeting(meeting)
      .then((response) => {
        console.log('Add Meetings Response ', response);
        if (response.status === 200) {
          dispatch(addMeetingSuccess(response.data));
        } else dispatch(getMeetingFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getMeetingFail(error.message));
      });
  };
}

export function updateMeetingDetail(meeting) {
  return (dispatch) => {
    dispatch(getMeetingStart());
    updateMeeting(meeting, meeting.id)
      .then((response) => {
        console.log('Update Meeting Response ', response);
        if (response.status === 200) {
          dispatch(updateMeetingSuccess(response.data));
        } else dispatch(getMeetingFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getMeetingFail(error.message));
      });
  };
}

export function markMeetingAsCompleted(meetingEventId) {
  return (dispatch) => {
    dispatch(getMeetingStart());
    markMeetingCompleted(meetingEventId)
      .then((response) => {
        console.log('Mark Meeting off Response ', response);
        if (response.status === 200) {
          dispatch(updateMeetingSuccess(response.data));
        } else dispatch(getMeetingFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getMeetingFail(error.message));
      });
  };
}

export function clearMeetingReducer() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_MEETING_REDUCER,
    });
  };
}

export function resetAddUpdateMeetingReducer() {
  return (dispatch) => {
    dispatch({
      type: RESET_ADD_UPDATE_MEETING_REDUCER,
    });
  };
}

const getMeetingStart = () => {
  return {
    type: GET_MEETING_START,
  };
};

const getMeetingSuccess = (data) => {
  return {
    type: GET_MEETING_SUCCESS,
    data,
  };
};
const addMeetingSuccess = (data) => {
  return {
    type: ADD_MEETING_SUCCESS,
    data,
  };
};

const updateMeetingSuccess = (data) => {
  return {
    type: UPDATE_MEETING_SUCCESS,
    data,
  };
};

const getMeetingFail = (errorMessage) => {
  return {
    type: GET_MEETING_FAIL,
    errorMessage,
  };
};

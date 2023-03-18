import {
  addAppointment,
  getAppointments,
  markAppointmentOff,
  updateAppointment,
} from 'services/remote/api';
import {onError} from 'utils';
import {
  GET_APPOINTMENT_START,
  GET_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT_SUCCESS,
  GET_APPOINTMENT_FAIL,
  CLEAR_APPOINTMENT_REDUCER,
  RESET_ADD_UPDATE_APPOINTMENT_REDUCER,
} from './constant';

export function fetchAppointments(
  SkipCount,
  MarkItOffStatuses,
  LabelStatuses,
  GuestEventStatuses,
  SearchDateFrom,
  SearchDateTo,
  SortType,
  Sorting,
) {
  return (dispatch) => {
    dispatch(getAppointmentsStart());
    getAppointments(
      SkipCount,
      MarkItOffStatuses,
      LabelStatuses,
      GuestEventStatuses,
      SearchDateFrom,
      SearchDateTo,
      SortType,
      Sorting,
    )
      .then((response) => {
        console.log('Get Appointments Response ', response);
        if (response.status === 200)
          dispatch(getAppointmentsSuccess(response.data));
        else dispatch(getAppointmentsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getAppointmentsFail(error.message));
      });
  };
}

export function addNewAppointment(appointment) {
  return (dispatch) => {
    dispatch(getAppointmentsStart());
    addAppointment(appointment)
      .then((response) => {
        console.log('Add Appointment Response ', response);
        if (response.status === 200) {
          dispatch(addAppointmentsSuccess(response.data));
        } else dispatch(getAppointmentsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getAppointmentsFail(error.message));
      });
  };
}

export function updateAppointmentDetail(appointment) {
  return (dispatch) => {
    dispatch(getAppointmentsStart());
    updateAppointment(appointment, appointment.id)
      .then((response) => {
        console.log('Update Appointment Response ', response);
        if (response.status === 200) {
          dispatch(updateAppointmentsSuccess(response.data));
        } else dispatch(getAppointmentsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getAppointmentsFail(error.message));
      });
  };
}

export function markAppointmentOffById(appointment) {
  return (dispatch) => {
    dispatch(getAppointmentsStart());
    markAppointmentOff(appointment.id)
      .then((response) => {
        console.log('Mark Appointment off Response ', response);
        if (response.status === 200) {
          dispatch(updateAppointmentsSuccess(response.data));
        } else dispatch(getAppointmentsFail(response.message));
      })
      .catch((error) => {
        onError(error);
        dispatch(getAppointmentsFail(error.message));
      });
  };
}

export function clearAppointmentReducer() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_APPOINTMENT_REDUCER,
    });
  };
}

export function resetAddUpdateAppointmentReducer() {
  return (dispatch) => {
    dispatch({
      type: RESET_ADD_UPDATE_APPOINTMENT_REDUCER,
    });
  };
}

const getAppointmentsStart = () => {
  return {
    type: GET_APPOINTMENT_START,
  };
};

const getAppointmentsSuccess = (data) => {
  return {
    type: GET_APPOINTMENT_SUCCESS,
    data,
  };
};
const addAppointmentsSuccess = (data) => {
  return {
    type: ADD_APPOINTMENT_SUCCESS,
    data,
  };
};

const updateAppointmentsSuccess = (data) => {
  return {
    type: UPDATE_APPOINTMENT_SUCCESS,
    data,
  };
};

const getAppointmentsFail = (errorMessage) => {
  return {
    type: GET_APPOINTMENT_FAIL,
    errorMessage,
  };
};

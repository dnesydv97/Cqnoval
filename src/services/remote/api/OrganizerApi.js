import {getAuthAxios} from '../ApiConfig';
import {organizerEndPoint} from 'services';
import qs from 'qs';

export async function getAllFiscalYears() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_FISCAL_YEARS_WITH_STATUS,
  });
}

export async function addHoliday(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: organizerEndPoint.ADD_HOLIDAY,
    data,
  });
}

export async function getHolidys(skipCount = 0, FiscalYearIds = '') {
  const authAxios = await getAuthAxios();
  const params = {skipCount, FiscalYearIds};
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_HOLIDAY_PAGINATION,
    params,
  });
}

export async function getHolidyDetailById(holidayEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_HOLIDAY_DETAIL}/${holidayEventId}`,
  });
}

export async function getGoalLabels() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_GOAL_LABELS,
  });
}
export async function getGoalPriority() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_GOAL_PRIORITY,
  });
}
export async function getGoals(skipCount = 0, sortBy = '', filterBy = '') {
  const params = {skipCount, sortBy, filterBy};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_GOAL_PAGINATION,
    params,
  });
}

export async function getGoalDetail(goalEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_GOAL_DETAIL}/${goalEventId}`,
  });
}

export async function addGoal(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: organizerEndPoint.ADD_GOAL,
    data,
  });
}

export async function updateGoal(data, goalEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${organizerEndPoint.UPDATE_GOAL}/${goalEventId}`,
    data,
  });
}

//GUEST
export async function getGuestLabel() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_GUEST_LABELS,
  });
}

export async function getGuests(
  skipCount = 0,
  GuestEventStatuses = null,
  SearchDateFrom = null,
  SearchDateTo = null,
) {
  const params = {skipCount, GuestEventStatuses, SearchDateFrom, SearchDateTo};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_GUEST_PAGINATION,
    params,
  });
}

export async function getGuestDetail(guestEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_GUEST_DETAIL}/${guestEventId}`,
  });
}

export async function addGuest(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: organizerEndPoint.ADD_GUEST,
    data,
  });
}

export async function updateGuest(data, guestEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${organizerEndPoint.UPDATE_GUEST}/${guestEventId}`,
    data,
  });
}

//For Appointment
export async function getAppointmentLabel() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_APPOINTMENT_LABELS,
  });
}

export async function getAppointments(
  SkipCount = 0,
  MarkItOffStatuses = false,
  LabelStatuses = null,
  GuestEventStatuses = null,
  SearchDateFrom = null,
  SearchDateTo = null,
  SortType = false,
  Sorting = null,
) {
  const marked = MarkItOffStatuses ? false : null;
  const sortType = SortType ? 'asc' : 'desc';
  const params = {
    SkipCount,
    MarkItOffStatuses: marked,
    LabelStatuses,
    GuestEventStatuses,
    SearchDateFrom,
    SearchDateTo,
    SortType: sortType,
    Sorting,
  };
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_APPOINTMENT_PAGINATION,
    params,
  });
}

export async function getAppointmentDetail(appointmentEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_APPOINTMENT_DETAIL}/${appointmentEventId}`,
  });
}

export async function addAppointment(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: organizerEndPoint.ADD_APPOINTMENT,
    data,
  });
}

export async function updateAppointment(data, appointmentEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${organizerEndPoint.UDPATE_APPOINTMENT}/${appointmentEventId}`,
    data,
  });
}

export async function markAppointmentOff(appointmentId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PATCH',
    url: `${organizerEndPoint.MARK_APPOINTMENT_OFF}/${appointmentId}`,
  });
}
export async function getAllUserList(Filter = '') {
  const params = {Filter};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_USER_LIST,
    params,
  });
}

//For TODO
export async function getTodoStatus() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_TODO_STATUS,
  });
}

export async function getTodoList(
  SkipCount = 0,
  ActiveStatuses = null,
  PriorityStatuses = null,
  TodoStatuses = null,
  AssignedStatus = null,
  LabelStatuses = null,
  Sorting = null,
) {
  const params = {
    SkipCount,
    ActiveStatuses,
    PriorityStatuses,
    TodoStatuses,
    AssignedStatus,
    LabelStatuses,
    Sorting,
  };
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_TODO_PAGINATION,
    params,
  });
}

export async function getTodoDetail(todoEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_TODO_DETAIL}/${todoEventId}`,
  });
}

export async function addTodo(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: organizerEndPoint.ADD_TODO,
    data,
  });
}

export async function updateTodo(data, todoEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${organizerEndPoint.UDPATE_TODO}/${todoEventId}`,
    data,
  });
}
//For MEETING
export async function getMeetingStatus() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_MEETING_STATUS,
  });
}

export async function getMeetingSisterCompanies() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_MEETING_SISTER_COMPANY,
  });
}

export async function getEmployeeSisterCompanies() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_EMP_SISTER_COMPANY_NAME_LIST,
  });
}

export async function getMeetings(
  SkipCount = 0,
  SearchKeyword = null,
  Sorting = null,
) {
  const params = {
    SkipCount,
    SearchKeyword,
    Sorting,
  };
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_MEETING_PAGINATION,
    params,
  });
}

export async function getMeetingDetail(meetingEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_MEETING_DETAIL}/${meetingEventId}`,
  });
}

export async function addMeeting(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: organizerEndPoint.ADD_MEETING,
    data,
  });
}

export async function updateMeeting(data, meetingEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${organizerEndPoint.UDPATE_MEETING}/${meetingEventId}`,
    data,
  });
}

export async function markMeetingCompleted(meetingEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PATCH',
    url: `${organizerEndPoint.MARK_MEETING_COMPLETE}/${meetingEventId}`,
  });
}

export async function getMeetingAgenda(meetingEventId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${organizerEndPoint.GET_MEETING_AGENDA}/${meetingEventId}`,
  });
}

//CALENDAR EVENTS
export async function getCalendarEvents(
  SearchDateFrom = null,
  SearchDateTo = null,
  EventTypeSystemNames = [],
) {
  const authAxios = await getAuthAxios();
  const params = {SearchDateFrom, SearchDateTo, EventTypeSystemNames};

  return authAxios({
    method: 'GET',
    url: organizerEndPoint.GET_CALENDAR_EVENTS,
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
}

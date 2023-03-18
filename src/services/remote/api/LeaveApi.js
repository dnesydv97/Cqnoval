import {getAuthAxios} from '../ApiConfig';
import {leaveEndPoints} from 'services';

export async function getLeaveTypes() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: leaveEndPoints.GET_LEAVE_TYPE,
  });
}
export async function getLeaveTypesRemaining() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: leaveEndPoints.GET_LEAVE_TYPE_REMAINING,
  });
}

export async function getLeaveStatusList() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: leaveEndPoints.GET_LEAVE_STATUS_LIST,
  });
}
export async function getSupervisorList(appUserid = null) {
  const authAxios = await getAuthAxios();
  const params = {appUserid};
  return authAxios({
    method: 'GET',
    url: leaveEndPoints.GET_SUPERVISOR_LIST,
    params,
  });
}
export async function getAllLeaveList(
  SkipCount = 0,
  SearchKeyword = '',
  Sorting = '',
) {
  const authAxios = await getAuthAxios();
  const params = {SkipCount, SearchKeyword, Sorting};
  return authAxios({
    method: 'GET',
    url: leaveEndPoints.GET_APPLIED_LEAVE_LIST,
    params,
  });
}
export async function getLeaveDetailById(Id = null) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${leaveEndPoints.GET_LEAVE_DETAIL}${Id}`,
  });
}

export async function postLeave(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: leaveEndPoints.POST_LEAVE,
    data,
  });
}

export async function approveRejectLeave(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: leaveEndPoints.APPROVE_REJECT_LEAVE,
    data,
  });
}

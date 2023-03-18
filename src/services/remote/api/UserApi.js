import {authConfig, getAuthAxios, getNormalAuthAxios} from '../ApiConfig';
import {endPoints, getUserId} from 'services';
import qs from 'qs';

export async function getMyProfile() {
  const userId = await getUserId();
  return getUserDetailById(userId);
}

export async function getUserDetailById(userId) {
  const authAxios = await getAuthAxios();
  const params = {appUserId: userId};
  return authAxios({
    method: 'GET',
    url: endPoints.GET_USER_DETAIL,
    params,
  });
}

export async function getAllUsers(skipCount = 0) {
  const authAxios = await getAuthAxios();
  const params = {SkipCount: skipCount, MaxResultCount: 10};
  return authAxios({
    method: 'GET',
    url: endPoints.GET_USERS,
    params,
  });
}
export async function getAllGenders() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: endPoints.GET_GENDERS,
  });
}
export async function getAllMaritalStatus() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: endPoints.GET_MARITAL_STATUS,
  });
}
export async function updatePersonalDetail(requestBody) {
  console.log('profile', requestBody);
  const authAxios = await getNormalAuthAxios();
  return authAxios({
    method: 'POST',
    url: endPoints.UPDATE_USER_PERSONAL_DETAIL,
    data: requestBody,
  });
}
export async function updateCompanyDetail(requestBody) {
  console.log('company', requestBody);
  const authAxios = await getNormalAuthAxios();
  return authAxios({
    method: 'POST',
    url: endPoints, UPDATE_COMPANY_DETAIL,
    data: requestBody,
  });
};
export async function updateOfficialDetail(requestBody) {
  console.log('Official profile', requestBody);
  const authAxios = await getNormalAuthAxios();
  return authAxios({
    method: 'POST',
    url: endPoints.UPDATE_USER_OFFICIAL_DETAIL,
    data: requestBody,
  });
}

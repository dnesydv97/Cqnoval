import {getAuthAxios} from '../ApiConfig';
import {contactEndPoints} from 'services';
import { referenceEndPoint } from '../ApiEndPoints';

export async function getAllSOW() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_SOW,
  });
}
export async function addSOW(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: contactEndPoints.ADD_SOW,
    data,
  });
}

export async function getSearchedSow(searchText = '') {
  const authAxios = await getAuthAxios();
  const params = {searchText};
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_SEARCH_SOW,
    params,
  });
}

export async function getAllSearchTags(tagName = '') {
  const authAxios = await getAuthAxios();
  const params = {tagName};
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_SEARCH_TAGS,
    params,
  });
}

export async function addSearchTag(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: contactEndPoints.ADD_SEARCH_TAG,
    data,
  });
}

export async function getAllCountries() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_COUNTRY,
  });
}
export async function getAllCitiesByCountryId(CountryId) {
  const authAxios = await getAuthAxios();
  const params = {CountryId};
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_CITY,
    params,
  });
}
export async function getAllContactLabelGroups() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_CONTACT_LABEL_GROUPS,
  });
}
export async function getAllContactLabels() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_CONTACT_LABELS,
  });
}
export async function getAllContactLabelLists(
  contactCompanyId = '',
  contactPersonId = '',
) {
  const data = {contactCompanyId, contactPersonId};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_CONTACT_LABEL_LIST,
    data,
  });
}
export async function getAllContactSources() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_ALL_CONTACT_SOURCE,
  });
}

export async function getFavOrSearchCompanyPerson(SearchKeyword, SkipCount) {
  const params = {SearchKeyword, SkipCount};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_FAV_SEARCH_COMPANY_PERSON,
    params,
  });
}

export async function getFavOrSearchPerson(SearchKeyword, SkipCount) {
  const params = {SearchKeyword, SkipCount};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_CONTACT_PERSONS,
    params,
  });
}

export async function getFavOrSearchCompany(SearchKeyword, SkipCount) {
  const params = {SearchKeyword, SkipCount};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: contactEndPoints.GET_CONTACT_COMPANIES,
    params,
  });
}

export async function updateContactCompany(data, contactCompanyId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${contactEndPoints.UPDATE_CONTACT_COMPANY}${contactCompanyId}`,
    data,
  });
}

export async function updateContactPerson(data, contactPersonId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'PUT',
    url: `${contactEndPoints.UPDATE_CONTACT_PERSON}${contactPersonId}`,
    data,
  });
}

export async function addRemoveContactPersonAsFav(contactPersonId) {
  const authAxios = await getAuthAxios();
  const data = {contactPersonId};
  return authAxios({
    method: 'POST',
    url: contactEndPoints.MAKE_FAV_CONTACT_PERSON,
    data,
  });
}

export async function addRemoveContactCompanyAsFav(contactCompanyId) {
  const authAxios = await getAuthAxios();
  const data = {contactCompanyId};
  return authAxios({
    method: 'POST',
    url: contactEndPoints.MAKE_FAV_CONTACT_COMPANY,
    data,
  });
}


export async function addRemoveReferenceTenderAsFav(tenderId) {
  const authAxios = await getAuthAxios();
  const data = {tenderId};
  return authAxios({
    method: 'POST',
    url: referenceEndPoint.MAKE_FAV_TENDER_REFERENCE,
    data,
  });
}

export async function addRemoveReferenceProjectAsFav(projectId) {
  const authAxios = await getAuthAxios();
  const data = {projectId};
  return authAxios({
    method: 'POST',
    url: referenceEndPoint.MAKE_FAV_PROJECT_REFERENCE,
    data,
  });
}

export async function addContactCompany(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: contactEndPoints.ADD_CONTACT_COMPANY,
    data,
  });
}

export async function quickAddContactCompany(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: contactEndPoints.QUICK_ADD_CONTACT_COMPANY,
    data,
  });
}

export async function addContactPerson(data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: contactEndPoints.ADD_CONTACT_PERSON,
    data,
  });
}

export async function getContactPersonDetail(contactPersonId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${contactEndPoints.GET_CONTACT_PERSON_DETAIL}${contactPersonId}`,
  });
}

export async function getContactCompanyDetail(contactCompanyId) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: `${contactEndPoints.GET_CONTACT_COMPANY_DETAIL}${contactCompanyId}`,
  });
}

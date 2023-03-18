import {getAuthAxios} from '../ApiConfig';
import {referenceEndPoint} from 'services';

export async function getAllProject() {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: referenceEndPoint.GET_ALL_PROJECT,
    });
}

export async function getAllTender() {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: referenceEndPoint.GET_TENDER_LIST,
    });
}

export async function getProjectDetail(projectId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_ALL_PROJECT_DETAIL}${projectId}`,
    });
}

export async function getTenderDetail(tenderBasicId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_TENDER_DETAIL}${tenderBasicId}`,
    });
}

export async function getTenderExtensiondetail(tenderExtId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_TENDER_EXTENSION}${tenderExtId}`,
    });
}

export async function getProjectSector(projectId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_PROJECT_SECTOR}${projectId}`,
    })
}

export async function getProjectFundingAgencies(projectId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_PROJECT_FUNDING_AGENCY}${projectId}`,
    })
}

export async function getProjectCurrency(projectId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_PROJECT_CURRENCY_LIST}${projectId}`,
    })
}

export async function getFavOrSearchProject(SearchKeyword, SkipCount) {
    const params = {SearchKeyword, SkipCount};
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: referenceEndPoint.GET_PROJECTS,
        params,
    });
}

export async function getProjectStatus(projectStatusId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_PROJECT_STATUS}${projectStatusId}`,
    });
}

export async function getProjectModality(modalityId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_PROJECT_MODALITY}${modalityId}`,
    });
}

export async function addProjectReference(data) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'POST',
        url: referenceEndPoint.ADD_PROJECT,
        data,
    });
} 

export async function updateProjectReference(data, projectId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'PUT',
        url: `${referenceEndPoint.UPDATE_PROJECT}${projectId}`,
        data,
    });
}

export async function getFavOrSearchTender(SearchKeyword, SkipCount) {
    const params = {SearchKeyword, SkipCount};
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: referenceEndPoint.GET_TENDER_LIST,
        params,
    });
}
export async function getFavOrSearchOther(SearchKeyword, SkipCount) {
    const params = {SearchKeyword, SkipCount};
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: referenceEndPoint.GET_OTHER_LIST,
        params,
    });
}

export async function updateTenderReference(data, tenderBasicId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'PUT',
        url: `${referenceEndPoint.UPDATE_TENDER}${tenderBasicId}`,
        data,
    });
}

export async function getTenderExtensionListing(data, tenderId) {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: `${referenceEndPoint.GET_TENDER_EXTENSION}${tenderId}`,
        data,
    });
}

export async function getAllSecondaryIncharge() {
    const authAxios = await getAuthAxios();
    return authAxios({
        method: 'GET',
        url: referenceEndPoint.GET_ALL_SECONDARY_INCHARGE,
    });
}
import {
    getAllProject,
    getProjectDetail,
    getProjectSector,
    getProjectFundingAgencies,
    getProjectCurrency,
    getProjectStatus,
    getProjectModality,
} from 'services';
import {showFailToast, onError} from 'utils';
import {INFO_BASE_URL} from '@env';
import _ from 'lodash';
import { getLabels } from 'scenes/contact/functions';

export function getDefaultTenderLabel(group, tenderBasicId) {
    return{
        defaultTenderLabelId: group.id,
        defaultTenderName: group.name,
        referenceCode: '',
        tenderStageId: '',
        tenderStageName: '',
        tenderTypeId: '',
        tenderTypeName: '',
        sectorName: '',
        sectorId: '',
        primaryInchargeName: '',
        primaryInchargeId: '',
        clientName: '',
        clientId: '',
        budget: '',
        budgetCurrencyId: '',
        budgetCurrencySymbol: '',
        budgetCurrency: '',
        department: '',
        note: '',
        officialInvitation: true,
        documentCostCurrencyId: '',
        documentCostCurrencySymbol: '',
        documentCost: '',
        bankGuranteeCurrencySymbol: '',
        bankGuranteeValueCurrencyId: '',
        bankGuranteeValue: '',
        publicationDate: '',
        submissionDate: '',
        openingDate: '',
        bidValidity: '',
        bankGuranteeValidity: '',
        clientReference: '',
        detailDescription: '',
        tenderBasicSecondaryInchargeDtos: {
            secondaryInchargeId: '',
            secondaryInchargeGroupName: '',
        }
    }
}

export function getProject (
    referenceCode,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    getAllProject(referenceCode)
        .then((response) => {
            console.log('Response of getAllProject from function.js', response);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    projects: response.data,
                });
        })
        .catch((error)=> {
            onError(error);
        });
}

export function getSectorForProject(
    projectSectorId, 
    projectId, 
    sectorId,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    // setLoading(true);
    getProjectSector(projectId)
        .then((response) => {
            console.log('Response of getProjectSector from function.js', response);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    sectors: response.data,
                });
        })
        .catch((error) => {
            onError(error);
        });
}

export function getFundingAgencyForProject(
    projectFundingAgencyId,
    projectId,
    fundingAgencyId,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    // setLoading(true);
    getProjectFundingAgencies(projectId)
        .then((response) => {
            console.log('Response of getProjectFundingAgencies from function.js', response);
            setLoading(false);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    fundingAgency: response.data,
                });
        })
        .catch((error) => {
            setLoading(false);
            onError(error);
        });
}

export function getCurrencyLabel(
    projectId,
    currencyId,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    // setLoading(true);
    getProjectCurrency(projectId)
        .then((response) => {
            console.log('Response of getCurrencyLabel from function.js', response);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    currencyLabel: response.data,
                });
        })
        .catch((error) => {
            onError(error);
        });
}

export function getStatus(
    projectStatusId,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    setLoading(true);
    getProjectStatus(projectStatusId)
        .then((response) => {
            console.log('Response of getProjectStatus from function.js', response);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    projectStatus: response.data,
                });
        })
        .catch((error) => {
            onError(error);
        });
}

export function getModality(
    modalityId,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    getProjectModality(modalityId)
        .then((response) => {
            console.log('Response of getProjectModality from function.js', response);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    projectModality: repsonse.data,
                });
        })
        .catch((error) => {
            onError(error);
        });
}

export function getProjectDetailByProjectId(
    referenceCode,
    setLoading,
    setPreloadedData,
    preloadedData,
) {
    getProjectDetail(referenceCode)
        .then((response) => {
            console.log('Response of Project Details from function.js', response);
            if(response.status === 200)
                setPreloadedData({
                    ...preloadedData,
                    projectDetails: response.data,
                });
        })
        .catch((error) => {
            onError(error);
        });
}

export function getFundingAgencyGroup(group, fundingAgencyId) {
    return {
        fundingAgencyLabelGroupId: group.id,
        fundingAgencyLabelGroupName: group.name,
        projectFundingAgencyId: fundingAgencyId,
        projectFundingAgencyName: fundingAgencyName,
    };
}

export function getSecondaryIncharge(group, tenderBasicId) {
    return {
        secodanryInchargeGroupId: group.id,
        secondaryInchargeGroupName: group.name,
        secondaryInchargeId: '',
        secondaryInchargeName: '',
        isMultipleValueAllowed: true,
    };
}

export function getSecondaryInchargeLabelGroup(group, tenderBasicId) {
    return{
        secondaryInchargeLabelGroupId: group.id,
        secondaryInchargeGroupLabelName: group.name,
        tenderBasicSecondaryInchargeDtos: [getDefaultTenderLabel(group, tenderBasicId)],
        isMultipleValueAllowed: group.isMultipleValueAllowed,
    };
}
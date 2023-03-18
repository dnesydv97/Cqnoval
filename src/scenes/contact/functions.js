import {
  getAllCitiesByCountryId,
  getAuthToken,
  uploadFile,
  uploadFiles,
} from 'services';
import {showFailToast, onError} from 'utils';
import {INFO_BASE_URL} from '@env';
import _, {keys} from 'lodash';

export const sendFileToServer = (
  uploaderGroupName,
  setLoading,
  dynamicFileLabelTypes,
  setProfile,
  onDocumentUploaded,
) => (file) => {
  setLoading(true);
  const fileLabelType = dynamicFileLabelTypes.find(
    (item) => item.name === uploaderGroupName,
  );
  uploadFile(fileLabelType.id, file)
    .then((response) => {
      setLoading(false);
      console.log('Uploaded file response ', response);
      if (response.status === 200) {
        uploaderGroupName === 'Profile' ||
        uploaderGroupName === 'ProfilePicture'
          ? setProfile(response.data[0])
          : onDocumentUploaded(uploaderGroupName, response.data[0]);
      } else {
        showFailToast('Something went wrong while uploading file');
      }
    })
    .catch((error) => {
      setLoading(false);
      showFailToast('Something went wrong while uploading file');
      onError(error);
    });
};

export const uploadFilesToServer = (files, setLoading, onUploadCompleted) => {
  setLoading(true);
  uploadFiles(files)
    .then((response) => {
      setLoading(false);
      console.log('Files Uploaded response ', response);
      if (response.status === 200) {
        onUploadCompleted(response.data);
      } else {
        showFailToast('Something went wrong while uploading file');
      }
    })
    .catch((error) => {
      setLoading(false);
      showFailToast('Something went wrong while uploading file');
      onError(error);
    });
};

export function getCitiesByCountryId(
  CountryId,
  setLoading,
  setPreloadedData,
  preloadedData,
) {
  // setLoading(true);
  getAllCitiesByCountryId(CountryId)
    .then((response) => {
      console.log('Response of cities ', response);
      setLoading(false);
      if (response.status === 200)
        setPreloadedData({
          ...preloadedData,
          cities: response.data,
        });
    })
    .catch((error) => {
      setLoading(false);
      onError(error);
    });
}

export function getLabels(contactLabelGroupId, preloadedData) {
  const labels = [];
  preloadedData.contactLabels.map((item) => {
    if (item.contactLabelGroupId === contactLabelGroupId)
      return labels.push({
        label: item.name,
        value: item.id,
      });
  });
  return labels;
}

export async function getFullFileUrl(tempUrl, setUrl) {
  const token = await getAuthToken();
  const url = `${INFO_BASE_URL}${tempUrl}${token}`;
  setUrl && setUrl(url);
  return url;
}

export function getLabelGroup(group, companyId) {
  return {
    contactLabelGroupId: group.id,
    contactLabelGroupName: group.name,
    contactComapnyPersonLabelDtos: [],
    // contactComapnyPersonLabelDtos: [getDefaultLabel(group, companyId)],
    isMultipleValuedAllowed: group.isMultipleValuedAllowed,
  };
}

export function getInitialUploaderGroup(
  dynamicFileLabelTypes = [],
  setLogo,
  setUploaderGroup,
) {
  const tempUploaderGroup = {};

  dynamicFileLabelTypes.map((uploaderGroup) => {
    tempUploaderGroup[uploaderGroup.name] = [
      getDefaultUploader(uploaderGroup.id),
    ];
  });

  setLogo &&
    setLogo(
      tempUploaderGroup['Profile']
        ? tempUploaderGroup['Profile'][0]
        : tempUploaderGroup['ProfilePicture'][0],
    );
  delete tempUploaderGroup.Profile;
  delete tempUploaderGroup.ProfilePicture;
  setUploaderGroup && setUploaderGroup(tempUploaderGroup);
}

export function getDefaultLabel(group, companyId) {
  return {
    contactLabelGroupId: group.id,
    contactLabelGroupName: group.name,
    contactLabelId: '',
    contactLabelName: '',
    contactLabelDataId: null,
    contactLabelDataValue: '',
    contactCompanyId: companyId,
    contactPersonId: '',
    isMultipleValuedAllowed: false,
  };
}
export function getAddressGroup(group, companyId) {
  return {
    contactLabelGroupId: group.id,
    contactLabelGroupName: group.name,
    addressId: '',
    contactCompanyId: companyId,
    contactPersonId: '',
    contactLabelId: '',
    countryId: '',
    cityId: '',
    streetName: '',
    poBox: '',
    stateProvince: '',
    postalCodeZip: '',
    isPrimaryAddress: false,
    isMultipleValuedAllowed: true,
  };
}

export function getDefaultUploader(fileLableTypeId) {
  return {
    viewFileURL: '',
    displayFileName: '',
    fileName: '',
    fileInformationId: '',
    fileLableTypeId: fileLableTypeId,
    isActive: true,
    uploadedFileDomainMappingDto: {
      domainId: '',
      isPublic: true,
    },
  };
}

export function handleDetailDocResponse(
  dynamicFileLabelTypes,
  uploadedFileDtos,
  setLogo,
  setUploaderGroup,
  frm = 'n/a',
) {
  let tempUploader = {};
  _.chain(uploadedFileDtos)
    .groupBy('fileLableTypeId')
    .map((value, key) => {
      let uploaderGroup = dynamicFileLabelTypes.find((item) => item.id === key);
      if (uploaderGroup)
        tempUploader[uploaderGroup.name] = [...value, getDefaultUploader(key)];
    })
    .value();
  // console.log('New document group from ', frm, tempUploader);
  setLogo &&
    Object.keys(tempUploader).length &&
    setLogo(
      tempUploader['Profile']
        ? tempUploader['Profile'][0]
          ? tempUploader['Profile'][0]
          : null
        : tempUploader['ProfilePicture']
        ? tempUploader['ProfilePicture'][0]
        : null,
    );
  delete tempUploader.Profile;
  delete tempUploader.ProfilePicture;

  if (setUploaderGroup)
    Object.keys(tempUploader).length
      ? setUploaderGroup(tempUploader)
      : getInitialUploaderGroup(dynamicFileLabelTypes, null, setUploaderGroup);
}

export function onDocumentUploaded(
  uploaderGroupName,
  responseObj,
  setUploaderGroup,
  uploaderGroup,
) {
  const tempArray = uploaderGroup[uploaderGroupName];
  tempArray.push(responseObj);
  setUploaderGroup({
    ...uploaderGroup,
    [uploaderGroupName]: tempArray,
  });
}

export const getFullAddress = (
  streetName,
  cityName,
  postalCode,
  provience,
  country,
) => {
  let fullAddress = '';
  if (streetName) fullAddress = `${streetName},\n`;
  if (cityName) fullAddress = `${fullAddress}${cityName},`;
  if (postalCode) fullAddress = `${fullAddress} ${postalCode},\n`;
  else fullAddress = `${fullAddress}\n`;
  if (provience) fullAddress = `${fullAddress}${provience},`;
  if (country) fullAddress = `${fullAddress} ${country}.`;

  return fullAddress;
};

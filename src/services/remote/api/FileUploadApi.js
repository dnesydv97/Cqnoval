import {
  getAuthAxios,
  multiPartConfig,
  getAuthMultipartAxios,
} from '../ApiConfig';
import {fileUploadEndPoints} from 'services';
import {createFileFormData, createFilesFormData} from 'utils';

export async function getAllFileLabelTypes() {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: fileUploadEndPoints.GET_FILE_LABEL_GROUP_LIST,
  });
}

export async function getDynamicFileLabelTypes(fileLabelTypeGroupName) {
  const params = {fileLabelTypeGroupName};
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'GET',
    url: fileUploadEndPoints.GET_DYNAMIC_FILE_LABEL_TYPE_UPLOADER_DETAIL,
    params,
  });
}

export async function uploadFile(fileLabelTypeId, file) {
  const authAxios = await getAuthMultipartAxios();
  const data = createFileFormData(file);
  return authAxios({
    method: 'POST',
    url: `${fileUploadEndPoints.UPLOAD_FILE}${fileLabelTypeId}`,
    data,
  });
}

export async function uploadFiles(files) {
  const authAxios = await getAuthMultipartAxios();
  const data = createFilesFormData(files);
  return authAxios({
    method: 'POST',
    url: fileUploadEndPoints.UPLOAD_FILE,
    data,
  });
}

export async function uploadUserDocs(employeeProfileId, data) {
  const authAxios = await getAuthAxios();
  return authAxios({
    method: 'POST',
    url: `${fileUploadEndPoints.UPLOAD_USER_DOC}/${employeeProfileId}`,
    data,
  });
}

import {isAndroid} from 'utils';

export const createFileFormData = (file) => {
  var data = new FormData();
  data.append('uploadedFiles', {
    // uri: isAndroid ? file.uri : file.uri.replace('file://', ''),
    uri: file.uri,
    name: file.type === 'application/pdf' ? file.name : file.fileName,
    type: file.type,
  });

  return data;
};

export const createFilesFormData = (files = []) => {
  var data = new FormData();
  {
    files.map((file, index) =>
      data.append(`uploadedFiles`, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      }),
    );
  }

  return data;
};

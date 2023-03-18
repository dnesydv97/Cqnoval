import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker/src/index';

import {isAndroid} from 'utils';

const requestCameraPermission = async () => {
  if (isAndroid) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else return true;
};

const requestExternalWritePermission = async () => {
  if (isAndroid) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      // console.warn(err);
      alert('Write permission err', err);
    }
    return false;
  } else return true;
};

export const captureImage = async (type) => {
  let options = {
    mediaType: type,
    maxWidth: 300,
    maxHeight: 550,
    quality: 1,
    videoQuality: 'low',
    durationLimit: 30, //Video max duration in seconds
    saveToPhotos: true,
  };
  let isCameraPermitted = await requestCameraPermission();
  let isStoragePermitted = await requestExternalWritePermission();
  if (isCameraPermitted && isStoragePermitted) {
    launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not granted');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      return response;
    });
  }
};

export const chooseImage = (type) => {
  let options = {
    mediaType: type,
    maxWidth: 300,
    maxHeight: 550,
    quality: 1,
  };

  return new Promise((resolve, reject) => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        reject('User cancelled camera picker');
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        reject('Camera not available on device');
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        reject('Permission not satisfied');
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        reject(response.errorMessage);
      }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      resolve(response);
    });
  });
};

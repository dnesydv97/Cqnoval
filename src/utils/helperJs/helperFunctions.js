import {navScreenNames} from 'constant';
import RNFetchBlob from 'rn-fetch-blob';
import {clearUserData} from 'services';
import {resetToGivenScreen} from './navigationHelper';
import {showSuccessToast} from './ToastHelper';

export const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

// const debounce = (func, wait) => {
//   let timeout;

//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };

//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// };

export function getFileTypes(fullFileName = '') {
  let fileType = 'None';
  if (fullFileName.includes('.pdf')) fileType = 'pdf';
  else if (
    fullFileName.includes('.jpg') ||
    fullFileName.includes('.jpeg') ||
    fullFileName.includes('.png')
  )
    fileType = 'image';
  else if (
    fullFileName.includes('.xls') ||
    fullFileName.includes('.xlsx') ||
    fullFileName.includes('.docx') ||
    fullFileName.includes('.txt') ||
    fullFileName.includes('.doc')
  )
    fileType = 'download';

  return fileType;
}

export function downloadFile(url) {
  const {config, fs} = RNFetchBlob;
  let DownloadDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
      notification: true,
      path:
        DownloadDir +
        '/me_' +
        Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
      description: 'Downloading file.',
    },
  };
  config(options)
    .fetch('GET', 'http://www.example.com/example.pdf')
    .then((res) => {
      showSuccessToast('File is succesfully downloaded.');
    });
}

export function logout(navigation) {
  if (navigation) {
    clearUserData();
    resetToGivenScreen(navigation, navScreenNames.NAV_LOGIN_SCREEN);
  }
}

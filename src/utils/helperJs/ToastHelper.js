import {Toast} from '@ant-design/react-native';

export const showSuccessToast = (message) =>
  Toast.success({
    content: message,
    duration: 1,
    stackable: true,
  });

export const showFailToast = (message) =>
  Toast.fail({
    content: message,
    duration: 0.5,
    stackable: true,
  });

export const showLoadingToast = (message) =>
  Toast.loading({
    content: message,
    duration: 1,
    stackable: true,
  });
export const showInfoToast = (message) =>
  Toast.info({
    content: message,
    duration: 1,
    stackable: false,
  });

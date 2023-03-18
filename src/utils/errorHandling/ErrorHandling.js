import {messages} from 'constant';
import {showFailToast} from 'utils/helperJs';

export const onError = (error) => {
  console.log('Error: ', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // showFailToast(error);
    console.log('Server Error: ', error.response);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    showFailToast(error.response.data.error.message);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the
    // browser and an instance of
    // http.ClientRequest in node.js
    console.log('Internal Error: ', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Unknown Error', error.message);
  }
};

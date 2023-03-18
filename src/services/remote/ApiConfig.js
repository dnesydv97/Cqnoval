import axios from 'axios';
import {IDENTITY_BASE_URL, INFO_BASE_URL} from '@env';
import {getAuthToken} from 'services/local/AsyncManager';

const getAuthAxios = async () =>
  axios.create({
    baseURL: INFO_BASE_URL,
    headers: await authConfig(normalConfig),
  });

const getAuthMultipartAxios = async () =>
  axios.create({
    baseURL: INFO_BASE_URL,
    headers: await authConfig(multiPartConfig),
  });

const getNormalAuthAxios = async () =>
  axios.create({
    baseURL: INFO_BASE_URL,
    headers: await authConfig(normalConfig),
  });

const TokenAxios = axios.create({
  baseURL: IDENTITY_BASE_URL,
  headers: normalConfig,
});

const Axios = axios.create({
  baseURL: INFO_BASE_URL,
  headers: normalConfig,
});

const urlEncodeConfig = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json',
};
const multiPartConfig = {
  'Content-Type': 'multipart/form-data',
  Accept: 'application/json',
};
const normalConfig = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const authConfig = async (config) => {
  const token = await getAuthToken();
  return {
    ...config,
    Authorization: 'Bearer ' + token,
  };
};

export {
  urlEncodeConfig,
  multiPartConfig,
  normalConfig,
  authConfig,
  getAuthAxios,
  getNormalAuthAxios,
  getAuthMultipartAxios,
  TokenAxios,
  Axios,
};

import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStoreKeys, defaultValues} from 'constant';

export const isMe = async (userId) => {
  const myId = await getUserId();
  return myId === userId;
};
export const checkIsAdmin = async (setData) => {
  const role = await getUserRole();
  setData(role === 'admin');
  return role === 'admin';
};

export const clearUserData = () => {
  setAuthToken(defaultValues.EMPTY);
  setRefreshToken(defaultValues.EMPTY);
  setAuthTokenExpiry(defaultValues.INTEGER);
};

export const getUserData = async () => {
  return {};
};

export const setFcmToken = (fcmToken) => {
  storeAsyncData(AsyncStoreKeys.FCM_TOKEN, fcmToken);
};
export const getFcmToken = () => {
  return getAsyncData(AsyncStoreKeys.FCM_TOKEN, defaultValues.EMPTY);
};

export const setAuthToken = (authToken) => {
  storeAsyncData(AsyncStoreKeys.AUTH_TOKEN, authToken);
};

export const getAuthToken = () => {
  return getAsyncData(AsyncStoreKeys.AUTH_TOKEN, defaultValues.EMPTY);
};

export const getAuthTokenExpiry = () => {
  return getAsyncData(AsyncStoreKeys.AUTH_TOKEN_EXPIRY, defaultValues.INTEGER);
};
export const setAuthTokenExpiry = (expiryMillis) => {
  storeAsyncData(AsyncStoreKeys.AUTH_TOKEN_EXPIRY, expiryMillis);
};
export const getRefreshToken = () => {
  return getAsyncData(AsyncStoreKeys.REFRESH_TOKEN, defaultValues.EMPTY);
};
export const setRefreshToken = (refreshToken) => {
  storeAsyncData(AsyncStoreKeys.REFRESH_TOKEN, refreshToken);
};

export const getUserId = () => {
  return getAsyncData(AsyncStoreKeys.USER_ID, defaultValues.EMPTY);
};
export const setUserId = (userId) => {
  storeAsyncData(AsyncStoreKeys.USER_ID, userId);
};

export const getUserRole = () => {
  return getAsyncData(AsyncStoreKeys.USER_ROLE, defaultValues.EMPTY);
};
export const setUserRole = (userRole) => {
  storeAsyncData(AsyncStoreKeys.USER_ROLE, userRole);
};

const storeAsyncData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (e) {
    console.log(`Async Storage Error: Failed to store value ${key}`);
    console.log(e);
  }
};

const getAsyncData = async (key, defaultValue = 'N/A') => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      defaultValue = value;
    }
    // //console.log(`Async Storage: There is no data in key ${key}`);
    // //console.log(`${key} = ${defaultValue}`)
    return defaultValue;
  } catch (e) {
    //console.log(`Async Storage Error: Failed to get data ${key}`);
    console.log(e);
  }
};

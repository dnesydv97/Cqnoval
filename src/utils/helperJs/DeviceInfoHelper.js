import {Platform} from "react-native";
import {
  getVersion,
  getBuildNumber,
  getUniqueId,
  getSystemVersion,
  getApiLevel,
} from "react-native-device-info";

export const AppVersion = getVersion();
export const AppBuildNo = getBuildNumber();
export const DeviceUniqueId = getUniqueId();
export const PlatformType = Platform.OS;

export const getAndroidVersion = async () => await getApiLevel();
export const SystemVersion = getSystemVersion();

export const getOSWiseVersion = () =>
  Platform.OS === "ios" ? AppBuildNo : AppVersion;

export const isAndroid = Platform.OS === "android";
export const isIos = Platform.OS === "ios";

export const deviceOs = Platform.OS;

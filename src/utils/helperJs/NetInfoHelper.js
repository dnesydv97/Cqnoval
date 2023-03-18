import NetInfo from "@react-native-community/netinfo";

export const isConnected = async () => {
  await NetInfo.fetch().then((state) => {
    //console.log*("Connection type", state.type);
    //console.log*("Is connected?", state.isConnected);
    return state.isConnected;
  });
};
export const isInternetAvailable = async () => {
  await NetInfo.fetch().then((state) => {
    //console.log*("Connection type", state.type);
    //console.log*("Is connected?", state.isConnected);
    return state.isInternetReachable;
  });
};

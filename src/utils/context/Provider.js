import React, {useState, useEffect} from 'react';
import RootContext from './RootContext';
import NetInfo from '@react-native-community/netinfo';

let initialState = {
  isLoggedIn: false,
  userData: {},
  fcmToken: '',
  isConnected: true,
  isInternetReachable: true,
};

const Provider = ({children}) => {
  const [rootState, setRootState] = useState(initialState);

  const logout = () => {
    setRootState(initialState);
  };

  const updateLoginInfo = () => {
    getLoggedInInfo();
  };

  const getLoggedInInfo = async () => {
    // setRootState({
    //   ...rootState,
    //   token: await getAccesstoken(),
    //   isLoggedIn: await isLoggedIn(),
    //   userData: await getUserData(),
    //   fcmToken: await getFcmToken(),
    // });
  };

  useEffect(() => {
    getLoggedInInfo();
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (
        !state.isConnected ||
        (state.isInternetReachable !== null && !state.isInternetReachable)
      ) {
        //Show No internet message here

        setRootState({
          ...rootState,
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <RootContext.Provider
      value={{
        rootState,
        logout,
        updateLoginInfo,
      }}>
      {children}
    </RootContext.Provider>
  );
};

export default Provider;

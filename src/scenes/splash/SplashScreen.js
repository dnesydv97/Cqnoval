import {useNavigation} from '@react-navigation/native';
import {Icons, Images} from 'assets';
import {navScreenNames} from 'constant';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  clearUserData,
  getAuthToken,
  getAuthTokenExpiry,
  getRefreshToken,
} from 'services';
import {resetToGivenScreen, isSecondsPassed} from 'utils';

const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const token = await getAuthToken();
    const expiry = await getAuthTokenExpiry();
    const refreshToken = await getRefreshToken();

    // console.log('Token and expiry ', token, expiry);

    resetToGivenScreen(
      navigation,
      token && !isSecondsPassed(expiry)
        ? navScreenNames.NAV_BOTTOM_TAB_ROUTE
        : navScreenNames.NAV_LOGIN_SCREEN,
    );
  };

  return (
    <View style={styles.container}>
      <Image source={Images.logo} style={styles.logoStyle} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    height: moderateVerticalScale(100),
    width: moderateScale(100),
  },
});

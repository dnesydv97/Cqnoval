import React, {useState} from 'react';
import {Image, StyleSheet, Text, BackHandler} from 'react-native';
import {Button} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';
import jwtDecode from 'jwt-decode';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SUB_HEADING_TEXT_STYLE,
  WINDOW_HEIGHT,
} from 'styles';
import {
  isAndroid,
  isLoginValid,
  navigateToGivenScreen,
  onError,
  showFailToast,
} from 'utils';
import {navScreenNames} from 'constant';
import {BaseContainer, TextField} from 'components';
import {showSuccessToast} from 'utils';
import {
  doLogin,
  setAuthToken,
  setAuthTokenExpiry,
  setRefreshToken,
  setUserId,
  setUserRole,
} from 'services';
import {Images} from 'assets';
import { View } from 'react-native';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({username: false, password: false});
  const [loginInfo, setLoginInfo] = useState({username: '', password: ''});
  const [tokenExp, setTokenExp] = useState(false);

  const onChangeText = (key) => (value) => {
    setLoginInfo({
      ...loginInfo,
      [key]: value,
    });
    setError({
      ...error,
      [key]: '',
    });
  };

  const navigation = useNavigation();

  const login = () => {
    const response = isLoginValid(loginInfo);
    if (response.valid) {
      setLoading(true);
      doLogin(loginInfo)
        .then((response) => {
          console.log('login response', response.data.access_token);
          setAuthToken(response.data.access_token);
          setAuthTokenExpiry(Date.now() + response.data.expires_in);
          setRefreshToken(response.data.refresh_token);
          const decodedValue = jwtDecode(response.data.access_token);
          decodedValue && setUserId(decodedValue.sub);
          console.log("Expiry Token", setAuthTokenExpiry());
          console.log("decoded data from token", response.data );
          decodedValue && setUserRole(decodedValue.role);
          setLoading(false);
          // showSuccessToast('Successfully Logged In.');
          navigateToGivenScreen(
            navigation,
            navScreenNames.NAV_BOTTOM_TAB_ROUTE,
          );
        })
        .catch((error) => {
          setLoading(false);
          onError(error);
          showFailToast('Invalid username or password');
        });
    } else setError(response.error);
  };

  const [visible, setVisible] = useState(true);

  const onForgotPassword = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccessToast(
        'Password Change request is sent to Admin. Please wait we will contact you shortly.',
      );
    }, 2000);
  };

  disableBackButton = () => {
    BackHandler.exitApp();
    return true;
  }

  return (
    <BaseContainer
      containerStyle={styles.container}
      loading={loading}
      toolbarTitle=""
      isDrawer
      // scrollable
      showToolbarLeftIcon={false}>
      <Image style={styles.logo} source={Images.logo} />
      <Text style={styles.cqText}>
        CQ
        <Text style={{color: AppColors.LOGO_TEXT_COLOR_TWO}}> Noval</Text>
      </Text>
      {/* <Text style={styles.signIn}></Text> */}
      <TextField
        containerStyle={styles.inputContainer}
        value={loginInfo.username}
        onChangeText={onChangeText('username')}
        placeholder="Username"
        error={error.username}
        editable
        inputTextContainerStyle={styles.inputTextStyle}
      />
      <TextField
        containerStyle={styles.inputContainer}
        value={loginInfo.password}
        onChangeText={onChangeText('password')}
        placeholder="Password"
        error={error.password}
        editable
        inputTextContainerStyle={styles.inputTextStyle}
        isSecuredText={visible}
        returnKeyType="next"
        returnKeyLabel="next"
        onSubmitEditing={login}
      />
      <Text onPress={() => setVisible(!visible)} style={styles.passwordToggle}>
        {visible ? 'Show Password' : 'Hide Password'}
      </Text>

      <Button type="primary" onPress={login} style={styles.button}>
        Log In
      </Button>
      {/* <Text style={styles.forgotPassword} onPress={onForgotPassword}>
        Forgot Password?
      </Text> */}
      <View style={{flex: 1, flexDirection: 'row',marginVertical: moderateScale(140), marginHorizontal: AppDimensions.LARGEST, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={styles.footerText}>
          Powered by
          {/* <Text style={{fontWeight: 'bold'}}> Infocom</Text> */}
        </Text>
        {console.log("Window Height", WINDOW_HEIGHT)}
        <Image
          source={Images.logoInfocom}
          style={styles.footerLogo}
          resizeMode="contain"
        />
      </View>
    </BaseContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.NORMAL_WHITE,
    paddingHorizontal: AppDimensions.LARGE,
  },
  logo: {
    height: moderateScale(90),
    width: moderateScale(90),
    alignSelf: 'center',
    top: 10,
    marginBottom: AppDimensions.NORMAL,

  },
  cqText: {
    ...SUB_HEADING_TEXT_STYLE,
    fontWeight: 'bold',
    color: AppColors.LOGO_TEXT_COLOR,
    textAlign: 'center',
    top: 10,
  },
  signIn: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginTop: AppDimensions.MODERATE,
    marginBottom: AppDimensions.NORMAL,
  },
  inputContainer: {
    top: moderateScale(WINDOW_HEIGHT/12),
    marginTop: AppDimensions.NORMAL,
  },
  inputTextStyle: {
    borderBottomWidth: 0.6,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderRadius: moderateScale(40),
  },
  passwordToggle: {
    top: moderateScale(WINDOW_HEIGHT/10),
    alignSelf: 'flex-end',
  },
  button: {
    borderRadius: AppDimensions.LARGE,
    marginTop: AppDimensions.LARGE,
    top: moderateScale(WINDOW_HEIGHT/9),
  },
  forgotPassword: {
    ...NORMAL_TEXT_STYLE,
    marginVertical: AppDimensions.NORMAL,
    alignSelf: 'center',
  },
  footerText: {
    marginTop: AppDimensions.LARGER,
    marginBottom: AppDimensions.NORMAL,
    fontSize: moderateScale(15),
    top: isAndroid? moderateScale(WINDOW_HEIGHT/6.5): moderateScale(WINDOW_HEIGHT/6.5),
    left: 15,
    color: 'black',
  },
  footerLogo: {
    height: moderateScale(40),
    width: moderateScale(150),
    alignSelf: 'center',
    right: 10,
    top: moderateScale(WINDOW_HEIGHT/6),
  },
});

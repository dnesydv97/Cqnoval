import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {Toolbar} from 'components';
import ProgressModal from './ProgressModal';
import WarningView from './WarningView';
import {useRootContext} from 'utils';
import {WarningTypes} from 'constant';
import {AppColors} from 'styles';
import {FloatingAction} from 'react-native-floating-action';
import {Icons} from 'assets';
import {HeaderStyleInterpolators} from '@react-navigation/stack';

const initialNoNetInfo = {
  visibility: false,
  message: 'You are offline',
  type: WarningTypes.FAILED,
};

const TabContainer = ({
  laoding,
  scrollable,
  fab = {
    visibility: false,
    fabColor: AppColors.BIN_RED,
    fabActions: [],
    onFabClick: null,
    onFabItemClick: null,
  },
  ...props
}) => {
  const {
    rootState: {isConnected, isInternetReachable},
  } = useRootContext();

  const [noNetworkInfo, setNoNetworkInfo] = useState(initialNoNetInfo);
  useEffect(() => {
    if (isConnected && isInternetReachable)
      setNoNetworkInfo({
        ...noNetworkInfo,
        visibility: true,
        message: 'You are Online :)',
        type: WarningTypes.SUCCESS,
      });
    else setNoNetworkInfo(initialNoNetInfo);
  }, [isConnected, isInternetReachable]);

  return (
    <View style={style.container}>
      {scrollable ? (
        <KeyboardAwareScrollView
          style={{...style.body, ...props.containerStyle}}>
          {props.children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={{...style.body, ...props.containerStyle}}>
          {props.children}
        </View>
      )}

      {fab.visibility && (
        <FloatingAction
          color={fab.fabColor}
          actions={fab.fabActions}
          onPressMain={fab.onFabClick && fab.onFabClick}
          onPressItem={fab.onFabItemClick && fab.onFabItemClick}
        />
      )}

      <WarningView
        message={noNetworkInfo.message}
        showWarning={noNetworkInfo.visibility}
        type={noNetworkInfo.type}
      />
    </View>
  );
};

TabContainer.propTypes = {
  loading: PropTypes.bool,
  scrollable: PropTypes.bool,
};

export default TabContainer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: moderateScale(610),
    backgroundColor: AppColors.NORMAL_WHITE,
  },
  body: {
    flex: 1,
    height: '100%',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateVerticalScale(8),
  },
});

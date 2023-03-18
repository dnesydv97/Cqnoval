import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import {Toolbar} from 'components';
import ProgressModal from './ProgressModal';
import WarningView from './WarningView';
import {useRootContext} from 'utils';
import {WarningTypes} from 'constant';
import {AppColors, AppDimensions} from 'styles';
import {FloatingAction} from 'react-native-floating-action';

const initialNoNetInfo = {
  visibility: false,
  message: 'You are offline.',
  type: WarningTypes.FAILED,
};

const BaseContainer = ({
  loading,
  toolbarTitle = 'CQ Noval',
  showToolbarLeftIcon,
  showToolbarRightIcon,
  isDrawer,
  toolbarRightIcon,
  scrollable,
  fab = {
    visibility: false,
    fabColor: AppColors.BTN_RED,
    fabActions: [],
    onFabClick: null,
    onFabItemClick: null,
    fabRef: null,
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
    <View style={styles.container}>
      <Toolbar
        showLeftIcon={showToolbarLeftIcon}
        showRightIcon={showToolbarRightIcon}
        RightView={toolbarRightIcon}
        isDrawer={isDrawer}
        title={toolbarTitle}
      />

      {scrollable ? (
        <KeyboardAwareScrollView
          style={{...styles.body, ...props.containerStyle}}>
          {props.children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={{...styles.body, ...props.containerStyle}}>
          {props.children}
        </View>
      )}

      {fab.visibility && (
        <FloatingAction
          color={fab.fabColor}
          actions={fab.fabActions}
          onPressMain={fab.onFabClick && fab.onFabClick}
          onPressItem={fab.onFabItemClick && fab.onFabItemClick}
          ref={fab.fabRef && fab.fabRef}
        />
      )}

      <ProgressModal loading={loading} />
      <WarningView
        message={noNetworkInfo.message}
        showWarning={noNetworkInfo.visibility}
        type={noNetworkInfo.type}
      />
    </View>
  );
};

BaseContainer.propTypes = {
  loading: PropTypes.bool,
  toolbarTitle: PropTypes.string,
  showToolbarLeftIcon: PropTypes.bool,
  showToolbarRightIcon: PropTypes.bool,
  isDrawer: PropTypes.bool,
  toolbarRightIcon: PropTypes.func,
  scrollable: PropTypes.bool,
};

export default BaseContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  body: {
    flex: 1,
    paddingHorizontal: AppDimensions.SMALL,
    paddingBottom: AppDimensions.SMALL,
    paddingTop: AppDimensions.SMALLER,
  },
});

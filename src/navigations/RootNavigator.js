import React from 'react';
import {View, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppColors} from 'styles';
import StackRoute from './StackRoute';
import {RootProvider} from 'utils';

const RootNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right,
      }}>
      <View style={{backgroundColor: 'white', height: insets.top}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
      </View>
      <RootProvider>
        <StackRoute />
      </RootProvider>
    </View>
  );
};

export default RootNavigator;

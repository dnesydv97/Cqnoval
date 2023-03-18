import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppDimensions} from 'styles';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const BaseCard = ({children, containerStyle = {}, scrollable, ...props}) => {
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {children}
      {scrollable ? (
        <KeyboardAwareScrollView
          style={{...styles.body, ...props.containerStyle}}
          getScrollResponder>
          {props.children}
        </KeyboardAwareScrollView>
      ) : (
        <View style={{...styles.body, ...props.containerStyle}}>
          {props.children}
        </View>
      )}
    </View>
  );
};

BaseCard.prototypes = {
  scrollable: PropTypes.bool,
};

export default BaseCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.NORMAL,
    backgroundColor: 'white',
    borderRadius: AppDimensions.NORMAL,
    //elevation: AppDimensions.NORMAL,
    // shadowOpacity: 0.1,
    // shadowOffset: {height: 0, width: 0},
  },
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppDimensions} from 'styles';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const InnerCard = ({
    children, 
    containerStyle = {}, 
    scrollable,
    ...props
  }) => {
    return (
      <View style={{...styles.container, ...containerStyle}}>{children}
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

InnerCard.prototypes = {
    scrollable: PropTypes.bool,
};

export default InnerCard;

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: AppDimensions.LARGE,
      paddingVertical: AppDimensions.NORMAL,
      backgroundColor: '#FAFAFA',
      borderRadius: AppDimensions.NORMAL,
    },
  });
  
import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  WINDOW_HEIGHT,
} from 'styles';
import {useState} from 'react';
import {useEffect} from 'react';

const BaseModal = ({
  children,
  visibility,
  onDismiss,
  containerStyle = {},
  bodyStyle = {},
  modalStyle = {},
  collapsable,
  title = 'CQ Noval',
  hasCrossIcon = true,
  hasDropDownIcon = true,
  hasTitle = true,
  hideOnEmptyAreaClicked = false,
  animationType = 'slide',
  entryAnimation = null,
  exitAnimation = null,
  animationInitialValue = 0,
  verticleAnimation = true,
}) => {
  const value = useState(new Animated.Value(animationInitialValue))[0];
  
  useEffect(() => {
    entryAnimation && entryAnimation(value).start();
  }, []);

  return (
    <Modal
      transparent
      onDismiss={onDismiss}
      visible={visibility}
      collapsable={collapsable}
      animationType={animationType}
      style={styles.modal}>
      <SafeAreaView style={styles.modal}>
        <TouchableOpacity
          activeOpacity={1}
          style={{...styles.modal, ...modalStyle}}
          onPress={
            hideOnEmptyAreaClicked
              ? () => {
                  exitAnimation && exitAnimation(value).start();
                  setTimeout(() => {
                    onDismiss();
                  }, 200);
                }
              : null
          }>
          <Animated.View
            style={{
              ...styles.container,
              ...containerStyle,
              transform: [
                verticleAnimation ? {translateY: value} : {translateX: value},
              ],
            }}>
            <View style={styles.titleContainer}>
              {hasCrossIcon && (
                <IconOutline
                  name="close"
                  size={30}
                  color={AppColors.ERROR_RED}
                  style={styles.icon}
                  onPress={() => {
                    entryAnimation && exitAnimation(value).start();
                    setTimeout(() => {
                      onDismiss();
                    }, 200);
                  }}
                />
              )}
              {hasDropDownIcon && (
                <IconOutline
                  name="down"
                  size={30}
                  color={AppColors.NORMAL_BLACK}
                  style={styles.title}
                  onPress={onDismiss}
                />
              )}
              {hasTitle && <Text style={styles.title}>{title}</Text>}
            </View>
            <View style={{...styles.body, ...bodyStyle}}>{children}</View>
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default BaseModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    width: '100%',
    backgroundColor: AppColors.NORMAL_WHITE,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppDimensions.SMALL,
    backgroundColor: 'white',
  },
  title: {
    ...HEADING_TEXT_SIZE,
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    paddingEnd: 30,
  },
  icon: {
    width: moderateScale(30),
    width: moderateVerticalScale(30),
  },
  body: {
    padding: AppDimensions.SMALL,
  },
});

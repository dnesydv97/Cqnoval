import {IconOutline} from '@ant-design/icons-react-native';
import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {AppColors, AppDimensions, HEADING_TEXT_SIZE} from 'styles';

const PlainBaseModal = ({
  children,
  visibility,
  onDismiss,
  containerStyle = {},
  bodyStyle = {},
  collapsable,
}) => {
  return (
    <Modal
      transparent
      onDismiss={onDismiss}
      visible={visibility}
      collapsable={collapsable}
      onRequestClose={onDismiss}
      animationType="fade"
      style={styles.modal}>
      <SafeAreaView style={styles.modal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => collapsable && onDismiss()}
          style={{...styles.container, ...containerStyle}}>
          <View style={{...styles.body, ...bodyStyle}}>{children}</View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default PlainBaseModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.SEMI_TRANSPARENT,
  },
  body: {
    padding: AppDimensions.SMALL,
  },
});

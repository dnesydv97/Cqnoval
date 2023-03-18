import React from 'react';
import {StyleSheet, View} from 'react-native';
import {DocumentPickerItem, CircularIconButton} from 'components';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import {isAndroid} from 'utils';

const MoreDocumnetPicker = ({
  editable,
  onItemSelected,
  onMinusPressed,
  uri,
  name,
  isLastItem,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.docContainer}>
        {editable && (
          <CircularIconButton
            icon={isLastItem ? 'plus' : 'minus'}
            iconSize={15}
            containerStyle={styles.minusIcon}
            onPress={!isLastItem ? onMinusPressed : null}
            activeOpacity={isLastItem ? 1 : 0}
          />
        )}
        <DocumentPickerItem
          onItemSelected={onItemSelected}
          uri={uri}
          name={name}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default MoreDocumnetPicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: isAndroid ? AppDimensions.NORMAL : AppDimensions.SMALL,
  },
  docContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minusIcon: {
    borderWidth: 0.5,
    borderColor: AppColors.TAG_GREEN,
    height: moderateScale(20),
    width: moderateScale(20),
  },
});

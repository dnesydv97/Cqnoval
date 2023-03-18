import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';

const Tag = ({text, onDelete, editable}) => {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{text}</Text>
      {editable && (
        <IconOutline
          name="close"
          size={15}
          color={AppColors.PRIMARY_DARK}
          onPress={onDelete}
        />
      )}
    </View>
  );
};

export default Tag;

const styles = StyleSheet.create({
  tag: {
    backgroundColor: AppColors.ITEM_BG,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.NORMAL,
    margin: AppDimensions.SMALL,
    borderRadius: AppDimensions.LARGE,
  },
  text: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_DARK,
    marginHorizontal: AppDimensions.NORMAL,
    paddingEnd: AppDimensions.SMALL,
  },
});

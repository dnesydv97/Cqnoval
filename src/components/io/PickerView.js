import React, {useState, useEffect} from 'react';
import {Icons} from 'assets';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {PlainBaseModal, EmptyView} from 'components';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
} from 'styles';
import {BaseCard} from 'components/base';
import {isNull} from 'lodash';
import {isIos} from 'utils';

const PickerView = ({
  label = '',
  placeholder = {label: 'Select'},
  editable,
  error = '',
  value = '',
  onValueChange,
  containerStyle = {},
  pickerContainer = {},
  pickerStyle = {},
  labelStyle = {},
  bodyStyle={},
  errorTextStyle = {},
  items = [],
}) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  useEffect(() => {
    findSelectedValue();
  }, [items, value]);

  useEffect(() => {
    items.length && onValueChange && onValueChange(items[0].value);
  }, []);

  function findSelectedValue() {
    const foundItem = items.find((item) => item.value === value);
    setSelectedItem(foundItem);
  }

  return (
    <View style={{...styles.container, ...containerStyle}}>
      {label !== '' && (
        <Text
          style={{
            ...styles.labelText,
            ...labelStyle,
          }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => editable && setShowPopUp(true)}
        activeOpacity={1}
        style={{
          ...styles.inputContainer,
          ...pickerContainer,
          borderColor: editable ? 'black' : 'grey',
          borderBottomWidth: editable ? 0 : 0,
        }}>
        <Text style={{...styles.valueText, ...pickerStyle}}>
          {(selectedItem && selectedItem.label) || placeholder.label}
        </Text>
        <Image
          source={editable ? Icons.upDownArrowIcon : isNull}
          style={styles.iconStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {error !== '' && (
        <Text style={{...styles.errorText, ...errorTextStyle}}>
          {error}
        </Text>
      )}
      {showPopUp && (
        <PlainBaseModal
          visibility={showPopUp}
          collapsable
          onDismiss={() => {
            setShowPopUp(false);
          }}
          bodyStyle={styles.dropDownModalBody}>
          <BaseCard containerStyle={styles.dowpDownContainer} scrollable>
            <Text style={styles.dropDownTitle}>{placeholder.label}</Text>
            <FlatList
              data={items}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.dropDownItemContainer}
                  onPress={() => {
                    onValueChange(item.value);
                    setShowPopUp(false);
                  }}>
                  <Text style={styles.dropDownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <EmptyView message="No Item To Select" />
              )}
            />
          </BaseCard>
        </PlainBaseModal>
      )}
    </View>
  );
};

export default PickerView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: AppDimensions.MODERATE,
  },
  dropDownModalBody: {
    height: '33%',
    width: moderateScale(300),
  },
  dowpDownContainer: {
    borderRadius: AppDimensions.MODERATE,
    height: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dropDownTitle: {
    ...HEADING_TEXT_SIZE,
    paddingVertical: isIos ? AppDimensions.NORMAL : AppDimensions.MODERATE,
    textAlign: 'center',
    margin: AppDimensions.NORMAL,
    color: AppColors.PRIMARY_DARK,
    backgroundColor: AppColors.NORMAL_WHITE,
    borderBottomWidth: 0.7,
  },
  dropDownItemContainer: {
    padding: AppDimensions.NORMAL,
    width: '90%',
    alignSelf: 'center',
    marginBottom: AppDimensions.SMALL,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.NORMAL_WHITE,
  },
  dropDownItemText: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: isIos ? AppDimensions.SMALL : 0,
    textAlign: 'center',
  },
  labelText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.DISABLE,
  },
  valueText: {
    flex: 1,
    ...NORMAL_TEXT_STYLE,
    paddingHorizontal: isIos ? AppDimensions.NORMAL : 0,
  },
  errorText: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.ERROR_RED,
  },
  inputContainer: {
    paddingHorizontal: AppDimensions.SMALLER,
    borderColor: AppColors.DISABLE,
    borderRadius: AppDimensions.SMALL,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.NORMAL,
  },
  iconStyle: {
    height: '100%',
    width: moderateScale(20),
    padding: AppDimensions.NORMAL,
    overflow: 'hidden',
  },
});

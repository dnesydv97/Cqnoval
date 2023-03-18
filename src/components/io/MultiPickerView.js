import React, {useState, useEffect} from 'react';
import {Icons} from 'assets';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PlainBaseModal, EmptyView} from 'components';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {BaseCard} from 'components/base';
import _ from 'lodash';
import {ScrollView} from 'react-native-gesture-handler';
import {IconOutline} from '@ant-design/icons-react-native';
import Tag from './Tag';

const MultiPickerView = ({
  label = '',
  placeholder = 'Select Multiple',
  editable,
  values = [],
  onValueChange,
  containerStyle = {},
  pickerContainer = {},
  pickerStyle = {},
  labelStyle = {},
  sectionItems = [],
  sectionBy = 'section',
  displayKey = 'name',
  idKey = 'id',
}) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [renderItems, setRenderItems] = useState({
    groupedItems: null,
    ungroupedList: [],
  });

  useEffect(() => {
    console.log('Section items ', sectionItems);
    const newList = [];
    sectionItems.map((item) => {
      values.map((value) => {
        if (value[idKey] === item[idKey]) {
          item.isSelected = true;
        }
      });
      newList.push(item);
    });

    setRenderItems({
      ...renderItems,
      groupedItems: _.groupBy(sectionItems, sectionBy),
      ungroupedList: sectionItems,
    });
  }, [sectionItems]);

  function onItemSelected(clickedItem) {
    const newList = renderItems.ungroupedList.map((item) => {
      if (clickedItem[idKey] === item[idKey])
        item.isSelected = !item.isSelected;
      return item;
    });
    setRenderItems({
      ...renderItems,
      ungroupedList: newList,
      groupedItems: _.groupBy(newList, sectionBy),
    });
    onValueChange(renderItems.ungroupedList.filter((item) => item.isSelected));
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
          borderBottomWidth: 0,
          ...pickerContainer,
          borderColor: editable ? 'black' : 'grey',
          borderWidth: 0,
        }}>
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
            ...pickerStyle,
          }}>
          {renderItems.ungroupedList.filter((item) => item.isSelected).length ==
          0 ? (
            <Text
              style={{
                ...NORMAL_TEXT_STYLE,
                paddingVertical: AppDimensions.SMALL,
                paddingHorizontal: AppDimensions.SMALL,
              }}>
              Select Filters
            </Text>
          ) : (
            renderItems.ungroupedList.map(
              (selectedItem) =>
                selectedItem.isSelected && (
                  <Tag
                    key={selectedItem[idKey]}
                    text={selectedItem[displayKey]}
                    onDelete={() => onItemSelected(selectedItem)}
                  />
                ),
            )
          )}
        </View>

        <Image
          source={Icons.upDownArrowIcon}
          style={styles.iconStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {showPopUp && (
        <PlainBaseModal
          visibility={showPopUp}
          collapsable
          onDismiss={() => {
            setShowPopUp(false);
          }}
          bodyStyle={styles.dropDownModalBody}>
          <BaseCard containerStyle={styles.dowpDownContainer}>
            <Text style={styles.dropDownTitle}>{placeholder}</Text>
            <ScrollView>
              {Object.keys(renderItems.groupedItems).map((key) => {
                return (
                  <View
                    key={String(Math.random())}
                    style={styles.sectionContainer}>
                    {renderItems.groupedItems[key].map((item) => (
                      <TouchableOpacity
                        key={item[idKey]}
                        style={styles.dropDownItemContainer}
                        activeOpacity={1}
                        onPress={() => {
                          onItemSelected(item);
                        }}>
                        <Text
                          style={{
                            ...styles.dropDownItemText,
                            color: item.isSelected
                              ? AppColors.PRIMARY_DARK
                              : AppColors.PRIMARY_TEXT,
                          }}>
                          {item[displayKey]}
                        </Text>
                        {item.isSelected && (
                          <IconOutline
                            name="check"
                            color={AppColors.PRIMARY_DARK}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          </BaseCard>
        </PlainBaseModal>
      )}
    </View>
  );
};

export default MultiPickerView;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: AppDimensions.NORMAL,
    marginVertical: AppDimensions.NORMAL,
  },
  dropDownModalBody: {
    height: moderateVerticalScale(300),
    width: moderateScale(300),
  },
  dowpDownContainer: {
    borderRadius: AppDimensions.SMALL,
    height: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dropDownTitle: {
    ...HEADING_TEXT_SIZE,
    paddingVertical: AppDimensions.NORMAL,
    textAlign: 'center',
    color: AppColors.PRIMARY_DARK,
    backgroundColor: AppColors.ITEM_BG,
  },
  sectionContainer: {
    borderBottomWidth: 1,
    marginHorizontal: AppDimensions.NORMAL,
    borderColor: AppColors.DISABLE,
  },
  dropDownItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppDimensions.SMALL,
    marginBottom: AppDimensions.SMALL,
    // backgroundColor: AppColors.LIST_ITEM_BG,
  },
  dropDownItemText: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.SMALLER,
  },
  labelText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.DISABLE,
    // paddingVertical: AppDimensions.SMALLER,
  },
  tag: {
    backgroundColor: AppColors.ITEM_BG,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppDimensions.SMALL,
    margin: AppDimensions.SMALLER,
    borderRadius: AppDimensions.LARGE,
  },
  valueText: {
    ...SMALL_TEXT_STYLE,
    paddingVertical: AppDimensions.SMALL,
    paddingHorizontal: AppDimensions.NORMAL,
  },

  inputContainer: {
    paddingHorizontal: AppDimensions.SMALLER,
    borderColor: AppColors.DISABLE,
    borderRadius: AppDimensions.SMALL,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.NORMAL,
    // height: moderateVerticalScale(35),
  },
  iconStyle: {
    height: '100%',
    width: moderateScale(20),
    padding: AppDimensions.NORMAL,
    backgroundColor: AppColors.NORMAL_WHITE,
  },
});

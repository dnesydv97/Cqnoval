import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  CircularIconButton,
  EqualSpaceHorizontalView,
  PickerView,
  TextField,
  AddMoreButton,
  TouchableOpacity,
} from 'components';
import {AppColors, AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import {moderateScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import {Checkbox} from '@ant-design/react-native';
import VerticleSeparator from 'scenes/contact/company/VerticleSeparator';

const AddressItem = ({
  editable,
  labels = [],
  countryList = [],
  cities = [],
  countryValue = '',
  stateValue = '',
  postalValue = '',
  cityValue = '',
  streetValue = '',
  labelValue = '',
  fullAddress = '',
  labelInputContainer = {
    flex: 1,
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
  },
  onLabelChanged,
  onCountryChanged,
  onCityChanged,
  onStreetChanged,
  onStateChanged,
  onPostalChanged,
  onChecked,
  checked,
  hasAddMore,
  onAdd,
  onRemove,
  itemIndex = -1,
  isLastItem = false,
}) => {
  return (
    <View>
      {editable ? (
        <EqualSpaceHorizontalView containerStyle={styles.editContainer}>
          <View style={styles.labelContainer}>
            <CircularIconButton
              icon="minus"
              iconSize={15}
              containerStyle={styles.roundButton}
              onPress={() => onRemove(itemIndex)}
            />
            <PickerView
              onValueChange={onLabelChanged}
              editable={editable}
              pickerStyle={styles.pickerStyle}
              items={labels}
              value={labelValue}
              containerStyle={labelInputContainer}
              labelStyle={{
                color: AppColors.PRIMARY_TEXT,
                fontWeight: 'bold',
              }}
            />
          </View>
          <VerticleSeparator style={{height: moderateScale(200)}} />

          <View style={styles.inputFieldsHolder}>
            <PickerView
              onValueChange={onCountryChanged}
              editable={editable}
              containerStyle={styles.pickerContainer}
              pickerStyle={{width: '70%', marginLeft: AppDimensions.SMALL}}
              placeholder={{label: 'Country'}}
              items={countryList}
              value={countryValue}
            />
            <PickerView
              onValueChange={onCityChanged}
              editable={editable}
              containerStyle={styles.pickerContainer}
              items={cities}
              pickerStyle={{marginLeft: AppDimensions.SMALL}}
              value={cityValue}
              placeholder={{label: 'City'}}
            />

            <TextField
              placeholder="Postal/Zip"
              value={postalValue}
              onChangeText={onPostalChanged}
              editable={editable}
              containerStyle={styles.textInput}
            />

            <TextField
              placeholder="State/Province"
              value={stateValue}
              onChangeText={onStateChanged}
              editable={editable}
              containerStyle={styles.textInput}
            />

            <TextField
              placeholder="Street"
              value={streetValue}
              onChangeText={onStreetChanged}
              editable={editable}
              containerStyle={styles.textInput}
            />

            {editable && (
              <View style={{left: -16}}>
                <Checkbox.AgreeItem
                  disabled={!editable}
                  checked={checked}
                  style={{
                    color: AppColors.ACCENT,
                    margin: AppDimensions.NORMAL,
                  }}
                  onChange={onChecked}>
                  Primary Address
                </Checkbox.AgreeItem>
              </View>
            )}
          </View>
        </EqualSpaceHorizontalView>
      ) : (
        <View
          style={{
            ...styles.viewContainer,
            borderBottomWidth: isLastItem ? 0 : 1,
          }}>
          <PickerView
            onValueChange={onLabelChanged}
            pickerStyle={styles.pickerStyle}
            items={labels}
            value={labelValue}
            containerStyle={labelInputContainer}
          />
          <Text style={styles.viewText}>{fullAddress}</Text>
        </View>
      )}
    </View>
  );
};

AddressItem.protoType = {
  editable: PropTypes.bool,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  countryList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  labelValue: PropTypes.string,
  countryValue: PropTypes.string,
  stateValue: PropTypes.string,
  postalValue: PropTypes.string,
  cityValue: PropTypes.string,
  streetValue: PropTypes.string,
  labelInputContainer: PropTypes.object,
  onLabelChanged: PropTypes.func.isRequired,
  onCountryChanged: PropTypes.func.isRequired,
  onCityChanged: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onPostalChanged: PropTypes.func.isRequired,
  onStreetChanged: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  itemIndex: PropTypes.number.isRequired,
};

export default AddressItem;

const styles = StyleSheet.create({
  editContainer: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  labelContainer: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  inputFieldsHolder: {
    width: '60%',
  },
  textInput: {
    marginStart: AppDimensions.NORMAL,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerContainer: {
    height: '90%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    // marginTop: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.MODERATE,
  },
  pickerStyle: {
    color: AppColors.PRIMARY_TEXT,
    fontWeight: 'bold',
  },
  roundButton: {
    borderWidth: 0.5,
    borderColor: AppColors.TAG_GREEN,
    height: moderateScale(20),
    width: moderateScale(20),
  },
  viewContainer: {
    borderColor: AppColors.LIGHT_GRAY,
    paddingBottom: AppDimensions.SMALL,
    marginBottom: AppDimensions.NORMAL,
  },
  viewText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.ACCENT,
    paddingHorizontal: AppDimensions.NORMAL,
  },
});

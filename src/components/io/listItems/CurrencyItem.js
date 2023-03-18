import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
    CircularIconButton,
    PickerView,
    TextField,
    AddMoreButton,
} from 'components';
import {AppColors, AppDimensions} from 'styles';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import PropTypes from 'prop-types';

const CurrencyItem = ({
    editable,
    labels = [],
    labelValue = '',
    valuePlaceholder = '',
    value = '',
    labelInputContainer = {},
    valueInputContainer = {},
    onLabelChanged,
    onValueChanged,
    onAdd,
    style={},
    onRemove,
    itemIndex = -1,
    hasAddMore = false, 
}) => {
    return (
        <View>
            <View>
                <PickerView
                    onValueChange={onLabelChanged}
                    editable
                    items={labels}
                    value={labelValue}
                    containerStyle={{}}
                    pickerStyle={{}}
                />
                <TextField
                    placeholder={valuePlaceholder}
                    value={value}
                    containerStyle={valueInputContainer}
                    onChangeText={onValueChanged}
                    editable
                />
            </View>
        </View>
    );
};

CurrencyItem.protoType = {
    editable: PropTypes.bool,
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
    ),
    labelValue: PropTypes.string,
    value: PropTypes.string,
    onValueChange: PropTypes.func.isRequired,
    style: PropTypes.string,
};

export default CurrencyItem;

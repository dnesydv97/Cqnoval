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
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import {
    AppColors,
    AppDimensions,
    HEADING_TEXT_SIZE,
    NORMAL_TEXT_STYLE,
    SMALLER_TEXT_STYLE,
} from 'styles';
import { BaseCard } from 'components';
import { isNull } from 'lodash';
import { isIos } from 'utils';

const FromEmailPickerView =({
    label = '',
    placeholder = {label: 'Select an email address'},
    editable,
    error = '',
    value = '',
    onUsersChanged,
    containerStyle = {},
    pickerContainer = {},
    pickerStyle = {},
    labelStyle = {},
    bodyStyle = {},
    errorTextStyle = {},
    users = [], //instead of item we are using users over here
    selectedUsers = [],
}) => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState();

    useEffect(() => {
        findSelectedValue();
    }, [users, value]);

    function findSelectedValue() {
        const foundItem = users.find((user) => user.value === value);
        setSelectedItem(foundItem);
    }

    return (
        <View>
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
                }}
            >
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
                    <BaseCard containerStyle={styles.dropDownContainer} scrollable>
                        <Text style ={styles.dropDownTitle}>
                            {placeholder.label}
                        </Text>
                        <FlatList
                            data={users}
                            keyExtractor={(user, index) => String(index)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({user, index}) => (
                                <TouchableOpacity
                                    style={styles.dropDownItemContainer}
                                    onPress={() => {
                                        onUsersChanged(user.value);
                                        setShowPopUp(false);
                                    }}>
                                    <Text style={styles.dropDownItemText}>{user.label}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <EmptyView message="No Item To Select"/>
                            )}
                        />
                    </BaseCard>
                </PlainBaseModal>
            )}
        </View>
    );
};

export default FromEmailPickerView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: AppDimensions.MODERATE,
    },
    dropDownModalBody: {
        height: '33%',
        width: moderateScale(300),
    },
    dropDownContainer: {
        borderRadius: AppDimensions.MODERATE,
        height: '100%',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    dropDownTitle: {
        ...HEADING_TEXT_SIZE,
        paddingVertical: isIos ? AppDimensions.NORMAL: AppDimensions.MODERATE,
        textAlign: 'center',
        margin: AppDimensions.NORMAL,
        color: AppColors.PRIMARY_DARK,
        backgroundColor: AppColors.NORMAL_WHITE,
        borderWidth: 0.7,
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
        paddingVertical: isIos? AppDimensions.SMALL : 0,
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
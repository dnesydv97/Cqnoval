import {useNavigation} from '@react-navigation/native';
import {Icons} from 'assets';
import {BaseCard, BaseContainer, InnerCard} from 'components';
import {messages, navScreenNames} from 'constant';
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
    AppColors,
    AppDimensions,
    HEADING_TEXT_SIZE,
    NORMAL_TEXT_SIZE,
    SMALL_TEXT_STYLE
} from 'styles';
import PropTypes from 'prop-types';
import {Checkbox} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';

const DocumentPurchase = () => {

    const [expand, setExpand] = useState(false);

    return (
        <View>
            <Text>
                This is Document Purchase Page
            </Text>
        </View>
    )
}

export default DocumentPurchase;

const styles = StyleSheet.create({
    titleView: {
        marginHorizontal: AppDimensions.LARGE, 
        marginVertical: AppDimensions.SMALL,
        flexDirection: 'row', 
        justifyContent: 'space-between',
      },
    titleText: {
        color: AppColors.PRIMARY_DARK_REF_TEXT, 
        fontSize: moderateScale(16), 
        fontWeight: 'bold',
      },
})
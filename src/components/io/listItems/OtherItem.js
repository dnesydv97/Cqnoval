import {useNavigation} from '@react-navigation/native';
import {Icons} from 'assets';
import { BaseCard, BaseContainer } from 'components';
import { messages, navScreenNames } from 'constant';
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'; 
import {
    AppColors,
    AppDimensions,
    HEADING_TEXT_SIZE,
    NORMAL_TEXT_STYLE,
    SMALL_TEXT_STYLE,
} from 'styles';
import {
    navigateToGivenScreen,
    navigateToGivenScreenWithParams,
} from 'utils';
import PropTypes from 'prop-types';
import { IconFill, IconOutline } from '@ant-design/icons-react-native';
import { getFullFileUrl } from 'scenes/contact/functions';
import {StatusBar} from 'react-native';

const OtherItem = ({other}) => {
    const navigation = useNavigation();
    const [isFav, setFav] = useState(other.isFavorite);
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        setFav(other.isFavorite)
    }, [other]);

    useEffect(() => {
        if(logo) getFullFileUrl(logo.viewFileURL, setLogoUrl);
    }, [logo]);

    return(
        <TouchableOpacity
        style={styles.flatListContainer}>
            {console.log("Data on Other", other)}
            <View style={styles.flatListView}>
                <View style={styles.otherIdStyle}>
                    <Text numberOfLines={2} style={styles.otherIdText}>{other.referenceCode}</Text>
                </View>
                <View style={styles.otherDescStyle}>
                    <Text numberOfLines={2} style={styles.otherDescText}>{other.title}</Text>
                </View>
                <View style={styles.favIconStyle}>
                    <IconFill
                        name="star"
                        size={25}
                        color={AppColors.FAV_LIST_COLOR}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

OtherItem.propTypes = {
    other: PropTypes.shape({
        referenceCode: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    flatListContainer: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    flatListView: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: AppDimensions.SMALL,
        alignContent: 'center',
    },
    favIconStyle: {
        width: '10%',
        marginVertical: AppDimensions.SMALL,
        marginBottom: AppDimensions.NORMAL,
        left: 3,
        alignContent: 'center',
    },
    otherIdStyle: {
        marginBottom: AppDimensions.NORMAL,
        marginHorizontal: moderateScale(10),
        width: '20%',
        alignItems: 'flex-start',
    },
    otherIdText: {
        color: AppColors.FIVE_DAYS_COLOR,
    },
    otherDescStyle: {
        flex: 1,
        width: '100%',
        marginHorizontal: moderateScale(0),
        marginBottom: AppDimensions.NORMAL,
    },
    otherDescText: {
        // color: AppColors.FIVE_DAYS_COLOR,
    },
});

export default OtherItem;
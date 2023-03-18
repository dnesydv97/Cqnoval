import {useNavigation} from '@react-navigation/native';
import {Icons, Images} from 'assets';
import {messages, navScreenNames} from 'constant';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  SMALLER_TEXT_STYLE,
} from 'styles';
import {
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import PropTypes from 'prop-types';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {useState} from 'react';
import {addRemoveContactCompanyAsFav} from 'services';
import {getFullFileUrl} from 'scenes/contact/functions';

const CompanyItem = ({company}) => {
  const navigation = useNavigation();
  const [isFav, setFav] = useState(company.isFavorite);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(Icons.logoIcon);

  useEffect(() => {
    setFav(company.isFavorite);
    setSource(
      company.viewFileURL
        ? {uri: getFullFileUrl(company?.viewFileURL, null)}
        : Icons.logoIcon,
    );
  }, [company]);

  const onCompanyPressed = () => {
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_COMPANY_DETAIL_SCREEN,
      {companyId: company.contactCompanyId, isFavourite: company.isFavorite},
    );
  };
  
  const onFavPressed = (value) => {
    setLoading(true);
    addRemoveContactCompanyAsFav(company.contactCompanyId)
      .then((response) => {
        setLoading(false);
        console.log('Add Remove Company To Favourite response', response);
        if (response.status === 200) {
          setFav(value);
        } else showFailToast(messages.FAILED_TO_ADD_FAV);
      })
      .catch((error) => {
        onError(error);
        setLoading(false);
      });
  };

  return (
    <TouchableOpacity onPress={onCompanyPressed} style={styles.container}>
      <View style={{flex: 0.15, paddingLeft: AppDimensions.NORMAL}}>
        <Image
          style={styles.profIcon}
          source={source}
          resizeMode="contain"
          defaultSource={Images.logo}
          onError={() => setSource(Images.logo)}
        />
      </View>
      <View style={{flex: 0.7}}>
        <Text style={styles.nameStyle} numberOfLines={1}>
          {company.contactCompanyName} {company.contactCompanyAbbrevation}
        </Text>
        <Text style={styles.addressStyle}>Hattisar, Kathmandu</Text>
      </View>
      <View
        style={{
          flex: 0.15,
          alignItems: 'flex-end',
        }}>
        {loading ? (
          <IconOutline
            name="loading-3-quarters"
            size={25}
            color="grey"
            style={styles.icon}
          />
        ) : isFav ? (
          <IconFill
            name="star"
            size={25}
            color={AppColors.FAV_LIST_COLOR}
            style={styles.icon}
            onPress={() => onFavPressed(false)}
          />
        ) : (
          <IconOutline
            name="star"
            size={25}
            color="grey"
            style={styles.icon}
            onPress={() => onFavPressed(true)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

CompanyItem.propTypes = {
  company: PropTypes.shape({
    contactCompanyId: PropTypes.string.isRequired,
    contactCompanyName: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }),
};

export default CompanyItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: AppDimensions.NORMAL,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.NORMAL_WHITE,
  },
  icon: {
    paddingHorizontal: AppDimensions.SMALL,
    margin: AppDimensions.SMALL,
  },
  nameStyle: {
    ...HEADING_TEXT_SIZE,
    paddingVertical: AppDimensions.SMALLER,
  },
  addressStyle: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.UTIL,
  },
  profIcon: {
    height: moderateScale(40),
    width: moderateScale(40),
  },
});

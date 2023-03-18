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
import {addRemoveContactPersonAsFav} from 'services';

const PersonItem = ({person}) => {
  const navigation = useNavigation();
  const [isFav, setFav] = useState(person.isFavorite);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(Icons.logoIcon);

  useEffect(() => {
    setFav(person.isFavorite);
    setSource(
      person.viewFileURL
        ? {uri: getFullFileUrl(person?.viewFileURL, null)}
        : Icons.iconContact,
    );
  }, [person]);

  const onPersonPressed = () => {
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_PERSON_DETAIL_SCREEN,
      {personId: person.contactPersonId},
    );
  };
  const onFavPressed = (value) => {
    setLoading(true);
    addRemoveContactPersonAsFav(person.contactPersonId)
      .then((response) => {
        setLoading(false);
        console.log('Add Remove Person To Favourite response', response);
        if (response.status === 200) {
          setFav(value);
          // showSuccessToast(
          //   value
          //     ? messages.SUCCESS_TO_ADD_FAV
          //     : messages.SUCCESS_TO_REMOVE_FAV,
          // );
        } else showFailToast(messages.FAILED_TO_ADD_FAV);
      })
      .catch((error) => {
        onError(error);
        setLoading(false);
      });
  };

  return (
    <TouchableOpacity
      onPress={onPersonPressed}
      style={styles.container}>
      <View
        style={{
          flex: 0.15,
          paddingLeft: AppDimensions.NORMAL,
        }}>
        <Image
          style={styles.profIcon}
          source={source}
          defaultSource={Images.logo}
          onError={() => setSource(Images.logo)}
        />
      </View>
      <View style={{flex: 0.7}}>
        <Text style={styles.nameStyle} numberOfLines={1}>
          {person.personFullName}
        </Text>
        <Text style={styles.addressStyle}>{person.personNickName}</Text>
      </View>
      <View style={{flex: 0.15, alignItems: 'flex-end'}}>
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

PersonItem.propTypes = {
  person: PropTypes.shape({
    contactPersonId: PropTypes.string.isRequired,
    contactPersonName: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }),
};

export default PersonItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: AppDimensions.NORMAL,
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
    height: moderateVerticalScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(40 / 2),
    // backgroundColor: AppColors.ACCENT,
  },
});

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {EqualSpaceHorizontalView} from 'components/base';
import {moderateScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {useNavigation} from '@react-navigation/native';
import {
  dateFormats,
  getDateOnRequiredFormat,
  getMessageItemDate,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
} from 'utils';
import {navScreenNames} from 'constant';

const MessageItem = ({item, helpingData, onItemClicked}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: item.isSelected
          ? AppColors.LIST_ITEM_BLUE
          : AppColors.TRANSPARENT,
      }}
      onPress={onItemClicked}
      onLongPress={() => helpingData && helpingData(item)}>
      <View
        style={[
          styles.bodyContainer,
          {backgroundColor: AppColors.NORMAL_WHITE},
        ]}>
        {(!item.isRead || !item.isRead_InstanceMessage) && (
          <View
            style={{
              height: moderateScale(10),
              width: moderateScale(10),
              position: 'absolute',
              top: moderateScale(8),
              borderRadius: moderateScale(6),
              backgroundColor: AppColors.MESSAGE_DOT,
              margin: AppDimensions.SMALL,
              marginHorizontal: moderateScale(10),
              top: 13,
            }}
          />
        )}
        {item.isTheirInstanceMessage && (
          <IconOutline
            name="message"
            size={14}
            color={AppColors.PRIMARY_DARK}
            style={{
              ...styles.icon,
              position: 'absolute',
              top: moderateScale(26),
            }}
          />
        )}
        {item.isSpecialFlagOne ? (
          <IconFill
            name="star"
            size={25}
            color={AppColors.WARNING_YELLOW}
            style={{
              ...styles.icon,
              position: 'absolute',
              top: '40%',
              right: moderateScale(5),
            }}
          />
        ) : (
          <IconOutline
            name="star"
            size={25}
            color={AppColors.STAR_ICON_COLOR}
            style={{
              ...styles.icon,
              position: 'absolute',
              top: '40%',
              right: moderateScale(5),
            }}
          />
        )}
        {item.applicationTypeDetails?.mailMessageAttachmentDtos?.length !==
          0 && (
          <View
            style={{
              // backgroundColor: AppColors.LIST_ITEM_BG,
              // borderRadius: AppDimensions.NORMAL,
              position: 'absolute',
              top: 45,
              rotation: 180,
            }}>
            <IconOutline
              name="paper-clip"
              size={13}
              color={AppColors.PRIMARY_DARK}                        
                                   
              style={styles.icon}
            />
          </View>
        )}
        <EqualSpaceHorizontalView containerStyle={styles.equalSpaceHori}>
          <View style={styles.horizontalStyl}>
            <Text style={styles.title} numberOfLines={1}>
              {item.applicationTypeDetails.mailMessageParticipantWithTypeDtos
                ?.participantFrom?.participantUserDto?.fullName || item.applicationTypeDetails?.emailRecipients?.emailFrom?.emailAddress}
            </Text>
          </View>
          <Text style={styles.dateDesc}>
            {getMessageItemDate(item.creationTime)}
          </Text>
        </EqualSpaceHorizontalView>

        <View style={{paddingVertical: AppDimensions.SMALL}}>
          <Text
            style={{
              ...styles.text,
              fontWeight: 'normal',
            }}
            numberOfLines={1}>
            {item.title }
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
          {item.applicationTypeDetails?.description}
          </Text>
        </View>

        <EqualSpaceHorizontalView
          containerStyle={{
            ...styles.equalSpaceHori,
            justifyContent: 'flex-start',
            marginHorizontal: moderateScale(25),
          }}>
          <Text style={styles.tag}>{item.referenceName || 'Reference Demos'}</Text>
          <Text style={styles.tag}>{item.companyName}</Text>
        </EqualSpaceHorizontalView>
      </View>
    </TouchableOpacity>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.DISABLE,
  },
  iconContainer: {
    padding: AppDimensions.NORMAL,
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: AppDimensions.SMALL,
    paddingVertical: AppDimensions.SMALL,
  },
  horizontalStyl: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: -5,
  },
  equalSpaceHori: {
    marginVertical: AppDimensions.TINY,
  },
  title: {
    ...NORMAL_TEXT_STYLE,
    fontWeight: 'bold',
    marginHorizontal: moderateScale(30),
  },
  dateDesc: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.DISABLE,
    marginHorizontal: moderateScale(10),
  },
  desc: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.DISABLE,
    marginHorizontal: moderateScale(30),
  },
  text: {
    ...NORMAL_HEADING_TEXT_SIZE,
    // width: '95%',
    marginHorizontal: moderateScale(30),
    paddingRight: AppDimensions.NORMAL,
  },
  tag: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.MESSAGE_TAG_COLOR,
    // borderWidth: 1,
    // borderRadius: AppDimensions.SMALL,
    // borderColor: AppColors.TAG_RED,
    marginHorizontal: AppDimensions.SMALL,
    // paddingHorizontal: AppDimensions.SMALL,
  },
  icon: {
    marginVertical: AppDimensions.SMALL,
    marginHorizontal: AppDimensions.NORMAL,
  },
});

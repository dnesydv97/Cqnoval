import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Icons, Images} from 'assets';
import {moderateScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
} from 'styles';
import {Separator, PopMenuItem} from 'components';
import {
  EqualSpaceHorizontalView,
  LoadMoreFlatList,
  PlainBaseModal,
} from 'components/base';
import {
  dateFormats,
  getDateOnRequiredFormat,
  getDisplayValue,
  getFileTypes,
  navigateToGivenScreenWithParams,
} from 'utils';
import HTMLView from 'react-native-htmlview';
import {TouchableOpacity} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {isMe} from 'services';
import {useNavigation} from '@react-navigation/core';
import {navScreenNames} from 'constant';
import {getFullFileUrl} from 'scenes/contact/functions';

const InternalMessageItem = ({item, index, helpingData}) => {
  const navigation = useNavigation();
  const [isMSender, setIsMSender] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);

  useEffect(() => {
    updateSenderInfo();
  }, []);

  const isMePopUpMenu = [
    {
      label: 'Read/Unread',
      onPress: () => doThreeDotAction('readUnread'),
    },
    {
      label: 'Edit',
      onPress: () => doThreeDotAction('edit'),
    },
    {
      label: 'Log',
      onPress: () => doThreeDotAction('log'),
    },
    {
      label: 'Delete',
      onPress: () => doThreeDotAction('delete'),
    },
  ];

  const popUpMenu = [
    {
      label: 'Read/Unread',
      onPress: () => doThreeDotAction('readUnread'),
    },
    {
      label: 'Log',
      onPress: () => doThreeDotAction('log'),
    },
  ];

  function doThreeDotAction(action = '') {
    if (action === 'readUnread') {
      helpingData(item, 'readUnread');
    } else if (action === 'edit') {
      helpingData(item, 'edit');
    } else if (action === 'log') {
      setTimeout(() => {
        setShowLogDialog(true);
      }, 500);
    } else if (action === 'delete') {
      helpingData(item, 'delete');
    }
  }

  async function onAttachmentClicked(fileUrl, fileName = '') {
    const viewType = getFileTypes(fileName);
    const fullUrl = await getFullFileUrl(fileUrl, null);
    if (viewType === 'pdf' || viewType === 'image') {
      navigateToGivenScreenWithParams(
        navigation,
        viewType === 'pdf'
          ? navScreenNames.NAV_PDF_VIEWER_SCREEN
          : navScreenNames.NAV_IMAGE_VIEWER_SCREEN,
        {url: fullUrl},
      );
    } else if (viewType === 'download') {
    }
  }

  async function updateSenderInfo() {
    const tempIsMe = await isMe(
      item.mailMessageParticipantWithTypeDtos.participantFrom.participantUserId,
    );
    setIsMSender(tempIsMe);
  }

  const MoreItem = () => <IconOutline name="more" size={25} />;

  const ChangeLogItem = ({item}) => (
    <View style={{padding: AppDimensions.SMALL}}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  // console.log('Internal message item ', item);
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: item.isActive
          ? (index + 1) % 2 == 0
            ? AppColors.LIST_ITEM_YELLOW
            : AppColors.LIST_ITEM_BLUE
          : AppColors.TAG_RED,
        flexDirection: 'row',
      }}>
      <View>
        <EqualSpaceHorizontalView containerStyle={{marginVertical: 0}}>
          <View style={styles.horizontal}>
            <Image
              style={styles.image}
              source={Images.logo}
              resizeMode="contain"
            />
            <View
              style={{
                backgroundColor: AppColors.PRIMARY_DARK,
                height: moderateScale(15),
                width: moderateScale(15),
                borderRadius: moderateScale(8),
                position: 'absolute',
                left: moderateScale(20),
                top: moderateScale(35),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: moderateScale(10),
                }}>
                {item.orderNumber}
              </Text>
            </View>
            <View style={{marginLeft: moderateScale(10)}}>
              <Text style={{...styles.text, color: AppColors.PRIMARY_DARK}}>
                {getDisplayValue(
                  item.mailMessageParticipantWithTypeDtos.participantFrom
                    .participantUserDto.userName,
                )}
              </Text>
              <Text style={styles.desc}>
                <Text>To: </Text>

                {item.mailMessageParticipantWithTypeDtos.participantTos.map(
                  (toItem, index) => (
                    <Text key={String(index)}>
                      {`${toItem.participantUserDto.userName}, `}
                    </Text>
                  ),
                )}
              </Text>
              {item.mailMessageParticipantWithTypeDtos.participantCCs.length !=
              0 ? (
                <Text style={styles.desc}>
                  <Text>CC: </Text>

                  {item.mailMessageParticipantWithTypeDtos.participantCCs.map(
                    (toItem, index) => (
                      <Text key={String(index)}>
                        {`${toItem.participantUserDto.userName}`}
                      </Text>
                    ),
                  )}
                </Text>
              ) : (
                <Text style={styles.desc}></Text>
              )}
            </View>
          </View>

          <View
            style={{
              // borderWidth: 1,
              width: '70%',
            }}>
            <View style={{...styles.horizontal, justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => helpingData(item, 'reply')}
                activeOpacity={0.6}>
                <Image
                  style={styles.icon}
                  source={Icons.iconReply}
                  resizeMode="center"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => helpingData(item, 'replyAll')}
                activeOpacity={0.6}>
                <Image
                  style={styles.icon}
                  source={Icons.iconReplyAll}
                  resizeMode="center"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => helpingData(item, 'forward')}
                activeOpacity={0.6}>
                <Image
                  style={styles.icon}
                  source={Icons.iconForward}
                  resizeMode="center"
                />
              </TouchableOpacity>
              <PopMenuItem
                ButtonComponent={MoreItem}
                menuItems={item.isOwner ? isMePopUpMenu : popUpMenu}
              />
            </View>
            <>
              <Text style={styles.desc}>
                {getDateOnRequiredFormat(
                  item.creationTime,
                  dateFormats.MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM,
                )}
              </Text>
              {item.replyOfInstanceMessageOrderNumber && (
                <Text
                  style={
                    styles.desc
                  }>{`Reply To ${item.replyOfInstanceMessageOrderNumber}`}</Text>
              )}
            </>
          </View>
        </EqualSpaceHorizontalView>
        <Separator />
        <View style={{paddingVertical: AppDimensions.NORMAL}}>
          <HTMLView
            value={getDisplayValue(item.messageText)}
            stylesheet={htmlStyles}
          />
        </View>
        <View>
          {item.instanceMessageAttachmentDtos.map((attachment) => (
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() =>
                onAttachmentClicked(
                  attachment.viewFileURL,
                  attachment.displayFileName,
                )
              }>
              <IconOutline name="paper-clip" size={15} color={AppColors.UTIL} />
              <Text
                style={{
                  ...styles.text,
                  paddingHorizontal: AppDimensions.SMALL,
                }}>
                {attachment.displayFileName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {showLogDialog && (
        <PlainBaseModal collapsable onDismiss={() => setShowLogDialog(false)}>
          <View style={styles.popUpDialog}>
            <Text style={{...styles.text, textAlign: 'center'}}>
              Message Edit Logs
            </Text>
            <Separator />
            <LoadMoreFlatList
              data={[1, 2, 3, 4, 5, 6]}
              SingleItemView={ChangeLogItem}
            />
          </View>
        </PlainBaseModal>
      )}
    </View>
  );
};

export default InternalMessageItem;

const htmlStyles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});

const styles = StyleSheet.create({
  container: {
    borderRadius: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
    // borderWidth: 1,
  },
  image: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(25),
  },
  desc: {
    ...SMALLER_TEXT_STYLE,
    color: AppColors.UTIL,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
    paddingVertical: AppDimensions.NORMAL,
  },
  horizontal: {
    width: '50%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
    marginHorizontal: AppDimensions.SMALL,
  },
  popUpDialog: {
    height: '70%',
    width: moderateScale(300),
    backgroundColor: 'white',
    borderRadius: AppDimensions.NORMAL,
  },
});

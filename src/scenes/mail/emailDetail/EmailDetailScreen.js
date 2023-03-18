import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {Icons} from 'assets';
import {
  BaseContainer,
  DirectPersonSearchBox,
  DocImagePicker,
  EmailToggleButton,
  EqualSpaceHorizontalView,
  InternalMessageItem,
  LoadMoreFlatList,
  PlainBaseModal,
  PopMenuItem,
  Separator,
  TextEditor,
  TextField,
} from 'components';
import {navScreenNames, screenNames} from 'constant';
import {moderateScale} from 'react-native-size-matters';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALLEST_TEXT_STYLE,
  SUB_HEADING_TEXT_STYLE,
  WINDOW_WIDTH,
} from 'styles';
import HTMLView from 'react-native-htmlview';
import {
  getInstanceMessagesByMsgId,
  getMailParticipantStatus,
  getMailParticipantType,
  sendInstanceMessage,
  sendInternalMessage,
  updateInstanceMessageAttachments,
  updateInstanceMessageParticipants,
  updateInstanceMessageText,
  updateInstanceMessage,
  getAllUserList,
  changeEmailStatus,
} from 'services';
import {
  areArraysEqual,
  arraysEqual,
  dateFormats,
  downloadFile,
  getDateOnRequiredFormat,
  getDisplayValue,
  getFileTypes,
  getIntersection,
  getPersonSearchSelectedItems,
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
  showFailToast,
  showInfoToast,
  subtractArrays,
} from 'utils';
import {Button} from '@ant-design/react-native';
import {update} from 'lodash';
import {getFullFileUrl, uploadFilesToServer} from 'scenes/contact/functions';
import {useRef} from 'react';
import {LeaveMessage} from '../msgTypeComponents';
import {componentProvider} from './HelperFunction';
import {TextInput} from 'react-native-gesture-handler';

const actionMenu = [
  {
    title: 'Reply',
    icon: Icons.iconReply,
    disabled: false,
  },
  {
    title: 'Reply All',
    icon: Icons.iconReplyAll,
    disabled: false,
  },
  {
    title: 'Forward',
    icon: Icons.iconForward,
    disabled: false,
  },
  {
    title: 'Int. Forward',
    icon: Icons.iconForward,
    disabled: false,
  },
  // {
  //   title: 'Follow Up',
  //   icon: Icons.iconForward,
  //   disabled: false,
  // },
  // {
  //   title: 'Resend',
  //   icon: Icons.iconForward,
  //   disabled: false,
  // },
  // {
  //   title: 'Ref/Party',
  //   icon: Icons.iconTag,
  //   disabled: false,
  // },
  {
    title: 'Read/Unread',
    icon: Icons.iconReadUnread,
    disabled: false,
  },
  {
    title: 'Pending',
    icon: Icons.iconPending,
    disabled: false,
  },
  {
    title: 'Archive',
    icon: Icons.iconArchive,
    disabled: false,
  },
  // {
  //   title: 'Print',
  //   icon: Icons.iconPrint,
  //   disabled: false,
  // },
  {
    title: 'Trash',
    icon: Icons.iconTrash,
    disabled: false,
  },
];

function getParticipantDto(
  participantId,
  fullName,
  userName,
  userIdName,
  participantTypeId,
  messageId = null,
) {
  return {
    quickMessageId: messageId,
    participantId,
    appUserId: participantId,
    participantUserId: participantId,
    fullName,
    userName,
    userIdName,
    candidateDto: {
      appUserId: participantId,
      fullName,
      userName,
      userIdName,
      officialEmail: '',
      phoneNumber: '',
      profilePictureFileInformationId: '',
      profilePictureViewUrl: '',
    },
    participantTypeId,
    participantTypeDto: {
      id: participantTypeId,
      systemName: '',
      displayName: '',
    },
  };
}

function getUpdateParticipantDto(
  instanceMessageId,
  participantId,
  participantTypeId,
) {
  return {
    instanceMessageId,
    participantId,
    participantUserId: participantId,
    appUserId: participantId,
    participantTypeId,
  };
}

const ActionButton = ({title, icon, disabled, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{alignItems: 'center', paddingHorizontal: AppDimensions.NORMAL}}
      onPress={() => !disabled && onPress && onPress(title)}>
      <Image
        style={{
          ...styles.icon,
          tintColor: disabled ? AppColors.DISABLE : 'rgba(33, 33, 33, 0.8)',
        }}
        resizeMode="center"
        source={icon}
      />
      <Text
        style={{
          ...styles.smallText,
          color: disabled ? AppColors.DISABLE : 'black',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const initialInternalMsg = {
  instanceMessageId: '',
  mailMessageCenterId: '',
  orderNumber: 0,
  messageText: '',
  replyOfInstanceMessageId: '',
  InstanceMessageStatusName: '',
  instanceMessageActionName: '',
  instanceMessageStatusId: '',
  instanceMessageAttachmentDtos: [],
  mailMessageParticipantWithTypeDtos: {
    instanceMessageId: '',
    participantFrom: null,
    participantTos: [],
    participantCCs: [],
    participantBCCs: [],
  },
  ccParticipants: [],
  toParticipants: [],
};

const EmailDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const scrollRef = useRef(null);
  const [expand, setExpand] = useState(false);
  const {messageDetail} = route?.params;

  const [visibilities, setVisibilities] = useState({
    isInternal: false,
    loading: false,
    isEdit: false,
    showReplyBox: false,
    showAttachmentDialog: false,
  });
  const [instanceMsgDetail, setInstanceMsgDetail] = useState(
    initialInternalMsg,
  );
  const [prevInstanceMsgDetail, setPrevInstanceMsgDetail] = useState(
    initialInternalMsg,
  );
  const [instMessages, setInstMessages] = useState({
    totalCount: 0,
    items: [],
  });
  const [preLoadedData, setPreLoadedData] = useState({
    mailParticipantType: [],
    participantStatuses: [],
    allParticipants: [],
  });
  const [selectableParticipants, setSelectableParticipants] = useState([]);
  const [ccMembers, setCcMembers] = useState({
    expand: false,
    members: [],
  });
  const [toMembers, setToMembers] = useState({
    expand: false,
    members: [],
  });
  const onInternalMessagePressed = () => {
    navigateToGivenScreen(
      navigation,
      navScreenNames.NAV_COMPOSE_INTERNAL_SCREEN,
    );
  };
  useEffect(() => {
    fetchInstanceMessages();
    let tempCc = [];
    let tempTo = [];
    {
      messageDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos?.participantCCs.map(
        (item, index) => {
          tempCc.push(item.participantUserDto.userName);
        },
      );
    }

    {
      messageDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos?.participantTos.map(
        (item, index) => tempTo.push(item.participantUserDto.userName),
      );
    }
    setCcMembers({
      members: tempCc,
    });

    setToMembers({
      members: tempTo,
    });
  }, [messageDetail]);

  useEffect(() => {
    getRequiredData();
  }, []);

  useEffect(() => {
    visibilities.showReplyBox && onVisibilityChanged('isEdit')(false);
  }, [visibilities.showReplyBox]);

  useEffect(() => {
    setSelectableParticipants(
      subtractArrays(
        preLoadedData.allParticipants,
        [
          ...instanceMsgDetail.toParticipants,
          ...instanceMsgDetail.ccParticipants,
        ],
        'appUserId',
        'appUserId',
      ),
    );
  }, [
    preLoadedData.allParticipants,
    instanceMsgDetail.ccParticipants,
    instanceMsgDetail.toParticipants,
  ]);

  function getRequiredData() {
    Promise.all([
      getMailParticipantType(),
      getMailParticipantStatus(),
      getAllUserList(),
    ]).then((response) => {
      console.log('REspoese of required data ', response);
      setPreLoadedData({
        ...preLoadedData,
        mailParticipantType: response[0].data,
        participantStatuses: response[1].data,
        allParticipants: response[2].data,
      });
    });
  }

  const onTextChange = (key) => (value) =>
    setInstanceMsgDetail({
      ...instanceMsgDetail,
      [key]: value,
    });

  const onVisibilityChanged = (key) => (value) =>
    setVisibilities({
      ...visibilities,
      [key]: value,
    });

  const setLoading = (value) =>
    setVisibilities({...visibilities, loading: value});

  function fetchInstanceMessages(SkipCount) {
    setLoading(true);
    getInstanceMessagesByMsgId(messageDetail.id, SkipCount)
      .then((response) => {
        setLoading(false);
        console.log('Instance Messages response ', response);
        if (response.status === 200)
          setInstMessages({
            ...instMessages,
            items: [...instMessages.items, ...response.data.items],
            totalCount: response.data.totalCount,
          });
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function onAttachmentChanged(attachments) {
    // console.log('Selected attachments ', attachments);
    uploadFilesToServer(attachments, setLoading, onUploadCompleted);
  }

  function onUploadCompleted(tempFiles = []) {
    onTextChange('instanceMessageAttachmentDtos')(tempFiles);
  }

  function onUpdate() {
    setLoading(true);

    let data = {
      instanceMessageId: instanceMsgDetail.instanceMessageId,
      instanceMessageUpdateDto: null,
      mailMessageParticipantWithTypeDtos: null,
      instanceMessageAttachmentDtos: [],
    };

    const toType = preLoadedData.mailParticipantType.find(
      (item) => item.systemname === 'To',
    );
    const ccType = preLoadedData.mailParticipantType.find(
      (item) => item.systemname === 'Cc',
    );

    const toParticipants = instanceMsgDetail.toParticipants.map((item) =>
      getUpdateParticipantDto(
        instanceMsgDetail.instanceMessageId,
        item.appUserId,
        toType.id,
      ),
    );

    const ccParticipants = instanceMsgDetail.ccParticipants.map((item) =>
      getUpdateParticipantDto(
        instanceMsgDetail.instanceMessageId,
        item.appUserId,
        ccType.id,
      ),
    );

    if (
      !areArraysEqual(
        prevInstanceMsgDetail.mailMessageParticipantWithTypeDtos
          ?.participantCCs || [],
        instanceMsgDetail.ccParticipants,
        'participantUserId',
        'appUserId',
      ) ||
      !areArraysEqual(
        prevInstanceMsgDetail.mailMessageParticipantWithTypeDtos
          ?.participantTos || [],
        instanceMsgDetail.toParticipants,
        'participantUserId',
        'appUserId',
      )
    ) {
      data.mailMessageParticipantWithTypeDtos = {
        instanceMessageId: instanceMsgDetail.instanceMessageId,
        participantTos: toParticipants,
        participantCCs: ccParticipants,
      };
      // data.mailMessageParticipantWithTypeDtos = [
      //   ...toParticipants,
      //   ...ccParticipants,
      // ];
    }
    if (prevInstanceMsgDetail.messageText !== instanceMsgDetail.messageText) {
      data.instanceMessageUpdateDto = {
        instanceMessageId: instanceMsgDetail.instanceMessageId,
        messageText: instanceMsgDetail.messageText,
      };
    }

    if (
      !areArraysEqual(
        prevInstanceMsgDetail.instanceMessageAttachmentDtos,
        instanceMsgDetail.instanceMessageAttachmentDtos,
        'id',
        'id',
      )
    ) {
      data.instanceMessageAttachmentDtos =
        instanceMsgDetail.instanceMessageAttachmentDtos;
    }

    console.log('Data to be sent to server ', data, JSON.stringify(data));

    updateInstanceMessage(data)
      .then((response) => {
        setLoading(false);
        console.log('Update Instance Message Response ', response);
        if (response.status === 200) {
          onVisibilityChanged('showReplyBox')(false);
          fetchInstanceMessages(0);
          setTimeout(() => {
            setInstanceMsgDetail(initialInternalMsg);
          }, 20);
        }
      })
      .catch((error) => {
        setLoading(false);
        showFailToast('Failed, to update instance message !!!');
        onError(error);
      });
  }

  function onSend(statusName) {
    let data = {...instanceMsgDetail};
    // const foundStatus = preLoadedData.participantStatuses.find(
    //   (status) => status.systemName === statusName,
    // );
    data.InstanceMessageStatusName = statusName;
    // data.instanceMessageStatusId = foundStatus.id;
    data.mailMessageParticipantWithTypeDtos = {
      participantTos: instanceMsgDetail.toParticipants.map((value) => {
        return {
          participantUserId: value.appUserId,
        };
      }),
      participantCCs: instanceMsgDetail.ccParticipants.map((value) => {
        return {
          participantUserId: value.appUserId,
        };
      }),
    };

    delete data.toParticipants;
    delete data.ccParticipants;
    delete data.bccParticipants;
    delete data.description;
    delete data.id;
    delete data.applicationTypeDetails;
    delete data.applicationTypeId;

    console.log('data ', instanceMsgDetail, data, JSON.stringify(data));
    setLoading(true);
    sendInstanceMessage(data)
      .then((response) => {
        setLoading(false);
        console.log('Instance Message post response ', response);
        if (response.status === 200) {
          fetchInstanceMessages(0);
          onVisibilityChanged('showReplyBox')(false);
          setInstanceMsgDetail(initialInternalMsg);
        } else showFailToast('Sorry, We failed to send the message.');
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
        showFailToast('Sorry, We failed to send the message.');
      });
  }

  function deleteInstanceMessage(item) {
    console.log('on Delete ', item, messageDetail);
  }

  function changeMessageStatus(mailMsgCenterId, instanceMsgId, status) {
    setLoading(true);
    changeEmailStatus(mailMsgCenterId, instanceMsgId, status)
      .then((response) => {
        setLoading(false);
        console.log('Change message status response ', response);
        if (response.status === 200) {
        }
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function onUsersChanged(userList, type) {
    // console.log(('email detail user changed ', userList));
    const participantType = preLoadedData.mailParticipantType.find(
      (item) => item.systemname === type,
    );
    if (participantType) {
      const convertedUsers = userList.map((item) => {
        let user = getParticipantDto(
          item.appUserId,
          item.fullName,
          item.userName,
          item.userIdName,
          participantType.id,
        );

        return user;
      });

      if (type === 'Cc') onTextChange('ccParticipants')(convertedUsers);
      else if (type === 'To') onTextChange('toParticipants')(convertedUsers);
    }
  }

  function onMainIconClicked(menuName = '') {
    if (instMessages.items.length !== 0) {
      const latestInstMsgId =
        instMessages.items[instMessages.items.length - 1].id;
      if (menuName === 'Archive') {
        changeMessageStatus(messageDetail.id, latestInstMsgId, 'archived');
      } else if (menuName === 'Read/Unread') {
        changeMessageStatus(
          messageDetail.id,
          latestInstMsgId,
          messageDetail.isRead ? 'un-read' : 'read',
        );
      } else if (menuName === 'Pending') {
        changeMessageStatus(messageDetail.id, latestInstMsgId, 'pending');
      } else if (menuName === 'Delete') {
        changeMessageStatus(messageDetail.id, latestInstMsgId, 'delete');
      } else if (menuName === 'Reply') {
        goToComposeMail('reply');
      } else if (menuName === 'Reply All') {
        goToComposeMail('replyAll');
      } else if (menuName === 'Forward') {
        goToComposeMail('forward');
      } else if (menuName === 'Int. Forward') {
        goToComposeMail('intForward');
      } else if (menuName === 'Follow Up') {
        goToComposeMail('followUp');
      } else if (menuName === 'Resend') {
        goToComposeMail('resend');
      } else if (menuName === 'Ref/Party') {
        showInfoToast('Feature is comming Soon.');
      } else if (menuName === 'Print') {
        showInfoToast('Feature is comming Soon.');
      }
    }
  }

  function goToComposeMail(action) {
    console.log('on goToComposeMail ', action);
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_MAIL_COMPOSE_SCREEN,
      {emailDetail: messageDetail, action},
    );
  }

  function onIconClicked(item, type) {
    console.log('Item clicked ', item);

    if (type === 'delete') {
      deleteInstanceMessage(item);
    } else if (type === 'readUnread') {
      changeMessageStatus(
        item.mailMessageCenterId,
        item.id,
        item.isRead ? 'read' : 'un-read',
      );
    } else {
      onVisibilityChanged('showReplyBox')(true);
      setTimeout(
        () => scrollRef?.current?.scrollToEnd({duration: 500, animated: true}),
        50,
      );
      // scrollRef?.current?.scrollToEnd();
      let toParticipants = [],
        ccParticipants = [],
        messageText = null,
        instanceMessageId = null,
        replyOfInstanceMessageId = item.id,
        instanceMessageActionName = '';
      if (type === 'reply') {
        const tempTos = item.mailMessageParticipantWithTypeDtos?.participantTos.map(
          (participant) => {
            return {
              ...participant,
              ...participant.participantUserDto,
            };
          },
        );
        toParticipants = tempTos;
        instanceMessageActionName = 'reply';
      } else if (type === 'replyAll') {
        const tempTos = item.mailMessageParticipantWithTypeDtos?.participantTos.map(
          (participant) => {
            return {
              ...participant,
              ...participant.participantUserDto,
            };
          },
        );

        const tempCcs = item.mailMessageParticipantWithTypeDtos?.participantCCs.map(
          (participant) => {
            return {
              ...participant,
              ...participant.participantUserDto,
            };
          },
        );

        toParticipants = [...tempTos, ...tempCcs];
        instanceMessageActionName = 'replyall';
      } else if (type === 'forward') {
        messageText = `<div><p>-----This is forwarded message of ${item.mailMessageParticipantWithTypeDtos?.participantFrom?.participantUserDto?.userIdName} ------</p></br> ${item.messageText} </div>`;
        instanceMessageActionName = 'forward';
      } else if (type === 'edit') {
        onVisibilityChanged('isEdit')(true);
        setTimeout(() => {
          setPrevInstanceMsgDetail({...item});
        }, 10);
        instanceMessageId = item.id;
        replyOfInstanceMessageId = null;
        messageText = item.messageText;
        const tempTos = item.mailMessageParticipantWithTypeDtos?.participantTos.map(
          (participant) => {
            return {
              ...participant,
              ...participant.participantUserDto,
            };
          },
        );

        const tempCcs = item.mailMessageParticipantWithTypeDtos?.participantCCs.map(
          (participant) => {
            return {
              ...participant,
              ...participant.participantUserDto,
            };
          },
        );

        toParticipants = [...tempTos];
        ccParticipants = [...tempCcs];
      }

      setInstanceMsgDetail({
        ...instanceMsgDetail,
        toParticipants,
        ccParticipants,
        instanceMessageId,
        messageText,
        replyOfInstanceMessageId,
        mailMessageCenterId: item.mailMessageCenterId,
        instanceMessageActionName,
      });
    }
  }

  const AttachmentItem = ({item}) => (
    <TouchableOpacity
      style={{padding: AppDimensions.SMALL}}
      onPress={async () => {
        const viewerKey = getFileTypes(item.displayFileName);
        const fullUrl = await getFullFileUrl(item.viewFileURL, null);
        if (viewerKey === 'pdf' || viewerKey === 'image') {
          navigateToGivenScreenWithParams(
            navigation,
            viewerKey === 'pdf'
              ? navScreenNames.NAV_PDF_VIEWER_SCREEN
              : navScreenNames.NAV_IMAGE_VIEWER_SCREEN,
            {url: fullUrl},
          );
        } else if (viewerKey === 'download') {
          downloadFile(fullUrl);
        }
        onVisibilityChanged('showAttachmentDialog')(false);
      }}>
      <Text style={styles.text}>{item.displayFileName}</Text>
    </TouchableOpacity>
  );

  const onFavPressed = (isFav) => {};

  function SendIcon(){
    <Button
      type="primary"
      onPress={() =>
      visibilities.isEdit ? onUpdate() : onSend('normal')
      }>
        {visibilities.isEdit ? 'Update' : 'Send'}
    </Button>
  };

  return (
    <BaseContainer
      toolbarTitle='Email Detail'
      containerStyle={{
        backgroundColor: 'white',
        marginVertical: AppDimensions.SMALL,
      }}
      loading={visibilities.loading}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        style={{marginBottom: moderateScale(45)}}>
        <View style={{marginBottom: moderateScale(80)}}>
          <View style={styles.body}>
            
            <Text style={styles.title} numberOfLines={2}>
              {getDisplayValue(messageDetail.title)}
            </Text>
            <EqualSpaceHorizontalView
              containerStyle={{
                // borderWidth: 1,
                marginVertical: AppDimensions.SMALL,
              }}>
              <Text
                style={{
                  ...styles.title,
                  fontWeight: 'normal',
                  fontSize: moderateScale(14),
                  color: AppColors.PRIMARY_DARK,
                  top: -5,
                }}
                numberOfLines={2}>
                {`(${messageDetail?.referenceName || 'T2020-054, SISCO-USHEC'})`}
              </Text>
              {messageDetail.isFav ? (
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
            </EqualSpaceHorizontalView>
            <TouchableOpacity 
            onPress={() => setExpand(!expand)}
            style={{backgroundColor: '#FAFAFA', marginHorizontal: AppDimensions.NORMAL}}>
              <View style={{marginHorizontal: AppDimensions.NORMAL, paddingBottom: AppDimensions.SMALL}}>
                <EqualSpaceHorizontalView style={{flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth}}>
                  <EqualSpaceHorizontalView>
                    <Text style={{color: AppColors.NORMAL_BLACK, fontSize: moderateScale(16), marginRight: AppDimensions.MODERATE}}>From: </Text>
                    <Text style={{fontSize: moderateScale(16), color: AppColors.NORMAL_BLACK}}>{messageDetail.applicationTypeDetails
                        ?.mailMessageParticipantWithTypeDtos?.participantFrom
                        ?.participantUserDto?.fullName||messageDetail.applicationTypeDetails?.emailRecipients?.emailFrom?.emailAddress}</Text>
                    {/* {!expand && (<IconOutline
                      name="caret-down"
                    />)} */}
                  </EqualSpaceHorizontalView>
                  
                  {/* {expand && (
                    <IconOutline
                      name="caret-up"
                    />
                  )} */}
                </EqualSpaceHorizontalView>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={{width: '17%', fontSize: moderateScale(16)}}>To: </Text>
                  <Text style={{fontSize: moderateScale(16)}}>{toMembers.members.toString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {expand && (<TouchableOpacity
                          style={{backgroundColor: '#FAFAFA', top: -5, marginHorizontal: AppDimensions.NORMAL, borderBottomWidth: 0.7, borderBottomColor: '#C4C4C4'}}>
              {ccMembers.members!='' && (<View style={{flexDirection: 'row', marginHorizontal: AppDimensions.NORMAL}}>
                <Text style={{fontSize: moderateScale(16), width: '17%'}}>CC: </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: moderateScale(WINDOW_WIDTH - 110),
                  }}>
                  <Text editable={false} style={{fontSize: moderateScale(16)}} multiline={ccMembers.expand}>
                    {ccMembers.members.toString()}
                  </Text>
                  {ccMembers.members.length > 5 && (
                    <IconOutline
                      name={ccMembers.expand ? 'up' : 'down'}
                      size={20}
                      color="#B3B3B3"
                      style={{paddingHorizontal: AppDimensions.SMALL}}
                      onPress={() =>
                        setCcMembers({...ccMembers, expand: !ccMembers.expand})
                      }
                    />
                  )}
                </View>
              </View>)}
              <View style={{flexDirection: 'row', marginHorizontal: AppDimensions.NORMAL, paddingBottom: AppDimensions.SMALL}}>
                <Text style={[styles.label],{fontSize: moderateScale(16), width: '17%'}}>Date: </Text>
                <Text style={[styles.text],{fontSize: moderateScale(16)}}>
                  {getDateOnRequiredFormat(
                    messageDetail.creationTime,
                    dateFormats.MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM,
                  )}
                </Text>
              </View>
            </TouchableOpacity>)}
            {/* <Separator
              containerStyle={{marginVertical: AppDimensions.SMALL}}
            /> */}
            <View style={{backgroundColor: '#FAFAFA', marginHorizontal: AppDimensions.NORMAL, top: -5}}>
            {messageDetail.applicationTypeDetails?.mailMessageAttachmentDtos
                ?.length !== 0 && (
                <>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#E0E0E0',
                      padding: AppDimensions.NORMAL,
                      borderRadius: AppDimensions.LARGE,
                      width: moderateScale(150),
                      marginVertical: moderateScale(5),
                      marginHorizontal: AppDimensions.NORMAL,
                    }}>
                    <IconOutline name="paper-clip" size={20} />
                    <Text
                      onPress={(e) =>
                        onVisibilityChanged('showAttachmentDialog')(true)
                      }
                      style={{
                        ...styles.text,
                        paddingHorizontal: AppDimensions.SMALL,
                      }}>{`${messageDetail.applicationTypeDetails?.mailMessageAttachmentDtos?.length} Attachments`}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            {/* <TouchableOpacity
            onPress={() => setExpand(!expand)}>
            <View style={styles.senderInfo}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.label}>From:</Text>
                <Text style={styles.text}>
                  <Text>
                    {messageDetail.applicationTypeDetails
                      ?.mailMessageParticipantWithTypeDtos?.participantFrom
                      ?.participantUserDto?.fullName || messageDetail.applicationTypeDetails?.emailRecipients?.emailFrom?.emailAddress}
                  </Text>
                  <Text style={{color: AppColors.PRIMARY_DARK}}>
                    {` [${messageDetail.companyName || 'Company Name'}]`}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row'
                }}>
                <Text style={styles.label}>To:</Text>
                <TextInput editable={false} multiline={toMembers.expand}>
                  {toMembers.members.toString()}
                </TextInput>
                {toMembers.members.length > 5 && (
                  <IconOutline
                    name={toMembers.expand ? 'up' : 'down'}
                    size={20}
                    color="#B3B3B3"
                    style={{paddingHorizontal: AppDimensions.SMALL}}
                    onPress={() =>
                      setToMembers({...toMembers, expand: !toMembers.expand})
                    }
                  />
                )}
              </View>
              {ccMembers.members!='' && (<View style={{flexDirection: 'row'}}>
                <Text style={styles.label}>CC:</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: moderateScale(WINDOW_WIDTH - 110),
                  }}>
                  <TextInput editable={false} multiline={ccMembers.expand}>
                    {ccMembers.members.toString()}
                  </TextInput>
                  {ccMembers.members.length > 5 && (
                    <IconOutline
                      name={ccMembers.expand ? 'up' : 'down'}
                      size={20}
                      color="#B3B3B3"
                      style={{paddingHorizontal: AppDimensions.SMALL}}
                      onPress={() =>
                        setCcMembers({...ccMembers, expand: !ccMembers.expand})
                      }
                    />
                  )}
                </View>
              </View>)}
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.text}>
                  {getDateOnRequiredFormat(
                    messageDetail.creationTime,
                    dateFormats.MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM,
                  )}
                </Text>
              </View>

              {messageDetail.applicationTypeDetails?.mailMessageAttachmentDtos
                ?.length !== 0 && (
                <>
                  <Separator
                    containerStyle={{marginVertical: AppDimensions.SMALL}}
                  />
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: AppColors.DISABLE,
                      padding: AppDimensions.NORMAL,
                      borderRadius: AppDimensions.LARGE,
                      width: moderateScale(150),
                    }}>
                    <IconOutline name="paper-clip" size={20} />
                    <Text
                      onPress={(e) =>
                        onVisibilityChanged('showAttachmentDialog')(true)
                      }
                      style={{
                        ...styles.text,
                        paddingHorizontal: AppDimensions.SMALL,
                      }}>{`${messageDetail.applicationTypeDetails?.mailMessageAttachmentDtos?.length} Attachments`}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            </TouchableOpacity> */}
            {/* {!messageDetail.isTheirInstanceMessage && (<View style={{flexDirection: 'row-reverse', marginHorizontal: AppDimensions.NORMAL}}>
                <IconOutline
                  name="message"
                  size={25}
                  onPress={onInternalMessagePressed}
                />
            </View>)} */}
            {messageDetail.isTheirInstanceMessage && (
              <EmailToggleButton
                onToggle={onVisibilityChanged('isInternal')}
                isInternal={visibilities.isInternal}
              />
            )}

            <View style={styles.htmlContainer}>
              {!visibilities.isInternal ? (
                componentProvider(
                  messageDetail.applicationTypeSystemName,
                  messageDetail,
                )
              ) : (
                <>
                  <View style={{height: moderateScale(350)}}>
                    <LoadMoreFlatList
                      data={instMessages.items.reverse()}
                      SingleItemView={InternalMessageItem}
                      helpingData={(item, type) => {
                        onIconClicked(item, type);
                      }}
                      onLoadMore={() =>
                        fetchInstanceMessages(instMessages.items.length)
                      }
                      showLoadMore={
                        instMessages.totalCount > instMessages.items.length
                      }
                    />
                  </View>

                  {visibilities.showReplyBox ? (
                    <View>
                      <Text>To</Text>
                      <DirectPersonSearchBox
                        selectedUsers={getPersonSearchSelectedItems(
                          instanceMsgDetail.toParticipants,
                          'appUserId',
                          'userName',
                        )}
                        onUsersChanged={(users) => onUsersChanged(users, 'To')}
                        users={selectableParticipants}
                        editable
                      />
                      <Text>Cc</Text>
                      <DirectPersonSearchBox
                        selectedUsers={getPersonSearchSelectedItems(
                          instanceMsgDetail.ccParticipants,
                          'appUserId',
                          'userName',
                        )}
                        onUsersChanged={(users) => onUsersChanged(users, 'Cc')}
                        users={selectableParticipants}
                        editable
                      />

                      <TextEditor
                        onTextChanged={onTextChange('messageText')}
                        initialText={instanceMsgDetail.messageText}
                      />

                      <DocImagePicker
                        editable
                        initialItems={[]}
                        onItemSelected={onAttachmentChanged}
                        containerStyle={{marginVertical: AppDimensions.NORMAL}}
                      />

                      <Button
                        type="primary"
                        onPress={() =>
                          visibilities.isEdit ? onUpdate() : onSend('normal')
                        }>
                        {visibilities.isEdit ? 'Update' : 'Send'}
                      </Button>
                    </View>
                  ) : null}
                </>
              )}
            </View>
          </View>
        </View>
        {visibilities.showAttachmentDialog && (
          <PlainBaseModal
            collapsable
            onDismiss={() =>
              onVisibilityChanged('showAttachmentDialog')(false)
            }>
            <View style={styles.popUpDialog}>
              <Text
                style={{
                  ...styles.text,
                  textAlign: 'center',
                  paddingVertical: AppDimensions.NORMAL,
                }}>
                Attachments
              </Text>
              <Separator containerStyle={{marginHorizontal: AppDimensions.NORMAL}}/>
              <LoadMoreFlatList
                data={
                  messageDetail.applicationTypeDetails.mailMessageAttachmentDtos
                }
                SingleItemView={AttachmentItem}
              />
            </View>
          </PlainBaseModal>
        )}
      </ScrollView>
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {actionMenu.map((aMenu, index) => (
            <ActionButton
              key={String(index)}
              title={aMenu.title}
              icon={aMenu.icon}
              disabled={aMenu.disabled}
              onPress={onMainIconClicked}
            />
          ))}
        </ScrollView>
      </View>
    </BaseContainer>
  );
};

export default EmailDetailScreen;
const htmlStyles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});

const styles = StyleSheet.create({
  header: {
    borderTopWidth: 0.6,
    backgroundColor: AppColors.NORMAL_WHITE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: AppDimensions.NORMAL,
  },
  body: {
    // marginTop: moderateScale(45),
    // marginHorizontal: AppDimensions.NORMAL,
    // borderWidth: 1,
    // marginVertical: AppDimensions.SMALL,
  },
  htmlContainer: {
    // borderWidth: 1,
    // borderColor: AppColors.DISABLE,
    // borderRadius: AppDimensions.NORMAL,
    marginHorizontal: AppDimensions.NORMAL,
    marginVertical: AppDimensions.NORMAL,
  },
  senderInfo: {
    paddingHorizontal: AppDimensions.NORMAL,
    backgroundColor: AppColors.SMOKE_WHITE,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
  },
  specialComponentContainer: {
    borderWidth: 0.8,
    borderColor: 'red',
  },
  title: {
    ...HEADING_TEXT_SIZE,
    fontWeight: 'bold',
    marginHorizontal: AppDimensions.NORMAL,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
  },
  label: {
    ...NORMAL_TEXT_STYLE,
    fontWeight: '600',
    width: moderateScale(50),
    textAlignVertical: 'center',
    // borderWidth: 1,
  },
  smallText: {
    ...SMALLER_TEXT_STYLE,
  },
  icon: {
    height: moderateScale(20),
    width: moderateScale(20),
    tintColor: 'black',
    marginHorizontal: AppDimensions.NORMAL,
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.ITEM_BG,
    marginHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.NORMAL,
  },
  popMenuIcon: {
    width: moderateScale(20),
    padding: AppDimensions.NORMAL,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popUpDialog: {
    height: '70%',
    width: moderateScale(300),
    backgroundColor: 'white',
    borderRadius: AppDimensions.NORMAL,
  },
});

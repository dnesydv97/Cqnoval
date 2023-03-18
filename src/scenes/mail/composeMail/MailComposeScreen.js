import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, Image} from 'react-native';
import {Button, Toast, InputItem, TextareaItem} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  initialInternalMsg,
  initialMailTemplete,
  initialNewMail,
  navScreenNames,
  screenNames,
} from 'constant';
import {
  getPersonSearchSelectedItems,
  getPickerItems,
  isConnected,
  navigateToGivenScreen,
  onError,
  showFailToast,
  showSuccessToast,
  subtractArrays,
} from 'utils';
import {addOutboxMail} from 'services/redux/mail/outboxMail/action';
import {addNewSentMail} from 'services/redux/mail/sentMail/action';
import {
  BaseContainer,
  BaseCard,
  DocumentPickerItem,
  EqualSpaceHorizontalView,
  PickerView,
  TextEditor,
  TextField,
  MessageItem,
  PopMenuItem,
  EmailToggleButton,
  DirectPersonSearchBox,
  DocImagePicker,
  EmailAttachment,
  EmailAddressWithInfoPicker,
  Separator,
  DropdownMenu,
} from 'components';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {IconOutline} from '@ant-design/icons-react-native';
import {Icons} from 'assets';
import {moderateScale} from 'react-native-size-matters';
import {
  getGoalPriority,
  getMailParticipantType,
  sendInternalMessage,
  getPredefinedTempletes,
  getMailParticipantStatus,
  getAllUserList,
  getParticipanTypeEmailAddresses,
  composeEmailMessage,
  composeMessageAsDraft,
  getUserId,
  getFromEmailAddresses,
} from 'services';
import {TouchableOpacity} from 'react-native';
import {uploadFilesToServer} from 'scenes/contact/functions';

function getParticipantDto(participantUserId, emailAddress) {
  return {
    id: participantUserId,
    employeeEmailAddressHolderId: participantUserId,
    participantUserId,
    emailAddress,
    userIdName: emailAddress,
  };
}

const getAttachmentDto = (quickMessageId, uploadedFileDto) => {
  return {
    quickMessageId,
    uploadedFileDto,
    uploadedFileDomainPermisionDtos: [
      {
        uploadedFileDomainMappingId: '',
        userId: '',
        organizationLayerId: '',
        isHierarchyPermissionAllowed: true,
        isActive: true,
      },
    ],
    isActive: true,
  };
};

const MailComposeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const {emailDetail, action} = route?.params;

  console.log('Compose mail email Detail ', emailDetail, action);

  const [mailMessage, setMailMessage] = useState(initialMailTemplete);
  const [internalMessage, setInternalMessage] = useState(initialInternalMsg);
  const [visibilities, setVisibilities] = useState({
    isInternal: false,
    isCc: false,
    isBCc: false,
    loading: false,
  });
  const [emailFromInfo, setEmailFromInfo] = useState({});
  const [preLoadedData, setPreLoadedData] = useState({
    mailParticipantType: [],
    priority: [],
    predefinedTempletes: [],
    participantStatuses: [],
    allParticipants: [],
    reference: [],
    allInternalParticipants: [],
    fromParticipants: {
      requestEmployeeEmails: [],
      parentEmployeesEmails: [],
    },
  });
  const [selectableParticipants, setSelectableParticipants] = useState([]);
  const [
    internalSelectableParticipants,
    setInternalSelectableParticipants,
  ] = useState([]);
  const [myEmails, setMyEmails] = useState([]);
  const email = ['admin@infocom.com.np', 'admin@ispl.com.np']
  useEffect(() => {
    getRequiredData();
    updateMyEmails();
  }, []);

  useEffect(() => {
    emailDetail && updateEmailDetailAccToAction();
  }, [emailDetail, action]);

  useEffect(() => {
    setSelectableParticipants(
      subtractArrays(
        preLoadedData.allParticipants,
        [
          ...mailMessage.toParticipants,
          ...mailMessage.ccParticipants,
          ...mailMessage.bccParticipants,
        ],
        'emailAddress',
        'emailAddress',
      ),
    );
  }, [
    preLoadedData.allParticipants,
    mailMessage.toParticipants,
    mailMessage.ccParticipants,
    mailMessage.bccParticipants,
  ]);

  useEffect(() => {
    setInternalSelectableParticipants(
      subtractArrays(
        preLoadedData.allInternalParticipants,
        [
          ...internalMessage.toParticipants,
          ...internalMessage.ccParticipants,
          ...internalMessage.bccParticipants,
        ],
        'appUserId',
        'participantUserId',
      ),
    );
  }, [
    preLoadedData.allInternalParticipants,
    internalMessage.toParticipants,
    internalMessage.ccParticipants,
    internalMessage.bccParticipants,
  ]);

  async function updateMyEmails() {
    const myUserId = await getUserId();
    const myEmails = preLoadedData.allParticipants.filter(
      (item) => item.senderId === myUserId,
    );
    console.log('updateMyEmails ', myUserId, myEmails);
    setMyEmails(myEmails);
  }

  function getRequiredData() {
    Promise.all([
      getGoalPriority(),
      getMailParticipantType(),
      getPredefinedTempletes(),
      getMailParticipantStatus(),
      // getParticipanTypeEmailAddresses(),
      getAllUserList(),
      getFromEmailAddresses(),
    ]).then((response) => {
      console.log('Compose Mail Required Data response ', response);
      setPreLoadedData({
        ...preLoadedData,
        priority: response[0].data,
        mailParticipantType: response[1].data,
        predefinedTempletes: response[2].data,
        participantStatuses: response[3].data,
        // reference: response[4].data,
        // allParticipants: response[5].data,
        allInternalParticipants: response[4].data,
        fromParticipants: response[5].data,
      });
    });
  }

  function updateEmailDetailAccToAction() {
    let data = initialMailTemplete;
    data.title = emailDetail.title;

    data.priorityId = emailDetail.applicationTypeDetails.priorityId;
    data.referenceId = emailDetail.applicationTypeDetails.referenceId;
    data.emailMessageAttachmentDtos =
      emailDetail.applicationTypeDetails.mailMessageAttachmentDtos;

    let tempFrom = getParticipantDto(
      emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos
        .participantFrom.participantUserId,
      emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos
        .participantFrom.participantUserDto.userIdName,
    );
    let tempTo = [],
      tempCc = [],
      tempBcc = [];

    emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos.participantTos.map(
      (item) => {
        tempTo.push(
          getParticipantDto(
            item.participantUserId,
            item.participantUserDto.userIdName,
          ),
        );
      },
    );
    emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos.participantBCCs.map(
      (item) => {
        tempBcc.push(
          getParticipantDto(
            item.participantUserId,
            item.participantUserDto.userIdName,
          ),
        );
      },
    );
    emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos.participantCCs.map(
      (item) => {
        tempCc.push(
          getParticipantDto(
            item.participantUserId,
            item.participantUserDto.userIdName,
          ),
        );
      },
    );

    if (action === 'reply') {
      data.body = `<div><p>----- Reply ------</p></br> ${emailDetail.applicationTypeDetails.description} </div>`;
      data.toParticipants = [tempFrom];
      data.ccParticipants = [];
      data.bccParticipants = [];
    } else if (action === 'replyAll') {
      data.body = `<div><p>----- Reply ------</p></br> ${emailDetail.applicationTypeDetails.description} </div>`;
      data.toParticipants = [tempFrom];
      data.ccParticipants = tempTo;
      data.bccParticipants = tempCc;
    } else if (action === 'forward') {
      data.body = `<div><p>-----This is forwarded message of ${emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos?.participantFrom?.participantUserDto?.userName} ------</p></br> ${emailDetail.applicationTypeDetails.description} </div>`;
      data.toParticipants = [];
      data.ccParticipants = [];
      data.bccParticipants = [];
    } else if (action === 'intForward') {
      data.body = `<div><p>-----This is internally forwarded message of ${emailDetail.applicationTypeDetails.mailMessageParticipantWithTypeDtos?.participantFrom?.participantUserDto?.userName} ------</p></br> ${emailDetail.applicationTypeDetails.description} </div>`;
      data.toParticipants = [];
      data.ccParticipants = [];
      data.bccParticipants = [];
    } else if (action === 'followUp') {
      data.toParticipants = tempTo;
      data.ccParticipants = tempCc;
      data.bccParticipants = tempBcc;
    } else if (action === 'resend') {
      data.toParticipants = tempTo;
      data.ccParticipants = tempCc;
      data.bccParticipants = tempBcc;
    } else if (action === 'refParty') {
      data.toParticipants = tempTo;
      data.ccParticipants = tempCc;
      data.bccParticipants = tempBcc;
    }

    setMailMessage(data);
  }

  const popUpMenu = [
    {
      label: 'As Archive',
      onPress: () => {},
    },
    {
      label: 'As Pending',
      onPress: () => {},
    },
  ];

  const onTextChange = (key) => (value) =>
    setMailMessage({
      ...mailMessage,
      [key]: value,
    });

  const onInternalTextChange = (key) => (value) =>
    setInternalMessage({
      ...internalMessage,
      [key]: value,
    });

  const onVisbilitiesChanged = (key) => (value) =>
    setVisibilities({
      ...visibilities,
      [key]: value,
    });

  const setLoading = (value) =>
    setVisibilities({
      ...visibilities,
      loading: value,
    });

  function onInternalUsersChanged(userList, type) {
    console.log('onInternalUsersChanged ', userList, type);
    const participantType = preLoadedData.mailParticipantType.find(
      (item) => item.systemname === type,
    );
    if (participantType) {
      const convertedUsers = userList.map((item) => {
        let user = getParticipantDto(item.appUserId, item.userIdName);

        return user;
      });

      if (type === 'Cc') onInternalTextChange('ccParticipants')(convertedUsers);
      else if (type === 'Bcc')
        onInternalTextChange('bccParticipants')(convertedUsers);
      else if (type === 'To')
        onInternalTextChange('toParticipants')(convertedUsers);
    }
  }

  function onUsersChanged(userList, type) {
    console.log('onUsersChanged ', userList, type);
    const participantType = preLoadedData.mailParticipantType.find(
      (item) => item.systemname === type,
    );
    if (participantType) {
      const convertedUsers = userList.map((item) => {
        if (item) {
          let user = getParticipantDto(
            item.employeeEmailAddressHolderId,
            item.emailAddress,
          );
          return user;
        }
      });

      if (type === 'Cc') onTextChange('ccParticipants')(convertedUsers);
      else if (type === 'Bcc') onTextChange('bccParticipants')(convertedUsers);
      else if (type === 'From')
        onTextChange('participantFrom')(
          convertedUsers[0] ? convertedUsers[0] : convertedUsers[1],
        );
      else if (type === 'To') onTextChange('toParticipants')(convertedUsers);
    }
  }

  const onAttachmentChanged = (attachments) => {
    console.log('Selected attachments ', attachments);
    uploadFilesToServer(attachments, setLoading, onUploadCompleted);
  };

  const onUploadCompleted = (tempFiles = []) => {
    visibilities.isInternal
      ? onInternalTextChange('emailInstanceMessageAttachmentDtos')(tempFiles)
      : onTextChange('emailMessageAttachmentDtos')(tempFiles);
  };

  const onDraft = (statusName) => {
    // isConnected
    //   ? dispatch(addOutboxMail(newMail))
    //   : dispatch(addNewSentMail(newMail));

    // const foundStatus = preLoadedData.participantStatuses.find(
    //   (status) => status.systemName === statusName,
    // );

    let data = {...mailMessage};
    let internalData = {...internalMessage};
    data.emailMessageStatusName = statusName;
    data.emailMessageDraftParticipantWithEmaileDtos = {
      participantFrom: mailMessage.participantFrom,
      participantTos: mailMessage.toParticipants,
      participantCCs: mailMessage.ccParticipants,
      participantBCCs: mailMessage.bccParticipants,
    };

    if (internalMessage.description && internalMessage.toParticipants.length) {
      data.emailInstanceMessageAddDto.subject = mailMessage.title;

      data.emailInstanceMessageAddDto = internalData;
      data.emailInstanceMessageAddDto.emailInstanceMessageStatusName = statusName;
      data.emailInstanceMessageAddDto.emailMessageParticipantWithTypeDtos = {
        participantTos: internalData.toParticipants,
        participantCCs: internalData.ccParticipants,
        participantBCCs: internalData.bccParticipants,
        participantFrom: mailMessage.participantFrom,
      };
    } else data.emailInstanceMessageAddDto = null;

    delete data.toParticipants;
    delete data.ccParticipants;
    delete data.bccParticipants;
    delete data.participantFrom;

    if (data.emailInstanceMessageAddDto) {
      delete data.emailInstanceMessageAddDto.toParticipants;
      delete data.emailInstanceMessageAddDto.ccParticipants;
      delete data.emailInstanceMessageAddDto.bccParticipants;
      delete data.emailInstanceMessageAddDto.instanceMessageStatusId;
      delete data.emailInstanceMessageAddDto.mailMessageCenterId;
      delete data.emailInstanceMessageAddDto.messageText;
      delete data.emailInstanceMessageAddDto.orderNumber;
      delete data.emailInstanceMessageAddDto.priorityId;
      delete data.emailInstanceMessageAddDto.partyId;
      delete data.emailInstanceMessageAddDto.predefinedMsg;
      delete data.emailInstanceMessageAddDto.quickMessageStatusId;
      delete data.emailInstanceMessageAddDto.quickMessageStatusName;
      delete data.emailInstanceMessageAddDto.replyOfInstanceMessageId;
      delete data.emailInstanceMessageAddDto.quickMessageParticipantDtos;
      delete data.emailInstanceMessageAddDto.mailMessageParticipantWithTypeDtos;
    }

    const getDetail = () => {
      setLoading(true);
      getFromEmailAddresses()
        .then((response) => {
          setLoading(false);
          if(response.status === 200) {
            dataForView(response.data);
          } else {
            onError(response.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          onError(error);
        });
    };

    const dataForView = (data) => {
      setEmailFromInfo(data);
    }
    
    console.log('data ', data, JSON.stringify(data));
    setLoading(true);
    composeMessageAsDraft(data)
    .then((response) => {
      setLoading(false);
      console.log('Email Message draft response ', response);
      if (response.status === 200) {
        showSuccessToast('Email Message Saved as Draft !!!');
        setMailMessage(initialMailTemplete);
        setTimeout(() => {
          setInternalMessage(initialInternalMsg);
        }, 20);
        navigateToGivenScreen(navigation, navScreenNames.NAV_INBOX_SCREEN);
      } else showFailToast('Sorry, We failed to draft the message.');
    })
    .catch((error) => {
      setLoading(false);
      onError(error);
      showFailToast('Sorry, We failed to draft the message.');
    });
  };
  
  const onSend = (statusName) => {
    // isConnected
    //   ? dispatch(addOutboxMail(newMail))
    //   : dispatch(addNewSentMail(newMail));
    
    // const foundStatus = preLoadedData.participantStatuses.find(
      //   (status) => status.systemName === statusName,
      // );
      // data.quickMessageStatusId = foundStatus.id;
      
      let data = {...mailMessage};
      let internalData = {...internalMessage};
      data.emailMessageStatusName = statusName;
      data.emailMessageParticipantWithTypeDtos = {
        participantFrom: mailMessage.participantFrom,
        participantTos: mailMessage.toParticipants,
        participantCCs: mailMessage.ccParticipants,
        participantBCCs: mailMessage.bccParticipants,
      };
      
      if (internalMessage.description && internalMessage.toParticipants.length) {
        data.emailInstanceMessageAddDto.subject = mailMessage.title;
        
        data.emailInstanceMessageAddDto = internalData;
        data.emailInstanceMessageAddDto.emailInstanceMessageStatusName = statusName;
      data.emailInstanceMessageAddDto.emailMessageParticipantWithTypeDtos = {
        participantTos: internalData.toParticipants,
        participantCCs: internalData.ccParticipants,
        participantBCCs: internalData.bccParticipants,
        participantFrom: mailMessage.participantFrom,
      };
    } else data.emailInstanceMessageAddDto = null;

    delete data.toParticipants;
    delete data.ccParticipants;
    delete data.bccParticipants;
    delete data.participantFrom;
    delete data.id;
    
    if (data.emailInstanceMessageAddDto) {
      delete data.emailInstanceMessageAddDto.toParticipants;
      delete data.emailInstanceMessageAddDto.ccParticipants;
      delete data.emailInstanceMessageAddDto.bccParticipants;
      delete data.emailInstanceMessageAddDto.instanceMessageStatusId;
      delete data.emailInstanceMessageAddDto.mailMessageCenterId;
      delete data.emailInstanceMessageAddDto.messageText;
      delete data.emailInstanceMessageAddDto.orderNumber;
      delete data.emailInstanceMessageAddDto.priorityId;
      delete data.emailInstanceMessageAddDto.partyId;
      delete data.emailInstanceMessageAddDto.predefinedMsg;
      delete data.emailInstanceMessageAddDto.quickMessageStatusId;
      delete data.emailInstanceMessageAddDto.quickMessageStatusName;
      delete data.emailInstanceMessageAddDto.replyOfInstanceMessageId;
      delete data.emailInstanceMessageAddDto.quickMessageParticipantDtos;
      delete data.emailInstanceMessageAddDto.mailMessageParticipantWithTypeDtos;
    }
    
    console.log('data ', data, JSON.stringify(data), internalMessage);
    setLoading(true);
    composeEmailMessage(data)
    .then((response) => {
      setLoading(false);
      console.log('Email Message post response ', response);
      if (response.status === 200) {
        showSuccessToast('Email Message Sent !!!');
        setMailMessage(initialMailTemplete);
        setTimeout(() => {
          setInternalMessage(initialInternalMsg);
        }, 20);
        navigateToGivenScreen(navigation, navScreenNames.NAV_INBOX_SCREEN);
      } else showFailToast('Sorry, We failed to send the message.');
    })
    .catch((error) => {
      setLoading(false);
      onError(error);
      showFailToast('Sorry, We failed to send the message.');
    });
  };
  
  const onSearchQuery = (searchKeyword) => {
    // console.log('Search query ', searchKeyword);
    if (searchKeyword) {
      console.log('Debounced Search query ', searchKeyword);
      getParticipanTypeEmailAddresses(searchKeyword)
      .then((response) => {
          console.log('Search participants response ', response);
          if (response.status === 200) {
            setPreLoadedData({
              ...preLoadedData,
              allParticipants: response.data,
            });
          }
        })
        .catch((error) => {
          onError(error);
        });
    }
  };
  
  const RightIcon = () => (
    <IconOutline
      name="plus"
      size={30}
      color={AppColors.PRIMARY_DARK}
      onPress={() =>
        navigateToGivenScreen(
          navigation,
          navScreenNames.NAV_COMPOSE_INTERNAL_SCREEN,
          )
      }
      />
  );
  
  const MoreItem = () => (
    <View style={styles.iconStyle}>
      <Image
        source={Icons.upDownArrowIcon}
        style={styles.iconStyle}
        resizeMode="contain"
        />
    </View>
  );
  const SendIcon = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row', marginVertical: AppDimensions.NORMAL}}>
        <Text style={{color: AppColors.ACCENT, fontWeight:'bold', fontSize: moderateScale(14), right: moderateScale(10)}} onPress={() => onSend('Normal')}>
          Send
        </Text>
      </View>
    )
  };
  function prepareData() {}
  
  return (
    <BaseContainer
    // isDrawer
    toolbarTitle='Mailbox \ Compose'
    scrollable
    // showToolbarRightIcon
    // loading={visibilities.loading}
    // toolbarRightIcon={RightIcon}
    toolbarRightIcon={SendIcon}
    >
      <BaseCard>
        <EmailToggleButton
          onToggle={onVisbilitiesChanged('isInternal')}
          isInternal={visibilities.isInternal}
          />
        {visibilities.isInternal ? (
          <>
            <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
              <Text style={styles.labelText}>To </Text>
              <DirectPersonSearchBox
                selectedUsers={getPersonSearchSelectedItems(
                  internalMessage.toParticipants,
                  'appUserId',
                  'userIdName',
                  )}
                  onUsersChanged={(users) => onInternalUsersChanged(users, 'To')}
                users={internalSelectableParticipants}
                editable
              />

              {/* <EmailAddressWithInfoPicker
                selectedUsers={internalMessage.toParticipants}
                onUsersChanged={(users) => onUsersChanged(users, 'To')}
                users={selectableParticipants}
                editable
              /> */}
            </EqualSpaceHorizontalView>
            <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
              <Text style={styles.labelText}>Cc </Text>
              <DirectPersonSearchBox
                selectedUsers={getPersonSearchSelectedItems(
                  internalMessage.ccParticipants,
                  'appUserId',
                  'userIdName',
                )}
                onUsersChanged={(users) => onInternalUsersChanged(users, 'Cc')}
                users={internalSelectableParticipants}
                editable
                />

              {/* <EmailAddressWithInfoPicker
                selectedUsers={internalMessage.ccParticipants}
                onUsersChanged={(users) => onUsersChanged(users, 'Cc')}
                users={selectableParticipants}
                editable
              /> */}
            </EqualSpaceHorizontalView>

            {/* <PickerView
              placeholder={{label: 'Select Predefined Messages'}}
              containerStyle={styles.containerStyle}
              pickerStyle={styles.pickerStyle}
              editable
              />
            <Separator/> */}
            <TextEditor
              onTextChanged={onInternalTextChange('description')}
              initialText={internalMessage.description}
              />
          </>
        ) : (
          <>
            <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
              <Text style={styles.labelText}>From </Text>
              {/* <EmailAddressWithInfoPicker
                selectedUsers={[mailMessage.participantFrom]}
                onUsersChanged={(users) => onUsersChanged(users, 'From')}
                users={[
                  ...preLoadedData.fromParticipants.requestEmployeeEmails,
                  ...preLoadedData.fromParticipants.parentEmployeesEmails,
                ]}
                onSearchQuery={onSearchQuery}
                editable
                />
              {console.log("From Participant", preLoadedData.fromParticipants.requestEmployeeEmails)} */}
              <PickerView
                placeholder={{label: 'Select an email'}}
                items={getPickerItems(preLoadedData.fromParticipants.requestEmployeeEmails, 'emailAddress', 'employeeEmailAddressHolderId')}
                onValueChange={(users) => onUsersChanged(users, 'From')}
                value={mailMessage.participantFrom}
                containerStyle={styles.containerStyle}
                pickerStyle={styles.pickerStyle}
                editable
              />
            </EqualSpaceHorizontalView>


            <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
              <Text style={styles.labelText}>To </Text>
              <EmailAddressWithInfoPicker
                selectedUsers={mailMessage.toParticipants}
                onUsersChanged={(users) => onUsersChanged(users, 'To')}
                users={selectableParticipants}
                onSearchQuery={onSearchQuery}
                editable
                />
            </EqualSpaceHorizontalView>
                {console.log("Data inside all participant inside preloadedData", preLoadedData.allParticipants)}

            <EqualSpaceHorizontalView
              containerStyle={{
                borderBottomWidth: 0.5,
                borderBottomColor: AppColors.DISABLE,
              }}>
              {/* <TouchableOpacity
                style={styles.textBtnContiner}
                onPress={() =>
                  onVisbilitiesChanged('isCc')(!visibilities.isCc)
                }>
                <Text style={styles.textBtn}>Cc</Text>
              </TouchableOpacity> */}
              <Text style={styles.labelText}>Cc </Text>
                <EmailAddressWithInfoPicker
                  selectedUsers={mailMessage.ccParticipants}
                  onUsersChanged={(users) => onUsersChanged(users, 'Cc')}
                  users={selectableParticipants}
                  onSearchQuery={onSearchQuery}
                  editable
                />
              <TouchableOpacity
                style={styles.textBtnContiner}
                onPress={() =>
                  onVisbilitiesChanged('isBCc')(!visibilities.isBCc)
                }>
                <Text style={styles.textBtn}>Bcc</Text>
              </TouchableOpacity>
            </EqualSpaceHorizontalView>
            {visibilities.isCc && (
              <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
                <Text style={styles.labelText}>Cc </Text>
                <EmailAddressWithInfoPicker
                  selectedUsers={mailMessage.ccParticipants}
                  onUsersChanged={(users) => onUsersChanged(users, 'Cc')}
                  users={selectableParticipants}
                  onSearchQuery={onSearchQuery}
                  editable
                />
              </EqualSpaceHorizontalView>
            )}
            {visibilities.isBCc && (
              <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
                <Text style={styles.labelText}>Bcc </Text>
                <EmailAddressWithInfoPicker
                  selectedUsers={mailMessage.bccParticipants}
                  onUsersChanged={(users) => onUsersChanged(users, 'Bcc')}
                  users={selectableParticipants}
                  onSearchQuery={onSearchQuery}
                  editable
                />
              </EqualSpaceHorizontalView>
            )}
            {console.log("Reference Id", mailMessage.referenceId)}
            <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
              <Text style={styles.labelText}>Ref </Text>
              <TextInput
                containerStyle={{}}
              />
              {/* <PickerView
                placeholder={{label: 'Set Refernce'}}
                items={getPickerItems(preLoadedData.reference, 'name', 'id')}
                onValueChange={onTextChange('referenceId')} 
                value={mailMessage.referenceId}
                containerStyle={styles.containerStyle}
                pickerStyle={styles.pickerStyle}
                editable
              />   */}
            </EqualSpaceHorizontalView>
            <EqualSpaceHorizontalView containerStyle={styles.horizontalView}>
              <Text style={styles.labelText}>Subject</Text>
              <TextField
                clear
                value={mailMessage.title}
                onChangeText={onTextChange('title')}
                // placeholder="Subject"
                containerStyle={{flex: 1, marginVertical: moderateScale(1)}}
                // containerStyle={styles.containerStyle}
                editable
              />
            </EqualSpaceHorizontalView>
            <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth,paddingVertical: moderateScale(12), justifyContent: 'space-between'}}>
              <EmailAttachment
                editable
                initialItems={[]}
                onItemSelected={onAttachmentChanged}
              />
            </View>
            <EqualSpaceHorizontalView>
              <View style={{borderBottomWidth: 0.5, flex: 1, alignItems:'center', flexDirection: 'row'}}>
              {/* <PickerView
                placeholder={{label: 'Select Reference'}}
                containerStyle={styles.containerStyle}
                pickerStyle={styles.pickerStyle}
                editable
              /> */}
              <Text style={{fontSize: moderateScale(14), alignItems: 'center', borderRightWidth: 0.8, paddingRight: moderateScale(10)}}>Prority</Text>

              <PickerView
                placeholder={{label: 'Set Priority'}}
                items={getPickerItems(preLoadedData.priority, 'name', 'id')}
                onValueChange={onTextChange('priorityId')}
                value={mailMessage.priorityId}
                containerStyle={styles.containerStyle}
                pickerStyle={styles.pickerStyle}
                editable
              />   
              </View>
              
            </EqualSpaceHorizontalView>
            {/* <PickerView
              placeholder={{label: 'Select Predefined Messages'}}
              items={getPickerItems(preLoadedData.predefinedTempletes, )}
              containerStyle={styles.containerStyle}
              pickerStyle={styles.pickerStyle}
              editable
            />
            <Separator/> */}
            <TextEditor
              onTextChanged={onTextChange('body')}
              initialText={mailMessage.body}
            />
            {/* <DocImagePicker
              editable
              initialItems={[]}
              onItemSelected={onAttachmentChanged}
            /> */}
          </>
        )}
      </BaseCard>
      {/* <EqualSpaceHorizontalView
        containerStyle={{marginHorizontal: AppDimensions.SMALL}}>
        <Button type="warning" onPress={onSend}>
          Cancel
        </Button>
        <Button type="ghost" onPress={() => onDraft('Draft')}>
          Save As Draft
        </Button>
        <View style={styles.sendBtnContainer}>
          <Button type="primary" onPress={() => onSend('Normal')}>
            Send
          </Button>
          <PopMenuItem ButtonComponent={MoreItem} menuItems={popUpMenu} />
        </View>
      </EqualSpaceHorizontalView> */}
    </BaseContainer>
  );
};

export default MailComposeScreen;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  containerStyle: {
    flex: 1,
    // borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.ITEM_BG,
    marginHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.NORMAL,
  },
  horizontalView: {
    justifyContent: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: AppColors.DISABLE,
  },
  textBtnContiner: {
    marginHorizontal: moderateScale(-8),
    borderRadius: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
    // backgroundColor: AppColors.LIST_ITEM_BG,
  },
  textBtn: {
    ...NORMAL_TEXT_STYLE,
    padding: AppDimensions.NORMAL,
  },
  labelText: {
    ...NORMAL_TEXT_STYLE,
    width: '16%',
  },
  sendBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.PRIMARY_DARK,
    borderRadius: AppDimensions.NORMAL,
  },
  pickerStyle: {
    paddingVertical: AppDimensions.SMALLER
  },
  iconStyle: {
    width: moderateScale(20),
    padding: AppDimensions.NORMAL,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  AppColors,
  AppDimensions,
  HEADING_TEXT_SIZE,
  NORMAL_HEADING_TEXT_SIZE,
  NORMAL_TEXT_STYLE,
  SMALLER_TEXT_STYLE,
  SMALLEST_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {navScreenNames, screenNames} from 'constant';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {
  AddEditUpdateButton,
  BaseCard,
  BaseContainer,
  DateTimePicker,
  DocumentPickerItem,
  EqualSpaceHorizontalView,
  PickerView,
  MoreDocumnetPicker,
  TextField,
  DateTimeRangePicker,
  DocImagePicker,
  PersonSearchBox,
} from 'components';
import {Button, Checkbox} from '@ant-design/react-native';
import {
  checkAndGoBack,
  dateFormats,
  getDateDifference,
  getDateOnRequiredFormat,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';
import {ScrollView} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {shallowEqual, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {uploadFilesToServer} from 'scenes/contact/functions';
import DocumentPicker from 'react-native-document-picker';
import {
  getLeaveTypes,
  getLeaveTypesRemaining,
  getSupervisorList,
  getLeaveStatusList,
  postLeave,
} from 'services';

const sortBy = [
  {
    id: 1,
    label: 'Casual/Home',
    description: '5 Days Remaining',
    isSelected: false,
  },
  {
    id: 2,
    label: 'Rites',
    description: '13 Days Remaining',
    isSelected: false,
  },
  {
    id: 3,
    label: 'Sick',
    description: '14 Days Remaining',
    isSelected: false,
  },
];

const LeaveScreen = () => {
  const navigation = useNavigation();

  const profileReducer = useSelector(
    (state) => state.profileReducer,
    shallowEqual,
  );

  const [leaveTypes, setLeaveTypes] = useState(sortBy);
  const [loading, setLoading] = useState(false);
  const [preloadedData, setPreloadedData] = useState({
    superVisors: [],
    superVisorNames: [],
    leaveTypes: [],
    leaveStatusList: [],
  });
  const [leaveData, setLeaveData] = useState({
    leaveApplicationTypeId: null,
    leaveDayFrom: getDateOnRequiredFormat(),
    leaveDayTo: getDateOnRequiredFormat(),
    reason: '',
    uploadedFileDtos: [],
    leaveDays: 1,
    isHalfDay: false,
  });

  // useEffect(() => {
  //   console.log('Profile ', profileReducer);
  //   onChangeText('leaveById')(
  //     profileReducer.data?.employeeOfficialDetailUpdateDto?.appUserId || null,
  //   );
  // }, [profileReducer]);

  useEffect(() => {
    getRequiredData();
  }, []);

  const LeaveType = (props) => {
    const {leaveType} = props;
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          width: moderateScale(150),
          backgroundColor: leaveType.isSelected
            ? AppColors.LIST_ITEM_BLUE
            : AppColors.LIST_ITEM_BG,
          borderWidth: 1,
          borderColor: leaveType.isSelected
            ? AppColors.LIST_ITEM_BLUE
            : AppColors.DISABLE,
          borderRadius: AppDimensions.SMALL,
          margin: AppDimensions.SMALL,
          padding: AppDimensions.SMALL,
        }}
        onPress={() => onLeaveTypeSelected(leaveType)}>
        <View
          style={[
            {
              height: 15,
              width: 15,
              borderRadius: 9,
              borderWidth: 1,
              marginHorizontal: AppDimensions.SMALL,
              borderColor: leaveType.isSelected
                ? AppColors.PRIMARY_DARK
                : AppColors.DISABLE,
              alignItems: 'center',
              justifyContent: 'center',
            },
            props.style,
          ]}>
          {leaveType.isSelected ? (
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 6,
                backgroundColor: AppColors.PRIMARY,
              }}
            />
          ) : null}
        </View>
        <View>
          <Text style={{...styles.normalText, fontWeight: '600'}}>
            {leaveType.leaveApplicationTypeDto?.leaveTypeName}
          </Text>
          <Text style={{...styles.smallText, width: '100%'}}>
            {`${leaveType.leaveApplicationTypeDto?.allocatedDays} Days Alloted`}
          </Text>
          <Text style={{...styles.smallText, width: '100%'}}>
            {`${leaveType.remainingLeave} Days Remaining`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  function onLeaveTypeSelected(leaveType) {
    const newLeaveTypes = preloadedData.leaveTypes.map((item) => {
      return {
        ...item,
        isSelected:
          item.leaveApplicationTypeId === leaveType.leaveApplicationTypeId,
      };
    });

    setPreloadedData({
      ...preloadedData,
      leaveTypes: newLeaveTypes,
    });

    onChangeText('leaveApplicationTypeId')(leaveType.leaveApplicationTypeId);
  }

  const onChangeText = (key) => (value) =>
    setLeaveData({
      ...leaveData,
      [key]: value,
    });

  function onDateChanged(dateRange) {
    setLeaveData({
      ...leaveData,
      leaveDayFrom: dateRange.startDate,
      leaveDayTo: dateRange.endDate,
      leaveDays: getDateDifference(dateRange.endDate, dateRange.startDate) + 1,
    });
  }

  function onHalfDayChecked(checked) {
    onChangeText('leaveDays')(
      checked ? leaveData.leaveDays - 0.5 : leaveData.leaveDays + 0.5,
    );

    setTimeout(() => {
      onChangeText('isHalfDay')(checked);
    }, 100);
  }
  const onAttachmentChanged = (attachments) => {
    console.log('Selected attachments ', attachments);
    uploadFilesToServer(attachments, setLoading, onUploadCompleted);
  };

  const onUploadCompleted = (tempFiles = []) => {
    onChangeText('uploadedFileDtos')(tempFiles);
  };

  function getRequiredData() {
    setLoading(true);
    Promise.all([
      getLeaveTypesRemaining(),
      // getSupervisorList(),
      // getLeaveStatusList(),
    ])
      .then((response) => {
        setLoading(false);
        console.log('Get Required Data Response ', response);
        // let names = [];
        // response[1].data.map((item) => {
        //   names.push(item.supervisorUserName);
        // });
        setPreloadedData({
          ...preloadedData,
          leaveTypes: response[0].data,
          // superVisors: response[1].data,
          // leaveStatusList: response[2].data,
          // superVisorNames: names,
        });

        // preloadedData.leaveStatusList.map((item) => {
        //   if (item.statusName === 'Pending') {
        //     onChangeText('leaveApplicationStatusId')(item.id);
        //   }
        // });

        setLeaveData({
          ...leaveData,
        });
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function onSubmit() {
    setLoading(true);
    let data = {...leaveData};
    // data.leaveForApprovalDtos = preloadedData.superVisors;
    data.leaveById =
      profileReducer.data?.employeeOfficialDetailUpdateDto?.appUserId || null;
    data.leaveDays = parseFloat(leaveData?.leaveDays || 0);

    console.log(
      'Data payload for post leave request ',
      data,
      JSON.stringify(data),
    );
    postLeave(data)
      .then((response) => {
        setLoading(false);
        console.log('Post leave response ', response);
        if (response.status === 200) {
          showSuccessToast('Leave request Success.');
          checkAndGoBack(navigation);
        } else showFailToast('Failed to post your request. Try Again.');
      })
      .catch((error) => {
        setLoading(false);
        showFailToast('Failed to post your request. Try Again.');
        onError(error);
      });
  }

  return (
    <BaseContainer toolbarTitle={screenNames.LEAVE_SCREEN} scrollable>
      <BaseCard>
        {/* <Text style={{...styles.labelText}}>Leave By</Text>
        <Text style={[styles.inputBoxContainer, styles.inputBoxStyle]}>
          {profileReducer.data?.employeePersonalDetailUpdateDto?.employeeName}
        </Text>

        <Text style={{...styles.labelText}}>For Approval By</Text>
        <Text style={[styles.inputBoxContainer, styles.inputBoxStyle]}>
          {`${preloadedData.superVisorNames}`}
        </Text> */}

        <Text style={styles.labelText}>Choose Leave Type</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {preloadedData.leaveTypes.map((item, index) => (
            <LeaveType key={String(index)} leaveType={item} />
          ))}
        </View>

        <View style={{marginVertical: AppDimensions.SMALL}}>
          <Text style={styles.labelText}>
            Leave Days (If it's half day please specify as 0.5)
          </Text>

          <EqualSpaceHorizontalView
            containerStyle={{
              flex: 1,
              alignItems: 'center',
            }}>
            <DateTimeRangePicker
              mode="date"
              mode2="date"
              separator=""
              editable
              dateFormat1={dateFormats.year_month_day_dash}
              dateFormat2={dateFormats.year_month_day_dash}
              containerStyle={{
                flex: 0.95,
              }}
              startDate={leaveData.leaveDayFrom}
              endDate={leaveData.leaveDayTo}
              onDateChanged={onDateChanged}
            />
          </EqualSpaceHorizontalView>
          <EqualSpaceHorizontalView>
            <View>
              <Checkbox onChange={(e) => onHalfDayChecked(e.target.checked)}>
                Half Day
              </Checkbox>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.labelText}>Leave Days</Text>

              <TextField
                inputTextContainerStyle={{
                  ...styles.inputBoxContainer,
                  width: moderateScale(80),
                  marginHorizontal: AppDimensions.SMALL,
                }}
                placeholder="Days"
                onChangeText={onChangeText('leaveDays')}
                value={leaveData.leaveDays.toString()}
                labelStyle={styles.labelText}
              />
            </View>
          </EqualSpaceHorizontalView>
        </View>

        <View>
          <Text style={styles.labelText}>Upload Attachments</Text>
          <DocImagePicker
            editable
            initialItems={[]}
            onItemSelected={onAttachmentChanged}
          />
          {leaveData.uploadedFileDtos.map((doc, index) => (
            <Text>{doc.displayName}</Text>

            // <MoreDocumnetPicker
            //   key={String(index)}
            //   editable
            //   uri={doc.viewFileURL}
            //   name={doc.displayFileName}
            //   //   onMinusPressed={() => onItemDel(key, index, 'document')}
            //   //   onItemSelected={sendFileToServer(
            //   //     key,
            //   //     setLoading,
            //   //     preloadedData.dynamicFileLabelTypes,
            //   //     setLogo,
            //   //     onDocumentUploaded,
            //   //   )}
            // />
          ))}
        </View>
        <TextField
          inputTextContainerStyle={{
            ...styles.inputBoxContainer,
            marginBottom: AppDimensions.NORMAL,
            height: moderateScale(100),
          }}
          label="Reason"
          placeholder="Mention your reason for leave here..."
          onChangeText={onChangeText('reason')}
          value={leaveData.reason}
          labelStyle={styles.labelText}
          multiline
          editable
        />

        <Button type="primary" onPress={onSubmit}>
          Forward To Supervisor
        </Button>
      </BaseCard>
    </BaseContainer>
  );
};

export default LeaveScreen;

const styles = StyleSheet.create({
  inputBoxContainer: {
    backgroundColor: AppColors.LIST_ITEM_BG,
    borderWidth: 0.5,
    borderColor: AppColors.ITEM_BG,
  },
  inputBoxStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.NORMAL,
    // borderWidth: 1,
    // borderColor: 'red',
  },

  datePickerContainer: {
    backgroundColor: AppColors.SMOKE_WHITE,
  },
  labelText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.NORMAL,
  },
  normalText: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
  },
  smallText: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
  },
});

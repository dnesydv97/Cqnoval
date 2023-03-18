import {IconOutline} from '@ant-design/icons-react-native';
import {Button} from '@ant-design/react-native';
import {TableRow, TextField} from 'components';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {ScrollView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {
  getLeaveDetailById,
  getLeaveStatusList,
  approveRejectLeave,
} from 'services';
import {AppColors, AppDimensions} from 'styles';
import {
  getDateOnRequiredFormat,
  onError,
  showFailToast,
  showSuccessToast,
} from 'utils';

const HistoryTableSize = [150, 100, 100, 80, 100];
const RemainingTableSize = [150, 150, 150, 150];
const HistoryTableColumns = [
  'Leave Type',
  'Leave Start',
  'Leave End',
  'Leave Days',
  'Status',
];
const RemainingTableColumns = [
  'Leave Type',
  'Allowed Leaves',
  'Leaves Taken',
  'Leaves Remaining',
];

const LeaveMessage = ({id = null}) => {
  const [leaveDetail, setLeaveDetail] = useState();
  const [LeaveStatus, setLeaveStatus] = useState([]);
  const [Tables, setTables] = useState({
    historyTable: [],
    remainingTable: [],
  });

  const [acceptRejectRemarks, setAcceptRejectRemarks] = useState('');

  useEffect(() => {
    id && getLeaveDetails();
    getLeaveStatus();
  }, [id]);

  function getLeaveDetails() {
    getLeaveDetailById(id)
      .then((response) => {
        console.log('Leave Detail response ', response);
        if (response.status === 200) {
          setLeaveDetail(response.data);
          const tempRemaining = [];
          const tempHistory = [];

          response.data.remaining.map((item) => {
            tempRemaining.push([
              item.leaveApplicationTypeDto.leaveTypeName,
              item.allowedleave,
              item.takenLeave,
              item.remainingLeave,
            ]);
          });

          response.data.history.map((item) => {
            tempHistory.push([
              item.leaveApplicationTypeDto.leaveTypeName,
              item.leaveDayFrom,
              item.leaveDayTo,
              item.leaveDays,
              item.requisitionApplicationStatusDto.displayName,
            ]);
          });

          setTables({
            historyTable: tempHistory,
            remainingTable: tempRemaining,
          });
        }
      })
      .catch((error) => {
        onError(error);
      });
  }

  function getLeaveStatus() {
    getLeaveStatusList()
      .then((response) => {
        console.log('Leave Status list response ', response);
        if (response.status === 200) {
          setLeaveStatus(response.data);
        }
      })
      .catch((error) => {
        onError(error);
      });
  }

  function acceptRejectLeave(isAccept) {
    if (!acceptRejectRemarks) {
      showFailToast('Please provide Accept/Reject Remarks to continue.');
      return;
    }
    let foundStatus = LeaveStatus.find((item) =>
      isAccept ? item.systemName == 'Approved' : item.systemName == 'Rejected',
    );

    const data = {
      leaveApplicationId: leaveDetail.details.id,
      approveRejectRemarks: acceptRejectRemarks,
      approveRejectStatusId: foundStatus?.id,
    };

    console.log('Accept Reject api payload ', data);

    approveRejectLeave(data)
      .then((response) => {
        console.log('Approve and Reject Application response ', response);
        if (response.status === 200) {
          showSuccessToast(
            `Leave application is successfully ${
              isAccept ? 'Accepted' : 'Rejected'
            }`,
          );

          setLeaveDetail({
            ...leaveDetail,
            details: {
              ...leaveDetail.details,
              leaveApplicationCurrentStatusDto: foundStatus,
            },
          });
        }
      })
      .catch((error) => {
        onError(error);
      });
  }

  const StepView = ({status, text}) => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          backgroundColor:
            status === 'current'
              ? AppColors.PRIMARY_DARK
              : AppColors.SMOKE_WHITE,
          borderColor:
            status === 'comming' ? AppColors.UTIL : AppColors.PRIMARY_DARK,
          borderWidth: 1,
          height: moderateScale(25),
          width: moderateScale(25),
          borderRadius: moderateScale(12),
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: AppDimensions.SMALL,
        }}>
        <Text
          style={{
            color:
              status === 'complete'
                ? AppColors.PRIMARY_DARK
                : status === 'current'
                ? AppColors.SMOKE_WHITE
                : AppColors.UTIL,
          }}>
          {status === 'complete' ? '✓' : status === 'current' ? '2' : '3'}
        </Text>
      </View>
      <Text
        style={{
          color: status === 'comming' ? AppColors.UTIL : AppColors.PRIMARY_TEXT,
        }}>
        {text}
        {/* {status === 'complete'
          ? 'Apply'
          : status === 'current'
          ? 'Pending'
          : 'Approved'} */}
      </Text>
    </View>
  );

  const HorizontalLine = ({width = 30, color = AppColors.DISABLE}) => (
    <View
      style={{
        height: 2,
        width: width,
        backgroundColor: color,
        marginHorizontal: AppDimensions.SMALL,
      }}
    />
  );

  function getStepStatus(step) {
    return leaveDetail?.details?.leaveApplicationCurrentStatusDto
      ?.statusSystemName == 'Apply'
      ? step === 3
        ? 'comming'
        : 'current'
      : 'complete';
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <StepView status="complete" text="Apply" />
        <HorizontalLine />
        <StepView status={getStepStatus(2)} text="Pending" />
        <HorizontalLine />
        <StepView
          status={getStepStatus(3)}
          text={
            leaveDetail?.details?.leaveApplicationCurrentStatusDto
              ?.statusDisplayName === 'Apply'
              ? 'Approved/\nRejected'
              : leaveDetail?.details?.leaveApplicationCurrentStatusDto
                  ?.statusDisplayName
          }
        />
      </View>

      <View style={styles.body}>
        <View style={styles.countDetail}>
          <TextField
            value={`${getDateOnRequiredFormat(
              leaveDetail?.details.leaveDayFrom,
            )} --> ${getDateOnRequiredFormat(leaveDetail?.details.leaveDayTo)}`}
            editable={false}
            label="Leave Dates"
            labelStyle={styles.labelStyle}
            inputTextStyle={styles.valueStyle}
          />
          <TextField
            value={`${leaveDetail?.details.leaveDays} Day/s`}
            editable={false}
            label="Total Days"
            labelStyle={styles.labelStyle}
            inputTextStyle={styles.valueStyle}
          />
        </View>
        <TextField
          value={leaveDetail?.details.leaveApplicationTypeDto.leaveTypeName}
          editable={false}
          label="Leave Type"
          labelStyle={styles.labelStyle}
          inputTextStyle={styles.valueStyle}
        />
      </View>

      <TextField
        value={leaveDetail?.details.reason}
        editable={false}
        label="Reason"
        labelStyle={styles.labelStyle}
        inputTextStyle={styles.valueStyle}
        multiline
      />

      <TextField
        label="Accept/Reject Remarks"
        placeholder="Your Remarks on Approve or Reject"
        value={acceptRejectRemarks}
        onChangeText={setAcceptRejectRemarks}
        labelStyle={styles.labelStyle}
        inputTextStyle={styles.valueStyle}
        multiline
        editable={
          leaveDetail?.details?.isSupervisor &&
          leaveDetail?.details.leaveApplicationCurrentStatusDto
            .statusSystemName == 'Apply'
        }
        containerStyle={{marginBottom: AppDimensions.NORMAL}}
      />

      {leaveDetail?.details?.isSupervisor &&
        leaveDetail?.details.leaveApplicationCurrentStatusDto
          .statusSystemName == 'Apply' && (
          <View style={styles.buttonContainer}>
            <Button type="warning" onPress={() => acceptRejectLeave(false)}>
              Reject
            </Button>
            <Button type="primary" onPress={() => acceptRejectLeave(true)}>
              Accept
            </Button>
          </View>
        )}

      <ScrollView horizontal>
        <View style={{borderWidth: 0.5}}>
          <TableRow
            row={HistoryTableColumns}
            size={HistoryTableSize}
            isHeader
          />
          {Tables.historyTable.length ? (
            Tables.historyTable.map((item, index) => (
              <TableRow row={item} size={HistoryTableSize} index={index} />
            ))
          ) : (
            <Text style={{textAlign: 'center'}}>
              Sorry, there is no history to display
            </Text>
          )}
        </View>
      </ScrollView>

      <ScrollView
        horizontal
        style={{borderWidth: 0.5, marginVertical: AppDimensions.NORMAL}}>
        <View style={{borderWidth: 0.5}}>
          <TableRow
            row={RemainingTableColumns}
            size={RemainingTableSize}
            isHeader
          />
          {Tables.remainingTable.length ? (
            Tables.remainingTable.map((item, index) => (
              <TableRow row={item} size={RemainingTableSize} index={index} />
            ))
          ) : (
            <Text style={{textAlign: 'center'}}>
              Sorry, there is no data to display
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaveMessage;

const styles = StyleSheet.create({
  container: {
    marginVertical: AppDimensions.SMALLER,
    backgroundColor: AppColors.MSG_BACKGROUND,
    marginBottom: AppDimensions.LARGE,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: AppDimensions.NORMAL,
    alignItems: 'center',
  },
  body: {},
  countDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  labelStyle: {
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.NORMAL,
  },
  valueStyle: {
    backgroundColor: AppColors.NORMAL_WHITE,
    paddingHorizontal: AppDimensions.NORMAL,
  },
  attachmentContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: AppDimensions.NORMAL,
    backgroundColor: AppColors.NORMAL_WHITE,
    paddingHorizontal: AppDimensions.NORMAL,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: moderateScale(200),
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    paddingVertical: AppDimensions.NORMAL,
  },
});

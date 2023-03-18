import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';
import {BaseModal} from 'components';
import DateRangePicker from 'react-native-daterange-picker';
import {AppColors} from 'styles';
import {moderateScale} from 'react-native-size-matters';

export default class DateRangePickerItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      displayedDate: moment(),
    };
  }

  setDates = (dates) => {
    this.setState({
      ...dates,
    });
    // if(dates.startDate !=='' && dates.endDate !=='')
    //     this.props.onDateRangeChange(dates);
    // else null;
  };

  render() {
    const {startDate, endDate, displayedDate} = this.state;
    return (
      <BaseModal
        visibility={this.props.visibility}
        onDismiss={() => {
          this.props.onDismiss(this.state);
        }}
        modalStyle={styles.modalStyle}
        containerStyle={styles.container}
        collapsable={this.props.collapsable}
        title={this.props.title}
        style={StyleSheet.container}>
        <DateRangePicker
          onChange={this.setDates}
          endDate={endDate}
          startDate={startDate}
          displayedDate={displayedDate}
          range
          open>
          <Text>{''}</Text>
        </DateRangePicker>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    // justifyContent: 'flex-end',
  },
  container: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
});

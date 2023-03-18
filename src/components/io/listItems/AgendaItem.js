import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {IconOutline} from '@ant-design/icons-react-native';
import {dateFormats, getDateOnRequiredFormat} from 'utils';

const ExpandableItem = ({containerStyle = {}, item}) => {
  const [expand, setExpand] = useState(false);
  return (
    <View style={{...styles.container, ...containerStyle}}>
      <View style={[styles.header, styles.bottomBorderStyle]}>
        <Text style={styles.title}>{item.agendaTitle}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.picContainer}>
            <Text style={styles.description}>Person-In-Charge</Text>
            <View style={styles.personList}>
              {item.meetingEventAgendaCandidateDtos.map((item) => (
                <Text
                  style={
                    styles.text
                  }>{`${item.candidateDto.userIdName}, `}</Text>
              ))}
            </View>
          </View>
          <IconOutline
            name={expand ? 'caret-up' : 'caret-down'}
            size={15}
            onPress={() => setExpand(!expand)}
          />
        </View>
      </View>
      {expand && (
        <View style={styles.body}>
          {item.meetingEventDecisionTodoDtos.map((item) => (
            <View style={styles.bottomBorderStyle}>
              <View style={styles.discussionContainer}>
                <Text style={styles.title}>{item.decisionTitle}</Text>
                <View style={styles.picContainer}>
                  <Text style={styles.description}>Person-In-Charge</Text>
                  <View style={styles.personList}>
                    <Text style={styles.text}>
                      {item.personInCharge
                        ? item.personInCharge.userIdName
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.description}>
                {item.dueDate
                  ? getDateOnRequiredFormat(
                      item.dueDate,
                      dateFormats.MMM_D_COMMA_YYYY,
                    )
                  : 'N/A'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
export default ExpandableItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: AppDimensions.NORMAL,
    marginVertical: AppDimensions.SMALL,
    paddingVertical: AppDimensions.NORMAL,
    backgroundColor: '#ecf0ff',
    borderRadius: AppDimensions.NORMAL,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecf0ff',
    marginHorizontal: AppDimensions.NORMAL,
  },
  body: {
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    marginHorizontal: AppDimensions.NORMAL,
    paddingVertical: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.NORMAL,
  },
  discussionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBorderStyle: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.DISABLE,
    paddingVertical: AppDimensions.SMALL,
    marginBottom: AppDimensions.NORMAL,
  },
  title: {
    ...NORMAL_TEXT_STYLE,
    color: AppColors.PRIMARY_DARK,
  },
  description: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.UTIL,
  },
  text: {
    ...NORMAL_TEXT_STYLE,
  },
  picContainer: {
    paddingHorizontal: AppDimensions.SMALL,
  },
  personList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {messages, screenNames} from 'constant';
import {BaseContainer, LoadMoreFlatList, AgendaItem} from 'components';
import {AppColors, AppDimensions} from 'styles';
import {getMeetingAgenda} from 'services';
import {onError, showSuccessToast} from 'utils';

const AgendaMinuteScreen = () => {
  const {meetingId} = useRoute()?.params;
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('meeting id ', meetingId);
    obtainAgendas();
  }, []);

  function obtainAgendas() {
    setLoading(true);
    getMeetingAgenda(meetingId)
      .then((response) => {
        setLoading(false);
        console.log('Meeting agenda response ', response);
        if (response.status === 200) setAgendas(response.data);
        else showSuccessToast(messages.FAILED_TO_GET_AGENDA);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  return (
    <BaseContainer
      toolbarTitle={screenNames.AGENDA_MINUTE_SCREEN}
      // loading={loading}
      >
      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={agendas}
          SingleItemView={AgendaItem}
          loading={loading}
        />
      </View>
    </BaseContainer>
  );
};

export default AgendaMinuteScreen;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    backgroundColor: AppColors.NORMAL_WHITE,
    paddingVertical: AppDimensions.SMALL,
    borderRadius: 10,
  },
  flatListItem: {
    padding: AppDimensions.NORMAL,
    marginTop: AppDimensions.NORMAL,
    borderRadius: 30,
  },
  expandableItem: {
    borderRadius: 10,
  },
});

import {Card} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {syncOutboxToSentMail} from 'services/redux/mail/sentMail/action';
import {BaseContainer} from 'components';
import {useRootContext} from 'utils';
import {screenNames} from 'constant';

const OutBoxScreen = () => {
  const outboxReducerData = useSelector(
    (state) => state.outBoxReducer,
    shallowEqual,
  );
  const {
    rootState: {isConnected, isInternetReachable},
  } = useRootContext();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Net info outbox ', isConnected, isInternetReachable);
    // const unsubscribe = NetInfo.addEventListener((state) => {
    if (isConnected && isInternetReachable !== null && isInternetReachable) {
      syncOutboxMail();
    }
    // });

    // return () => {
    //   unsubscribe();
    // };
  }, [isConnected, isInternetReachable]);

  const syncOutboxMail = () => {
    if (outboxReducerData.data && outboxReducerData.data.length) {
      dispatch(syncOutboxToSentMail(outboxReducerData.data));
    }
  };

  const renderItem = (item) => {
    console.log('Item ', item);
    return (
      <>
        <Card>
          <Card.Header
            title={item.subject}
            thumbStyle={{width: 30, height: 30}}
            thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
            // extra="this is extra"
          />
          <Card.Body>
            <View style={{height: 42}}>
              <Text style={{marginLeft: 16}}>{item.message}</Text>
            </View>
          </Card.Body>
          <Card.Footer content="footer content" extra="footer extra content" />
        </Card>
      </>
    );
  };

  return (
    <BaseContainer isDrawer toolbarTitle={screenNames.OUTBOX_SCREEN}>
      <FlatList
        data={outboxReducerData.data || []}
        renderItem={({item, index}) => renderItem(item)}
        keyExtractor={(item) => String(Math.random())}
      />
    </BaseContainer>
  );
};

export default OutBoxScreen;

const styles = StyleSheet.create({});

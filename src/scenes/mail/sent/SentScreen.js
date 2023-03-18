import {Card} from '@ant-design/react-native';
import {BaseContainer} from 'components';
import {screenNames} from 'constant';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

const SentScreen = () => {
  const sentmailReducerData = useSelector(
    (state) => state.sentMailReducer,
    shallowEqual,
  );
  const dispatch = useDispatch();

  const renderItem = () => {
    return (
      <>
        <Card>
          <Card.Header
            title="This is title"
            thumbStyle={{width: 30, height: 30}}
            thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
            extra="this is extra"
          />
          <Card.Body>
            <View style={{height: 42}}>
              <Text style={{marginLeft: 16}}>Card Content</Text>
            </View>
          </Card.Body>
          <Card.Footer content="footer content" extra="footer extra content" />
        </Card>
      </>
    );
  };

  return (
    <BaseContainer isDrawer toolbarTitle={screenNames.SENT_SCREEN}>
      <FlatList
        data={sentmailReducerData.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => String(Math.random())}
      />
    </BaseContainer>
  );
};

export default SentScreen;

const styles = StyleSheet.create({});

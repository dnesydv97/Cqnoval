import {BaseContainer} from 'components';
import {screenNames} from 'constant';
import React from 'react';
import {View, Text} from 'react-native';
const TaskScreen = () => {
  return (
    <BaseContainer isDrawer toolbarTitle={screenNames.TASK_SCREEN}>
      <Text> This is Task Screen.</Text>
    </BaseContainer>
  );
};
export default TaskScreen;

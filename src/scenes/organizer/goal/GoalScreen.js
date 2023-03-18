import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import {
  BaseContainer,
  PickerView,
  EqualSpaceHorizontalView,
  FloatingActionButton,
  LoadMoreFlatList,
  PopMenuItem,
  GoalItem,
} from 'components';
import {useNavigation} from '@react-navigation/native';
import {IconOutline} from '@ant-design/icons-react-native';
import {navScreenNames, screenNames} from 'constant';
import {
  navigateToGivenScreen,
  navigateToGivenScreenWithParams,
  onError,
} from 'utils';
import {
  AppColors,
  AppDimensions,
  SMALLEST_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {Checkbox} from '@ant-design/react-native';
import {getGoals} from 'services';

const getOrderDropdown = [
  {
    label: 'Alphabetical',
  },
  {
    label: 'Date',
  },
  {
    label: 'Ascending',
  },
  {
    label: 'Descending',
  },
];

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Complete Goal Flat List',
    isComplete: true,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Complete To-do Flat List',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d75',
    title: 'Complete Add To-do Section',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d67',
    title: 'Complete Calendar',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title:
      'Complete Add Goal Section Complete Add Goal Section Complete Add Goal Section',
    isComplete: true,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d45',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d47',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d09',
    title: 'Third Item',
    isComplete: true,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d10',
    title: 'Third Item',
  },
];

const GoalScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({
    totalCount: 0,
    items: [],
  });
  const [displayGoals, setDisplayGoals] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    completeFilter();
  }, [hideCompleted, goals]);

  useEffect(() => {
    obtainGoals();
  }, []);

  function obtainGoals(skipCount = 0, sortBy = '', filterBy = '') {
    setLoading(true);
    getGoals(skipCount, sortBy, filterBy)
      .then((response) => {
        setLoading(false);
        console.log('Goals response ', response);
        if (response.status === 200) setGoals(response.data);
      })
      .catch((error) => {
        setLoading(false);
        onError(error);
      });
  }

  function completeFilter() {
    const newList = hideCompleted
      ? goals.items.filter((item) => !item.isComplete)
      : goals.items;

    setDisplayGoals(newList);
  }

  function onItemPressed(item) {
    console.log('On Goal Item clicked ', item);
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_ADD_GOALS_SCREEN,
      {goalId: item.id},
    );
  }

  function onPopupAction(modifiedItem) {
    console.log('onPopupAction ', modifiedItem);
    if (modifiedItem === undefined) setLoading(true);
    else {
      setLoading(false);
      goals.items.map((item) => {
        if (item.id === modifiedItem.id) {
          item.isComplete = modifiedItem.isComplete;
          item.isActive = modifiedItem.isActive;
        }
      });
    }

    setGoals({...goals});
  }

  return (
    <BaseContainer
      isDrawer
      toolbarTitle={screenNames.GOAL_SCREEN}
      loading={loading}>
      <View style={styles.filterContainer}>
        <EqualSpaceHorizontalView>
          <PickerView
            // label="My Goals"
            placeholder={{label: 'Goal Filter By'}}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            containerStyle={{flex: 1}}
            pickerContainer={styles.pickerContainer}
            editable
          />
          <PickerView
            // label="Order By"
            items={getOrderDropdown}
            placeholder={{label: 'Order By'}}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            containerStyle={{flex: 1}}
            editable
          />
        </EqualSpaceHorizontalView>
        <Checkbox
          checked={hideCompleted}
          onChange={(e) => {
            console.log('Check box value changed ', e.target.checked);
            setHideCompleted(e.target.checked);
          }}
          style={styles.checkBox}>
          Hide Completed
        </Checkbox>
      </View>
      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={displayGoals}
          loading={loading}
          helpingData={onPopupAction}
          onLoadMore={() => console.log('Load more clicked')}
          SingleItemView={GoalItem}
          onItemClicked={onItemPressed}
          showLoadMore
        />
      </View>
      <FloatingActionButton
        onPress={() =>
          navigateToGivenScreen(navigation, navScreenNames.NAV_ADD_GOALS_SCREEN)
        }
      />
    </BaseContainer>
  );
};
export default GoalScreen;

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 0.5,
    borderRadius: 15,
  },
  pickerStyle: {
    paddingHorizontal: AppDimensions.NORMAL,
    ...SMALL_TEXT_STYLE,
  },
  pickerLabelStyle: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_TEXT,
    paddingVertical: AppDimensions.SMALLER,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: AppDimensions.SMALL,
    borderRadius: 10,
  },
  checkBox: {
    marginHorizontal: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
  },
});

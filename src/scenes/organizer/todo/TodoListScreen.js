import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  BaseContainer,
  EqualSpaceHorizontalView,
  FloatingActionButton,
  LoadMoreFlatList,
  MultiPickerView,
  PickerView,
  TodoItem,
} from 'components';
import {messages, navScreenNames, screenNames} from 'constant';
import {Checkbox} from '@ant-design/react-native';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
import {useNavigation} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {getGoalLabels, getGoalPriority, getTodoStatus} from 'services';
import {
  getMultiPickerItems,
  navigateToGivenScreenWithParams,
  onError,
  showSuccessToast,
} from 'utils';
import {
  clearTodoReducer,
  fetchTodos,
  resetAddUpdateTodoReducer,
} from 'services/redux/todo/action';

const sortBy = [
  {
    label: 'Subject',
    value: 'subject',
  },
  {
    label: 'Start Date',
    value: 'startdate',
  },
  {
    label: 'Priority',
    value: 'priority',
  },
  {
    label: 'Todo Status',
    value: 'todostatus',
  },
  {
    label: 'Todo Label',
    value: 'label',
  },
];

const TodoListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const todoRdxData = useSelector((state) => state.todoReducer, shallowEqual);

  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState({
    totalCount: 0,
    items: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    SkipCount: 0,
    ActiveStatuses: null,
    PriorityStatuses: null,
    TodoStatuses: null,
    AssignedStatus: null,
    LabelStatuses: null,
    Sorting: null,
  });
  const [preloadedData, setPreloadedData] = useState({
    todoLabels: [],
    todoPriority: [],
    todoProgress: [],
    todoSorting: sortBy,
  });

  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    getPreloadedData();
    return () => {
      dispatch(clearTodoReducer());
    };
  }, []);

  useEffect(() => {
    obtainTodos(
      0,
      filterOptions.ActiveStatuses,
      filterOptions.PriorityStatuses,
      filterOptions.TodoStatuses,
      filterOptions.AssignedStatus,
      filterOptions.LabelStatuses,
      filterOptions.Sorting,
    );
  }, [filterOptions]);

  useEffect(() => {
    console.log('todosRdxData changed ', todoRdxData);
    setLoading(todoRdxData.isLoading);
    if (!todoRdxData.isLoading && !todoRdxData.isError && todoRdxData.data) {
      setTodos(todoRdxData.data);
    }
    if (!todoRdxData.isLoading && !todoRdxData.isError && todoRdxData.updated) {
      showSuccessToast(messages.GOAL_UPDATE_SUCCESS);
      dispatch(resetAddUpdateTodoReducer());
    }
  }, [todoRdxData]);

  function getPreloadedData() {
    Promise.all([getGoalLabels(), getGoalPriority(), getTodoStatus()])
      .then((response) => {
        console.log('Preloaded Data Response', response);
        setPreloadedData({
          ...preloadedData,
          todoLabels: [{id: null, name: 'Show All'}, ...response[0].data],
          todoPriority: response[1].data,
          todoProgress: response[2].data,
        });
      })
      .catch(onError);
  }

  function obtainTodos(
    SkipCount,
    ActiveStatuses,
    PriorityStatuses,
    TodoStatuses,
    AssignedStatus,
    LabelStatuses,
    Sorting,
  ) {
    dispatch(
      fetchTodos(
        SkipCount,
        ActiveStatuses,
        PriorityStatuses,
        TodoStatuses,
        AssignedStatus,
        LabelStatuses,
        Sorting,
      ),
    );
  }

  const onFilterOptionChanged = (key) => (value) => {
    console.log('key, value ', key, value);
    setFilterOptions({
      ...filterOptions,
      [key]: value,
    });
  };

  function resetFilterOption() {
    setFilterOptions({
      ...filterOptions,
      SkipCount: 0,
      ActiveStatuses: null,
      PriorityStatuses: null,
      TodoStatuses: null,
      AssignedStatus: null,
      LabelStatuses: null,
      Sorting: null,
    });
  }

  function onItemPressed(item) {
    console.log('On Todo Item clicked ', item);
    navigateToGivenScreenWithParams(
      navigation,
      navScreenNames.NAV_ADD_TODO_SCREEN,
      {todoId: item.id, preloadedData},
    );
  }

  return (
    <BaseContainer
      isDrawer
      toolbarTitle={screenNames.TODO_SCREEN}
      loading={loading}>
      <View style={styles.filterContainer}>
        <EqualSpaceHorizontalView>
          <MultiPickerView
            // label="Appointments Lists"
            sectionItems={getMultiPickerItems({
              LabelStatuses: preloadedData.todoLabels,
              PriorityStatuses: preloadedData.todoPriority,
              TodoStatuses: preloadedData.todoProgress,
            })}
            placeholder="Goal Filter By"
            labelStyle={styles.pickerLabelStyle}
            // containerStyle={{flex: 1}}
            pickerContainer={styles.pickerContainer}
            sectionBy="section"
            idKey="id"
            displayKey="name"
            pickerStyle={styles.pickerStyle}
            values={selectedFilters}
            editable
            onValueChange={(values) => {
              setSelectedFilters(values);
              values.length
                ? values.map((item) =>
                    onFilterOptionChanged(item.section)(item.id),
                  )
                : resetFilterOption();
            }}
          />
          <PickerView
            // label="Order By"
            placeholder={{label: 'Order By'}}
            items={preloadedData.todoSorting}
            labelStyle={styles.pickerLabelStyle}
            pickerStyle={styles.pickerStyle}
            pickerContainer={styles.pickerContainer}
            containerStyle={{flex: 1}}
            editable
            onValueChange={onFilterOptionChanged('Sorting')}
            value={filterOptions.Sorting}
          />
        </EqualSpaceHorizontalView>

        {/* <Checkbox
          checked={filterOptions.TodoStatuses}
          onChange={(e) => {
            onFilterOptionChanged('MarkItOffStatuses')(e.target.checked);
          }}
          style={styles.checkBox}>
          Hide Completed
        </Checkbox> */}
      </View>
      <View style={styles.flatListContainer}>
        <LoadMoreFlatList
          data={todos.items}
          loading={loading}
          onLoadMore={() =>
            obtainAppointments(
              todos.items.length,
              filterOptions.SkipCount,
              filterOptions.ActiveStatuses,
              filterOptions.PriorityStatuses,
              filterOptions.TodoStatuses,
              filterOptions.AssignedStatus,
              filterOptions.LabelStatuses,
            )
          }
          SingleItemView={TodoItem}
          onItemClicked={onItemPressed}
          showLoadMore={todos.totalCount > todos.items.length}
        />
      </View>
      <FloatingActionButton
        onPress={() =>
          navigateToGivenScreenWithParams(
            navigation,
            navScreenNames.NAV_ADD_TODO_SCREEN,
            {preloadedData},
          )
        }
      />
    </BaseContainer>
  );
};

export default TodoListScreen;

const styles = StyleSheet.create({
  pickerContainer: {},
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

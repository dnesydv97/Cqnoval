import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {AddMoreButton} from 'components';
import {IconOutline} from '@ant-design/icons-react-native';
import {moderateScale} from 'react-native-size-matters';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
import {TextInput} from 'react-native-gesture-handler';
import {getAllUserList} from 'services';
import {onError} from 'utils';
import Tag from './Tag';

const PersonSearchBox = ({
  selectedUsers = [],
  onUsersChanged,
  editable,
  singleMode,
}) => {
  const [selectedUserList, setSelectedUserList] = useState(selectedUsers);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [addVisibility, setAddVisibility] = useState(true);

  useEffect(() => {
    obtainUsers();
  }, []);

  useEffect(() => {
    singleMode && setAddVisibility(selectedUsers.length === 0);
    setSelectedUserList(selectedUsers);
  }, [selectedUsers]);

  function obtainUsers(searchText) {
    getAllUserList(searchText)
      .then((response) => {
        console.log('Response on get All user list  ', response);
        if (response.status === 200) setAllUsers(response.data);
      })
      .catch(onError);
  }

  function onSearch(searchText) {
    setTimeout(() => {
      obtainUsers(searchText);
    }, 800);
  }

  function onItemSelected(user) {
    setShowDropdown(false);
    const updatedUsers = [...selectedUserList];
    const foundUser = selectedUserList.find(
      (item) => item.appUserId === user.appUserId,
    );
    if (!foundUser) {
      updatedUsers.push(user);
    }
    // setSelectedUserList(updatedUsers);
    onUsersChanged(updatedUsers);
  }

  function onItemDeleted(user) {
    const newUserList = selectedUserList.filter(
      (item) => item.appUserId !== user.appUserId,
    );

    // setSelectedUserList(newUserList);
    onUsersChanged(newUserList);
  }

  return (
    <View
      style={{...styles.container, borderColor: editable ? 'black' : 'grey'}}>
      <View style={styles.itemDisplayContainer}>
        {selectedUserList.map((user, index) => {
          return user ? (
            <Tag
              editable={editable}
              text={user.userIdName}
              onDelete={() => onItemDeleted(user)}
            />
          ) : null;
        })}
        {editable && addVisibility && (
          <AddMoreButton
            title="ADD"
            containerStyle={styles.addButton}
            onPress={() => setShowDropdown(true)}
          />
        )}
      </View>
      {showDropdown && (
        <View style={styles.flatListContainer}>
          <TextInput
            placeholder="Search user ..."
            style={styles.searchBox}
            onChangeText={onSearch}
          />
          <FlatList
            data={allUsers}
            scrollEnabled
            keyExtractor={(item, index) => String(item.appUserId)}
            renderItem={({item, index}) => (
              <Text
                style={styles.flatListItem}
                onPress={() => onItemSelected(item)}>
                {item.fullName}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default PersonSearchBox;

const styles = StyleSheet.create({
  container: {
    marginVertical: AppDimensions.NORMAL,
  },
  itemDisplayContainer: {
    height: moderateScale(40),
    marginVertical: AppDimensions.NORMAL,
    borderWidth: 1,
    borderRadius: AppDimensions.SMALL,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addButton: {
    width: moderateScale(60),
    marginHorizontal: AppDimensions.SMALL,
  },
  flatListContainer: {
    borderWidth: 1,
    borderRadius: AppDimensions.SMALL,
    marginVertical: AppDimensions.SMALL,
  },
  searchBox: {
    paddingVertical: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.NORMAL,
    borderRadius: AppDimensions.SMALL,
    marginEnd: AppDimensions.SMALLER,
    backgroundColor: AppColors.LIST_ITEM_BG,
  },
  flatListItem: {
    ...SMALL_TEXT_STYLE,
    paddingVertical: AppDimensions.SMALL,
    paddingStart: AppDimensions.NORMAL,
    // borderWidth: 1,
  },
  text: {
    ...SMALL_TEXT_STYLE,
    color: 'white',
  },
  icon: {
    paddingHorizontal: AppDimensions.SMALL,
  },
});

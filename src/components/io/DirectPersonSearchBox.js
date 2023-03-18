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
import {set} from 'lodash';

const DirectPersonSearchBox = ({
  selectedUsers = [],
  onUsersChanged,
  users = [],
  editable,
}) => {
  const [selectedUserList, setSelectedUserList] = useState(selectedUsers);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allUsers, setAllUsers] = useState(users);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setAllUsers(users);
  }, [users]);

  useEffect(() => {
    console.log('selectedUsers ', selectedUsers);
    setSelectedUserList(selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    setShowDropdown(allUsers.length !== 0 && isFocused);
  }, [allUsers]);

  // function obtainUsers(searchText) {
  //   getAllUserList(searchText)
  //     .then((response) => {
  //       console.log('Response on get All user list  ', response);
  //       if (response.status === 200) setAllUsers(response.data);
  //     })
  //     .catch(onError);
  // }

  function onSearch(searchQuery) {
    setSearchText(searchQuery);
    if (searchQuery) {
      const searchText = searchQuery.toLowerCase();
      setAllUsers(
        users.filter(
          (item) =>
            item.fullName?.toLowerCase().includes(searchText) ||
            item.userName?.toLowerCase().includes(searchText) ||
            item.userIdName?.toLowerCase().includes(searchText),
        ),
      );
    } else setAllUsers(users);
    // setTimeout(() => {
    //   obtainUsers(searchText);
    // }, 800);
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
    setTimeout(() => {
      setSearchText('');
    }, 20);
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
      {selectedUserList.length !== 0 && (
        <View style={styles.itemDisplayContainer}>
          {selectedUserList.map((user, index) => {
            return user ? (
              <Tag
                key={String(Math.random())}
                editable={editable}
                text={user.userIdName}
                onDelete={() => onItemDeleted(user)}
              />
            ) : null;
          })}
        </View>
      )}
      {editable && (
        <TextInput
          placeholder="Search user ..."
          style={styles.searchBox}
          value={searchText}
          onChangeText={onSearch}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
      )}
      {showDropdown && (
        <View style={styles.flatListContainer}>
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

export default DirectPersonSearchBox;

const styles = StyleSheet.create({
  container: {
    // marginVertical: AppDimensions.NORMAL,
    // borderWidth: 1,
    width: '95%',
    borderRadius: AppDimensions.SMALL,
  },
  itemDisplayContainer: {
    height: moderateScale(40),
    // marginVertical: AppDimensions.NORMAL,
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
    flex: 1,
    paddingVertical: AppDimensions.NORMAL,
    paddingHorizontal: AppDimensions.NORMAL,
    borderRadius: AppDimensions.SMALL,
    marginEnd: AppDimensions.SMALLER,
    // backgroundColor: AppColors.LIST_ITEM_BG,
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

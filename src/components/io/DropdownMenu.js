import React, {useEffect, useState} from 'react';
import {FLatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { TextInput } from 'react-native-gesture-handler';
import {AppColors, AppDimensions, SMALL_TEXT_STYLE} from 'styles';
const DropdownMenu = ({
    selectedUsers = [],
    onUsersChanged,
    onSearchQuery,
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
        setSelectedUserList(selectedUsers);
    }, [selectedUsers]);

    useEffect(() => {
        const timeoutHandler = setTimeout(() => {
            onSearch(searchText);
        }, 800);
        return () => {
            clearTimeout(timeoutHandler);
        };
    }, [searchText]);

    function onSearch(searchQuery) {
        if(onSearchQuery) {
            onSearchQuery(searchQuery);
        } else {
            if(searchQuery) {
                const searchText = searchQuery.toLowerCase();
                setAllUsers(
                    users.filter((item) => 
                        item.emailAddress.toLowerCase().includes(searchText),
                    ),
                );
            } else setAllUsers(users);
        }
    }

    function onItemSelected(user) {
        setShowDropdown(false);
        const updatedUsers = [...selectedUserList];
        const foundUser = selectedUserList.find((item) => {
            if (item) {
                return (
                    item.employeeEmailAddressHolderId ===
                    user.employeeEmailAddressHolderId
                );
            }
        });
        if(!foundUser) {
            updatedUsers.push(user);
        }
        setTimeout(() => {
            setSearchText('');
        }, 20);
        onUsersChanged(updatedUsers);
    }

    function onItemDeleted(user) {
        const newUserList = selectedUserList.filter(
            (item) => 
                item.employeeEmailAddressHolderId !== user.employeeEmailAddressHolderId,
        );
        onUsersChanged(newUserList);
    }

    const DropDownItem = ({item}) => (
        <TouchableOpacity
            onPress={() => onItemSelected(item)}
            style={styles.flatListItemcontainer}>
            <Text style={{...styles.flatListItem, fontSize: moderateScale(17)}}>
                {item.emailAddress}
            </Text>
            <Text
        style={{
          ...styles.flatListItem,
          color: AppColors.UTIL,
          fontSize: moderateScale(15),
        }}>
                {item.emailAddressSearchDto.personName || 'N/A'}
            </Text>
            <Text
        style={{
          ...styles.flatListItem,
          color: AppColors.UTIL,
          fontSize: moderateScale(13),
        }}>
                {item.emailAddressSearchDto.companyName || 'N/A'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{...styles.container}}>
            {selectedUserList.length !==0 &&(
            <View style={styles.itemDisplayContainer}>
                {selectedUserList.map((user,index) => {
                    return user ? (
                        <Text key={String(Math.random())}>{user.emailAddress}</Text>
                    ) : null;
                })}
            </View>)}
            {editable && (
                <TextInput
                    style={styles.searchBox}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    onBlur={() => setIsFocused(false)}
                    onFocus={() => setIsFocused(true)}
                />
            )}
            {showDropdown && (
                <View style={styles.flatListContainer}>
                    <FlatList
                        data={allUsers}
                        scrollEnabled
                        keyExtractor={(item, index) => 
                            String(item.employeeEmailAddressHolderId + Math.random())
                        }
                        renderItem={({item, index}) => <DropDownItem item={item}/>}
                    />
                </View>
            )}
        </View>
    );
};

export default DropdownMenu;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // marginVertical: AppDimensions.NORMAL,
  
      // borderBottomWidth: 0.5,
      // borderBottomColor: AppColors.DISABLE,
      // borderRadius: AppDimensions.SMALL,
    },
    itemDisplayContainer: {
      // height: moderateScale(40),
      // marginVertical: AppDimensions.NORMAL,
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      // borderWidth: 1,
      // borderColor: 'blue',
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
    flatListItemcontainer: {
      marginVertical: AppDimensions.SMALL,
      marginHorizontal: AppDimensions.SMALL,
      backgroundColor: AppColors.LIST_ITEM_BG,
      paddingVertical: AppDimensions.SMALL,
    },
    flatListItem: {
      ...SMALL_TEXT_STYLE,
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
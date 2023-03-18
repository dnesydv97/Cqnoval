import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {
  AppColors,
  AppDimensions,
  NORMAL_TEXT_STYLE,
  SMALL_TEXT_STYLE,
} from 'styles';
import {AddMoreButton, CircularIconButton} from 'components';
import {addSearchTag, getAllSearchTags} from 'services';
import {onError} from 'utils';

const list = ['Anil', 'Sagar', 'Yuba', 'Ujal', 'Ishwor'];
const MultipleSearchTags = ({selectedTags = '', onTagChanged}) => {
  const [listItems, setListItems] = useState({
    searchList: [],
    selectedItems: [],
  });
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [fetchedTags, setFetchedTags] = useState([]);

  useEffect(() => {
    setListItems({
      ...listItems,
      selectedItems: selectedTags.split(','),
    });
  }, [selectedTags]);

  function getSearchTags(text) {
    setSearchedText(text);
    setTimeout(() => {
      getAllSearchTags(searchedText)
        .then((response) => {
          console.log('Search Tag response ', response);
          if (response.status === 200) {
            const remoteList = [];
            response.data.map((item) => remoteList.push(item.name));
            setListItems({
              ...listItems,
              searchList: remoteList,
            });
          }
        })
        .catch(onError);
    }, 1000);
  }

  const onItemDeleted = (tag) => {
    let filteredList = listItems.selectedItems.filter((item) => item !== tag);
    setListItems({
      ...listItems,
      selectedItems: filteredList,
    });
    onTagChanged(filteredList.toString());
  };

  const onTagAdd = () => {
    setShowSearchResult(false);
    addSearchTag({name: searchedText, isActive: true})
      .then((response) => {
        console.log('Response on add tag ', response);
        if (response.status === 200) {
          setListItems({
            ...listItems,
            searchList: [...listItems.searchList, response.data.name],
          });
        }
      })
      .catch(onError);
  };

  function onSearchTagClicked(tag) {
    const tagList = listItems.selectedItems.includes(tag)
      ? [...listItems.selectedItems]
      : [...listItems.selectedItems, tag];

    setListItems({
      ...listItems,
      selectedItems: tagList,
    });

    !listItems.selectedItems.includes(tag) && onTagChanged(tagList.toString());
  }

  const Tags = ({tag, onDeleted}) => {
    return (
      <View style={styles.tag}>
        <Text style={styles.text}>{tag}</Text>
        <IconOutline
          name="close"
          size={15}
          color={AppColors.PRIMARY_DARK}
          onPress={() => onDeleted(tag)}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.selectedTagContainer}>
          {listItems.selectedItems.map((item, index) => (
            <Tags key={String(index)} tag={item} onDeleted={onItemDeleted} />
          ))}
        </View>
        <TextInput
          placeholder="Search tags here..."
          onChangeText={getSearchTags}
          style={styles.searchBox}
          onFocus={() => setShowSearchResult(true)}
          // onBlur={() => setShowSearchResult(false)}
        />
      </View>
      {showSearchResult && (
        <FlatList
          data={listItems.searchList}
          renderItem={({item}) => (
            <Text
              style={styles.searchText}
              onPress={() => onSearchTagClicked(item)}>
              {item}
            </Text>
          )}
          contentContainerStyle={styles.searchListContainer}
          ListEmptyComponent={() => (
            <AddMoreButton title="Add" onPress={onTagAdd} />
          )}
          ListHeaderComponent={() => (
            <CircularIconButton
              icon="close"
              iconColor={AppColors.ERROR_RED}
              iconSize={20}
              containerStyle={styles.searchBoxCloseStyle}
              onPress={() => setShowSearchResult(false)}
            />
          )}
          keyExtractor={(index, item) => String(index)}
        />
      )}
    </>
  );
};

export default MultipleSearchTags;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: AppDimensions.NORMAL,
    borderWidth: 1,
    borderRadius: AppDimensions.NORMAL,
  },
  selectedTagContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: AppColors.ITEM_BG,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppDimensions.SMALL,
    margin: AppDimensions.SMALLER,
    borderRadius: AppDimensions.LARGE,
  },
  text: {
    ...SMALL_TEXT_STYLE,
    color: AppColors.PRIMARY_DARK,
    paddingEnd: AppDimensions.SMALL,
  },
  searchListContainer: {
    justifyContent: 'center',
    paddingStart: AppDimensions.LARGE,
    marginVertical: AppDimensions.SMALL,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: AppDimensions.NORMAL,
  },
  searchBoxCloseStyle: {
    alignSelf: 'flex-end',
    height: 20,
    width: 20,
    margin: AppDimensions.SMALL,
  },
  searchText: {
    ...SMALL_TEXT_STYLE,
    paddingVertical: AppDimensions.SMALL,
  },
  searchBox: {
    ...NORMAL_TEXT_STYLE,
    padding: AppDimensions.SMALL,
  },
});

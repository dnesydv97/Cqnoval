import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {AppDimensions, NORMAL_TEXT_STYLE} from 'styles';
import {getSearchedSow} from 'services';
import {Tag} from 'components';
import {FlatList} from 'react-native-gesture-handler';
import {moderateScale} from 'react-native-size-matters';

const SowSelector = ({onTagsChanged, initialTags = '', editable}) => {
  const [searchedTags, setSearchedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    initialTags ? initialTags.split(',') : [],
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    onTagsChanged(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      searchQuery ? searchSow() : setSearchedTags([]);
    }, 500);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [searchQuery]);

  function searchSow() {
    getSearchedSow(searchQuery)
      .then((response) => {
        console.log('serching sow response ', response);
        if (response.status === 200) setSearchedTags(response.data);
      })
      .catch((error) => {
        console.log('Error while serching sow ', error);
      });
  }

  function onAddRemoveTag(tag, remove = false) {
    let tempTags = selectedTags;
    if (remove) tempTags = tempTags.filter((item) => item !== tag);
    else tempTags.push(tag);

    setSelectedTags([...tempTags]);
  }

  return (
    <View style={styles.container}>
      {!!selectedTags.length && (
        <View style={styles.tagContainer}>
          {selectedTags.map((item) => (
            <Tag
              text={item}
              onDelete={() => onAddRemoveTag(item, true)}
              editable={editable}
            />
          ))}
        </View>
      )}
      <View>
        <TextInput
          style={styles.editText}
          onChangeText={setSearchQuery}
          placeholder="Scope Of Work"
          value={searchQuery}
        />

        <FlatList
          data={
            searchedTags?.length === 1 && searchedTags[0].name === searchQuery
              ? [] // Close suggestion list in case movie title matches query
              : searchedTags
          }
          contentContainerStyle={styles.flatListContentContainer}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            let tagName = item.name;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSearchedTags([]);
                  onAddRemoveTag(tagName);
                  setSearchQuery(null);
                }}
                activeOpacity={0.7}
                style={{padding: AppDimensions.SMALL}}>
                <Text style={{...NORMAL_TEXT_STYLE}}>{tagName}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default SowSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  editText: {
    ...NORMAL_TEXT_STYLE,
    textAlignVertical: 'center',
    paddingHorizontal: AppDimensions.SMALL,
    borderWidth: 0,
    paddingStart: AppDimensions.MODERATE,
    paddingVertical: AppDimensions.NORMAL,
  },
  flatListContentContainer: {
    // height: moderateScale(150),
  },
});

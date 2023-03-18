import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {AppColors, AppDimensions, boxShadow, NORMAL_TEXT_STYLE} from 'styles';
import PropTypes from 'prop-types';
import {moderateScale} from 'react-native-size-matters';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchBox = ({onSearch, containerStyle = {}}) => {
  const [query, setQuery] = useState('');
  const [isFav, setIsFav] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setIsFav(query === '');
    const timeoutHandler = setTimeout(() => {
      onSearch(query, isFav);
    }, 800);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [query]);

  useEffect(() => {
    onSearch(query, isFav);
    query && isFav && setQuery('');
  }, [isFav]);

  return (
    <View style={{...styles.container, ...containerStyle}}>
      <View style={styles.innerContainer}>
        <IconOutline
          style={styles.searchIcon}
          name="search"
          color={AppColors.PRIMARY_DARK}
          size={20}
          onPress={() => ref?.current.focus()}
        />
        <TextInput
          style={styles.text}
          placeholder="Search here..."
          value={query}
          ref={ref}
          onChangeText={setQuery}
          // onKeyPress={() => onSearch(query)}
          // onPress={() => onSearch(query)}
        />
        {query!='' && (
          <TouchableOpacity
            style={{backgroundColor: AppColors.ACCENT, borderWidth: 10, borderColor:'white'}}
          >
            <IconFill
              name="close-circle"
              size={20}
              color='#808080'
              style={{backgroundColor: 'white'}}
            />
          </TouchableOpacity>
        )}
        {isFav ?
          (<IconFill
              name="star"
              size={25}
              onPress={() => setIsFav(!isFav)}
              color={AppColors.FAV_LIST_COLOR}
              style={{right: moderateScale(8)}}
            />
          ) : (
            <IconOutline
              name="star"
              size={25}
              onPress={() => setIsFav(!isFav)}
              color={AppColors.UTIL}
              style={{right: moderateScale(8)}}
            />
          )
        }
      </View>
    </View>
  );
};

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    // ...boxShadow('grey'),
    // paddingVertical: AppDimensions.SMALL,
    // marginBottom: AppDimensions.NORMAL,
    backgroundColor: 'white',
    // borderRadius: AppDimensions.NORMAL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
  },
  text: {
    flex: 1,
    paddingLeft: AppDimensions.MODERATE,
    ...NORMAL_TEXT_STYLE,
    // borderWidth: 1,
  },
  searchIcon: {
    margin: AppDimensions.NORMAL,
    marginLeft: AppDimensions.NORMAL,
  },
});

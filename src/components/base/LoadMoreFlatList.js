import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {EmptyView, LoadMore} from 'components';
import { AppDimensions } from 'styles';

const LoadMoreFlatList = ({
  onLoadMore,
  onRefresh,
  data,
  helpingData,
  showLoadMore,
  SingleItemView,
  loading,
  onItemClicked,
}) => {
  return (
    <FlatList
      contentContainerStyle={
        [data && !data.length ? styles.emptyViewStyle : null,{marginBottom: AppDimensions.LARGEST}]
      }
      data={data}
      keyExtractor={(item, index) => String(index)}
      renderItem={({index, item}) => (
        <SingleItemView
          item={item}
          index={index}
          helpingData={helpingData}
          onItemClicked={() => onItemClicked(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyView message="Ooops!!! Nothing to Display" />}
      refreshing={!!loading}
      onRefresh={onRefresh && onRefresh}
      ListFooterComponent={showLoadMore && <LoadMore onPress={onLoadMore} />}
    />
  );
};

export default LoadMoreFlatList;

const styles = StyleSheet.create({
  emptyViewStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

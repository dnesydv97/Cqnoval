import {useRoute} from '@react-navigation/native';
import {BaseContainer} from 'components';
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Pdf from 'react-native-pdf';

const PDFViewerScreen = () => {
  const route = useRoute();
  const resourceType = 'url';
  const resource = route.params?.url;
  const source = {uri: resource, cache: true};

  return (
    <BaseContainer style={{flex: 1}}>
      {console.log('Url ', resource)}
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link presse: ${uri}`);
        }}
        style={styles.pdf}
      />
    </BaseContainer>
  );
};

export default PDFViewerScreen;

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

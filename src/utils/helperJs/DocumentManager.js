import DocumentPicker from 'react-native-document-picker';

export const selectOneFile = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    // console.log('res:' + JSON.stringify(res));
    // console.log('URI:' + res.uri);
    // console.log('Type:' + res.type);
    // console.log('File Name:' + res.name);
    // console.log('File Size:' + res.size);

    return res;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      alert('Canceled from single doc Picker');
    } else {
      alert('Unknown Error:' + JSON.stringify(err));
      throw err;
    }
  }
};

export const selectMultipleFile = async (type) => {
  try {
    const results = await DocumentPicker.pickMultiple({
      type,
    });
    for (const res of results) {
      console.log('res :' + JSON.stringify(res));
      console.log('URI :' + res.uri);
      console.log('Type:' + res.type);
      console.log('File Name:' + res.name);
      console.log('File Size:' + res.size);
    }

    return results;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      alert('Canceled from multiple doc picker');
    } else {
      alert('Unknown Error:' + JSON.stringify(err));
      throw err;
    }
  }
};

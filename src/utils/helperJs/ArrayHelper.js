export function findUniqueArray(array = [], uniqueKey = '') {
  return array.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t[uniqueKey] === item[uniqueKey]),
  );
}

export function addItemToExistingArray(item, array = []) {
  return [...array, item];
}

export function deleteItemFromArray(
  index = -1,
  array = [],
  defaultItem = null,
) {
  if (index !== -1) {
    if (index === 0 && array.length === 1 && defaultItem !== null) {
      return [defaultItem];
    } else {
      array.splice(index, 1);
      console.log('Length of new Array ', contactList.length);
      return array;
    }
  }
}

export function getPickerItems(array, labelKey, valueKey) {
  const pickerItems = [];
  array &&
    array.map((item) =>
      pickerItems.push({label: item[labelKey], value: item[valueKey]}),
    );
  return pickerItems;
}

export function getMultiPickerItems(objectOfArray) {
  const pickerItems = [];
  objectOfArray &&
    Object.keys(objectOfArray).map((key) => {
      objectOfArray[key].map((item) => {
        pickerItems.push({...item, isSelected: false, section: key});
      });
    });
  return pickerItems;
}

export function getPersonSearchSelectedItems(array, idKey, userIdNameKey) {
  const personSelectedItems = [];
  array &&
    array.map((item) =>
      personSelectedItems.push({
        ...item,
        appUserId: item[idKey],
        userIdName: item[userIdNameKey],
      }),
    );
  return personSelectedItems;
}

//Compare two array value
export const objectsEqual = (o1, o2) =>
  typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => o1[p] === o2[p])
    : o1 === o2;

export const arraysEqual = (a1, a2) => {
  console.log(a1);
  console.log(a2);
  return (
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]))
  );
};

export function getIntersection(arr1, arr2, COMPARE_KEY1, COMPARE_KEY2) {
  return arr1.filter((item1) =>
    arr2.some((item2) => item1[COMPARE_KEY1] === item2[COMPARE_KEY2]),
  );
}

export function areArraysEqual(
  arr1 = [],
  arr2 = [],
  COMPARE_KEY1,
  COMPARE_KEY2,
) {
  const arr1Len = arr1.length;
  const arr2Len = arr2.length;
  if (arr1Len !== arr2Len) return false;
  else {
    const arrInterSection = getIntersection(
      arr1,
      arr2,
      COMPARE_KEY1,
      COMPARE_KEY2,
    );
    return (
      arr1.length === arr2.length && arr2.length === arrInterSection.length
    );
  }
}

export function subtractArrays(
  mainArray = [],
  arrayToSubtract = [],
  COMPARE_KEY1,
  COMPARE_KEY2,
) {
  return mainArray.filter(
    (item) =>
      !arrayToSubtract.some(
        (item2) => item2[COMPARE_KEY2] === item[COMPARE_KEY1],
      ),
  );
}


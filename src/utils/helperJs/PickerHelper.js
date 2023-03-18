export const getPicketList = (rawList = [], labelKey, valueKey) => {
  const returnList = [];
  rawList.map((item) =>
    returnList.push({label: item[labelKey], value: item[valueKey]}),
  );
  return returnList;
};

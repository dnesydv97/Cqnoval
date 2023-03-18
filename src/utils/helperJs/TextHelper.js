const {defaultValues} = require('constant');
export const getDisplayValue = (value) => {
  if (value === null || value === undefined) return defaultValues.STRING;
  else return value;
};

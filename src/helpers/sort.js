/* eslint-disable  */
const sort = (a, b, field) => {
  let nameA;
  let nameB;
  if (field === 'car_number') {
    nameA = a[field] ? a[field].toLowerCase() : '';
    nameB = b[field] ? b[field].toLowerCase() : '';
  } else {
    nameA = a[field] ? a[field].name.toLowerCase() : '';
    nameB = b[field] ? b[field].name.toLowerCase() : '';
  }
  if (nameA === '') return 1;
  if (nameB === '') return -1;
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};
export {sort};

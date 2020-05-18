const isValidForm = form => {
  const objForm = form.current.getFieldsValue();
  for (const key in objForm) {
    if (objForm[key] === undefined) return false;
  }
  return true;
};

export {isValidForm};

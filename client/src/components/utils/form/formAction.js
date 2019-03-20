export const validate = (element, formdata = []) => {
  let error = [true, ''];

  if (element.validation.email) {
    const valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(element.value);
    const message = `${!valid ? 'Envalid Email' : ''}`;
    error = !valid ? [valid, message] : error;
  }
  if (element.validation.confirm) {
    const valid = element.value.trim() === formdata[element.validation.confirm].value;
    const message = `${!valid ? 'Password do not match' : ''}`;
    error = !valid ? [valid, message] : error;
  }

  if (element.validation.required) {
    const valid = element.value.trim() !== '';
    const message = `${!valid ? 'This field is required' : ''}`;
    error = !valid ? [valid, message] : error;
  }

  return error;
};

export const update = (element, formdata, formName) => {
  const newFormdata = {
    ...formdata
  };
  const newElement = {
    ...newFormdata[element.id]
  };

  newElement.value = element.event.target.value;

  if (element.blur) {
    let validData = validate(newElement, formdata);
    newElement.valid = validData[0];
    newElement.validationMessage = validData[1];
  }

  newElement.touched = element.blur;

  newFormdata[element.id] = newElement;

  return newFormdata;
};

export const generateData = (formdata, formName) => {
  let dataToSubmit = {};

  for (let key in formdata) {
    if (key !== 'confirmPassword') {
      dataToSubmit[key] = formdata[key].value;
    }
  }

  return dataToSubmit;
};

export const isFormValid = (formdata, formName) => {
  let formIsValid = true;

  for (let key in formdata) {
    formIsValid = formdata[key].valid && formIsValid;
  }

  return formIsValid;
};

export const populateOptionFeilds = (formdata, arrayData = [], field) => {
  const newArray = [];
  const newFormdata = { ...formdata };

  arrayData.forEach(item => {
    newArray.push({ key: item._id, value: item.name });
  });

  newFormdata[field].config.options = newArray;
  return newFormdata;
};

export const resetFields = (formdata, formName) => {
  const newFormdata = { ...formdata };

  for (let key in newFormdata) {
    if (key === 'images') {
      newFormdata[key].value = [];
    } else {
      newFormdata[key].value = '';
    }
    formdata[key].value = '';
    formdata[key].valid = false;
    formdata[key].touched = false;
    formdata[key].validationMessage = '';
  }
  return newFormdata;
};

export const populateFields = (formdata, fields) => {
  for (let key in formdata) {
    formdata[key].value = fields[key];
    formdata[key].valid = true;
    formdata[key].touched = true;
    formdata[key].validationMessage = '';
  }

  return formdata;
};

import React from 'react';

const FormField = ({ id, formdata, change }) => {
  const showError = () => {
    let errorMeassage = null;

    if (formdata.validation && !formdata.valid) {
      errorMeassage = <div className='error_label'>{formdata.validationMessage}</div>;
    }

    return errorMeassage;
  };

  const renderTemplate = () => {
    let formTemplate = null;

    switch (formdata.element) {
      case 'input':
        formTemplate = (
          <div className='formBlock'>
            {formdata.showLabel ? <div className='label_inputs'>{formdata.config.label}</div> : null}
            <input
              {...formdata.config}
              value={formdata.value}
              onBlur={event => change({ event, id, blur: true })}
              onChange={event => change({ event, id })}
            />
            {showError()}
          </div>
        );

        break;
      case 'select':
        formTemplate = (
          <div className='formBlock'>
            {formdata.showLabel ? <div className='label_inputs'>{formdata.config.label}</div> : null}
            <select
              {...formdata.config}
              value={formdata.value}
              onBlur={event => change({ event, id, blur: true })}
              onChange={event => change({ event, id })}
            >
              <option value=''> Select one</option>
              {formdata.config.options.map(item => (
                <option key={item.key} value={item.key}>
                  {item.value}
                </option>
              ))}
            </select>
            {showError()}
          </div>
        );

        break;
      case 'textarea':
        formTemplate = (
          <div className='formBlock'>
            {formdata.showLabel ? <div className='label_inputs'>{formdata.config.label}</div> : null}
            <textarea
              {...formdata.config}
              value={formdata.value}
              onBlur={event => change({ event, id, blur: true })}
              onChange={event => change({ event, id })}
            />
            {showError()}
          </div>
        );

        break;

      default:
        formTemplate = null;
    }

    return formTemplate;
  };

  return <div>{renderTemplate()}</div>;
};

export default FormField;

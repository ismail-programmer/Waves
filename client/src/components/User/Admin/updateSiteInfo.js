import React, { Component } from 'react';

import FormField from '../../utils/form/formField';
import { update, generateData, isFormValid, populateFields } from '../../utils/form/formAction';

import { connect } from 'react-redux';
import { getSiteData, updateSiteData } from '../../../actions/siteActions';

class UpdateSiteInfo extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      address: {
        element: 'input',
        value: '',
        config: {
          label: 'Adress',
          name: 'address_input',
          type: 'text',
          placeholder: 'Enter Your site adress'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      hours: {
        element: 'input',
        value: '',
        config: {
          label: 'Working hours',
          name: 'hours_input',
          type: 'text',
          placeholder: 'Enter Your site working hours'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      phone: {
        element: 'input',
        value: '',
        config: {
          label: 'Phone Number',
          name: 'phone_input',
          type: 'text',
          placeholder: 'Enter the Phone Number'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      email: {
        element: 'input',
        value: '',
        config: {
          label: 'Shop Email',
          name: 'email_input',
          type: 'text',
          placeholder: 'Enter Yor Email'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      }
    }
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, 'site_info');
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'site_info');

    let formIsValid = isFormValid(this.state.formdata, 'site_info');
    if (formIsValid) {
      this.props.dispatch(updateSiteData(dataToSubmit)).then(() => {
        this.setState(
          {
            formSuccess: true
          },
          () => {
            setTimeout(() => {
              this.setState({
                formSuccess: false
              });
            }, 2000);
          }
        );
      });
    } else {
      this.setState({
        formError: true
      });
    }
  };
  componentDidMount() {
    this.props.dispatch(getSiteData()).then(() => {
      const newFormData = populateFields(this.state.formdata, this.props.site.siteData[0]);
      this.setState({
        formdata: newFormData
      });
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={event => this.submitForm(event)}>
          <h1>Site Info</h1>
          <FormField
            id={'address'}
            formdata={this.state.formdata.address}
            change={element => this.updateForm(element)}
          />

          <FormField id={'hours'} formdata={this.state.formdata.hours} change={element => this.updateForm(element)} />

          <FormField id={'phone'} formdata={this.state.formdata.phone} change={element => this.updateForm(element)} />

          <FormField id={'email'} formdata={this.state.formdata.email} change={element => this.updateForm(element)} />

          <div>
            {this.state.formSuccess ? <div className='form_success'>Success</div> : null}
            {this.state.formError ? <div className='error_label'>Please check Your details</div> : null}
            <button onClick={event => this.submitForm(event)}>Update </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    site: state.site
  };
};

export default connect(mapStateToProps)(UpdateSiteInfo);

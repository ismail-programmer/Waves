import React, { Component } from 'react';
import FormField from '../utils/form/formField';

import { connect } from 'react-redux';
import { updateDataUser, clearUpdateUser } from '../../actions/user_actions';
import { update, generateData, isFormValid, populateFields } from '../utils/form/formAction';

class UpdatePersonalInfo extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      firstname: {
        element: 'input',
        value: '',
        config: {
          name: 'name_input',
          type: 'text',
          placeholder: 'Enter Your Firstname'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          name: 'lastname_input',
          type: 'text',
          placeholder: 'Enter Your Lastname'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Enter Your Email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  };

  componentDidMount() {
    const newFormData = populateFields(this.state.formdata, this.props.user.userData);

    this.setState({
      formdata: newFormData
    });
  }

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'update_user');
    let formIsValid = isFormValid(this.state.formdata, 'update_user');

    if (formIsValid) {
      this.props.dispatch(updateDataUser(dataToSubmit)).then(() => {
        if (this.props.user.updateUser.success) {
          this.setState(
            {
              formSuccess: true
            },
            () => {
              setTimeout(() => {
                this.props.dispatch(clearUpdateUser());
                this.setState({
                  formSuccess: false
                });
              }, 2000);
            }
          );
        }
      });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, 'update_user');
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={event => this.submitForm(event)}>
          <h2>Personal Information</h2>
          <div className='form_block_two'>
            <div className='block'>
              <FormField
                id={'firstname'}
                formdata={this.state.formdata.firstname}
                change={element => this.updateForm(element)}
              />
            </div>
            <div className='block'>
              <FormField
                id={'lastname'}
                formdata={this.state.formdata.lastname}
                change={element => this.updateForm(element)}
              />
            </div>
          </div>
          <div>
            <FormField id={'email'} formdata={this.state.formdata.email} change={element => this.updateForm(element)} />
          </div>
          <div>
            {this.state.formSuccess ? <div className='form_success'>Success</div> : null}
            {this.state.formError ? <div className='error_label'>Please check Your details</div> : null}
            <button onClick={event => this.submitForm(event)}>Update Personal Info</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(UpdatePersonalInfo);

import React, { Component } from 'react';

import axios from 'axios';

import FormField from '../utils/form/formField';
import { update, generateData, isFormValid } from '../utils/form/formAction';

import Dialog from '@material-ui/core/Dialog';

class ResetPass extends Component {
  state = {
    resetToken: '',
    formErrorMeassage: '',
    formError: false,
    formSuccess: false,
    formdata: {
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter Your Password'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      confirmPassword: {
        element: 'input',
        value: '',
        config: {
          name: 'confirmPassword_input',
          type: 'password',
          placeholder: 'Confirm Your Password'
        },
        validation: {
          required: true,
          confirm: 'password'
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  };
  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, 'reset_pass');
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'reset_pass');

    let formIsValid = isFormValid(this.state.formdata, 'reset_pass');
    if (formIsValid) {
      axios
        .post('/api/users/reset_password', {
          ...dataToSubmit,
          resetToken: this.state.resetToken
        })
        .then(response => {
          if (!response.data.success) {
            this.setState({
              formError: true,
              formErrorMeassage: response.data.message
            });
          } else {
            this.setState({
              formError: false,
              formSuccess: true
            });
            setTimeout(()=>{
              this.props.history.push('/register_login')
            },3000)
          }
        });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  componentDidMount() {
    const resetToken = this.props.match.params.token;
    this.setState({ resetToken });
  }

  render() {
    return (
      <div className='container'>
        <form onSubmit={event => this.submitForm(event)}>
          <h2>Reset Password</h2>
          <div className='form_block_two'>
            <div className='block'>
              <FormField
                id={'password'}
                formdata={this.state.formdata.password}
                change={element => this.updateForm(element)}
              />
            </div>
            <div className='block'>
              <FormField
                id={'confirmPassword'}
                formdata={this.state.formdata.confirmPassword}
                change={element => this.updateForm(element)}
              />
            </div>
          </div>
          <div>
            {this.state.formError ? (
              <div className='error_label'>{this.state.formErrorMeassage}</div>
            ) : null}
            <button onClick={event => this.submitForm(event)}>
              Reset Password
            </button>
          </div>
        </form>
        <Dialog open={this.state.formSuccess}>
          <div className='dialog_alert'>Alright !!</div>
          <div>Your password was reset.redirecting in few seconds</div>
        </Dialog>
      </div>
    );
  }
}

export default ResetPass;

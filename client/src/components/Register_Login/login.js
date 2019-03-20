import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormField from '../utils/form/formField';
import { update, generateData, isFormValid } from '../utils/form/formAction';
import { loginUser } from '../../actions/user_actions';
import { withRouter } from 'react-router-dom';

class Login extends Component {
  state = {
    formError: false,
    formSuccess: '',
    formdata: {
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
      },
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
      }
    }
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'login');

    let formIsValid = isFormValid(this.state.formdata, 'login');
    if (formIsValid) {
      this.props.dispatch(loginUser(dataToSubmit)).then(response => {
        if (response.payload.loginSuccess) {
          this.props.history.push('/user/dashboard');
        } else {
          this.setState({
            formError: true
          });
        }
      });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, 'login');
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  render() {
    return (
      <div className='signin_wrapper'>
        <form onSubmit={event => this.submitForm(event)}>
          <FormField
            id={'email'}
            formdata={this.state.formdata.email}
            change={element => this.updateForm(element)}
          />
          <FormField
            id={'password'}
            formdata={this.state.formdata.password}
            change={element => this.updateForm(element)}
          />
          {this.state.formError ? (
            <div className='error_label'>Please check Your details</div>
          ) : null}
          <button onClick={event => this.submitForm(event)}>LOG In</button>
          <button
            style={{
              marginLeft: '10px'
            }}
            onClick={() =>
              this.props.history.push('/reset_user')
            }
          >
            Forgot My Password
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(withRouter(Login));

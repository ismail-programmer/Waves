import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import FormField from '../utils/form/formField';
import { update, generateData, isFormValid } from '../utils/form/formAction';
import { registerUser } from '../../actions/user_actions';

class Register extends Component {
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
    const newFormdata = update(element, this.state.formdata, 'register');
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'register');

    let formIsValid = isFormValid(this.state.formdata, 'register');
    if (formIsValid) {
      this.props
        .dispatch(registerUser(dataToSubmit))
        .then(response => {
          if (response.payload.success) {
            this.setState({
              formError: false,
              formSuccess: true
            });
            setTimeout(() => {
              this.props.history.push('/register_login');
            }, 3000);
          } else {
            this.setState({ formError: true });
          }
        })
        .catch(e => {
          this.setState({ formError: true });
        });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  render() {
    return (
      <div className='page_wrapper'>
        <div className='container'>
          <div className='register_login_container'>
            <div className='left'>
              <form onSubmit={event => this.submitForm(event)}>
                <h2>PERSONAL INFORMATION</h2>
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
                  <FormField
                    id={'email'}
                    formdata={this.state.formdata.email}
                    change={element => this.updateForm(element)}
                  />
                </div>
                <h2>VERIFY PASSWORD</h2>
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
                    <div className='error_label'>Please check Your details</div>
                  ) : null}
                  <button onClick={event => this.submitForm(event)}>
                    Create An Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Dialog open={this.state.formSuccess}>
          <div className='dialog_alert'>Congratulations !!</div>
          <div>You will be redirected to LOGIN in a couple seconds...</div>
        </Dialog>
      </div>
    );
  }
}

export default connect()(Register);

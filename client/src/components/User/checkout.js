import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCreditCard, faSmile } from '@fortawesome/fontawesome-free-solid';
import UserLayout from '../../hoc/user';
import FormField from '../utils/form/formField';
import { update, isFormValid } from '../utils/form/formAction';
import { getCartItems, onPayment } from '../../actions/user_actions';

class Checkout extends Component {
  state = {
    total: 0,
    showSuccess: true,
    formError: false,
    formSuccess: false,
    formData: {
      address: {
        element: 'input',
        value: '',
        config: {
          label: 'Shipping Address',
          name: 'Address',
          type: 'text',
          placeholder: 'Enter Shipping Address'
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
          label: 'Contact Email',
          name: 'email',
          type: 'email',
          placeholder: 'Enter Contact Email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      }
    }
  };

  componentDidMount() {
    let cartItems = [];
    let user = this.props.user;

    if (user.userData.cart) {
      if (user.userData.cart.length > 0) {
        user.userData.cart.forEach(item => {
          cartItems.push(item.id);
        });
        this.props
          .dispatch(getCartItems(cartItems, user.userData.cart))
          .then(() => {
            if (this.props.user.cartDetail.length > 0) {
              this.setState({ showSuccess: false });
              this.calculateTotal(this.props.user.cartDetail);
            }
          });
      }
    }
  }

  calculateTotal = cartDetail => {
    let total = 0;

    cartDetail.forEach(item => {
      total += parseInt(item.price, 10) * item.quantity;
    });

    this.setState({
      total,
      showTotal: true
    });
  };

  renderCartItems = cartItems => {
    if (cartItems)
      return cartItems.map((item, i) => (
        <tr key={item._id}>
          <td>{i + 1}.</td>
          <td>
            {item.brand.name}&nbsp;{item.name}
          </td>
          <td>$ {item.price}</td>
          <td>{item.quantity}</td>
          <td>$ {(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      ));
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formData, 'register');
    this.setState({
      formError: false,
      formData: newFormdata
    });
  };

  submitForm = event => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formData, 'register');

    if (formIsValid) {
      this.props
        .dispatch(onPayment({ cartItems: this.props.user.cartDetail }))
        .then(() => {
          if (this.props.user.paymentSuccess)
            this.setState({ showSuccess: true, formError: false });
        });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  render() {
    return (
      <UserLayout>
        {this.state.showSuccess ? (
          <div className='cart_success' style={{ marginTop: '32px' }}>
            <FontAwesomeIcon icon={faSmile} />
            <div style={{ marginTop: '16px' }}>
              ALL YOUR ORDERS ARE COMPLETE
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={this.submitForm}>
              <h2>Customer Details</h2>
              <FormField
                id={'address'}
                formdata={this.state.formData.address}
                change={element => this.updateForm(element)}
              />
              <FormField
                id={'email'}
                formdata={this.state.formData.email}
                change={element => this.updateForm(element)}
              />
              <h2>Order Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Sr #</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderCartItems(this.props.user.cartDetail)}
                </tbody>
              </table>
              <div
                className='item'
                style={{ fontSize: '20px', margin: '32px 0' }}
              >
                <strong>Total Amount</strong> $ {this.state.total}
              </div>
              {this.state.formError ? (
                <div className='error_label'>Please check your data</div>
              ) : null}
              <div className='checkout-btn' onClick={this.submitForm}>
                <FontAwesomeIcon icon={faCreditCard} />
                Place Order
              </div>
            </form>
          </div>
        )}
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Checkout);

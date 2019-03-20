import React, { Component } from 'react';
import UserLayout from '../../../hoc/user';

import FormField from '../../utils/form/formField';
import { update, generateData, isFormValid, resetFields, populateOptionFeilds } from '../../utils/form/formAction';
import FileUpload from '../../utils/form/FileUpload';

import { connect } from 'react-redux';
import { getBrands, getWoods, addProduct, clearProduct } from '../../../actions/products_actions';

class AddProduct extends Component {
  state = {
    formError: false,
    formSucess: false,
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          label: 'Product name',
          name: 'name_input',
          type: 'text',
          placeholder: 'Enter Your Name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      description: {
        element: 'textarea',
        value: '',
        config: {
          label: 'Product description',
          name: 'description_input',
          type: 'text',
          placeholder: 'Enter Your Description'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      price: {
        element: 'input',
        value: '',
        config: {
          label: 'Product Price',
          name: 'price_input',
          type: 'number',
          placeholder: 'Enter Your Price'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      brand: {
        element: 'select',
        value: '',
        config: {
          label: 'Product Brand',
          name: 'brands_input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      shiping: {
        element: 'select',
        value: '',
        config: {
          label: 'Product Shiping',
          name: 'shiping_input',
          options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      available: {
        element: 'select',
        value: '',
        config: {
          label: 'Available in Stocks',
          name: 'available_input',
          options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      wood: {
        element: 'select',
        value: '',
        config: {
          label: 'Wood material',
          name: 'wood_input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      frets: {
        element: 'select',
        value: '',
        config: {
          label: 'Frets',
          name: 'frets_input',
          options: [
            { key: 20, value: '20' },
            { key: 21, value: '21' },
            { key: 22, value: '22' },
            { key: 24, value: '24' }
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      publish: {
        element: 'select',
        value: '',
        config: {
          label: 'Publish',
          name: 'Publish_input',
          options: [{ key: true, value: 'Public' }, { key: false, value: 'Hidden' }]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      images: {
        values: [],
        validation: {
          required: false
        },
        valid: true,
        touched: false,
        validationMessage: '',
        showLabel: false
      }
    }
  };

  resetFileHandler = () => {
    const newFormData = resetFields(this.state.formdata, 'products');

    this.setState({
      formdata: newFormData,
      formSucess: true
    });
    setTimeout(() => {
      this.setState(
        {
          formSucess: false
        },
        () => {
          this.props.dispatch(clearProduct());
        }
      );
    }, 3000);
  };

  updateFields = newFormData => {
    this.setState({
      formdata: newFormData
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, 'products');

    let formIsValid = isFormValid(this.state.formdata, 'products');
    if (formIsValid) {
      this.props.dispatch(addProduct(dataToSubmit)).then(() => {
        if (this.props.products.addProduct.success) {
          this.resetFileHandler();
        } else {
          this.setState({ formError: true });
        }
      });
    } else {
      this.setState({
        formError: true
      });
    }
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, 'products');
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  componentDidMount() {
    const formdata = this.state.formdata;

    this.props.dispatch(getBrands()).then(response => {
      const newFormData = populateOptionFeilds(formdata, this.props.products.brands, 'brand');
      this.updateFields(newFormData);
    });

    this.props.dispatch(getWoods()).then(response => {
      const newFormData = populateOptionFeilds(formdata, this.props.products.woods, 'wood');
      this.updateFields(newFormData);
    });
  }

  imageHandler = images => {
    const newFormData = {
      ...this.state.formdata
    };
    newFormData['images'].value = images;
    newFormData['images'].valid = true;

    this.setState({
      formdata: newFormData
    });
  };

  render() {
    return (
      <UserLayout>
        <div>
          <h1>Add Products</h1>
          <form onSubmit={event => this.submitForm(event)}>
            <FileUpload imageHandler={images => this.imageHandler(images)} reset={this.state.formSucess} />
            <FormField id={'name'} formdata={this.state.formdata.name} change={element => this.updateForm(element)} />
            <FormField
              id={'description'}
              formdata={this.state.formdata.description}
              change={element => this.updateForm(element)}
            />
            <FormField id={'price'} formdata={this.state.formdata.price} change={element => this.updateForm(element)} />
            <div className='form_devider'> </div>
            <FormField id={'brand'} formdata={this.state.formdata.brand} change={element => this.updateForm(element)} />
            <FormField
              id={'shiping'}
              formdata={this.state.formdata.shiping}
              change={element => this.updateForm(element)}
            />
            <FormField
              id={'available'}
              formdata={this.state.formdata.available}
              change={element => this.updateForm(element)}
            />
            <FormField id={'wood'} formdata={this.state.formdata.wood} change={element => this.updateForm(element)} />
            <FormField id={'frets'} formdata={this.state.formdata.frets} change={element => this.updateForm(element)} />
            <div className='form_devider'> </div>

            <FormField
              id={'publish'}
              formdata={this.state.formdata.publish}
              change={element => this.updateForm(element)}
            />

            {this.state.formSucess ? <div className='form_success'>Success...</div> : null}

            {this.state.formError ? <div className='error_label'>Please check Your details</div> : null}
            <button onClick={event => this.submitForm(event)}>Add Product</button>
          </form>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(AddProduct);

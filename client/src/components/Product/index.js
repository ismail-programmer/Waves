import React, { Component } from 'react';
import PageTop from '../utils/PageTop';

import ProdInfo from './ProInfo';
import ProdImg from './ProdImg';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';
import { getProductDetail, clearProductDetail } from '../../actions/products_actions';

class ProductPage extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.dispatch(getProductDetail(id)).then(response =>{
      if(!this.props.products.proDetail){
        this.props.history.push('/')
      }
    })
  }

  componentWillMount() {
    this.props.dispatch(clearProductDetail());
  }

  addToCartHandler=(id)=>{

    this.props.dispatch(addToCart(id))



  }



  render() {
    return (
      <div>
        <PageTop title='Product Details' />
        <div className='container'>
          {this.props.products.proDetail ? (
            <div className='product_detail_wrapper'>
              <div className='left'>
                <div style={{ width: '500px' }}>
                  <ProdImg detail={this.props.products.proDetail} />
                </div>
              </div>
              <div className='right'>
                <ProdInfo addToCart={id => this.addToCartHandler(id)} detail={this.props.products.proDetail} />
              </div>
            </div>
          ) : (
            'Loading'
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(ProductPage);

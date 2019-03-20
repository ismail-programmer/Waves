import React, { Component } from 'react';
import HomeSlider from './home_slider';
import CartBlock from '../utils/cart_block';
import HomePermotion from './home_permotions';
import { connect } from 'react-redux';
import {
  getProductsBySell,
  getProductsByArrival
} from '../../actions/products_actions';

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(getProductsBySell());
    this.props.dispatch(getProductsByArrival());
  }

  render() {
    return (
      <div>
        <HomeSlider />
        <CartBlock
          list={this.props.products.bySell}
          title='Best selling guitars'
        />
        <HomePermotion />
        <CartBlock list={this.props.products.byArrival} title='New Arrivals' />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(Home);

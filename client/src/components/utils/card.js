import React, { Component } from 'react';
import MyButton from './button';

import { Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';

class Card extends Component {
  state = {
    btnClass: ''
  };

  renderCardImage(images) {
    if (images.length > 0) {
      return images[0].url;
    } else {
      return '/images/image_not_availble.png';
    }
  }

  componentDidMount() {
    if (this.props.user)
      if (!this.props.user.userData.isAuth)
        this.setState({ btnClass: 'disabled' });
      else this.setState({ btnClass: '' });
  }

  tooltipTitleHandler = user => {
    if (user)
      if (!user.isAuth) {
        return 'Please Login First';
      }

    return '';
  };

  render() {
    const props = this.props;
    return (
      <div className={`card_item_wrapper ${props.grid}`}>
        <div
          className='image'
          style={{
            background: `url(${this.renderCardImage(props.images)}) no-repeat`
          }}
        />
        <div className='action_container'>
          <div className='tags'>
            <div className='brand'>{props.brand.name}</div>
            <div className='name'>{props.name}</div>
            <div className='name'>${props.price}</div>
          </div>
          {props.grid ? (
            <div className='description'>
              <p>{props.description}</p>
            </div>
          ) : null}
          <div className='actions'>
            <div className='button_wrapp'>
              <MyButton
                type='default'
                altClass='card_link'
                title='View product'
                linkTo={`/product_detail/${props._id}`}
                addStyles={{
                  margin: '10px 0 0 0'
                }}
              />
            </div>
            <Tooltip
              title={this.tooltipTitleHandler(props.user.userData)}
              placement='top'
            >
              <div className={`button_wrapp ${this.state.btnClass}`}>
                <MyButton
                  type='bag_link'
                  addStyles={{marginTop: '10px'}}
                  runAction={() => {
                    props.user.userData.isAuth
                      ? this.props.dispatch(addToCart(props._id))
                      : console.log('you need login');
                  }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Card);

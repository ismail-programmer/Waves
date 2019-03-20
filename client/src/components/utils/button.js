import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faShopingBag from '@fortawesome/fontawesome-free-solid/faShoppingBag';

const MyButton = props => {
  const button = () => {
    let template = '';

    switch (props.type) {
      case 'default':
        template = (
          <Link className={!props.altClass ? 'link_default' : props.altClass} to={props.linkTo} {...props.addStyles}>
            {props.title}
          </Link>
        );
        break;
      case 'bag_link':
        template = (
          <div
            className='bag_link'
            onClick={() => {
              props.runAction();
            }}
          >
            <FontAwesomeIcon icon={faShopingBag} />
          </div>
        );
        break;
      case 'add_to_cart_link':
        template = (
          <div
            className='add_to_cart_link'
            onClick={() => {
              props.runAction();
            }}
          >
            <FontAwesomeIcon icon={faShopingBag} />
            Add to Cart
          </div>
        );

        break;
      default:
        template = '';
    }

    return template;
  };

  return <div className='My_link'>{button()}</div>;
};

export default MyButton;

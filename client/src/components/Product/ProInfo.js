import React from 'react';
import MyButton from '../utils/button';

import { Tooltip } from '@material-ui/core';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTruck, faCheck, faTimes } from '@fortawesome/fontawesome-free-solid';

const ProInfo = props => {
  let btnClass = '';
  if (!props.user.isAuth) btnClass = 'disabled';
  else btnClass = '';

  const tooltipTitleHandler = user => {
    if (user)
      if (!user.isAuth) {
        return 'Please Login First';
      }

    return '';
  };

  const showProdSpecifications = detail => (
    <div className='product_specifications'>
      <h2>Specifications:</h2>
      <div>
        <div className='item'>
          <strong>Frets:</strong>
          {detail.frets}
        </div>
        <div className='item'>
          <strong>Wood:</strong>
          {detail.wood.name}
        </div>
      </div>
    </div>
  );

  const showProdActions = () => (
    <div className='product_actions'>
      <div className='price'>${detail.price}</div>
      <Tooltip title={tooltipTitleHandler(props.user)} placement='bottom'>
        <div className={`cart ${btnClass}`}>
          <MyButton
            type='add_to_cart_link'
            runAction={() => {
              props.addToCart(detail._id);
            }}
          />
        </div>
      </Tooltip>
    </div>
  );

  const showProdTags = detail => (
    <div className='product_tags'>
      {detail.shiping ? (
        <div className='tag'>
          <div>
            <FontAwesomeIcon icon={faTruck} />
          </div>
          <div className='tag_text'>
            <div>Free Shiping </div>
            <div>And Return </div>
          </div>
        </div>
      ) : null}
      {detail.available ? (
        <div className='tag'>
          <div>
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className='tag_text'>
            <div>Available</div>
            <div>In Store </div>
          </div>
        </div>
      ) : (
        <div className='tag'>
          <div>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className='tag_text'>
            <div>Not Available</div>
            <div>Pre-order only </div>
          </div>
        </div>
      )}
    </div>
  );

  const detail = props.detail;
  return (
    <div>
      <h1>
        {detail.brand.name} {detail.name}{' '}
      </h1>
      <p>{detail.description}</p>
      {showProdTags(detail)}
      {showProdActions(detail)}
      {showProdSpecifications(detail)}
    </div>
  );
};

export default ProInfo;

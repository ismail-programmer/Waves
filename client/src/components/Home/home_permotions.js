import React from 'react';
import MyButton from '../utils/button';

const HomePermotion = (props) => {
  const permotion = 
    {
      img: '/images/featured/featured_home_3.jpg',
      lineOne: 'Up to 40% off',
      lineTwo: 'In second hand guitars',
      linkTitle: 'Shop now',
      linkTo: '/shop'
    }
  
  const renderPermotion = () =>
    permotion ? (
      <div
        className='home_promotion_img'
        style={{
          background: `url(${permotion.img})`
        }}
      >
        <div className='tag title'>{permotion.lineOne}</div>
        <div className='tag low_title'>{permotion.lineTwo}</div>
        <div>
          <MyButton
            type='default'
            title={permotion.linkTitle}
            linkTo={permotion.linkTo}
            addStyles={{
              margin: '10px 0 0 0'
            }}
          />
        </div>
      </div>
    ) : null;

  return <div className='home_promotion'>{renderPermotion()}</div>;
};

export default HomePermotion;

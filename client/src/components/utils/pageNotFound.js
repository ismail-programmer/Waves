import React from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faExclamitionCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';
import MyButton from './button';

const PageNotFound = () => {
  return (
    <div className='container'>
      <div className='not_found_container'>
        <FontAwesomeIcon icon={faExclamitionCircle} />
        <div>Oops !! Page not found</div>
        <MyButton
          title='Back to Home'
          linkTo='/'
          type='default'
          addStyles={{ fontSize: '18px', color: '#fff', margin: '32px auto' }}
        />
      </div>
    </div>
  );
};

export default PageNotFound;

import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/fontawesome-free-solid'

const NotOptimized = () => {
  window.scrollTo(300,0)
  return (
    <div className='not_optimized'>
      <FontAwesomeIcon icon={faExclamationTriangle} />
      <div>
        The site is not optimized for Mobile devices.
      </div>
    </div>
  )
}

export default NotOptimized;
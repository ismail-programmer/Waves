import React from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faExclamitionCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';


const PageNotFound = () => {
  return (
    <div className="container">
    <div className="not_found_container">
    <FontAwesomeIcon icon={faExclamitionCircle}/> 
    <div>
      Oops  !! Page not found
    </div>
    </div>
      
    </div>
  );
};

export default PageNotFound;
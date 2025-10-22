import React from 'react';
import './Loading.scss';

const Loading = () => {
  return (
    <div className='loadings'>
      <div className='loading-containers'>
        <div className="lds-pulse">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

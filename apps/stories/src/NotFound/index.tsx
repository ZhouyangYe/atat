import React from 'react';
import BasePage from '@/BasePage';

import './index.less';

const NotFound: React.FC<any> = () => {
  return (
    <BasePage className='not-found'>
      Not Found
    </BasePage>
  );
};

export default NotFound;

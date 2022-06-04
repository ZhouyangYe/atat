import React from 'react';
import BasePage from '@/BasePage';
import MergeSort from './MergeSort';

import './index.less';

const Visualization: React.FC<any> = () => {
  return (
    <BasePage className='visualization'>
      <MergeSort />
    </BasePage>
  );
};

export default Visualization;

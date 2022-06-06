import React from 'react';
import BasePage from '@/BasePage';
import SourceCode from '@/utils/SourceCode';
import BubbleSort from './BubbleSort';
import MergeSort from './MergeSort';

import './index.less';

const Visualization: React.FC<any> = () => {
  return (
    <BasePage className='visualization'>
      {/* <BubbleSort /> */}
      <MergeSort />
      <div className='source-code-wrap'>
        <SourceCode root='apps^stories^src^Visualization^MergeSort' maxHeight={800} minHeight={500} />
      </div>
    </BasePage>
  );
};

export default Visualization;

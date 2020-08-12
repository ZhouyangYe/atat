import React from 'react';
import ReactDom from 'react-dom';

import SvgComponent from './svg';

ReactDom.render(<SvgComponent />, document.querySelector<HTMLElement>('#app'));

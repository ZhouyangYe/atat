import React, { useState } from 'react';
import ReactDom from 'react-dom';

const Testa: React.FC<any> = () => {
  return <div>Hello World!</div>;
};

ReactDom.render(<Testa />, document.getElementById('app'));

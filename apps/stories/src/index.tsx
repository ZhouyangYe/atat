import React from 'react';
import ReactDom from 'react-dom';

const Test: React.FC<any> = () => {
  return <div>Hello World!</div>;
};

ReactDom.render(<Test />, document.getElementById('app'));

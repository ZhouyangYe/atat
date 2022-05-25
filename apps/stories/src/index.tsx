import React from 'react';
import ReactDom from 'react-dom/client';
import RootComponent from './Root';

const root = ReactDom.createRoot(document.getElementById('app')!);

root.render(<RootComponent />);

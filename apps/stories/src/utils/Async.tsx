import React, { Suspense } from 'react';
import { Loading } from './Loading';

interface Props {
  children?: React.ReactNode;
}

const Async: React.FC<Props> = ({ children }) => {
  return (
    <Suspense fallback={<Loading />} >
      {children}
    </Suspense>
  );
};

export default Async;

import io from 'socket.io-client';
import { test as test2 } from '@/test';

import './styles';

const test = (): void => {
  console.log('hello world');
  console.log(io);
  test2();
};

test();

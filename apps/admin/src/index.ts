import Resume, { MODE } from 'atat-common/lib/modules/resume';
import { login as loginService } from 'atat-common/lib/services/admin';
import Message from 'atat-common/lib/modules/message';
import Login from './components/login';

import 'atat-common/lib/modules/resume/index.css';
import 'atat-common/lib/modules/message/index.css';
import './styles';

const
  resume = new Resume({ show: false, mode: MODE.EDIT }),
  resumeDom = resume.getDom(),
  message = new Message(),
  messageDom = message.getDom(),
  login = new Login(),
  loginDom = login.getDom();

const app = document.getElementById('app');

app.append(resumeDom, loginDom, messageDom);
resume.resize();

login.onClick = (password: string) => {
  message.info('Authenticating.');

  return loginService({ password }).then((res) => {
    if (res.success) {
      message.success('Welcome!');
    } else {
      message.error('Authentication failed!');
    }
    return new Promise((res) => {
      setTimeout(() => { res(); }, 3000);
    });
  });
};

window.onresize = () => {
  resume.resize();
  message.resize();
};

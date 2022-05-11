import Resume, { MODE } from 'atat-common/lib/modules/resume';
import { login as loginService } from 'atat-common/lib/services/admin';
import Message from 'atat-common/lib/modules/message';
import Login from './components/login';
import Panel from './components/panel';

import 'atat-common/lib/modules/resume/index.css';
import 'atat-common/lib/modules/message/index.css';
import './styles';

const
  resume = new Resume({ show: false, mode: MODE.EDIT }),
  resumeDom = resume.getDom(),
  message = new Message(),
  messageDom = message.getDom(),
  login = new Login(),
  loginDom = login.getDom(),
  panel = new Panel(),
  panelDom = panel.getDom(),
  app = document.getElementById('app');

let initialized = false;

app.append(resumeDom, loginDom, messageDom, panelDom);
resume.resize();

panel.resumeClick = () => {
  resume.show();
};

login.onClick = (password: string) => {
  if (initialized) {
    message.info('Authenticating.');
  }

  return loginService({ password }).then((res) => {
    if (res.success) {
      if (!initialized) {
        login.hide();
        panel.show();
        initialized = true;
        return;
      }

      if (res.data) {
        message.success(res.data);
      } else {
        message.info('Already logged in.');
      }

      login.hide();
      panel.show();
    } else {
      if (!initialized) {
        initialized = true;
        return;
      }

      message.error('Authentication failed!');
    }

  }).catch(() => {
    message.error('Something is wrong.');
  });
};

login.onSubmit();

window.onresize = () => {
  resume.resize();
  message.resize();
};

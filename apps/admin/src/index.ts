import Resume, { MODE } from 'atat-common/lib/modules/resume';
import { login as loginService } from 'atat-common/lib/services/admin';
import { getResumeData } from 'atat-common/lib/services/intro';
import Message from 'atat-common/lib/modules/message';
import { throttle } from 'atat-common/lib/utils';
import Login from './components/login';
import Panel from './components/panel';

import 'atat-common/lib/modules/resume/index.css';
import 'atat-common/lib/modules/message/index.css';
import './styles';

const
  message = new Message(),
  messageDom = message.getDom(),
  resume = new Resume(getResumeData().then((res) => {
    if (!res.success) {
      message.error('Failed to get resume.');
      return;
    }

    return res.data;
  }), { show: false, mode: MODE.EDIT }),
  resumeDom = resume.getDom(),
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
        login.show();
        return;
      }

      message.error('Authentication failed!');
    }

  }).catch(() => {
    message.error('Something is wrong.');
  });
};

// check whether has logged in
login.onSubmit();

window.onresize = () => {
  resume.resize();
  message.resize();
};

const checkActivity = () => {
  loginService().then((res) => {
    if (!res.success) {
      login.show();
      message.error('Lost connection, please login again.');
    }
  });
};

window.onmousemove = () => {
  // activity checking
  throttle(checkActivity, 120000, false);
};

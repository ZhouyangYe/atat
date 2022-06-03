import Resume, { MODE } from 'atat-common/lib/modules/resume';
import { login as loginService, logout, updateResume } from 'atat-common/lib/services/admin';
import { getResumeData } from 'atat-common/lib/services/intro';
import message from 'atat-common/lib/modules/message';
import { throttle } from 'atat-common/lib/utils';
import Login from './components/login';
import Panel from './components/panel';

import './styles';

const
  resume = new Resume({ show: false, mode: MODE.EDIT }),
  resumeDom = resume.getDom(),
  login = new Login(),
  loginDom = login.getDom(),
  panel = new Panel(),
  panelDom = panel.getDom(),
  app = document.getElementById('app')!;

getResumeData().then((res) => {
  if (!res.success) {
    message.error('Failed to get resume.');
    return;
  }

  resume.setResumeData(res.data);
});

resume.onSave = (data) => {
  message.info('Saving.');
  updateResume({ resume: data }).then((res) => {
    if (res.success) {
      message.success('Updated.');
      return;
    }
    
    if (res.errorCode === 401) {
      login.show();
    }
    message.error('Update failed.');
  });
};

let initialized = false;

app.append(resumeDom, loginDom, panelDom);
resume.resize();

panel.resumeClick = () => {
  resume.show();
};

panel.logoutClick = () => {
  message.info('Logging out');
  logout().then((res) => {
    if (res.success) {
      login.show();
      panel.hide();
      message.success('You are logged out.');
    } else {
      message.info('Already logged out.');
    }
  }).catch(() => {
    message.error('Something is wrong.');
  });
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
  login.resize();
};

const checkActivity = () => {
  loginService().then((res) => {
    if (!res.success) {
      login.show();
      message.error('Lost connection, please login again.');
    }
  });
};

// activity checking
window.onmousemove = () => {
  throttle(checkActivity, 60000, false);
};
resumeDom.onwheel = null;
window.onwheel = () => {
  throttle(checkActivity, 60000, false);
};
window.onkeydown = () => {
  throttle(checkActivity, 60000, false);
};
window.ontouchstart = () => {
  throttle(checkActivity, 60000, false);
};
window.onwheel = () => {
  throttle(checkActivity, 60000, false);
};

const handleDoubleClick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
};
document.addEventListener('dblclick', handleDoubleClick, false);

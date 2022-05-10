import Resume from 'atat-common/lib/modules/resume';
import { login } from 'atat-common/lib/services/admin';

import 'atat-common/lib/modules/resume/index.css';
import './styles';

const resume = new Resume({ show: true });

login({ password: 'test pass' }).then((res) => {
  console.log(res);
});

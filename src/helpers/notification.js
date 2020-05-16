import {message} from 'antd';

const notification = status => {
  if (status.status === 200 || status.status === 201) {
    message.success(`${status.statusText}`);
  } else {
    message.error(`${status.message}`);
  }
};
export {notification};

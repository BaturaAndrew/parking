import React, {useState} from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Checkbox,
} from 'antd';
import {SendOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import * as PropTypes from 'prop-types';
import {addCarToParking} from '../../actions/carActions';
import {notification} from '../../helpers/notification';
import {isValidForm} from '../../helpers/isValidForm';

require('moment/locale/ru');
const moment = require('moment');

const dateFormatList = ['DD.MM.YYYY'];

const ModalAddNewParkedCar = props => {
  const form = React.createRef();
  const [history, setHistory] = useState({
    days: null,
    time_in: null,
    last_flag: false,
    car: 0,
  });

  const onChange = curState => {
    setHistory(prevState => ({...prevState, ...curState}));
  };

  const addCarEntry = () => {
    if (!isValidForm(form)) return;
    const {dispatch, setModalVisible} = props;

    dispatch(addCarToParking(history, notification));
    setModalVisible(false);
  };

  const {modalVisible, setModalVisible} = props;
  return (
    <Modal
      title="Добавление машины на парковку"
      style={{top: 20}}
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
      okButtonProps={{style: {display: 'none'}}}
      cancelButtonProps={{style: {display: 'none'}}}>
      <Form ref={form} layout="vertical" name="nest-messages">
        <Form.Item
          name="date"
          label="Дата"
          rules={[{required: true, message: 'Пожалуйста, введите дату!'}]}>
          <DatePicker
            format={dateFormatList}
            placeholder="08.05.2020"
            value="08.05.2020"
            onChange={date => {
              const d = moment(date).format('L');
              onChange({days: d});
            }}
          />
        </Form.Item>

        <Form.Item
          name="time"
          label="Время"
          rules={[{required: true, message: 'Пожалуйста, введите время!'}]}>
          <TimePicker
            format="h:mm:ss"
            value={history.time_in}
            onChange={time => {
              const t = moment(time).format('LTS');
              onChange({time_in: t});
            }}
          />
        </Form.Item>
        <Form.Item name="last_flag" label="last_flag">
          <Checkbox
            checked={history.last_flag}
            disabled
            onChange={e => onChange({last_flag: e.target.checked})}
          />
        </Form.Item>
        <Form.Item
          name="car"
          label="Авто (id)"
          rules={[{required: true, message: 'Пожалуйста, введите id авто!'}]}>
          <Input
            placeholder="69"
            onChange={e => onChange({car: +e.target.value})}
          />
        </Form.Item>

        <div className="button-block flex-row">
          <Form.Item>
            <Button
              className="back-btn"
              type="primary"
              htmlType="button"
              onClick={() => setModalVisible(false)}
              icon={<ArrowLeftOutlined />}>
              Закрыть форму
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              className="send-btn"
              type="primary"
              htmlType="submit"
              onClick={addCarEntry}
              icon={<SendOutlined />}>
              Добавить
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export {ModalAddNewParkedCar};

ModalAddNewParkedCar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
};

ModalAddNewParkedCar.defaultProps = {};

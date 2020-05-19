import React from 'react';
import {Button, Modal, Form, Input, DatePicker, TimePicker} from 'antd';
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

  const addCarEntry = () => {
    if (!isValidForm(form)) return;
    const {dispatch, setModalVisible} = props;
    const formattedHistory = hst => ({
      car: hst.car,
      days: moment(hst.days).format('L'),
      time_in: moment(hst.time_in).format('LTS'),
      last_flag: false,
    });
    const history = formattedHistory(form.current.getFieldsValue());

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
          />
        </Form.Item>

        <Form.Item
          name="time"
          label="Время"
          rules={[{required: true, message: 'Пожалуйста, введите время!'}]}>
          <TimePicker format="h:mm:ss" />
        </Form.Item>

        <Form.Item
          name="car"
          label="Авто (id)"
          rules={[{required: true, message: 'Пожалуйста, введите id авто!'}]}>
          <Input placeholder="69" />
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

import React, {Component} from 'react';
import {Button, Modal, Form, Input} from 'antd';
import {SendOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import * as PropTypes from 'prop-types';
import {addCar} from '../../actions/carActions';
import {notification} from '../../helpers/notification';

class ModalAddNewCar extends Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.state = {car: {}};
  }

  onChange = curState => {
    this.setState(prevState => ({
      ...prevState,
      car: {...prevState.car, ...curState},
    }));
  };

  isValidForm = () => {
    const car = this.form.current.getFieldsValue();
    if (
      car.car_brand === undefined ||
      car.car_model === undefined ||
      car.car_tenant === undefined
    ) {
      return false;
    }
    return true;
  };

  addNewCar = () => {
    if (!this.isValidForm()) return;
    const {dispatch, setModalVisible} = this.props;
    const {car} = this.state;
    const newCar = {
      car_number: car.car_number,
      car_brand: +car.car_brand,
      car_model: +car.car_model,
      car_tenant: +car.car_tenant,
    };

    dispatch(addCar(newCar, notification));
    setModalVisible(false);
  };

  render() {
    const {modalVisible, setModalVisible} = this.props;
    return (
      <Modal
        title="Добавление машины"
        style={{top: 20}}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{style: {display: 'none'}}}
        cancelButtonProps={{style: {display: 'none'}}}>
        <Form ref={this.form} layout="vertical" name="nest-messages">
          <Form.Item
            name="car_number"
            label="Номер авто"
            rules={[
              {required: true, message: 'Пожалуйста, введите номер авто!'},
            ]}>
            <Input
              placeholder="AA 2099-7"
              onChange={e => this.onChange({car_number: e.target.value})}
            />
          </Form.Item>

          <Form.Item
            name="car_brand"
            label="Бренда авто (id)"
            rules={[
              {required: true, message: 'Пожалуйста, введите бренда авто!'},
            ]}>
            <Input
              placeholder="134 (ГАЗ)"
              onChange={e => this.onChange({car_brand: e.target.value})}
            />
          </Form.Item>
          <Form.Item
            name="car_model"
            label="Модель авто (id)"
            rules={[
              {required: true, message: 'Пожалуйста, введите модель авто!'},
            ]}>
            <Input
              placeholder="1878 (33023)"
              onChange={e => this.onChange({car_model: e.target.value})}
            />
          </Form.Item>
          <Form.Item
            name="car_tenant"
            label="Арендатор (id)"
            rules={[
              {required: true, message: 'Пожалуйста, введите арендатора!'},
            ]}>
            <Input
              placeholder="7 (Альфа-Банк ЗАО)"
              onChange={e => this.onChange({car_tenant: e.target.value})}
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
                onClick={this.addNewCar}
                icon={<SendOutlined />}>
                Добавить
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  }
}

export {ModalAddNewCar};

ModalAddNewCar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
};

ModalAddNewCar.defaultProps = {};

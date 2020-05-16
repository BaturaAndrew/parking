import React, {Component} from 'react';
import {Button, Modal, Form, Input, Select} from 'antd';
import {SendOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import * as PropTypes from 'prop-types';
import {addCar} from '../../actions/carActions';
import {notification} from '../../helpers/notification';

const {Option} = Select;

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
    const {modalVisible, setModalVisible, tenants, brands} = this.props;

    const childrenTenants = tenants.map(tenant => (
      <Option key={tenant.id} value={tenant.id}>
        {tenant.name}
      </Option>
    ));
    const childrenBrands = brands.map(brand => (
      <Option key={brand.id} value={brand.id}>
        {brand.name}
      </Option>
    ));

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
            <Select
              name="car_tenant"
              allowClear
              placeholder="134 (ГАЗ)"
              onChange={value => this.onChange({car_brand: value})}>
              {childrenBrands}
            </Select>
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
            <Select
              name="car_tenant"
              allowClear
              placeholder="7 (Альфа-Банк ЗАО)"
              onChange={value => this.onChange({car_tenant: value})}>
              {childrenTenants}
            </Select>
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
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
  brands: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ModalAddNewCar.defaultProps = {};

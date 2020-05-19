import React from 'react';
import {Button, Modal, Form, Input, Select} from 'antd';
import {SendOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import * as PropTypes from 'prop-types';
import {addCar} from '../../actions/carActions';
import {notification} from '../../helpers/notification';
import {isValidForm} from '../../helpers/isValidForm';

const {Option} = Select;

const ModalAddNewCar = props => {
  const form = React.createRef();

  const addNewCar = () => {
    if (!isValidForm(form)) return;
    const objForm = form.current.getFieldsValue();
    const {dispatch, setModalVisible} = props;
    const newCar = {
      car_number: objForm.car_number,
      car_brand: +objForm.car_brand,
      car_model: +objForm.car_model,
      car_tenant: +objForm.car_tenant,
    };

    dispatch(addCar(newCar, notification));
    setModalVisible(false);
  };

  const {modalVisible, setModalVisible, tenants, brands} = props;

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
      <Form ref={form} layout="vertical" name="nest-messages">
        <Form.Item
          name="car_number"
          label="Номер авто"
          rules={[
            {required: true, message: 'Пожалуйста, введите номер авто!'},
          ]}>
          <Input placeholder="AA 2099-7" />
        </Form.Item>

        <Form.Item
          name="car_brand"
          label="Бренда авто (id)"
          rules={[
            {required: true, message: 'Пожалуйста, введите бренда авто!'},
          ]}>
          <Select name="car_tenant" allowClear placeholder="134 (ГАЗ)">
            {childrenBrands}
          </Select>
        </Form.Item>

        <Form.Item
          name="car_model"
          label="Модель авто (id)"
          rules={[
            {required: true, message: 'Пожалуйста, введите модель авто!'},
          ]}>
          <Input placeholder="1878 (33023)" />
        </Form.Item>

        <Form.Item
          name="car_tenant"
          label="Арендатор (id)"
          rules={[
            {required: true, message: 'Пожалуйста, введите арендатора!'},
          ]}>
          <Select name="car_tenant" allowClear placeholder="7 (Альфа-Банк ЗАО)">
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
              onClick={addNewCar}
              icon={<SendOutlined />}>
              Добавить
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export {ModalAddNewCar};

ModalAddNewCar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
  brands: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ModalAddNewCar.defaultProps = {};
